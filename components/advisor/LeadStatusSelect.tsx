"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { updateLeadStatus } from "@/features/leads/actions";
import { LEAD_STATUS_OPTIONS } from "@/lib/leads/constants";
import type { LeadStatus } from "@/lib/leads/constants";

interface LeadStatusSelectProps {
  leadId: string;
  currentStatus: LeadStatus;
}

const OUTLINE_CHEVRON = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23b67c2c' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`;
const FILLED_CHEVRON = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`;

/** @deprecated Use LeadStatusSelectControl inside LeadPipelineProvider */
export function LeadStatusSelect({ leadId, currentStatus }: LeadStatusSelectProps) {
  const [status, setStatus] = useState(currentStatus);
  const [hasSelected, setHasSelected] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as LeadStatus;
    setStatus(next);
    setHasSelected(true);
    startTransition(async () => {
      await updateLeadStatus({ leadId, status: next });
    });
  }

  const isFilled = hasSelected;

  return (
    <div className="relative">
      <select
        value={status}
        onChange={handleChange}
        disabled={isPending}
        className={`rounded-lg border border-[#b67c2c] px-3 py-2 text-sm font-semibold min-w-[220px] disabled:opacity-60 cursor-pointer transition-colors appearance-none pr-8 ${
          isFilled
            ? "bg-[#b67c2c] hover:bg-[#9f6c27] text-white"
            : "bg-white hover:bg-[#b67c2c]/5 text-[#b67c2c]"
        }`}
        style={{
          backgroundImage: isFilled ? FILLED_CHEVRON : OUTLINE_CHEVRON,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 0.65rem center",
        }}
      >
        {LEAD_STATUS_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option.replace(/_/g, " ")}
          </option>
        ))}
      </select>
      {isPending && (
        <Loader2
          size={14}
          className="animate-spin absolute right-[-22px] top-1/2 -translate-y-1/2 text-muted-foreground"
        />
      )}
    </div>
  );
}
