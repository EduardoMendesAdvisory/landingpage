import { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { serviceNameFromSlug } from "@/lib/invoices/constants";

export const metadata: Metadata = { title: "Invoice" };

interface ProposalPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProposalPage({ params }: ProposalPageProps) {
  const { id } = await params;
  const admin = createAdminClient();

  const { data: proposal, error } = await admin
    .from("proposals")
    .select("*, proposal_items(*)")
    .eq("id", id)
    .single();

  if (error || !proposal) notFound();

  const typedProposal = proposal as unknown as {
    id: string;
    title: string;
    status: string;
    total_amount: number;
    valid_until: string | null;
    notes: string | null;
    terms: string | null;
    payment_instructions: string | null;
    recipient_name: string | null;
    service_slug: string | null;
    created_at: string;
    proposal_items: Array<{
      id: string;
      item_name: string;
      description: string | null;
      quantity: number;
      unit_price: number;
      total_price: number;
    }>;
  };

  const serviceName = typedProposal.service_slug
    ? serviceNameFromSlug(typedProposal.service_slug)
    : typedProposal.title;

  const isPaid = typedProposal.status === "paid";

  return (
    <div className="min-h-screen bg-[#f5f4f1] py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-[#111A24] text-white rounded-2xl p-8">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[#b67c2c] text-xl font-bold">EM</span>
                <span className="text-white/70 text-sm">
                  Eduardo Mendes Advisory
                </span>
              </div>
              <h1 className="text-2xl font-bold">{serviceName}</h1>
              {typedProposal.recipient_name && (
                <p className="text-white/70 text-sm mt-1">
                  Prepared for {typedProposal.recipient_name}
                </p>
              )}
              <p className="text-white/50 text-sm mt-1">
                Issued {formatDate(typedProposal.created_at)}
              </p>
            </div>
            <StatusBadge status={typedProposal.status} label={isPaid ? "Paid" : undefined} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-semibold text-[#111A24]">Invoice details</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-[#f8f9fa]">
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">
                  Item
                </th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {typedProposal.proposal_items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4">
                    <p className="font-medium text-[#111A24]">{item.item_name}</p>
                    {item.description && (
                      <p className="text-xs text-muted-foreground mt-0.5 whitespace-pre-wrap">
                        {item.description}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-[#111A24]">
                    {formatCurrency(item.total_price)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-[#111A24]/20 bg-[#f8f9fa]">
                <td className="px-6 py-4 font-semibold text-[#111A24] text-right">
                  Total (AUD)
                </td>
                <td className="px-6 py-4 text-right font-bold text-[#111A24] text-lg">
                  {formatCurrency(typedProposal.total_amount)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {!isPaid && typedProposal.payment_instructions && (
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6">
            <h3 className="font-semibold text-[#111A24] mb-2">How to pay</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {typedProposal.payment_instructions}
            </p>
            <p className="text-xs text-muted-foreground mt-4">
              Once your payment is received, Eduardo will confirm and send your client portal login details by email.
            </p>
          </div>
        )}

        {isPaid && (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-sm text-emerald-800">
            Payment confirmed. Check your email for client portal access instructions.
          </div>
        )}

        {typedProposal.notes && (
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6">
            <h3 className="font-semibold text-[#111A24] mb-2">Notes</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {typedProposal.notes}
            </p>
          </div>
        )}

        {typedProposal.valid_until && !isPaid && (
          <p className="text-xs text-muted-foreground text-center">
            This invoice is valid until {formatDate(typedProposal.valid_until)}.
          </p>
        )}
      </div>
    </div>
  );
}
