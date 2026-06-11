import type { createAdminClient } from "@/lib/supabase/admin";
import type { ProjectStage } from "@/lib/buildiq/project-stages";

type AdminClient = ReturnType<typeof createAdminClient>;

export async function linkLeadRecordsToClient(
  admin: AdminClient,
  input: { clientId: string; leadId: string | null }
) {
  if (!input.leadId) return;

  await Promise.all([
    admin
      .from("meetings")
      .update({ client_id: input.clientId })
      .eq("lead_id", input.leadId)
      .is("client_id", null),
    admin
      .from("documents")
      .update({ client_id: input.clientId })
      .eq("lead_id", input.leadId)
      .is("client_id", null),
    admin
      .from("proposals")
      .update({ client_id: input.clientId })
      .eq("lead_id", input.leadId)
      .is("client_id", null),
  ]);
}

export async function resolveInitialProjectStage(
  admin: AdminClient,
  leadId: string | null
): Promise<ProjectStage> {
  if (!leadId) return "project_assessment";

  const { data: lead } = await admin
    .from("leads")
    .select("lead_status")
    .eq("id", leadId)
    .maybeSingle();

  const status = (lead as { lead_status: string } | null)?.lead_status;

  if (
    status &&
    ["qualified", "client_approved", "converted"].includes(status)
  ) {
    return "service_engagement";
  }

  if (
    status &&
    ["call_booked", "call_completed"].includes(status)
  ) {
    return "strategy_session";
  }

  const { count } = await admin
    .from("meetings")
    .select("id", { count: "exact", head: true })
    .eq("lead_id", leadId)
    .neq("status", "cancelled");

  if ((count ?? 0) > 0) return "strategy_session";

  return "project_assessment";
}
