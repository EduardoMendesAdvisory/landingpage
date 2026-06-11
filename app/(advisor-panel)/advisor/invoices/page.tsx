import { Metadata } from "next";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { serviceNameFromSlug } from "@/lib/invoices/constants";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Invoices" };

export default async function AdvisorInvoicesPage() {
  const admin = createAdminClient();

  const { data: proposals } = await admin
    .from("proposals")
    .select(
      "id, title, status, total_amount, recipient_email, recipient_name, service_slug, sent_at, paid_at, created_at, is_archived"
    )
    .eq("is_archived", false)
    .order("created_at", { ascending: false });

  const rows = (proposals ?? []) as Array<{
    id: string;
    title: string;
    status: string;
    total_amount: number;
    recipient_email: string | null;
    recipient_name: string | null;
    service_slug: string | null;
    sent_at: string | null;
    paid_at: string | null;
    created_at: string;
  }>;

  return (
    <>
      <DashboardHeader title="AdvisorHQ" userName="Eduardo" userInitials="EM" />
      <div className="flex-1 px-6 py-8 space-y-6">
        <PageHeader
          title="Invoices"
          description="Create invoices, send payment details, and activate client portal access when paid."
        >
          <Link
            href="/advisor/invoices/new"
            className="inline-flex items-center gap-2 bg-navy hover:bg-navy/90 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={15} />
            New invoice
          </Link>
        </PageHeader>

        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden">
          {rows.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground">
              No invoices yet. Create one to send payment details to a lead or client.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">
                    Recipient
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">
                    Service
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">
                    Amount
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">
                    Status
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {rows.map((row) => (
                  <tr key={row.id} className="hover:bg-light-bg transition-colors">
                    <td className="px-5 py-3">
                      <Link
                        href={`/advisor/invoices/${row.id}`}
                        className="font-medium text-navy hover:text-warm-soil"
                      >
                        {row.recipient_name ?? row.recipient_email ?? "-"}
                      </Link>
                      {row.recipient_email && (
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {row.recipient_email}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-3 text-muted-foreground">
                      {row.service_slug
                        ? serviceNameFromSlug(row.service_slug)
                        : row.title}
                    </td>
                    <td className="px-5 py-3 font-medium text-navy">
                      {formatCurrency(row.total_amount)}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="px-5 py-3 text-muted-foreground text-xs">
                      {row.paid_at
                        ? `Paid ${formatDate(row.paid_at)}`
                        : row.sent_at
                          ? `Sent ${formatDate(row.sent_at)}`
                          : formatDate(row.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </>
  );
}
