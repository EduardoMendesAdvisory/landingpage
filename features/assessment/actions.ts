"use server";

import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { emailAssessmentResults } from "@/lib/emails/assessment-notify";
import { createClient } from "@/lib/supabase/server";
import { calculateAssessmentScore } from "@/utils/assessment-score";
import { computePreliminaryMetrics } from "@/lib/assessment/preliminary-metrics";
import { validateFile } from "@/utils/validators";
import type { LeadData } from "@/features/assessment/components/StepLeadCapture";
import type { WizardData } from "@/features/assessment/components/AssessmentWizard";

// ── 1. saveLead — create anonymous lead (no auth required) ────

export async function saveLead(
  leadData: LeadData
): Promise<{ leadId: string } | { error: string }> {
  const admin = createAdminClient();

  const { data: lead, error } = await admin
    .from("leads")
    .insert({
      full_name: leadData.fullName.trim(),
      email: leadData.email.trim().toLowerCase(),
      phone: leadData.phone?.trim() || null,
      suburb: leadData.suburb.trim(),
      state: leadData.state,
      source: "free_assessment",
      lead_status: "assessment_started",
    })
    .select("id")
    .single();

  if (error || !lead) {
    console.error("[saveLead] Error:", error);
    return { error: "Failed to save your details. Please try again." };
  }

  return { leadId: lead.id };
}

// ── 1b. uploadLeadQuote — optional quote upload (no auth) ─────

export async function uploadLeadQuote(
  formData: FormData
): Promise<{ storagePath: string } | { error: string }> {
  const leadId = formData.get("leadId");
  const file = formData.get("file");

  if (typeof leadId !== "string" || !leadId) {
    return { error: "Session expired. Please restart the assessment." };
  }
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Please select a file to upload." };
  }

  const validation = validateFile(file, "lead");
  if (!validation.valid) {
    return { error: validation.error };
  }

  const admin = createAdminClient();

  const { data: lead, error: leadError } = await admin
    .from("leads")
    .select("id")
    .eq("id", leadId)
    .single();

  if (leadError || !lead) {
    return { error: "Session expired. Please restart the assessment." };
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "pdf";
  const storagePath = `${leadId}/${crypto.randomUUID()}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await admin.storage
    .from("lead-documents")
    .upload(storagePath, buffer, {
      contentType: file.type || "application/pdf",
      upsert: false,
    });

  if (uploadError) {
    console.error("[uploadLeadQuote] Upload error:", uploadError);
    return { error: "Failed to upload your quote. Please try again." };
  }

  await admin.from("documents").insert({
    lead_id: leadId,
    file_name: file.name,
    file_size: file.size,
    file_type: file.type || null,
    storage_path: storagePath,
    category: "builder_quotes",
  });

  return { storagePath };
}

// ── 2. submitFreeAssessment — free preliminary flow ───────────

export async function submitFreeAssessment({
  leadId,
  wizardData,
}: {
  leadId: string;
  wizardData: WizardData;
}): Promise<{ error: string } | never> {
  const admin = createAdminClient();

  const score = calculateAssessmentScore({
    projectType: wizardData.projectType,
    projectStage: wizardData.projectStage,
    budgetRange: wizardData.budgetRange,
    state: wizardData.state,
  });

  const { savingsPercentMin, savingsPercentMax, riskCount, recommendedActionsCount, benchmarkPosition } =
    computePreliminaryMetrics(wizardData);

  // Verify lead exists
  const { data: lead, error: leadError } = await admin
    .from("leads")
    .select("id")
    .eq("id", leadId)
    .single();

  if (leadError || !lead) {
    return { error: "Session expired. Please restart the assessment." };
  }

  // Mark previous assessments as not current
  await admin
    .from("assessments")
    .update({ is_current: false })
    .eq("lead_id", leadId)
    .eq("is_current", true);

  const { data: assessment, error: insertError } = await admin
    .from("assessments")
    .insert({
      lead_id: leadId,
      project_type: wizardData.projectType,
      project_subtype: wizardData.projectSubtype || null,
      land_type: wizardData.landType || null,
      suburb: wizardData.suburb || null,
      state: wizardData.state || null,
      postcode: wizardData.postcode || null,
      project_stage: wizardData.projectStage,
      budget_range: wizardData.budgetRange,
      finish_level: wizardData.finishLevel || null,
      uploaded_quote_url: wizardData.uploadedQuoteUrl || null,
      assessment_score: score,
      assessment_type: "free_preliminary",
      potential_savings_min: savingsPercentMin,
      potential_savings_max: savingsPercentMax,
      risk_count: riskCount,
      recommended_actions_count: recommendedActionsCount,
      benchmark_position: benchmarkPosition,
      is_current: true,
    })
    .select()
    .single();

  if (insertError || !assessment) {
    console.error("[submitFreeAssessment] Insert error:", insertError);
    return { error: "Failed to save your assessment. Please try again." };
  }

  // Update lead status and denormalised fields
  await admin
    .from("leads")
    .update({
      lead_status: "preliminary_assessment_completed",
      project_type: wizardData.projectType,
      project_stage: wizardData.projectStage,
      budget_range: wizardData.budgetRange,
      location: wizardData.state,
      suburb: wizardData.suburb || null,
      state: wizardData.state || null,
      notes: wizardData.projectComment?.trim() || null,
    })
    .eq("id", leadId);

  await emailAssessmentResults(admin, {
    leadId,
    assessmentId: (assessment as { id: string }).id,
    assessmentScore: score,
    projectType: wizardData.projectType,
  });

  redirect(`/assessment/results?id=${assessment.id}&lead=${leadId}`);
}

// ── 3. submitPaidAssessment — paid client intake flow ─────────

export async function submitPaidAssessment({
  leadId,
  wizardData,
}: {
  leadId: string;
  wizardData: WizardData;
}): Promise<{ error: string } | never> {
  const admin = createAdminClient();

  const score = calculateAssessmentScore({
    projectType: wizardData.projectType,
    projectStage: wizardData.projectStage,
    budgetRange: wizardData.budgetRange,
    state: wizardData.state,
  });

  const { savingsPercentMin, savingsPercentMax, riskCount, recommendedActionsCount, benchmarkPosition } =
    computePreliminaryMetrics(wizardData);

  const { data: lead, error: leadError } = await admin
    .from("leads")
    .select("id")
    .eq("id", leadId)
    .single();

  if (leadError || !lead) {
    return { error: "Session not found. Please contact support." };
  }

  await admin
    .from("assessments")
    .update({ is_current: false })
    .eq("lead_id", leadId)
    .eq("is_current", true);

  const { data: assessment, error: insertError } = await admin
    .from("assessments")
    .insert({
      lead_id: leadId,
      project_type: wizardData.projectType,
      project_subtype: wizardData.projectSubtype || null,
      land_type: wizardData.landType || null,
      suburb: wizardData.suburb || null,
      state: wizardData.state || null,
      postcode: wizardData.postcode || null,
      project_stage: wizardData.projectStage,
      budget_range: wizardData.budgetRange,
      finish_level: wizardData.finishLevel || null,
      uploaded_quote_url: wizardData.uploadedQuoteUrl || null,
      assessment_score: score,
      assessment_type: "paid_client",
      potential_savings_min: savingsPercentMin,
      potential_savings_max: savingsPercentMax,
      risk_count: riskCount,
      recommended_actions_count: recommendedActionsCount,
      benchmark_position: benchmarkPosition,
      is_current: true,
    })
    .select()
    .single();

  if (insertError || !assessment) {
    console.error("[submitPaidAssessment] Insert error:", insertError);
    return { error: "Failed to save your assessment. Please try again." };
  }

  await admin
    .from("leads")
    .update({
      lead_status: "qualified",
      project_type: wizardData.projectType,
      project_stage: wizardData.projectStage,
      budget_range: wizardData.budgetRange,
      location: wizardData.state,
      suburb: wizardData.suburb || null,
      state: wizardData.state || null,
      notes: wizardData.projectComment?.trim() || null,
    })
    .eq("id", leadId);

  await emailAssessmentResults(admin, {
    leadId,
    assessmentId: (assessment as { id: string }).id,
    assessmentScore: score,
    projectType: wizardData.projectType,
  });

  redirect(`/assessment/results?id=${assessment.id}&lead=${leadId}`);
}

// ── 4. submitAssessment — legacy auth-gated flow (kept for compatibility) ──

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

  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) redirect("/login?redirect=/assessment");

  const { data: lead, error: leadError } = await supabase
    .from("leads")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (leadError || !lead) {
    return { error: "Your account setup is incomplete. Please contact support." };
  }

  const score = calculateAssessmentScore({
    projectType: data.projectType,
    projectStage: data.projectStage,
    budgetRange: data.budgetRange,
    state: data.state,
  });

  await admin
    .from("assessments")
    .update({ is_current: false })
    .eq("lead_id", lead.id)
    .eq("is_current", true);

  const { data: assessment, error: insertError } = await admin
    .from("assessments")
    .insert({
      lead_id: lead.id,
      project_type: data.projectType,
      land_type: data.landType || null,
      suburb: data.suburb || null,
      state: data.state,
      postcode: data.postcode || null,
      project_stage: data.projectStage,
      budget_range: data.budgetRange,
      finish_level: data.finishLevel || null,
      assessment_score: score,
      assessment_type: "free_preliminary",
      is_current: true,
    })
    .select()
    .single();

  if (insertError || !assessment) {
    return { error: "Failed to save your assessment. Please try again." };
  }

  await admin
    .from("leads")
    .update({
      lead_status: "assessment_completed" as never,
      project_type: data.projectType,
      project_stage: data.projectStage,
      budget_range: data.budgetRange,
      location: data.state,
    })
    .eq("id", lead.id);

  await emailAssessmentResults(admin, {
    leadId: (lead as { id: string }).id,
    assessmentId: (assessment as { id: string }).id,
    assessmentScore: score,
    projectType: data.projectType,
  });

  redirect(`/assessment/results?id=${assessment.id}`);
}
