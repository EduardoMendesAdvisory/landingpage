import { formatCurrency } from "@/utils/formatters";
import { serviceNameFromSlug } from "@/lib/invoices/constants";
import type { PublicServiceSlug } from "@/lib/services-catalog";

interface InvoicePreviewProps {
  serviceSlug?: PublicServiceSlug;
  serviceName?: string;
  amount: number;
  recipientLabel: string;
  paymentInstructions: string;
  notes?: string;
  compact?: boolean;
}

export function InvoicePreview({
  serviceSlug,
  serviceName: serviceNameOverride,
  amount,
  recipientLabel,
  paymentInstructions,
  notes,
  compact = false,
}: InvoicePreviewProps) {
  const serviceName =
    serviceNameOverride ??
    (serviceSlug ? serviceNameFromSlug(serviceSlug) : "Invoice");

  return (
    <div
      className={`rounded-2xl border border-[#ece8e1] bg-[#faf9f7] overflow-hidden ${
        compact ? "" : "shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
      }`}
    >
      <div className="bg-[#111A24] text-white px-5 py-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[#b67c2c] text-sm font-bold">EM</span>
          <span className="text-white/70 text-xs">Eduardo Mendes Advisory</span>
        </div>
        <p className="text-base font-bold">{serviceName}</p>
        <p className="text-white/70 text-xs mt-1">Prepared for {recipientLabel}</p>
      </div>

      <div className="p-5 space-y-4 bg-white">
        <div className="flex items-center justify-between text-sm border-b border-border pb-3">
          <span className="font-medium text-navy">{serviceName}</span>
          <span className="font-bold text-navy">{formatCurrency(amount)}</span>
        </div>

        {notes?.trim() && (
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-1">
              Notes
            </p>
            <p className="text-xs text-muted-foreground whitespace-pre-wrap">{notes}</p>
          </div>
        )}

        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">
            How to pay
          </p>
          <p className="text-xs text-muted-foreground whitespace-pre-wrap leading-relaxed">
            {paymentInstructions}
          </p>
        </div>

        <p className="text-[10px] text-muted-foreground pt-1 border-t border-border">
          Preview - this is what the client will see on the invoice page and email.
        </p>
      </div>
    </div>
  );
}
