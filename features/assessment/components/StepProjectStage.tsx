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
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

const STAGES = [
  { value: "concept_idea",      label: "Just Researching",    description: "Early planning and researching phase",        icon: Search },
  { value: "early_planning",    label: "Plans & Design",       description: "Have plans or working on design",             icon: Pencil },
  { value: "getting_approvals", label: "Council Approvals",   description: "Preparing or submitted to council",           icon: Building },
  { value: "tendering_builders",label: "Builder Quotes",      description: "Collecting and comparing builder quotes",     icon: FileText },
  { value: "design_stage",      label: "Contract Stage",      description: "Reviewing or about to sign a contract",       icon: FileCheck },
  { value: "under_construction",label: "Construction",        description: "Construction has already started",            icon: HardHat },
  { value: "ready_to_build",    label: "Renovation Planning", description: "Planning a renovation or extension",          icon: Wrench },
  { value: "nearly_complete",   label: "Other",               description: "My situation is different to the above",      icon: MoreHorizontal },
] as const;

interface StepProjectStageProps {
  value: string;
  onChange: (value: string) => void;
}

export function StepProjectStage({ value, onChange }: StepProjectStageProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy">What stage is your project at?</h2>
        <p className="text-sm text-gray-500 mt-1.5">
          This helps us tailor the insights and recommendations to your current position.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {STAGES.map((stage) => {
          const Icon = stage.icon;
          const selected = value === stage.value;
          return (
            <button
              key={stage.value}
              type="button"
              onClick={() => onChange(stage.value)}
              className={cn(
                "relative flex flex-col items-start gap-3 p-4 rounded-xl border-2 text-left transition-all",
                selected
                  ? "border-amber bg-amber/5"
                  : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
              )}
            >
              {selected && (
                <span className="absolute top-2 right-2 w-5 h-5 rounded-full bg-amber flex items-center justify-center">
                  <Check size={11} strokeWidth={3} className="text-white" />
                </span>
              )}
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                selected ? "bg-amber/15" : "bg-gray-100"
              )}>
                <Icon size={20} className={selected ? "text-amber" : "text-gray-500"} />
              </div>
              <div>
                <p className={cn("text-sm font-semibold leading-tight", selected ? "text-navy" : "text-gray-800")}>
                  {stage.label}
                </p>
                <p className="text-xs text-gray-400 mt-0.5 leading-snug">{stage.description}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-start gap-3 text-xs text-blue-700">
        <span className="shrink-0 mt-0.5">ℹ</span>
        <span>Your selected stage helps us identify the most relevant insights, opportunities, and risks for your current position.</span>
      </div>
    </div>
  );
}
