"use client";

import { cn } from "@/lib/utils";

const BUDGET_RANGES = [
  { value: "under_50k", label: "Under $50k" },
  { value: "50k_100k", label: "$50k – $100k" },
  { value: "100k_250k", label: "$100k – $250k" },
  { value: "250k_500k", label: "$250k – $500k" },
  { value: "500k_1m", label: "$500k – $1M" },
  { value: "over_1m", label: "Over $1M" },
  { value: "not_sure", label: "Not Sure Yet" },
] as const;

const FINISH_LEVELS = [
  { value: "budget", label: "Budget Fit-out" },
  { value: "mid_range", label: "Mid-Range" },
  { value: "premium", label: "Premium" },
  { value: "luxury", label: "Luxury" },
  { value: "not_sure", label: "Not Sure Yet" },
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
        <h2 className="text-xl font-semibold text-navy">
          What is your budget?
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          Include all costs — land, build, fit-out, landscaping, and contingency.
        </p>
      </div>

      {/* Budget range */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Total project budget</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {BUDGET_RANGES.map((b) => (
            <button
              key={b.value}
              type="button"
              onClick={() => onChange({ budgetRange: b.value })}
              className={cn(
                "px-3 py-2.5 rounded-lg border-2 text-sm font-medium text-center transition-all",
                value.budgetRange === b.value
                  ? "border-navy bg-navy text-white"
                  : "border-border bg-white hover:border-navy/40"
              )}
            >
              {b.label}
            </button>
          ))}
        </div>
      </div>

      {/* Finish level */}
      <div className="space-y-2">
        <p className="text-sm font-medium">Desired finish level</p>
        <div className="flex flex-wrap gap-2">
          {FINISH_LEVELS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => onChange({ finishLevel: f.value })}
              className={cn(
                "px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all",
                value.finishLevel === f.value
                  ? "border-warm-soil bg-warm-soil text-white"
                  : "border-border bg-white hover:border-warm-soil/40"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Quote upload placeholder */}
      <div className="rounded-xl border-2 border-dashed border-border p-5 bg-light-bg">
        <div className="flex items-start gap-3">
          <div className="flex-1">
            <p className="text-sm font-medium text-navy">
              Do you have a builder quote? (Optional)
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Upload it to get a more accurate assessment. Eduardo will review
              it personally.
            </p>
          </div>
        </div>

        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => onChange({ hasQuote: true })}
            className={cn(
              "px-4 py-2 rounded-lg border text-sm font-medium transition-all",
              value.hasQuote
                ? "border-navy bg-navy text-white"
                : "border-border bg-white hover:border-navy/40"
            )}
          >
            Yes, I have a quote
          </button>
          <button
            type="button"
            onClick={() => onChange({ hasQuote: false })}
            className={cn(
              "px-4 py-2 rounded-lg border text-sm font-medium transition-all",
              !value.hasQuote
                ? "border-navy bg-navy text-white"
                : "border-border bg-white hover:border-navy/40"
            )}
          >
            Not yet
          </button>
        </div>

        {value.hasQuote && (
          <p className="mt-3 text-xs text-muted-foreground">
            📎 Quote upload available in your BuildIQ portal after your strategy
            call with Eduardo.
          </p>
        )}
      </div>
    </div>
  );
}
