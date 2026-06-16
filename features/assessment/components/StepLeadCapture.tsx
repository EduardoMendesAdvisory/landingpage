"use client";

import { useState, useTransition } from "react";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";
import { saveLead } from "@/features/assessment/actions";
import { normalizeOnboardingState } from "@/lib/assessment/states";
import { cn } from "@/lib/utils";
import { OnboardingStatePicker } from "./OnboardingStatePicker";

export interface LeadData {
  fullName: string;
  email: string;
  phone: string;
  suburb: string;
  state: string;
}

interface StepLeadCaptureProps {
  onComplete: (leadId: string, leadData: LeadData) => void;
  pendingQuoteName?: string | null;
  initialData?: Partial<Pick<LeadData, "suburb" | "state">>;
  aiPrefilledFields?: ReadonlyArray<keyof Pick<LeadData, "suburb" | "state">>;
}

const INPUT_CLASS =
  "h-11 w-full rounded-lg border border-[#e7e1d8] bg-white px-3 text-sm text-[#111A24] placeholder:text-[#9ca3af] focus:outline-none focus:ring-2 focus:ring-[#b67c2c]/25 focus:border-[#b67c2c] transition-colors";

function validate(data: LeadData): string | null {
  if (!data.fullName.trim()) return "Please enter your full name.";
  if (!data.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    return "Please enter a valid email address.";
  if (!data.suburb.trim()) return "Please enter your suburb.";
  if (!data.state) return "Please select your state.";
  return null;
}

function FieldLabel({
  htmlFor,
  children,
  hint,
}: {
  htmlFor?: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label htmlFor={htmlFor} className="block mb-1.5">
      <span className="text-xs font-semibold uppercase tracking-[0.12em] text-[#4b5564]">
        {children}
      </span>
      {hint && (
        <span className="ml-2 text-[10px] font-medium normal-case tracking-normal text-[#b67c2c]">
          {hint}
        </span>
      )}
    </label>
  );
}

export function StepLeadCapture({
  onComplete,
  pendingQuoteName,
  initialData,
  aiPrefilledFields,
}: StepLeadCaptureProps) {
  const [data, setData] = useState<LeadData>({
    fullName: "",
    email: "",
    phone: "",
    suburb: initialData?.suburb ?? "",
    state: normalizeOnboardingState(initialData?.state),
  });
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const hasQuotePrefill = aiPrefilledFields && aiPrefilledFields.length > 0;

  function handleSubmit() {
    const err = validate(data);
    if (err) {
      setError(err);
      return;
    }
    setError(null);

    startTransition(async () => {
      const result = await saveLead(data);
      if ("error" in result) {
        setError(result.error);
      } else {
        onComplete(result.leadId, data);
      }
    });
  }

  return (
    <div className="space-y-0">
      <div className="pb-6 border-b border-[#ece8e1]">
        <p className="text-[#b67c2c] text-xs font-semibold uppercase tracking-[0.18em] mb-3">
          Preliminary Assessment
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#111A24] leading-tight mb-2">
          Your contact details
        </h2>
        <p className="text-sm text-[#4b5564] leading-relaxed">
          Tell us a little about yourself so we can personalise your assessment. Your details are kept completely private.
        </p>
      </div>

      {pendingQuoteName && (
        <div className="py-5 border-b border-[#ece8e1]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-[#faf9f7] border border-[#e7e1d8] flex items-center justify-center shrink-0">
                <FileText size={18} className="text-[#b67c2c]" strokeWidth={1.8} />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-[#4b5564]">Attached document</p>
                <p className="text-sm font-semibold text-[#111A24] truncate">{pendingQuoteName}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#4b5564]">
              <CheckCircle2 size={14} className="text-[#b67c2c] shrink-0" />
              Ready to upload
            </div>
          </div>
          <p className="mt-3 text-xs text-[#6b7280] leading-relaxed">
            Your file will be uploaded securely once you submit this form.
          </p>
        </div>
      )}

      <div className="py-6 border-b border-[#ece8e1] space-y-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#111A24] mb-1">
            Contact
          </p>
          <div className="w-8 h-[2px] bg-[#b67c2c] mb-4" />
        </div>

        <div className="space-y-4">
          <div>
            <FieldLabel htmlFor="fullName">
              Full name <span className="text-[#b67c2c]">*</span>
            </FieldLabel>
            <div className="relative">
              <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
              <input
                id="fullName"
                value={data.fullName}
                onChange={(e) => setData((d) => ({ ...d, fullName: e.target.value }))}
                placeholder="Sarah Johnson"
                className={cn(INPUT_CLASS, "pl-9")}
                autoComplete="name"
              />
            </div>
          </div>

          <div>
            <FieldLabel htmlFor="email">
              Email address <span className="text-[#b67c2c]">*</span>
            </FieldLabel>
            <div className="relative">
              <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
              <input
                id="email"
                type="email"
                value={data.email}
                onChange={(e) => setData((d) => ({ ...d, email: e.target.value }))}
                placeholder="sarah@example.com"
                className={cn(INPUT_CLASS, "pl-9")}
                autoComplete="email"
              />
            </div>
          </div>

          <div>
            <FieldLabel htmlFor="phone">Phone number</FieldLabel>
            <div className="relative">
              <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
              <input
                id="phone"
                type="tel"
                value={data.phone}
                onChange={(e) => setData((d) => ({ ...d, phone: e.target.value }))}
                placeholder="Optional"
                className={cn(INPUT_CLASS, "pl-9")}
                autoComplete="tel"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="py-6 border-b border-[#ece8e1] space-y-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#111A24] mb-1">
            Project location
          </p>
          <div className="w-8 h-[2px] bg-[#b67c2c] mb-1" />
          {hasQuotePrefill && (
            <p className="text-xs text-[#6b7280] mt-2 mb-3">
              Pre-filled from your quote — please confirm or edit.
            </p>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <FieldLabel
              htmlFor="suburb"
              hint={aiPrefilledFields?.includes("suburb") ? "From quote" : undefined}
            >
              Suburb <span className="text-[#b67c2c]">*</span>
            </FieldLabel>
            <div className="relative">
              <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
              <input
                id="suburb"
                value={data.suburb}
                onChange={(e) => setData((d) => ({ ...d, suburb: e.target.value }))}
                placeholder="Buderim"
                className={cn(INPUT_CLASS, "pl-9")}
                autoComplete="address-level2"
              />
            </div>
          </div>
          <div>
            <FieldLabel hint={aiPrefilledFields?.includes("state") ? "From quote" : undefined}>
              State <span className="text-[#b67c2c]">*</span>
            </FieldLabel>
            <OnboardingStatePicker
              value={data.state}
              onChange={(state) => setData((d) => ({ ...d, state }))}
            />
          </div>
        </div>
      </div>

      <div className="pt-6 space-y-4">
        <div className="flex items-start gap-2.5 text-xs text-[#6b7280] leading-relaxed">
          <Lock size={13} className="text-[#4b5564] shrink-0 mt-0.5" strokeWidth={2} />
          <span>
            Your information is confidential and never shared with third parties. We only use it to personalise your assessment.
          </span>
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isPending}
          className={cn(
            "w-full inline-flex items-center justify-center gap-2",
            "bg-[#b67c2c] hover:bg-[#9f6c27] disabled:opacity-60 disabled:cursor-not-allowed",
            "text-white font-semibold px-6 py-3.5 rounded-lg text-sm uppercase tracking-[0.12em] transition-colors"
          )}
        >
          {isPending ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Saving...
            </>
          ) : (
            <>
              Start my free assessment
              <ArrowRight size={16} strokeWidth={2.25} />
            </>
          )}
        </button>

        <p className="text-center text-[11px] text-[#9ca3af] tracking-wide">
          Free · No obligation · Results in under 2 minutes
        </p>
      </div>
    </div>
  );
}
