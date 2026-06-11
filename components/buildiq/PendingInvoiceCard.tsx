import Link from "next/link";
import { Receipt, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";
import { serviceNameFromSlug } from "@/lib/invoices/constants";

interface PendingInvoiceCardProps {
  invoice: {
    id: string;
    total_amount: number;
    service_slug: string | null;
    title: string;
    status: string;
  };
}

export function PendingInvoiceCard({ invoice }: PendingInvoiceCardProps) {
  const serviceName = invoice.service_slug
    ? serviceNameFromSlug(invoice.service_slug)
    : invoice.title;

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50/80 p-5">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
          <Receipt size={18} className="text-amber-700" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold uppercase tracking-wider text-amber-700 mb-1">
            Invoice pending
          </p>
          <p className="text-sm font-bold text-[#111A24]">{serviceName}</p>
          <p className="text-lg font-bold text-[#111A24] mt-1">
            {formatCurrency(invoice.total_amount)}
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Payment by bank transfer. View invoice for instructions.
          </p>
          <Link
            href={`/proposal/${invoice.id}`}
            className="inline-flex items-center gap-1.5 mt-3 text-sm font-semibold text-[#111A24] hover:text-[#b67c2c] transition-colors"
          >
            View invoice
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}
