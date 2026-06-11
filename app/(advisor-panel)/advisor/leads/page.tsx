import { Metadata } from "next";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { PageHeader } from "@/components/shared/PageHeader";
import { LeadsTable, type AdvisorLeadRow } from "@/components/advisor/LeadsTable";
import { Users } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Leads" };

function leadDisplayLabel(
  lead: {
    user_id: string | null;
    email: string | null;
    full_name: string | null;
    id: string;
  },
  emailByUserId: Map<string, string>
): string {
  if (lead.user_id && emailByUserId.get(lead.user_id)) {
    return emailByUserId.get(lead.user_id)!;
  }
  return lead.full_name ?? lead.email ?? `Lead ${lead.id.slice(0, 8)}`;
}

export default async function AdvisorLeadsPage() {
  const admin = createAdminClient();

  const { data: leadsData } = await admin
    .from("leads")
    .select(
      "id, lead_status, created_at, project_type, project_stage, budget_range, full_name, email, phone, suburb, state, user_id, source"
    )
    .order("created_at", { ascending: false });

  const rawLeads = (leadsData ?? []) as Array<{
    id: string;
    lead_status: string;
    created_at: string;
    project_type: string | null;
    project_stage: string | null;
    budget_range: string | null;
    full_name: string | null;
    email: string | null;
    phone: string | null;
    suburb: string | null;
    state: string | null;
    user_id: string | null;
    source: string | null;
  }>;

  const userIds = rawLeads.map((l) => l.user_id).filter((id): id is string => Boolean(id));
  const { data: users } = userIds.length
    ? await admin.from("users").select("id, email").in("id", userIds)
    : { data: [] };

  const emailByUserId = new Map(
    ((users ?? []) as Array<{ id: string; email: string }>).map((u) => [u.id, u.email])
  );

  const { data: clients } = await admin.from("clients").select("user_id");
  const activeClientUserIds = new Set(
    ((clients ?? []) as Array<{ user_id: string }>).map((c) => c.user_id)
  );

  const leads: AdvisorLeadRow[] = rawLeads.map((lead) => ({
    id: lead.id,
    lead_status: lead.lead_status,
    created_at: lead.created_at,
    project_type: lead.project_type,
    budget_range: lead.budget_range,
    email: lead.email,
    phone: lead.phone,
    suburb: lead.suburb,
    state: lead.state,
    user_id: lead.user_id,
    source: lead.source,
    displayLabel: leadDisplayLabel(lead, emailByUserId),
    accountEmail: lead.user_id ? (emailByUserId.get(lead.user_id) ?? null) : null,
    isClient: lead.user_id ? activeClientUserIds.has(lead.user_id) : false,
  }));

  const newCount = leads.filter((l) => l.lead_status === "new").length;
  const activeCount = leads.filter(
    (l) => !["closed", "lost", "not_qualified", "converted"].includes(l.lead_status)
  ).length;

  return (
    <>
      <DashboardHeader title="AdvisorHQ" userName="Eduardo" userInitials="EM" />
      <div className="flex-1 px-6 py-8 space-y-6">
        <PageHeader
          title="Leads"
          description={`${leads.length} total  -  -  ${newCount} new  -  -  ${activeCount} active in pipeline`}
        />

        <LeadsTable leads={leads} />

        <Link
          href="/advisor/dashboard"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-navy"
        >
          <Users size={15} />
          Back to dashboard
        </Link>
      </div>
    </>
  );
}
