"use client";

import Link from "next/link";
import {
  createContext,
  useContext,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";
import { updateLeadStatus } from "@/features/leads/actions";
import { LEAD_STATUS_OPTIONS } from "@/lib/leads/constants";
import type { LeadStatus } from "@/lib/leads/constants";
import {
  getLeadJourneyProgress,
  resolveAdvisorNextAction,
} from "@/lib/leads/advisor-next-steps";

type LeadPipelineContextValue = {
  status: LeadStatus;
  hasSelected: boolean;
  isPending: boolean;
  onStatusChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
};

const LeadPipelineContext = createContext<LeadPipelineContextValue | null>(null);

export function useLeadPipeline() {
  const ctx = useContext(LeadPipelineContext);
  if (!ctx) throw new Error("Lead pipeline components must be used within LeadPipelineProvider");
  return ctx;
}

const OUTLINE_CHEVRON = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23b67c2c' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`;
const FILLED_CHEVRON = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`;

export function LeadPipelineProvider({
  leadId,
  initialStatus,
  children,
}: {
  leadId: string;
  initialStatus: LeadStatus;
  children: ReactNode;
}) {
  const [status, setStatus] = useState(initialStatus);
  const [hasSelected, setHasSelected] = useState(false);
  const [isPending, startTransition] = useTransition();

  function onStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as LeadStatus;
    setStatus(next);
    setHasSelected(true);
    startTransition(async () => {
      await updateLeadStatus({ leadId, status: next });
    });
  }

  return (
    <LeadPipelineContext.Provider
      value={{ status, hasSelected, isPending, onStatusChange }}
    >
      {children}
    </LeadPipelineContext.Provider>
  );
}

export function LeadStatusSelectControl() {
  const { status, hasSelected, isPending, onStatusChange } = useLeadPipeline();
  const isFilled = hasSelected;

  return (
    <div className="relative">
      <select
        value={status}
        onChange={onStatusChange}
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

export function LeadNextStepsPanel({
  leadId,
  hasUpcomingCall,
  hasPendingInvoice,
  isClient,
}: {
  leadId: string;
  hasUpcomingCall: boolean;
  hasPendingInvoice: boolean;
  isClient: boolean;
}) {
  const { status } = useLeadPipeline();
  const { steps } = getLeadJourneyProgress(status);
  const nextAction = resolveAdvisorNextAction({
    status,
    leadId,
    hasUpcomingCall,
    hasPendingInvoice,
    isClient,
  });
  const ActionIcon = nextAction.icon;

  return (
    <div className="grid lg:grid-cols-[1fr_280px] gap-5">
      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6">
        <p className="text-sm font-bold text-navy mb-5">Lead journey</p>
        <ol className="space-y-0">
          {steps.map((step, index) => {
            const isLast = index === steps.length - 1;
            const isDone = step.state === "done";
            const isCurrent = step.state === "current";

            return (
              <li key={step.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 ${
                      isDone
                        ? "bg-emerald-100"
                        : isCurrent
                          ? "bg-[#b67c2c]/15 ring-2 ring-[#b67c2c]"
                          : "bg-gray-100"
                    }`}
                  >
                    {isDone ? (
                      <Check size={12} className="text-emerald-700" strokeWidth={2.5} />
                    ) : isCurrent ? (
                      <div className="w-2 h-2 rounded-full bg-[#b67c2c]" />
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-gray-300" />
                    )}
                  </div>
                  {!isLast && (
                    <div
                      className={`w-px flex-1 min-h-[24px] my-1 ${
                        isDone ? "bg-emerald-200" : "bg-gray-200"
                      }`}
                    />
                  )}
                </div>
                <div className={`pb-5 ${isLast ? "pb-0" : ""}`}>
                  <p
                    className={`text-sm font-semibold leading-snug ${
                      isCurrent ? "text-[#b67c2c]" : isDone ? "text-navy" : "text-gray-400"
                    }`}
                  >
                    {step.label}
                    {isCurrent && (
                      <span className="ml-2 text-[10px] font-bold uppercase tracking-wide text-[#b67c2c]">
                        Current
                      </span>
                    )}
                  </p>
                  <p
                    className={`text-xs mt-0.5 leading-relaxed ${
                      isCurrent || isDone ? "text-muted-foreground" : "text-gray-400"
                    }`}
                  >
                    {step.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6 flex flex-col">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
          Advisor action
        </p>
        <p className="text-[10px] font-bold text-[#b67c2c] uppercase tracking-wide mb-4">
          {nextAction.eyebrow}
        </p>
        <div className="flex items-start gap-2.5 mb-2">
          <ActionIcon size={16} className="text-[#b67c2c] shrink-0 mt-0.5" />
          <p className="text-sm font-semibold text-navy leading-snug">{nextAction.title}</p>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed flex-1">
          {nextAction.description}
        </p>
        {nextAction.ctaHref && nextAction.ctaLabel && (
          <Link
            href={nextAction.ctaHref}
            className="mt-4 inline-flex items-center justify-center gap-2 bg-navy hover:bg-navy/90 text-white text-xs font-semibold py-2.5 px-4 rounded-lg transition-colors"
          >
            {nextAction.ctaLabel}
            <ArrowRight size={13} />
          </Link>
        )}
      </div>
    </div>
  );
}
