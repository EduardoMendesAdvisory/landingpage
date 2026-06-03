import { createAdminClient } from "@/lib/supabase/admin";
import { resend, FROM } from "@/lib/resend";

interface NotifyAssessmentCompletedInput {
  userEmail: string;
  userName: string;
  assessmentScore: number;
  projectType: string;
  assessmentId: string;
  siteUrl: string;
}

/**
 * Sends the assessment-completed notification email to the lead.
 * Called from the submitAssessment server action after DB write.
 * Non-blocking — errors are logged but not re-thrown.
 */
export async function notifyAssessmentCompleted(
  input: NotifyAssessmentCompletedInput
): Promise<void> {
  try {
    await resend.emails.send({
      from: FROM,
      to: input.userEmail,
      subject: "Your Project Assessment is Ready",
      text: [
        `Hi ${input.userName},`,
        "",
        "Your project assessment is complete.",
        "",
        `Your Project Readiness Score: ${input.assessmentScore}/100`,
        `Project Type: ${input.projectType.replace(/_/g, " ")}`,
        "",
        "View your full results and recommended next steps:",
        `${input.siteUrl}/assessment/results?id=${input.assessmentId}`,
        "",
        "Book a free 30-minute strategy call with Eduardo:",
        `${input.siteUrl}/book-call`,
        "",
        "Best regards,",
        "Eduardo Mendes",
      ].join("\n"),
    });
  } catch (error) {
    console.error("[notifyAssessmentCompleted] Email failed:", error);
  }
}

/**
 * Fetches the current assessment for a lead by userId.
 * SERVER-SIDE ONLY (uses admin client).
 */
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
