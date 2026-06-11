import { Metadata } from "next";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { PageHeader } from "@/components/shared/PageHeader";
import { DashboardCard } from "@/components/shared/DashboardCard";
import { Users, Phone, Briefcase, FileCheck, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Reports" };

export default async function AdvisorReportsPage() {
  const admin = createAdminClient();

  const [
    leadsRes,
    clientsRes,
    meetingsRes,
    buildchecksRes,
    proposalsRes,
    statusRes,
  ] = await Promise.all([
    admin.from("leads").select("id", { count: "exact", head: true }),
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
      .neq("buildcheck_status", "completed"),
    admin
      .from("proposals")
      .select("id, status, total_amount")
      .in("status", ["sent", "viewed", "approved"]),
    admin.from("leads").select("lead_status"),
  ]);

  const totalLeads = leadsRes.count ?? 0;
  const activeClients = clientsRes.count ?? 0;
  const upcomingCalls = meetingsRes.count ?? 0;
  const pendingReviews = buildchecksRes.count ?? 0;

  const pendingInvoices = (proposalsRes.data ?? []) as Array<{
    status: string;
    total_amount: number;
  }>;
  const outstandingAmount = pendingInvoices.reduce(
    (sum, p) => sum + (p.total_amount ?? 0),
    0
  );

  const statusCounts = new Map<string, number>();
  for (const row of (statusRes.data ?? []) as Array<{ lead_status: string }>) {
    statusCounts.set(row.lead_status, (statusCounts.get(row.lead_status) ?? 0) + 1);
  }

  const pipelineEntries = [...statusCounts.entries()].sort((a, b) => b[1] - a[1]);

  return (
    <>
      <DashboardHeader title="AdvisorHQ" userName="Eduardo" userInitials="EM" />
      <div className="flex-1 px-6 py-8 space-y-8">
        <PageHeader
          title="Reports"
          description="Snapshot of pipeline health and outstanding work."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardCard
            title="Total leads"
            value={totalLeads}
            description="All time"
            icon={<Users size={16} />}
          />
          <DashboardCard
            title="Active clients"
            value={activeClients}
            description="In BuildIQ"
            icon={<Briefcase size={16} />}
          />
          <DashboardCard
            title="Upcoming calls"
            value={upcomingCalls}
            description="Scheduled"
            icon={<Phone size={16} />}
          />
          <DashboardCard
            title="Quote reviews"
            value={pendingReviews}
            description="Pending completion"
            icon={<FileCheck size={16} />}
          />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6">
            <h2 className="text-sm font-semibold text-navy mb-4">Lead pipeline</h2>
            {pipelineEntries.length === 0 ? (
              <p className="text-sm text-muted-foreground">No leads yet.</p>
            ) : (
              <div className="space-y-2">
                {pipelineEntries.map(([status, count]) => (
                  <div
                    key={status}
                    className="flex items-center justify-between text-sm py-1.5 border-b border-border last:border-0"
                  >
                    <span className="capitalize text-navy">
                      {status.replace(/_/g, " ")}
                    </span>
                    <span className="font-semibold text-navy">{count}</span>
                  </div>
                ))}
              </div>
            )}
            <Link
              href="/advisor/leads"
              className="inline-flex items-center gap-1 text-xs font-semibold text-warm-soil hover:underline mt-4"
            >
              View leads
              <ArrowRight size={12} />
            </Link>
          </div>

          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6 space-y-4">
            <h2 className="text-sm font-semibold text-navy">Outstanding invoices</h2>
            <p className="text-3xl font-bold text-navy">
              ${outstandingAmount.toLocaleString("en-AU")}
            </p>
            <p className="text-sm text-muted-foreground">
              {pendingInvoices.length} invoice{pendingInvoices.length === 1 ? "" : "s"}{" "}
              sent or awaiting payment
            </p>
            <Link
              href="/advisor/invoices"
              className="inline-flex items-center gap-1 text-xs font-semibold text-warm-soil hover:underline"
            >
              View invoices
              <ArrowRight size={12} />
            </Link>
            {pendingReviews > 0 && (
              <Link
                href="/advisor/projects?filter=pending-reviews"
                className="inline-flex items-center gap-1 text-xs font-semibold text-warm-soil hover:underline block"
              >
                {pendingReviews} pending quote review{pendingReviews === 1 ? "" : "s"}
                <ArrowRight size={12} />
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
