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
  CheckCircle2,
  Upload,
  FileText,
  Loader2,
  X,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadLeadQuote } from "@/features/assessment/actions";
import type { UploadedFileRef } from "./AssessmentWizard";
import {
  OptionCheck,
  StepFootnote,
  StepHeader,
  StepSection,
  WIZARD_INPUT_CLASS,
  optionButtonClass,
} from "./wizard-ui";

const BUDGET_RANGES = [
  { value: "under_50k", label: "Under $100k", icon: PiggyBank },
  { value: "50k_100k", label: "$100k - $300k", icon: Wallet },
  { value: "100k_250k", label: "$300k - $500k", icon: Coins },
  { value: "250k_500k", label: "$500k - $1M", icon: Layers },
  { value: "500k_1m", label: "$1M - $2M", icon: Home },
  { value: "over_1m", label: "$2M+", icon: Diamond },
  { value: "not_sure", label: "Not Sure Yet", icon: HelpCircle },
] as const;

const FINISH_LEVELS = [
  { value: "budget", label: "Basic", sub: "Functional and cost-effective", icon: Layers },
  { value: "mid_range", label: "Standard", sub: "Good quality finishes and inclusions", icon: Sofa },
  { value: "premium", label: "Premium", sub: "High quality finishes and upgrades", icon: Star },
  { value: "luxury", label: "Luxury", sub: "Premium materials throughout", icon: Diamond },
] as const;

interface StepBudgetQuoteData {
  budgetRange: string;
  finishLevel: string;
  hasQuote: boolean;
  quoteFileName: string;
  uploadedQuoteUrl: string;
  uploadedFiles: UploadedFileRef[];
  projectComment: string;
}

interface StepBudgetQuoteProps {
  leadId: string | null;
  value: StepBudgetQuoteData;
  onChange: (data: Partial<StepBudgetQuoteData>) => void;
}

function syncLegacyFileFields(files: UploadedFileRef[]) {
  const first = files[0];
  return {
    uploadedFiles: files,
    hasQuote: files.length > 0,
    quoteFileName: first?.name ?? "",
    uploadedQuoteUrl: first?.storagePath ?? "",
  };
}

export function StepBudgetQuote({ leadId, value, onChange }: StepBudgetQuoteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [uploadingCount, setUploadingCount] = useState(0);

  const files = value.uploadedFiles?.length
    ? value.uploadedFiles
    : value.uploadedQuoteUrl
      ? [{ name: value.quoteFileName || "Document", storagePath: value.uploadedQuoteUrl }]
      : [];

  function handleFilesSelect(fileList: FileList | null) {
    if (!fileList || !leadId || fileList.length === 0) return;

    const toUpload = Array.from(fileList);
    setUploadError(null);
    setUploadingCount(toUpload.length);

    startTransition(async () => {
      const uploaded: UploadedFileRef[] = [...files];

      for (const file of toUpload) {
        const formData = new FormData();
        formData.append("leadId", leadId);
        formData.append("file", file);

        const result = await uploadLeadQuote(formData);
        if ("error" in result) {
          setUploadError(result.error);
          setUploadingCount(0);
          if (inputRef.current) inputRef.current.value = "";
          return;
        }

        uploaded.push({ name: file.name, storagePath: result.storagePath });
      }

      onChange(syncLegacyFileFields(uploaded));
      setUploadingCount(0);
      if (inputRef.current) inputRef.current.value = "";
    });
  }

  function handleRemoveFile(storagePath: string) {
    const next = files.filter((f) => f.storagePath !== storagePath);
    onChange(syncLegacyFileFields(next));
    setUploadError(null);
  }

  return (
    <div className="space-y-0">
      <StepHeader
        overline="Step 4 of 4"
        title="Budget and finish level"
        description="These details help us benchmark your project and identify realistic savings opportunities."
      />

      <StepSection title="Estimated budget (AUD)" hint="Total construction budget, excluding land purchase.">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5">
          {BUDGET_RANGES.map((b) => {
            const Icon = b.icon;
            const selected = value.budgetRange === b.value;
            return (
              <button
                key={b.value}
                type="button"
                onClick={() => onChange({ budgetRange: b.value })}
                className={cn(
                  optionButtonClass(selected),
                  "flex flex-col items-center gap-2 p-3 text-center min-h-[88px]"
                )}
              >
                <OptionCheck selected={selected} />
                <Icon
                  size={18}
                  className={selected ? "text-[#b67c2c]" : "text-[#9ca3af]"}
                  strokeWidth={1.8}
                />
                <span
                  className={cn(
                    "text-xs font-semibold leading-tight",
                    selected ? "text-[#111A24]" : "text-[#4b5564]"
                  )}
                >
                  {b.label}
                </span>
              </button>
            );
          })}
        </div>
      </StepSection>

      <StepSection title="Expected finish level" hint="The quality level you are aiming for across your build.">
        <div className="grid sm:grid-cols-2 gap-3">
          {FINISH_LEVELS.map((f) => {
            const Icon = f.icon;
            const selected = value.finishLevel === f.value;
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => onChange({ finishLevel: f.value })}
                className={cn(optionButtonClass(selected), "flex items-start gap-3 p-4 text-left")}
              >
                <OptionCheck selected={selected} />
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg border flex items-center justify-center shrink-0",
                    selected ? "border-[#b67c2c]/30 bg-[#faf9f7]" : "border-[#ece8e1] bg-[#faf9f7]"
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
                      "text-sm font-semibold",
                      selected ? "text-[#111A24]" : "text-[#374151]"
                    )}
                  >
                    {f.label}
                  </p>
                  <p className="text-[11px] text-[#6b7280] mt-1 leading-snug">{f.sub}</p>
                </div>
              </button>
            );
          })}
        </div>
      </StepSection>

      <StepSection
        title="Project documents"
        hint="Optional. Upload quotes, plans, contracts or other files. You can attach multiple documents."
      >
        {files.length > 0 && (
          <div className="space-y-2 mb-4">
            {files.map((file) => (
              <div
                key={file.storagePath}
                className="rounded-lg border border-[#ece8e1] bg-[#faf9f7] px-4 py-3"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-white border border-[#e7e1d8] flex items-center justify-center shrink-0">
                      <FileText size={18} className="text-[#b67c2c]" strokeWidth={1.8} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-[#111A24] truncate">{file.name}</p>
                      <p className="text-xs text-[#6b7280] flex items-center gap-1 mt-0.5">
                        <CheckCircle2 size={12} className="text-[#b67c2c]" />
                        Uploaded successfully
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(file.storagePath)}
                    disabled={isPending}
                    className="shrink-0 p-1.5 rounded-md text-[#9ca3af] hover:text-red-600 hover:bg-red-50 transition-colors"
                    aria-label={`Remove ${file.name}`}
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <label
          className={cn(
            "flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed px-6 py-8 text-center transition-colors",
            isPending
              ? "border-[#b67c2c]/40 bg-[#faf9f7] cursor-wait"
              : leadId
                ? "border-[#d8d2c8] bg-[#faf9f7] hover:border-[#b67c2c]/50 cursor-pointer"
                : "border-[#ece8e1] bg-[#faf9f7] opacity-60 cursor-not-allowed"
          )}
        >
          <input
            ref={inputRef}
            type="file"
            multiple
            className="sr-only"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.webp"
            disabled={!leadId || isPending}
            onChange={(e) => handleFilesSelect(e.target.files)}
          />
          {isPending ? (
            <>
              <Loader2 size={24} className="text-[#b67c2c] animate-spin" />
              <p className="text-sm font-medium text-[#111A24]">
                Uploading {uploadingCount > 1 ? `${uploadingCount} files` : "your file"}...
              </p>
            </>
          ) : (
            <>
              <div className="w-11 h-11 rounded-lg bg-white border border-[#e7e1d8] flex items-center justify-center">
                <Upload size={20} className="text-[#b67c2c]" strokeWidth={2} />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#111A24]">
                  {files.length > 0 ? "Add more documents" : "Upload project documents"}
                </p>
                <p className="text-xs text-[#6b7280] mt-1">
                  PDF, Word, Excel or images up to 25 MB each. Multiple files allowed.
                </p>
              </div>
            </>
          )}
        </label>

        {uploadError && (
          <div className="mt-3 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
            {uploadError}
          </div>
        )}

        {!files.length && (
          <p className="mt-3 text-xs text-[#9ca3af]">
            No documents yet? You can continue and share files later through your dashboard or consultation.
          </p>
        )}
      </StepSection>

      <StepSection title="Additional comments" hint="Optional. Share anything else Eduardo should know about your project." last>
        <div className="relative">
          <MessageSquare
            size={15}
            className="absolute left-3 top-3 text-[#9ca3af] pointer-events-none"
          />
          <textarea
            value={value.projectComment}
            onChange={(e) => onChange({ projectComment: e.target.value })}
            placeholder="E.g. specific concerns, timeline, builder details, or questions for Eduardo..."
            rows={4}
            className={cn(WIZARD_INPUT_CLASS, "pl-9 py-3 min-h-[100px] resize-y")}
          />
        </div>
      </StepSection>

      <StepFootnote>
        Budget and finish selections are used for benchmarking only. Comments and documents help Eduardo prepare your review.
      </StepFootnote>
    </div>
  );
}
