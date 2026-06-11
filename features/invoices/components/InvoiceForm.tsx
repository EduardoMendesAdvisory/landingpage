"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PUBLIC_SERVICES } from "@/lib/services-catalog";
import { createInvoice } from "@/features/invoices/actions";
import type { PublicServiceSlug } from "@/lib/services-catalog";

interface InvoiceFormProps {
  leads: Array<{ id: string; label: string }>;
  clients: Array<{ id: string; label: string }>;
  defaultLeadId?: string;
  defaultClientId?: string;
}

export function InvoiceForm({
  leads,
  clients,
  defaultLeadId,
  defaultClientId,
}: InvoiceFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [targetType, setTargetType] = useState<"lead" | "client">(
    defaultClientId ? "client" : "lead"
  );
  const [leadId, setLeadId] = useState(defaultLeadId ?? leads[0]?.id ?? "");
  const [clientId, setClientId] = useState(
    defaultClientId ?? clients[0]?.id ?? ""
  );
  const [serviceSlug, setServiceSlug] = useState<PublicServiceSlug>("buildcheck");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsedAmount = parseFloat(amount);
    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Enter a valid amount.");
      return;
    }

    startTransition(async () => {
      const result = await createInvoice({
        leadId: targetType === "lead" ? leadId : undefined,
        clientId: targetType === "client" ? clientId : undefined,
        serviceSlug,
        amount: parsedAmount,
        notes: notes.trim() || undefined,
      });

      if ("error" in result) {
        setError(result.error);
        return;
      }

      if (result.invoiceId) {
        router.push(`/advisor/invoices/${result.invoiceId}`);
      } else {
        router.push("/advisor/invoices");
      }
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
      <div className="space-y-2">
        <label className="text-sm font-medium text-navy">Invoice for</label>
        <div className="flex gap-2">
          {(["lead", "client"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setTargetType(type)}
              className={`px-3 py-1.5 rounded-lg text-sm border transition-colors ${
                targetType === type
                  ? "bg-navy text-white border-navy"
                  : "bg-white text-navy border-border hover:bg-light-bg"
              }`}
            >
              {type === "lead" ? "Lead" : "Client"}
            </button>
          ))}
        </div>
      </div>

      {targetType === "lead" ? (
        <div className="space-y-2">
          <label htmlFor="leadId" className="text-sm font-medium text-navy">
            Lead
          </label>
          <select
            id="leadId"
            value={leadId}
            onChange={(e) => setLeadId(e.target.value)}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            required
          >
            {leads.length === 0 ? (
              <option value="">No leads with email</option>
            ) : (
              leads.map((lead) => (
                <option key={lead.id} value={lead.id}>
                  {lead.label}
                </option>
              ))
            )}
          </select>
        </div>
      ) : (
        <div className="space-y-2">
          <label htmlFor="clientId" className="text-sm font-medium text-navy">
            Client
          </label>
          <select
            id="clientId"
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
            className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            required
          >
            {clients.length === 0 ? (
              <option value="">No active clients</option>
            ) : (
              clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.label}
                </option>
              ))
            )}
          </select>
        </div>
      )}

      <div className="space-y-2">
        <label htmlFor="serviceSlug" className="text-sm font-medium text-navy">
          Service
        </label>
        <select
          id="serviceSlug"
          value={serviceSlug}
          onChange={(e) => setServiceSlug(e.target.value as PublicServiceSlug)}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm"
          required
        >
          {PUBLIC_SERVICES.map((service) => (
            <option key={service.slug} value={service.slug}>
              {service.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="amount" className="text-sm font-medium text-navy">
          Amount (AUD)
        </label>
        <input
          id="amount"
          type="number"
          min="0"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="e.g. 1200"
          className="w-full rounded-lg border border-border px-3 py-2 text-sm"
          required
        />
        <p className="text-xs text-muted-foreground">
          You set the price - no fixed catalog amount.
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="notes" className="text-sm font-medium text-navy">
          Notes (optional)
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm resize-none"
          placeholder="Scope, deliverables, or payment terms..."
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={isPending}>
        {isPending ? (
          <>
            <Loader2 size={14} className="animate-spin mr-1.5" />
            Creating...
          </>
        ) : (
          "Create invoice"
        )}
      </Button>
    </form>
  );
}
