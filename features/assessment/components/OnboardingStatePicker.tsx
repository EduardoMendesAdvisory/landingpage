"use client";

import { useEffect } from "react";
import { MapPin } from "lucide-react";
import { ONBOARDING_STATE, QLD_SERVICE_NOTICE } from "@/lib/assessment/states";

interface OnboardingStatePickerProps {
  value: string;
  onChange: (state: string) => void;
  className?: string;
}

export function OnboardingStatePicker({
  value,
  onChange,
}: OnboardingStatePickerProps) {
  useEffect(() => {
    if (value !== ONBOARDING_STATE) {
      onChange(ONBOARDING_STATE);
    }
  }, [value, onChange]);

  return (
    <div className="rounded-lg border border-[#ece8e1] bg-[#faf9f7] px-4 py-3.5">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-lg bg-white border border-[#e7e1d8] flex items-center justify-center shrink-0">
          <MapPin size={16} className="text-[#b67c2c]" strokeWidth={1.8} />
        </div>
        <div>
          <p className="text-sm font-semibold text-[#111A24]">Queensland (QLD)</p>
          <p className="text-xs text-[#6b7280] mt-0.5">Sunshine Coast, Brisbane, Gold Coast &amp; QLD-wide</p>
        </div>
      </div>
      <p className="text-xs text-[#6b7280] mt-3 leading-relaxed border-t border-[#ece8e1] pt-3">
        {QLD_SERVICE_NOTICE}
      </p>
    </div>
  );
}
