"use client";

import { cn } from "@/lib/utils";
import {
  ALL_AU_STATES,
  ONBOARDING_STATE,
  isOnboardingStateSelectable,
} from "@/lib/assessment/states";
import { OptionCheck, optionButtonClass } from "./wizard-ui";

interface OnboardingStatePickerProps {
  value: string;
  onChange: (state: string) => void;
  className?: string;
}

export function OnboardingStatePicker({
  value,
  onChange,
  className,
}: OnboardingStatePickerProps) {
  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {ALL_AU_STATES.map((state) => {
        const enabled = isOnboardingStateSelectable(state);
        const selected = enabled && value === state;

        return (
          <button
            key={state}
            type="button"
            disabled={!enabled}
            aria-disabled={!enabled}
            aria-pressed={selected && enabled}
            onClick={() => {
              if (enabled) onChange(ONBOARDING_STATE);
            }}
            className={cn(
              optionButtonClass(selected && enabled),
              "px-4 py-2 text-sm font-semibold min-w-[3.5rem] text-center",
              enabled
                ? selected
                  ? "text-[#111A24]"
                  : "text-[#4b5564]"
                : "opacity-25 cursor-not-allowed border-[#ece8e1] bg-[#fafafa] text-[#9ca3af] shadow-none hover:border-[#ece8e1] hover:bg-[#fafafa]"
            )}
          >
            {enabled ? <OptionCheck selected={selected} /> : null}
            {state}
          </button>
        );
      })}
    </div>
  );
}
