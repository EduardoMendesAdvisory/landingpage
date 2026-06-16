import { createAdminClient } from "@/lib/supabase/admin";
import { sendAssessmentCompletedEmail } from "@/lib/emails/templates";

interface NotifyAssessmentCompletedInput {
  userEmail: string;
  userName: string;
  assessmentScore: number;
  projectType: string;
  assessmentId: string;
  siteUrl: string;
  leadId?: string | null;
}

/** @deprecated Use sendAssessmentCompletedEmail via emailAssessmentResults helper. */
export async function notifyAssessmentCompleted(
  input: NotifyAssessmentCompletedInput
): Promise<void> {
  const result = await sendAssessmentCompletedEmail({
    email: input.userEmail,
    firstName: input.userName,
    assessmentScore: input.assessmentScore,
    projectType: input.projectType,
    assessmentId: input.assessmentId,
    leadId: input.leadId,
  });

  if (!result.ok) {
    console.error("[notifyAssessmentCompleted]", result.error);
  }
}

export async function getCurrentAssessment(userId: string) {
  const admin = createAdminClient();

  const { data: lead } = await admin
    .from("leads")
    .select("id")
    .eq("user_id", userId)
    .single();

  if (!lead) return null;

  const { data: assessment } = await admin
    .from("assessments")
    .select("*")
    .eq("lead_id", (lead as { id: string }).id)
    .eq("is_current", true)
    .single();

  return assessment;
}
