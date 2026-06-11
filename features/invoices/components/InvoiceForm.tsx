"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Eye, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PUBLIC_SERVICES } from "@/lib/services-catalog";
import { createInvoice } from "@/features/invoices/actions";
import { InvoicePreview } from "@/features/invoices/components/InvoicePreview";
import {
  formatBsb,
  formatPaymentInstructions,
  isValidBankDetails,
  parseSavedBankDetails,
  type InvoiceBankDetails,
} from "@/lib/invoices/bank-details";
import type { PublicServiceSlug } from "@/lib/services-catalog";

interface InvoiceFormProps {
  leads: Array<{ id: string; label: string }>;
  clients: Array<{ id: string; label: string }>;
  defaultLeadId?: string;
  defaultClientId?: string;
  savedBankDetails?: InvoiceBankDetails | null;
}

const EMPTY_BANK: InvoiceBankDetails = {
  accountName: "",
  bsb: "",
  accountNumber: "",
  bankName: "",
};

const BANK_STORAGE_KEY = "em_invoice_bank_details";

function loadLocalBankDetails(): InvoiceBankDetails | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(BANK_STORAGE_KEY);
    if (!raw) return null;
    return parseSavedBankDetails(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function InvoiceForm({
  leads,
  clients,
  defaultLeadId,
  defaultClientId,
  savedBankDetails,
}: InvoiceFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [targetType, setTargetType] = useState<"lead" | "client">(
    defaultClientId ? "client" : defaultLeadId ? "lead" : "lead"
  );
  const [leadId, setLeadId] = useState(defaultLeadId ?? leads[0]?.id ?? "");
  const [clientId, setClientId] = useState(
    defaultClientId ?? clients[0]?.id ?? ""
  );
  const [serviceSlug, setServiceSlug] = useState<PublicServiceSlug>("buildcheck");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [bankDetails, setBankDetails] = useState<InvoiceBankDetails>(
    savedBankDetails ?? EMPTY_BANK
  );
  const [saveBankDetails, setSaveBankDetails] = useState(
    Boolean(savedBankDetails?.accountName)
  );

  useEffect(() => {
    if (savedBankDetails?.accountName) return;
    const local = loadLocalBankDetails();
    if (local?.accountName) {
      setBankDetails(local);
      setSaveBankDetails(true);
    }
  }, [savedBankDetails]);

  const recipientLabel =
    targetType === "lead"
      ? leads.find((l) => l.id === leadId)?.label ?? "Lead"
      : clients.find((c) => c.id === clientId)?.label ?? "Client";

  const parsedAmount = parseFloat(amount);
  const previewAmount =
    Number.isNaN(parsedAmount) || parsedAmount <= 0 ? 0 : parsedAmount;

  const paymentInstructions =
    isValidBankDetails(bankDetails)
      ? formatPaymentInstructions(bankDetails, recipientLabel.split(" (")[0])
      : "Complete bank details to generate payment instructions.";

  function updateBankField<K extends keyof InvoiceBankDetails>(
    field: K,
    value: InvoiceBankDetails[K]
  ) {
    setBankDetails((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (Number.isNaN(parsedAmount) || parsedAmount <= 0) {
      setError("Enter a valid amount.");
      return;
    }

    if (!isValidBankDetails(bankDetails)) {
      setError("Enter account name, a 6-digit BSB, and account number.");
      return;
    }

    startTransition(async () => {
      if (saveBankDetails && isValidBankDetails(bankDetails)) {
        localStorage.setItem(BANK_STORAGE_KEY, JSON.stringify(bankDetails));
      }

      const result = await createInvoice({
        leadId: targetType === "lead" ? leadId : undefined,
        clientId: targetType === "client" ? clientId : undefined,
        serviceSlug,
        amount: parsedAmount,
        notes: notes.trim() || undefined,
        bankDetails,
        saveBankDetails,
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
    <div className="grid xl:grid-cols-[1fr_360px] gap-8 items-start">
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
        </div>

        <fieldset className="space-y-4 rounded-xl border border-[#ece8e1] bg-[#faf9f7] p-4">
          <legend className="text-sm font-semibold text-navy px-1">
            Bank details (EFT)
          </legend>

          <div className="space-y-2">
            <label htmlFor="accountName" className="text-xs font-medium text-navy">
              Account name
            </label>
            <input
              id="accountName"
              value={bankDetails.accountName}
              onChange={(e) => updateBankField("accountName", e.target.value)}
              placeholder="e.g. Eduardo Mendes Advisory Pty Ltd"
              className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-white"
              required
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label htmlFor="bsb" className="text-xs font-medium text-navy">
                BSB
              </label>
              <input
                id="bsb"
                value={bankDetails.bsb}
                onChange={(e) => updateBankField("bsb", formatBsb(e.target.value))}
                placeholder="000-000"
                inputMode="numeric"
                className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-white"
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="accountNumber" className="text-xs font-medium text-navy">
                Account number
              </label>
              <input
                id="accountNumber"
                value={bankDetails.accountNumber}
                onChange={(e) =>
                  updateBankField("accountNumber", e.target.value.replace(/\D/g, ""))
                }
                placeholder="12345678"
                inputMode="numeric"
                className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-white"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="bankName" className="text-xs font-medium text-navy">
              Bank name (optional)
            </label>
            <input
              id="bankName"
              value={bankDetails.bankName ?? ""}
              onChange={(e) => updateBankField("bankName", e.target.value)}
              placeholder="e.g. Commonwealth Bank"
              className="w-full rounded-lg border border-border px-3 py-2 text-sm bg-white"
            />
          </div>

          <label className="flex items-start gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={saveBankDetails}
              onChange={(e) => setSaveBankDetails(e.target.checked)}
              className="mt-0.5 rounded border-border text-[#b67c2c] focus:ring-[#b67c2c]"
            />
            <span className="text-xs text-muted-foreground leading-relaxed">
              Save bank details for future invoices? Eduardo won&apos;t need to fill these again.
            </span>
          </label>
        </fieldset>

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

        <div className="flex flex-wrap gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowPreview((v) => !v)}
            className="xl:hidden"
          >
            <Eye size={14} className="mr-1.5" />
            {showPreview ? "Hide preview" : "Show preview"}
          </Button>
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
        </div>
      </form>

      <aside className={`space-y-3 ${showPreview ? "block" : "hidden xl:block"}`}>
        <p className="text-xs font-semibold uppercase tracking-wider text-[#b67c2c]">
          Client preview
        </p>
        <InvoicePreview
          serviceSlug={serviceSlug}
          amount={previewAmount}
          recipientLabel={recipientLabel.split(" (")[0]}
          paymentInstructions={paymentInstructions}
          notes={notes}
        />
      </aside>
    </div>
  );
}
