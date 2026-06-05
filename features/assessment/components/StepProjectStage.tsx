"use client";

import {
  Search,
  Pencil,
  Building,
  FileText,
  FileCheck,
  HardHat,
  Wrench,
  MoreHorizontal,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  OptionCheck,
  StepFootnote,
  StepHeader,
  StepSection,
  optionButtonClass,
} from "./wizard-ui";

const STAGES = [
  { value: "concept_idea", label: "Just Researching", description: "Early planning and researching phase", icon: Search },
  { value: "early_planning", label: "Plans & Design", description: "Have plans or working on design", icon: Pencil },
  { value: "getting_approvals", label: "Council Approvals", description: "Preparing or submitted to council", icon: Building },
  { value: "tendering_builders", label: "Builder Quotes", description: "Collecting and comparing builder quotes", icon: FileText },
  { value: "design_stage", label: "Contract Stage", description: "Reviewing or about to sign a contract", icon: FileCheck },
  { value: "under_construction", label: "Construction", description: "Construction has already started", icon: HardHat },
  { value: "ready_to_build", label: "Renovation Planning", description: "Planning a renovation or extension", icon: Wrench },
  { value: "nearly_complete", label: "Other", description: "My situation is different to the above", icon: MoreHorizontal },
] as const;

interface StepProjectStageProps {
  value: string;
  onChange: (value: string) => void;
}

export function StepProjectStage({ value, onChange }: StepProjectStageProps) {
  return (
    <div className="space-y-0">
      <StepHeader
        overline="Step 3 of 4"
        title="What stage are you at?"
        description="We will tailor insights and recommendations to your current position in the project."
      />

      <StepSection title="Current stage" hint="Select the stage that best reflects where you are today." last>
        <div className="grid sm:grid-cols-2 gap-3">
          {STAGES.map((stage) => {
            const Icon = stage.icon;
            const selected = value === stage.value;
            return (
              <button
                key={stage.value}
                type="button"
                onClick={() => onChange(stage.value)}
                className={cn(
                  optionButtonClass(selected),
                  "flex items-start gap-3 p-4 text-left"
                )}
              >
                <OptionCheck selected={selected} />
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg border flex items-center justify-center shrink-0",
                    selected
                      ? "border-[#b67c2c]/30 bg-[#faf9f7]"
                      : "border-[#ece8e1] bg-[#faf9f7]"
                  )}
                >
                  <Icon
                    size={18}
                    className={selected ? "text-[#b67c2c]" : "text-[#6b7280]"}
                    strokeWidth={1.8}
                  />
                </div>
                <div className="min-w-0 pr-4">
                  <p
                    className={cn(
                      "text-sm font-semibold leading-tight",
                      selected ? "text-[#111A24]" : "text-[#374151]"
                    )}
                  >
                    {stage.label}
                  </p>
                  <p className="text-[11px] text-[#6b7280] mt-1 leading-snug">{stage.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </StepSection>

      <StepFootnote>
        Your stage determines which risks, opportunities and next steps are most relevant right now.
      </StepFootnote>
    </div>
  );
}
