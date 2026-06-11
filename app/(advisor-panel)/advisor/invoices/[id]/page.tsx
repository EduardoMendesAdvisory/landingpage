import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { serviceNameFromSlug } from "@/lib/invoices/constants";
import { InvoiceActions } from "@/features/invoices/components/InvoiceActions";
import { ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Invoice Detail" };

interface InvoiceDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function InvoiceDetailPage({ params }: InvoiceDetailPageProps) {
  const { id } = await params;
  const admin = createAdminClient();

  const { data: proposal, error } = await admin
    .from("proposals")
    .select("*, proposal_items(*)")
    .eq("id", id)
    .single();

  if (error || !proposal) notFound();

  const row = proposal as unknown as {
    id: string;
    title: string;
    status: string;
    total_amount: number;
    recipient_email: string | null;
    recipient_name: string | null;
    service_slug: string | null;
    payment_instructions: string | null;
    notes: string | null;
    sent_at: string | null;
    paid_at: string | null;
    created_at: string;
    valid_until: string | null;
    proposal_items: Array<{
      item_name: string;
      description: string | null;
      total_price: number;
    }>;
  };

  const serviceName = row.service_slug
    ? serviceNameFromSlug(row.service_slug)
    : row.title;

  return (
    <>
      <DashboardHeader title="AdvisorHQ" userName="Eduardo" userInitials="EM" />
      <div className="flex-1 px-6 py-8 space-y-6">
        <PageHeader title={serviceName} description={`Invoice for ${row.recipient_name ?? row.recipient_email}`}>
          <StatusBadge status={row.status} />
        </PageHeader>

        <div className="grid lg:grid-cols-[1fr_320px] gap-6">
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Recipient</p>
                <p className="font-medium text-navy mt-1">{row.recipient_name ?? " - "}</p>
                <p className="text-muted-foreground">{row.recipient_email}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Amount</p>
                <p className="text-2xl font-bold text-navy mt-1">
                  {formatCurrency(row.total_amount)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Created</p>
                <p className="text-navy mt-1">{formatDate(row.created_at)}</p>
              </div>
              {row.valid_until && (
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide">Valid until</p>
                  <p className="text-navy mt-1">{formatDate(row.valid_until)}</p>
                </div>
              )}
            </div>

            {row.proposal_items[0]?.description && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Notes</p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {row.proposal_items[0].description}
                </p>
              </div>
            )}

            {row.payment_instructions && (
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Payment instructions
                </p>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap bg-light-bg rounded-lg p-4">
                  {row.payment_instructions}
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-5 space-y-4">
              <h3 className="text-sm font-semibold text-navy">Actions</h3>
              <InvoiceActions
                invoiceId={row.id}
                status={row.status}
                serviceName={serviceName}
                amount={row.total_amount}
                recipientName={row.recipient_name ?? row.recipient_email ?? "Client"}
                paymentInstructions={row.payment_instructions ?? ""}
                notes={row.proposal_items[0]?.description}
              />
              <a
                href={`/proposal/${row.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm text-warm-soil hover:underline"
              >
                <ExternalLink size={14} />
                Preview client view
              </a>
            </div>

            {(row.sent_at || row.paid_at) && (
              <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-5 text-sm space-y-2">
                {row.sent_at && (
                  <p className="text-muted-foreground">
                    Sent: <span className="text-navy">{formatDate(row.sent_at)}</span>
                  </p>
                )}
                {row.paid_at && (
                  <p className="text-muted-foreground">
                    Paid: <span className="text-emerald-700 font-medium">{formatDate(row.paid_at)}</span>
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <Link href="/advisor/invoices" className="text-sm text-warm-soil hover:underline">
          ← Back to invoices
        </Link>
      </div>
    </>
  );
}
