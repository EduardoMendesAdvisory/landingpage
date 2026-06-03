import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { PageHeader } from "@/components/shared/PageHeader";
import { DashboardCard } from "@/components/shared/DashboardCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDate } from "@/utils/formatters";
import { Users, Phone, FileCheck, Briefcase } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = { title: "Advisor Dashboard" };

export default async function AdvisorDashboardPage() {
  const supabase = await createClient();

  // Fetch all key metrics in parallel
  const [
    leadsResult,
    clientsResult,
    meetingsResult,
    buildchecksResult,
    recentLeadsResult,
  ] = await Promise.all([
    supabase
      .from("leads")
      .select("id", { count: "exact" })
      .eq("lead_status", "new"),
    supabase
      .from("clients")
      .select("id", { count: "exact" })
      .eq("client_status", "active"),
    supabase
      .from("meetings")
      .select("id", { count: "exact" })
      .eq("status", "scheduled")
      .gte("scheduled_at", new Date().toISOString()),
    supabase
      .from("buildchecks")
      .select("id", { count: "exact" })
      .eq("buildcheck_status", "pending"),
    supabase
      .from("leads")
      .select(
        "id, lead_status, created_at, project_type, user_id"
      )
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const newLeads = leadsResult.count ?? 0;
  const activeClients = clientsResult.count ?? 0;
  const upcomingMeetings = meetingsResult.count ?? 0;
  const pendingBuildchecks = buildchecksResult.count ?? 0;
  const recentLeads = (recentLeadsResult.data ?? []) as Array<{
    id: string;
    lead_status: string;
    created_at: string;
    project_type: string | null;
    user_id: string;
  }>;

  return (
    <>
      <DashboardHeader
        title="AdvisorHQ"
        userName="Eduardo"
        userInitials="EM"
      />
      <div className="flex-1 px-6 py-8 space-y-8">
        <PageHeader
          title="Dashboard"
          description="Overview of your advisory business."
        />

        {/* KPI Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard
            title="New Leads"
            value={newLeads}
            description="Awaiting review"
            icon={<Users size={16} />}
          />
          <DashboardCard
            title="Active Clients"
            value={activeClients}
            description="Currently engaged"
            icon={<Briefcase size={16} />}
          />
          <DashboardCard
            title="Upcoming Calls"
            value={upcomingMeetings}
            description="Scheduled meetings"
            icon={<Phone size={16} />}
          />
          <DashboardCard
            title="Pending BuildChecks"
            value={pendingBuildchecks}
            description="Quote reviews to complete"
            icon={<FileCheck size={16} />}
          />
        </div>

        {/* Recent Leads */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-navy uppercase tracking-wide">
              Recent Leads
            </h2>
            <Link
              href="/advisor/leads"
              className="text-xs text-warm-soil hover:underline underline-offset-2"
            >
              View all →
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden">
            {recentLeads.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No leads yet. Leads will appear here after users complete the assessment.
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Lead
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Project
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Status
                    </th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="hover:bg-light-bg transition-colors"
                    >
                      <td className="px-5 py-3">
                        <Link
                          href={`/advisor/leads/${lead.id}`}
                          className="text-navy font-medium hover:text-warm-soil transition-colors text-xs"
                        >
                          {lead.user_id.slice(0, 8)}…
                        </Link>
                      </td>
                      <td className="px-5 py-3 text-muted-foreground text-xs">
                        {lead.project_type
                          ? lead.project_type.replace(/_/g, " ")
                          : "—"}
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={lead.lead_status} />
                      </td>
                      <td className="px-5 py-3 text-muted-foreground text-xs">
                        {formatDate(lead.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Quick nav */}
        <div>
          <h2 className="text-sm font-semibold text-navy uppercase tracking-wide mb-4">
            Quick Access
          </h2>
          <div className="grid sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {[
              { label: "Leads", href: "/advisor/leads", icon: Users },
              { label: "Calls", href: "/advisor/calls", icon: Phone },
              { label: "Quote Reviews", href: "/advisor/quote-reviews", icon: FileCheck },
              { label: "Clients", href: "/advisor/clients", icon: Briefcase },
              { label: "Projects", href: "/advisor/projects", icon: Briefcase },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-2 bg-white hover:bg-light-bg rounded-xl px-4 py-3 border border-border hover:border-navy/20 transition-all text-sm font-medium text-navy shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
              >
                <item.icon size={15} className="text-warm-soil shrink-0" />
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
