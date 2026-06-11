"use client";

import { useState, useTransition } from "react";
import { Loader2, Mail, CheckCircle2, Eye, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sendInvoice, markInvoicePaid } from "@/features/invoices/actions";
import { InvoicePreview } from "@/features/invoices/components/InvoicePreview";

interface InvoiceActionsProps {
  invoiceId: string;
  status: string;
  serviceName: string;
  amount: number;
  recipientName: string;
  paymentInstructions: string;
  notes?: string | null;
}

export function InvoiceActions({
  invoiceId,
  status,
  serviceName,
  amount,
  recipientName,
  paymentInstructions,
  notes,
}: InvoiceActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [localStatus, setLocalStatus] = useState(status);
  const [showSendPreview, setShowSendPreview] = useState(false);

  function handleSend() {
    setError(null);
    startTransition(async () => {
      const result = await sendInvoice(invoiceId);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      setLocalStatus("sent");
      setShowSendPreview(false);
    });
  }

  function handleMarkPaid() {
    if (
      !confirm(
        "Mark this invoice as paid? This will activate the client portal and email login instructions."
      )
    ) {
      return;
    }

    setError(null);
    startTransition(async () => {
      const result = await markInvoicePaid(invoiceId);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      setLocalStatus("paid");
    });
  }

  if (localStatus === "paid") {
    return (
      <span className="inline-flex items-center gap-1.5 text-sm text-emerald-700 font-medium">
        <CheckCircle2 size={16} />
        Paid - portal access sent
      </span>
    );
  }

  return (
    <div className="space-y-4">
      {!showSendPreview ? (
        <div className="flex flex-wrap items-center gap-3">
          {(localStatus === "draft" || localStatus === "sent") && (
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => setShowSendPreview(true)}
            >
              <Eye size={14} className="mr-1.5" />
              {localStatus === "sent" ? "Preview & resend" : "Preview & send"}
            </Button>
          )}

          {localStatus !== "draft" && (
            <Button
              type="button"
              disabled={isPending}
              onClick={handleMarkPaid}
              className="bg-emerald-700 hover:bg-emerald-800"
            >
              {isPending ? (
                <Loader2 size={14} className="animate-spin mr-1.5" />
              ) : (
                <CheckCircle2 size={14} className="mr-1.5" />
              )}
              Mark as paid
            </Button>
          )}

          {error && <p className="text-sm text-destructive w-full">{error}</p>}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-navy">Confirm before sending</p>
            <button
              type="button"
              onClick={() => setShowSendPreview(false)}
              className="text-muted-foreground hover:text-navy"
              aria-label="Close preview"
            >
              <X size={16} />
            </button>
          </div>

          <InvoicePreview
              compact
              serviceName={serviceName}
              amount={amount}
              recipientLabel={recipientName}
              paymentInstructions={paymentInstructions}
              notes={notes ?? undefined}
            />

          <div className="flex flex-wrap gap-2">
            <Button type="button" disabled={isPending} onClick={handleSend}>
              {isPending ? (
                <Loader2 size={14} className="animate-spin mr-1.5" />
              ) : (
                <Mail size={14} className="mr-1.5" />
              )}
              {localStatus === "sent" ? "Confirm resend" : "Confirm & send email"}
            </Button>
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => setShowSendPreview(false)}
            >
              Cancel
            </Button>
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      )}
    </div>
  );
}
