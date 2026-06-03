"use client";

import {
  Home,
  Hammer,
  PlusSquare,
  Building2,
  HardHat,
  Building,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

const PROJECT_TYPES = [
  { value: "new_home_build",    label: "New Home",         sub: "New build from scratch",      icon: Home },
  { value: "major_renovation",  label: "Renovation",       sub: "Existing home upgrade",       icon: Hammer },
  { value: "addition_extension",label: "Extension",        sub: "Adding space to your home",   icon: PlusSquare },
  { value: "granny_flat",       label: "Granny Flat",      sub: "Secondary dwelling",          icon: Building2 },
  { value: "owner_builder",     label: "Owner Builder",    sub: "Self-managed build",          icon: HardHat },
  { value: "commercial_small",  label: "Commercial",       sub: "Small commercial project",    icon: Building },
] as const;

interface StepProjectTypeProps {
  value: string;
  onChange: (value: string) => void;
}

export function StepProjectType({ value, onChange }: StepProjectTypeProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy">What are you building?</h2>
        <p className="text-sm text-gray-500 mt-1.5">
          Select your project type and tell us a bit more about it.
        </p>
      </div>

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
                "relative flex flex-col items-center gap-3 p-5 rounded-xl border-2 transition-all text-center",
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
                "w-12 h-12 rounded-xl flex items-center justify-center",
                selected ? "bg-amber/15" : "bg-gray-100"
              )}>
                <Icon size={24} className={selected ? "text-amber" : "text-gray-500"} />
              </div>
              <div>
                <p className={cn("text-sm font-semibold leading-tight", selected ? "text-navy" : "text-gray-800")}>
                  {type.label}
                </p>
                <p className="text-xs text-gray-400 mt-0.5 leading-tight">{type.sub}</p>
              </div>
            </button>
          );
        })}
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-start gap-3 text-xs text-blue-700">
        <span className="shrink-0 mt-0.5">ℹ</span>
        <span>This helps us provide a more accurate estimate and identify potential cost-saving opportunities for your project.</span>
      </div>
    </div>
  );
}
