"use client";

import {
  Home,
  Hammer,
  PlusSquare,
  Building2,
  HardHat,
  Building,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  OptionCheck,
  StepFootnote,
  StepHeader,
  StepSection,
  optionButtonClass,
} from "./wizard-ui";

const PROJECT_TYPES = [
  { value: "new_home_build", label: "New Home", sub: "New build from scratch", icon: Home },
  { value: "major_renovation", label: "Renovation", sub: "Existing home upgrade", icon: Hammer },
  { value: "addition_extension", label: "Extension", sub: "Adding space to your home", icon: PlusSquare },
  { value: "granny_flat", label: "Granny Flat", sub: "Secondary dwelling", icon: Building2 },
  { value: "owner_builder", label: "Owner Builder", sub: "Self-managed build", icon: HardHat },
  { value: "commercial_small", label: "Commercial", sub: "Small commercial project", icon: Building },
] as const;

interface StepProjectTypeProps {
  value: string;
  onChange: (value: string) => void;
}

export function StepProjectType({ value, onChange }: StepProjectTypeProps) {
  return (
    <div className="space-y-0">
      <StepHeader
        overline="Step 1 of 4"
        title="What are you building?"
        description="Select the project type that best describes your build or renovation."
      />

      <StepSection title="Project type" hint="Choose the option that closest matches your plans." last>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {PROJECT_TYPES.map((type) => {
            const Icon = type.icon;
            const selected = value === type.value;
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => onChange(type.value)}
                className={cn(
                  optionButtonClass(selected),
                  "flex flex-col items-center gap-3 p-4 text-center"
                )}
              >
                <OptionCheck selected={selected} />
                <div
                  className={cn(
                    "w-11 h-11 rounded-lg border flex items-center justify-center",
                    selected
                      ? "border-[#b67c2c]/30 bg-[#faf9f7]"
                      : "border-[#ece8e1] bg-[#faf9f7]"
                  )}
                >
                  <Icon
                    size={22}
                    className={selected ? "text-[#b67c2c]" : "text-[#6b7280]"}
                    strokeWidth={1.8}
                  />
                </div>
                <div>
                  <p
                    className={cn(
                      "text-sm font-semibold leading-tight",
                      selected ? "text-[#111A24]" : "text-[#374151]"
                    )}
                  >
                    {type.label}
                  </p>
                  <p className="text-[11px] text-[#6b7280] mt-1 leading-snug">{type.sub}</p>
                </div>
              </button>
            );
          })}
        </div>
      </StepSection>

      <StepFootnote>
        Your project type helps Eduardo tailor guidance for Queensland residential and owner-builder projects.
      </StepFootnote>
    </div>
  );
}
