"use client";

import { useState, useTransition } from "react";
import { Loader2, Mail, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { sendInvoice, markInvoicePaid } from "@/features/invoices/actions";

interface InvoiceActionsProps {
  invoiceId: string;
  status: string;
}

export function InvoiceActions({ invoiceId, status }: InvoiceActionsProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [localStatus, setLocalStatus] = useState(status);

  function handleSend() {
    setError(null);
    startTransition(async () => {
      const result = await sendInvoice(invoiceId);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      setLocalStatus("sent");
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
        Paid  -  portal access sent
      </span>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {(localStatus === "draft" || localStatus === "sent") && (
        <Button
          type="button"
          variant="outline"
          disabled={isPending}
          onClick={handleSend}
        >
          {isPending ? (
            <Loader2 size={14} className="animate-spin mr-1.5" />
          ) : (
            <Mail size={14} className="mr-1.5" />
          )}
          {localStatus === "sent" ? "Resend invoice" : "Send invoice"}
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
  );
}
