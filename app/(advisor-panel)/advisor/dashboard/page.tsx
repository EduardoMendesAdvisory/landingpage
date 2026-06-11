import { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { PageHeader } from "@/components/shared/PageHeader";
import { DashboardCard } from "@/components/shared/DashboardCard";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDate } from "@/utils/formatters";
import { serviceNameFromSlug } from "@/lib/invoices/constants";
import { Users, Phone, FileCheck, Briefcase } from "lucide-react";
import Link from "next/link";
import { ActivateClientButton } from "@/features/clients/components/ActivateClientButton";

export const metadata: Metadata = { title: "Advisor Dashboard" };

export default async function AdvisorDashboardPage() {
  const admin = createAdminClient();

  const [
    leadsResult,
    clientsResult,
    meetingsResult,
    buildchecksResult,
    recentLeadsResult,
    recentMeetingsResult,
    activeClientUserIdsResult,
  ] = await Promise.all([
    admin
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("lead_status", "new"),
    admin
      .from("clients")
      .select("id", { count: "exact", head: true })
      .eq("client_status", "active"),
    admin
      .from("meetings")
      .select("id", { count: "exact", head: true })
      .eq("status", "scheduled")
      .gte("scheduled_at", new Date().toISOString()),
    admin
      .from("buildchecks")
      .select("id", { count: "exact", head: true })
      .eq("buildcheck_status", "pending"),
    admin
      .from("leads")
      .select("id, lead_status, created_at, project_type, user_id, email, full_name")
      .order("created_at", { ascending: false })
      .limit(5),
    admin
      .from("meetings")
      .select(
        "id, scheduled_at, status, invitee_name, invitee_email, service_slug, lead_id, leads(full_name, email)"
      )
      .order("created_at", { ascending: false })
      .limit(5),
    admin.from("clients").select("user_id"),
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
    user_id: string | null;
    email: string | null;
    full_name: string | null;
  }>;

  const recentMeetings = (recentMeetingsResult.data ?? []) as Array<{
    id: string;
    scheduled_at: string | null;
    status: string;
    invitee_name: string | null;
    invitee_email: string | null;
    service_slug: string | null;
    lead_id: string | null;
    leads: { full_name: string | null; email: string | null } | null;
  }>;

  const activeClientUserIds = new Set(
    ((activeClientUserIdsResult.data ?? []) as Array<{ user_id: string }>).map(
      (c) => c.user_id
    )
  );

  const leadUserIds = recentLeads
    .map((l) => l.user_id)
    .filter((id): id is string => Boolean(id));
  const { data: leadUsers } = leadUserIds.length
    ? await admin.from("users").select("id, email").in("id", leadUserIds)
    : { data: [] as Array<{ id: string; email: string }> };

  const emailByUserId = new Map(
    ((leadUsers ?? []) as Array<{ id: string; email: string }>).map((u) => [
      u.id,
      u.email,
    ])
  );

  return (
    <>
      <DashboardHeader title="AdvisorHQ" userName="Eduardo" userInitials="EM" />

      <div className="flex-1 px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
        <PageHeader
          title="Dashboard"
          description="Overview of your advisory business."
        />

        {/* KPI cards — 2 col mobile, 4 col desktop */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
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
            title="BuildChecks"
            value={pendingBuildchecks}
            description="Pending reviews"
            icon={<FileCheck size={16} />}
          />
        </div>

        {/* Recent Calls */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold text-navy uppercase tracking-wide">
              Recent Calls
            </h2>
            <Link
              href="/advisor/calls"
              className="text-xs text-warm-soil hover:underline underline-offset-2"
            >
              View all →
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden">
            {recentMeetings.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No calls booked yet. Bookings from /book-call appear here automatically.
              </div>
            ) : (
              <>
                {/* Mobile: card list */}
                <ul className="sm:hidden divide-y divide-border">
                  {recentMeetings.map((m) => {
                    const name =
                      m.invitee_name ??
                      m.leads?.full_name ??
                      m.invitee_email ??
                      m.leads?.email ??
                      "Unknown";
                    return (
                      <li key={m.id} className="px-4 py-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <Link
                              href={`/advisor/calls/${m.id}`}
                              className="text-sm font-medium text-navy hover:text-warm-soil truncate block"
                            >
                              {name}
                            </Link>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {m.service_slug ? serviceNameFromSlug(m.service_slug) : "—"}
                              {m.scheduled_at ? ` · ${formatDate(m.scheduled_at)}` : ""}
                            </p>
                          </div>
                          <StatusBadge status={m.status} />
                        </div>
                        {m.lead_id && (
                          <Link
                            href={`/advisor/leads/${m.lead_id}`}
                            className="text-[11px] text-warm-soil hover:underline mt-1 inline-block"
                          >
                            View lead →
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>

                {/* Desktop: table */}
                <div className="hidden sm:block overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Invitee
                        </th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Service
                        </th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Scheduled
                        </th>
                        <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {recentMeetings.map((meeting) => {
                        const displayName =
                          meeting.invitee_name ??
                          meeting.leads?.full_name ??
                          meeting.invitee_email ??
                          meeting.leads?.email ??
                          "Unknown";
                        return (
                          <tr
                            key={meeting.id}
                            className="hover:bg-light-bg transition-colors"
                          >
                            <td className="px-5 py-3">
                              <Link
                                href={`/advisor/calls/${meeting.id}`}
                                className="text-navy font-medium hover:text-warm-soil text-xs"
                              >
                                {displayName}
                              </Link>
                              {meeting.lead_id && (
                                <Link
                                  href={`/advisor/leads/${meeting.lead_id}`}
                                  className="block text-[10px] text-warm-soil hover:underline mt-0.5"
                                >
                                  View lead
                                </Link>
                              )}
                            </td>
                            <td className="px-5 py-3 text-muted-foreground text-xs">
                              {meeting.service_slug
                                ? serviceNameFromSlug(meeting.service_slug)
                                : "-"}
                            </td>
                            <td className="px-5 py-3 text-muted-foreground text-xs">
                              {meeting.scheduled_at ? formatDate(meeting.scheduled_at) : "-"}
                            </td>
                            <td className="px-5 py-3">
                              <StatusBadge status={meeting.status} />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Recent Leads */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold text-navy uppercase tracking-wide">
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
                No leads yet. Leads appear after assessment or book-call bookings.
              </div>
            ) : (
              <>
                {/* Mobile: card list */}
                <ul className="sm:hidden divide-y divide-border">
                  {recentLeads.map((lead) => {
                    const label =
                      (lead.user_id ? emailByUserId.get(lead.user_id) : null) ??
                      lead.email ??
                      lead.full_name ??
                      `Lead ${lead.id.slice(0, 8)}`;
                    return (
                      <li key={lead.id} className="px-4 py-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <Link
                              href={`/advisor/leads/${lead.id}`}
                              className="text-sm font-medium text-navy hover:text-warm-soil truncate block"
                            >
                              {label}
                            </Link>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {lead.project_type
                                ? lead.project_type.replace(/_/g, " ")
                                : "No project"}{" "}
                              · {formatDate(lead.created_at)}
                            </p>
                          </div>
                          <StatusBadge status={lead.lead_status} />
                        </div>
                      </li>
                    );
                  })}
                </ul>

                {/* Desktop: table */}
                <div className="hidden sm:block overflow-x-auto">
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
                        <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                          Portal
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {recentLeads.map((lead) => {
                        const label =
                          (lead.user_id ? emailByUserId.get(lead.user_id) : null) ??
                          lead.email ??
                          lead.full_name ??
                          `Lead ${lead.id.slice(0, 8)}`;
                        return (
                          <tr
                            key={lead.id}
                            className="hover:bg-light-bg transition-colors"
                          >
                            <td className="px-5 py-3">
                              <Link
                                href={`/advisor/leads/${lead.id}`}
                                className="text-navy font-medium hover:text-warm-soil text-xs"
                              >
                                {label}
                              </Link>
                              {!lead.user_id && lead.email && (
                                <p className="text-[10px] text-muted-foreground mt-0.5">
                                  No account yet
                                </p>
                              )}
                            </td>
                            <td className="px-5 py-3 text-muted-foreground text-xs">
                              {lead.project_type
                                ? lead.project_type.replace(/_/g, " ")
                                : "-"}
                            </td>
                            <td className="px-5 py-3">
                              <StatusBadge status={lead.lead_status} />
                            </td>
                            <td className="px-5 py-3 text-muted-foreground text-xs">
                              {formatDate(lead.created_at)}
                            </td>
                            <td className="px-5 py-3 text-right">
                              {lead.user_id ? (
                                <ActivateClientButton
                                  userId={lead.user_id}
                                  userEmail={
                                    emailByUserId.get(lead.user_id) ?? label
                                  }
                                  isClient={activeClientUserIds.has(lead.user_id)}
                                />
                              ) : (
                                <span className="text-[10px] text-muted-foreground">
                                  Register first
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Quick Access — 2 col mobile, 4 col desktop */}
        <div>
          <h2 className="text-xs font-semibold text-navy uppercase tracking-wide mb-3">
            Quick Access
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: "Leads", href: "/advisor/leads", icon: Users },
              { label: "Calls", href: "/advisor/calls", icon: Phone },
              { label: "Invoices", href: "/advisor/invoices", icon: FileCheck },
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
