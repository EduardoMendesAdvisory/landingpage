import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatCurrency, formatDate } from "@/utils/formatters";

export const metadata: Metadata = { title: "Proposal" };

interface ProposalPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProposalPage({ params }: ProposalPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: proposal, error } = await supabase
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

  return (
    <div className="min-h-screen bg-light-bg py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-navy text-white rounded-2xl p-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-warm-soil text-xl font-bold">EM</span>
                <span className="text-white/70 text-sm">
                  Eduardo Mendes Advisory
                </span>
              </div>
              <h1 className="text-2xl font-bold">{typedProposal.title}</h1>
              <p className="text-white/60 text-sm mt-1">
                Created {formatDate(typedProposal.created_at)}
              </p>
            </div>
            <StatusBadge status={typedProposal.status} />
          </div>
        </div>

        {/* Line items */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden">
          <div className="px-6 py-4 border-b border-border">
            <h2 className="font-semibold text-navy">Services</h2>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-light-bg">
                <th className="text-left px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">
                  Item
                </th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">
                  Qty
                </th>
                <th className="text-right px-6 py-3 text-xs font-semibold text-muted-foreground uppercase">
                  Unit
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
                    <p className="font-medium text-navy">{item.item_name}</p>
                    {item.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.description}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right text-muted-foreground">
                    {item.quantity}
                  </td>
                  <td className="px-6 py-4 text-right text-muted-foreground">
                    {formatCurrency(item.unit_price)}
                  </td>
                  <td className="px-6 py-4 text-right font-medium text-navy">
                    {formatCurrency(item.total_price)}
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-navy/20 bg-light-bg">
                <td
                  colSpan={3}
                  className="px-6 py-4 font-semibold text-navy text-right"
                >
                  Total (AUD)
                </td>
                <td className="px-6 py-4 text-right font-bold text-navy text-lg">
                  {formatCurrency(typedProposal.total_amount)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Notes / terms */}
        {typedProposal.notes && (
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6">
            <h3 className="font-semibold text-navy mb-2">Notes</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {typedProposal.notes}
            </p>
          </div>
        )}

        {typedProposal.terms && (
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6">
            <h3 className="font-semibold text-navy mb-2">Terms & Conditions</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {typedProposal.terms}
            </p>
          </div>
        )}

        {typedProposal.valid_until && (
          <p className="text-xs text-muted-foreground text-center">
            This proposal is valid until {formatDate(typedProposal.valid_until)}.
          </p>
        )}
      </div>
    </div>
  );
}
