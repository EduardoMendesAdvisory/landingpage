"use client";

import { cn } from "@/lib/utils";

const STAGES = [
  {
    value: "concept_idea",
    label: "Concept / Idea",
    description: "I have a general idea but nothing concrete yet",
  },
  {
    value: "early_planning",
    label: "Early Planning",
    description: "I've started researching and planning",
  },
  {
    value: "design_stage",
    label: "Design Stage",
    description: "Working with an architect / designer",
  },
  {
    value: "getting_approvals",
    label: "Getting Approvals",
    description: "DA or building permit in progress",
  },
  {
    value: "tendering_builders",
    label: "Tendering Builders",
    description: "Getting quotes from builders",
  },
  {
    value: "ready_to_build",
    label: "Ready to Build",
    description: "Have approvals and ready to start",
  },
  {
    value: "under_construction",
    label: "Under Construction",
    description: "Already building — need advisory support",
  },
  {
    value: "nearly_complete",
    label: "Nearly Complete",
    description: "In the final stages of construction",
  },
] as const;

interface StepProjectStageProps {
  value: string;
  onChange: (value: string) => void;
}

export function StepProjectStage({ value, onChange }: StepProjectStageProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-semibold text-navy">
          What stage is your project at?
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          This helps Eduardo understand where you need the most support.
        </p>
      </div>

      <div className="space-y-2">
        {STAGES.map((stage) => (
          <button
            key={stage.value}
            type="button"
            onClick={() => onChange(stage.value)}
            className={cn(
              "w-full flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all",
              value === stage.value
                ? "border-navy bg-navy text-white"
                : "border-border bg-white hover:border-navy/40 hover:bg-light-bg"
            )}
          >
            <div
              className={cn(
                "w-3 h-3 rounded-full border-2 mt-0.5 shrink-0 transition-colors",
                value === stage.value
                  ? "border-white bg-white"
                  : "border-muted-foreground"
              )}
            />
            <div>
              <p className="text-sm font-medium leading-snug">{stage.label}</p>
              <p
                className={cn(
                  "text-xs mt-0.5",
                  value === stage.value ? "text-white/70" : "text-muted-foreground"
                )}
              >
                {stage.description}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
