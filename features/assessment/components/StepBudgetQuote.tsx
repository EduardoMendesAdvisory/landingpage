"use client";

import { useRef, useState, useTransition } from "react";
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
  UploadCloud,
  FileText,
  Loader2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadLeadQuote } from "@/features/assessment/actions";

const BUDGET_RANGES = [
  { value: "under_50k",   label: "Under $100k",     icon: PiggyBank },
  { value: "50k_100k",    label: "$100k - $300k",    icon: Wallet },
  { value: "100k_250k",   label: "$300k - $500k",    icon: Coins },
  { value: "250k_500k",   label: "$500k - $1M",      icon: Layers },
  { value: "500k_1m",     label: "$1M - $2M",        icon: Home },
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
  quoteFileName: string;
  uploadedQuoteUrl: string;
}

interface StepBudgetQuoteProps {
  leadId: string | null;
  value: StepBudgetQuoteData;
  onChange: (data: Partial<StepBudgetQuoteData>) => void;
}

export function StepBudgetQuote({ leadId, value, onChange }: StepBudgetQuoteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleFileSelect(file: File | null) {
    if (!file || !leadId) return;

    setUploadError(null);
    startTransition(async () => {
      const formData = new FormData();
      formData.append("leadId", leadId);
      formData.append("file", file);

      const result = await uploadLeadQuote(formData);
      if ("error" in result) {
        setUploadError(result.error);
        return;
      }

      onChange({
        uploadedQuoteUrl: result.storagePath,
        quoteFileName: file.name,
        hasQuote: true,
      });
    });
  }

  function handleRemoveQuote() {
    onChange({
      uploadedQuoteUrl: "",
      quoteFileName: "",
      hasQuote: false,
    });
    setUploadError(null);
    if (inputRef.current) inputRef.current.value = "";
  }

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

      {/* Quote upload */}
      <div className="space-y-3">
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Upload Your Builder Quote
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Optional. Upload your quote, contract or plans for a more tailored preliminary assessment.
          </p>
        </div>

        {value.uploadedQuoteUrl ? (
          <div className="flex items-center justify-between gap-3 rounded-xl border-2 border-green-200 bg-green-50 px-4 py-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                <FileText size={18} className="text-green-700" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-navy truncate">{value.quoteFileName}</p>
                <p className="text-xs text-green-700">Quote uploaded successfully</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleRemoveQuote}
              disabled={isPending}
              className="shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              aria-label="Remove uploaded quote"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <label
            className={cn(
              "flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors",
              isPending
                ? "border-amber/40 bg-amber/5 cursor-wait"
                : leadId
                  ? "border-gray-200 bg-gray-50 hover:border-amber/50 hover:bg-amber/5 cursor-pointer"
                  : "border-gray-200 bg-gray-50 opacity-60 cursor-not-allowed"
            )}
          >
            <input
              ref={inputRef}
              type="file"
              className="sr-only"
              accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.webp"
              disabled={!leadId || isPending}
              onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
            />
            {isPending ? (
              <>
                <Loader2 size={28} className="text-amber animate-spin" />
                <p className="text-sm font-medium text-navy">Uploading your quote...</p>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-xl bg-amber/10 flex items-center justify-center">
                  <UploadCloud size={24} className="text-amber" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-navy">Click to upload your builder quote</p>
                  <p className="text-xs text-gray-500 mt-1">
                    PDF, Word, Excel or images up to 25 MB
                  </p>
                </div>
              </>
            )}
          </label>
        )}

        {uploadError && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {uploadError}
          </div>
        )}

        {!value.uploadedQuoteUrl && (
          <p className="text-xs text-gray-400">
            No quote yet? You can still continue and upload one later during your consultation.
          </p>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-start gap-3 text-xs text-blue-700">
        <span className="shrink-0 mt-0.5">i</span>
        <span>These details help us provide more accurate benchmarks and identify the best opportunities to save you time and money.</span>
      </div>
    </div>
  );
}
