"use client";

import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  OptionCheck,
  StepFootnote,
  StepHeader,
  StepSection,
  WIZARD_INPUT_CLASS,
  optionButtonClass,
} from "./wizard-ui";

const LAND_TYPES = [
  { value: "vacant_land", label: "Vacant Land" },
  { value: "existing_property", label: "Existing Property" },
  { value: "rented_land", label: "Rented / Leased" },
  { value: "not_sure", label: "Not Sure Yet" },
] as const;

const STATES = ["NSW", "VIC", "QLD", "SA", "WA", "ACT", "TAS", "NT"] as const;

interface StepLocationData {
  landType: string;
  suburb: string;
  state: string;
  postcode: string;
}

interface StepLocationProps {
  value: StepLocationData;
  onChange: (data: Partial<StepLocationData>) => void;
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="block mb-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-[#4b5564]">
      {children}
    </span>
  );
}

export function StepLocation({ value, onChange }: StepLocationProps) {
  return (
    <div className="space-y-0">
      <StepHeader
        overline="Step 2 of 4"
        title="Where is your project?"
        description="Location helps us provide accurate local benchmarks and council-related insights."
      />

      <StepSection title="Address" hint="Suburb and postcode for your build site.">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <FieldLabel>Suburb</FieldLabel>
            <div className="relative">
              <MapPin size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]" />
              <input
                id="suburb"
                value={value.suburb}
                onChange={(e) => onChange({ suburb: e.target.value })}
                placeholder="Buderim"
                className={cn(WIZARD_INPUT_CLASS, "pl-9")}
                autoComplete="address-level2"
              />
            </div>
          </div>
          <div>
            <FieldLabel>Postcode</FieldLabel>
            <input
              id="postcode"
              value={value.postcode}
              maxLength={4}
              onChange={(e) => onChange({ postcode: e.target.value.replace(/\D/g, "") })}
              placeholder="4556"
              className={WIZARD_INPUT_CLASS}
              inputMode="numeric"
            />
          </div>
        </div>

        <div className="mt-4">
          <FieldLabel>State</FieldLabel>
          <div className="flex flex-wrap gap-2">
            {STATES.map((s) => {
              const selected = value.state === s;
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => onChange({ state: s })}
                  className={cn(
                    optionButtonClass(selected),
                    "px-4 py-2 text-sm font-semibold min-w-[3.5rem] text-center",
                    selected ? "text-[#111A24]" : "text-[#4b5564]"
                  )}
                >
                  <OptionCheck selected={selected} />
                  {s}
                </button>
              );
            })}
          </div>
        </div>
      </StepSection>

      <StepSection title="Land condition" hint="Helps estimate site complexity and potential costs." last>
        <div className="grid sm:grid-cols-2 gap-3">
          {LAND_TYPES.map((lt) => {
            const selected = value.landType === lt.value;
            return (
              <button
                key={lt.value}
                type="button"
                onClick={() => onChange({ landType: lt.value })}
                className={cn(
                  optionButtonClass(selected),
                  "px-4 py-3.5 text-sm font-semibold text-left",
                  selected ? "text-[#111A24]" : "text-[#374151]"
                )}
              >
                <OptionCheck selected={selected} />
                {lt.label}
              </button>
            );
          })}
        </div>
      </StepSection>

      <StepFootnote>You can update these details later if anything changes.</StepFootnote>
    </div>
  );
}
