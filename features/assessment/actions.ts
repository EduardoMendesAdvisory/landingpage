"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { calculateAssessmentScore } from "@/utils/assessment-score";

export interface AssessmentWizardData {
  projectType: string;
  landType: string;
  suburb: string;
  state: string;
  postcode: string;
  projectStage: string;
  budgetRange: string;
  finishLevel: string;
  hasQuote: boolean;
}

export async function submitAssessment(
  data: AssessmentWizardData
): Promise<{ error: string } | never> {
  const supabase = await createClient();
  const admin = createAdminClient();

  // Verify session
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login?redirect=/assessment");
  }

  // Get the lead for this user
  const { data: lead, error: leadError } = await supabase
    .from("leads")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (leadError || !lead) {
    return { error: "Your account setup is incomplete. Please contact support." };
  }

  // Calculate score using the deterministic BR-01 formula
  const score = calculateAssessmentScore({
    projectType: data.projectType,
    projectStage: data.projectStage,
    budgetRange: data.budgetRange,
    state: data.state,
  });

  // Mark any previous current assessment as not current (retake support)
  await admin
    .from("assessments")
    .update({ is_current: false })
    .eq("lead_id", lead.id)
    .eq("is_current", true);

  // Insert the new assessment
  const { data: assessment, error: insertError } = await admin
    .from("assessments")
    .insert({
      lead_id: lead.id,
      project_type: data.projectType,
      land_type: data.landType || null,
      location: data.state,
      suburb: data.suburb || null,
      state: data.state,
      postcode: data.postcode || null,
      project_stage: data.projectStage,
      budget_range: data.budgetRange,
      finish_level: data.finishLevel || null,
      assessment_score: score,
      is_current: true,
    })
    .select()
    .single();

  if (insertError || !assessment) {
    console.error("[submitAssessment] Insert error:", insertError);
    return { error: "Failed to save your assessment. Please try again." };
  }

  // Update lead with denormalised summary + status change
  await admin
    .from("leads")
    .update({
      lead_status: "assessment_completed",
      project_type: data.projectType,
      project_stage: data.projectStage,
      budget_range: data.budgetRange,
      location: data.state,
    })
    .eq("id", lead.id);

  // Audit log
  await admin.from("audit_logs").insert({
    user_id: user.id,
    action: "assessment_completed",
    entity_type: "assessment",
    entity_id: assessment.id,
    metadata: {
      score,
      project_type: data.projectType,
      project_stage: data.projectStage,
      budget_range: data.budgetRange,
      state: data.state,
    },
  });

  redirect(`/assessment/results?id=${assessment.id}`);
}
