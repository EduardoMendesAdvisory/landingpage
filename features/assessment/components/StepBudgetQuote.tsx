"use client";

import {
  PiggyBank,
  Wallet,
  Coins,
  Layers,
  Home,
  Diamond,
  HelpCircle,
  Sofa,
  Star,
  Check,
} from "lucide-react";
import { cn } from "@/lib/utils";

const BUDGET_RANGES = [
  { value: "under_50k",   label: "Under $100k",     icon: PiggyBank },
  { value: "50k_100k",    label: "$100k – $300k",    icon: Wallet },
  { value: "100k_250k",   label: "$300k – $500k",    icon: Coins },
  { value: "250k_500k",   label: "$500k – $1M",      icon: Layers },
  { value: "500k_1m",     label: "$1M – $2M",        icon: Home },
  { value: "over_1m",     label: "$2M+",             icon: Diamond },
  { value: "not_sure",    label: "Not Sure Yet",     icon: HelpCircle },
] as const;

const FINISH_LEVELS = [
  { value: "budget",    label: "Basic",    sub: "Functional and cost-effective",         icon: Layers },
  { value: "mid_range", label: "Standard", sub: "Good quality finishes and inclusions",  icon: Sofa },
  { value: "premium",   label: "Premium",  sub: "High quality finishes and upgraded inclusions", icon: Star },
  { value: "luxury",    label: "Luxury",   sub: "Luxury finishes with premium materials", icon: Diamond },
] as const;

interface StepBudgetQuoteData {
  budgetRange: string;
  finishLevel: string;
  hasQuote: boolean;
}

interface StepBudgetQuoteProps {
  value: StepBudgetQuoteData;
  onChange: (data: Partial<StepBudgetQuoteData>) => void;
}

export function StepBudgetQuote({ value, onChange }: StepBudgetQuoteProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-navy">What is your estimated build budget?</h2>
        <p className="text-sm text-gray-500 mt-1.5">
          This helps us benchmark costs and identify potential savings opportunities.
        </p>
      </div>

      {/* Budget range */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Estimated Budget (AUD)</p>
        <p className="text-sm text-gray-500">Select the range that best fits your estimated total construction budget.</p>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {BUDGET_RANGES.map((b) => {
            const Icon = b.icon;
            const selected = value.budgetRange === b.value;
            return (
              <button
                key={b.value}
                type="button"
                onClick={() => onChange({ budgetRange: b.value })}
                className={cn(
                  "relative flex flex-col items-center gap-2 p-3 rounded-xl border-2 text-center transition-all",
                  selected
                    ? "border-amber bg-amber/5"
                    : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                )}
              >
                {selected && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-amber flex items-center justify-center">
                    <Check size={9} strokeWidth={3} className="text-white" />
                  </span>
                )}
                <Icon size={20} className={selected ? "text-amber" : "text-gray-400"} />
                <span className={cn("text-xs font-semibold leading-tight", selected ? "text-navy" : "text-gray-700")}>
                  {b.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Finish level */}
      <div className="space-y-3">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Expected Finish Level</p>
        <p className="text-sm text-gray-500">What level of finish are you expecting for your project?</p>
        <div className="grid grid-cols-2 gap-2">
          {FINISH_LEVELS.map((f) => {
            const Icon = f.icon;
            const selected = value.finishLevel === f.value;
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => onChange({ finishLevel: f.value })}
                className={cn(
                  "relative flex flex-col items-center gap-2 p-4 rounded-xl border-2 text-center transition-all",
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
                <Icon size={22} className={selected ? "text-amber" : "text-gray-400"} />
                <div>
                  <p className={cn("text-sm font-semibold", selected ? "text-navy" : "text-gray-800")}>{f.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5 leading-tight">{f.sub}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-start gap-3 text-xs text-blue-700">
        <span className="shrink-0 mt-0.5">ℹ</span>
        <span>These details help us provide more accurate benchmarks and identify the best opportunities to save you time and money.</span>
      </div>
    </div>
  );
}
