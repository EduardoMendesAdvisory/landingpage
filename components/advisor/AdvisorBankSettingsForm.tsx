"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { saveBankDetails } from "@/features/invoices/actions";
import {
  isValidBankDetails,
  type InvoiceBankDetails,
} from "@/lib/invoices/bank-details";

interface AdvisorBankSettingsFormProps {
  initial: InvoiceBankDetails | null;
}

const EMPTY: InvoiceBankDetails = {
  accountName: "",
  bsb: "",
  accountNumber: "",
  bankName: "",
};

export function AdvisorBankSettingsForm({ initial }: AdvisorBankSettingsFormProps) {
  const [details, setDetails] = useState<InvoiceBankDetails>(initial ?? EMPTY);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  function updateField<K extends keyof InvoiceBankDetails>(
    field: K,
    value: InvoiceBankDetails[K]
  ) {
    setDetails((prev) => ({ ...prev, [field]: value }));
    setSuccess(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    if (!isValidBankDetails(details)) {
      setError("Please fill in account name, BSB and account number.");
      return;
    }

    startTransition(async () => {
      const result = await saveBankDetails(details);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      setSuccess(true);
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-border p-6 space-y-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)] max-w-lg"
    >
      <p className="text-sm text-muted-foreground">
        Default bank details pre-filled on new invoices.
      </p>
      <div>
        <label className="block text-xs font-semibold text-navy mb-1.5">
          Account name
        </label>
        <input
          value={details.accountName}
          onChange={(e) => updateField("accountName", e.target.value)}
          className="w-full rounded-lg border border-border px-3 py-2.5 text-sm"
          disabled={pending}
        />
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-navy mb-1.5">BSB</label>
          <input
            value={details.bsb}
            onChange={(e) => updateField("bsb", e.target.value)}
            placeholder="000-000"
            className="w-full rounded-lg border border-border px-3 py-2.5 text-sm"
            disabled={pending}
          />
        </div>
        <div>
          <label className="block text-xs font-semibold text-navy mb-1.5">
            Account number
          </label>
          <input
            value={details.accountNumber}
            onChange={(e) => updateField("accountNumber", e.target.value)}
            className="w-full rounded-lg border border-border px-3 py-2.5 text-sm"
            disabled={pending}
          />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold text-navy mb-1.5">
          Bank name (optional)
        </label>
        <input
          value={details.bankName ?? ""}
          onChange={(e) => updateField("bankName", e.target.value)}
          className="w-full rounded-lg border border-border px-3 py-2.5 text-sm"
          disabled={pending}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}
      {success && (
        <p className="text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">
          Bank details saved.
        </p>
      )}
      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 bg-navy hover:bg-navy/90 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2.5 rounded-lg"
      >
        {pending ? <Loader2 size={14} className="animate-spin" /> : null}
        Save bank details
      </button>
    </form>
  );
}
