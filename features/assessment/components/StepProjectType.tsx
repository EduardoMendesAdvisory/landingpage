"use client";

import { cn } from "@/lib/utils";

const PROJECT_TYPES = [
  { value: "new_home_build", label: "New Home Build", emoji: "🏗️" },
  { value: "major_renovation", label: "Major Renovation", emoji: "🔨" },
  { value: "addition_extension", label: "Addition / Extension", emoji: "🏠" },
  { value: "granny_flat", label: "Granny Flat", emoji: "🏡" },
  { value: "owner_builder", label: "Owner Builder", emoji: "👷" },
  { value: "commercial_small", label: "Small Commercial", emoji: "🏢" },
] as const;

interface StepProjectTypeProps {
  value: string;
  onChange: (value: string) => void;
}

export function StepProjectType({ value, onChange }: StepProjectTypeProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-navy">
          What type of project are you planning?
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Select the option that best describes your project.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {PROJECT_TYPES.map((type) => (
          <button
            key={type.value}
            type="button"
            onClick={() => onChange(type.value)}
            className={cn(
              "flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all text-center",
              value === type.value
                ? "border-navy bg-navy text-white"
                : "border-border bg-white hover:border-navy/40 hover:bg-light-bg"
            )}
          >
            <span className="text-2xl">{type.emoji}</span>
            <span className="text-sm font-medium leading-tight">{type.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
