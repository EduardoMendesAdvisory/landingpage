import type { createAdminClient } from "@/lib/supabase/admin";
import { sendAssessmentCompletedEmail } from "@/lib/emails/templates";

type AdminClient = ReturnType<typeof createAdminClient>;

export async function emailAssessmentResults(
  admin: AdminClient,
  input: {
    leadId: string;
    assessmentId: string;
    assessmentScore: number;
    projectType: string;
  }
): Promise<void> {
  const { data: lead } = await admin
    .from("leads")
    .select("email, full_name, user_id")
    .eq("id", input.leadId)
    .maybeSingle();

  if (!lead) return;

  const leadRow = lead as {
    email: string | null;
    full_name: string | null;
    user_id: string | null;
  };

  let email = leadRow.email?.trim().toLowerCase() ?? null;
  let firstName =
    leadRow.full_name?.split(" ").filter(Boolean)[0] ??
    leadRow.full_name ??
    "there";

  if (!email && leadRow.user_id) {
    const { data: user } = await admin
      .from("users")
      .select("email")
      .eq("id", leadRow.user_id)
      .maybeSingle();
    email = (user as { email: string } | null)?.email?.trim().toLowerCase() ?? null;
  }

  if (!email) return;

  const result = await sendAssessmentCompletedEmail({
    email,
    firstName,
    assessmentScore: input.assessmentScore,
    projectType: input.projectType,
    assessmentId: input.assessmentId,
    leadId: input.leadId,
  });

  if (!result.ok) {
    console.error("[emailAssessmentResults]", result.error);
  }
}
