"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AlertCircle,
  ArrowRight,
  CheckCircle2,
  FileText,
  Loader2,
} from "lucide-react";
import { extractQuoteFromFile } from "@/lib/quote-extraction";
import type { QuoteExtractionResult } from "@/lib/quote-extraction";
import { cn } from "@/lib/utils";

const LOADING_STEPS = [
  "Reading document structure",
  "Extracting builder and pricing",
  "Matching project details",
  "Preparing your assessment",
];

interface StepQuoteExtractionProps {
  file: File;
  onComplete: (result: QuoteExtractionResult) => void;
  onSkip: () => void;
}

function getFieldMap(result: QuoteExtractionResult) {
  return Object.fromEntries(result.fields.map((f) => [f.key, f.value]));
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-6 py-3 border-b border-[#ece8e1] last:border-0">
      <span className="text-sm text-[#4b5564] shrink-0">{label}</span>
      <span className="text-sm font-semibold text-[#111A24] text-right">{value}</span>
    </div>
  );
}

export function StepQuoteExtraction({ file, onComplete, onSkip }: StepQuoteExtractionProps) {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<QuoteExtractionResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const extracted = await extractQuoteFromFile(file);
        if (cancelled) return;
        setResult(extracted);
        setStatus("success");
      } catch {
        if (cancelled) return;
        setErrorMessage("We could not read this file automatically.");
        setStatus("error");
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [file]);

  useEffect(() => {
    if (status !== "loading") return;

    const interval = setInterval(() => {
      setLoadingStep((prev) => Math.min(prev + 1, LOADING_STEPS.length - 1));
    }, 750);

    return () => clearInterval(interval);
  }, [status]);

  const fields = useMemo(
    () => (result ? getFieldMap(result) : {}),
    [result]
  );

  if (status === "loading") {
    const progress = ((loadingStep + 1) / LOADING_STEPS.length) * 100;

    return (
      <div className="py-4">
        <div className="mb-8">
          <p className="text-[#b67c2c] text-xs font-semibold uppercase tracking-[0.18em] mb-3">
            Document Review
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111A24] leading-tight mb-2">
            Reviewing your builder quote
          </h2>
          <p className="text-sm text-[#4b5564] leading-relaxed max-w-lg">
            We are reading your document to prepare a tailored preliminary assessment.
          </p>
        </div>

        <div className="rounded-xl border border-[#ece8e1] bg-[#faf9f7] p-5 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-white border border-[#e7e1d8] flex items-center justify-center shrink-0">
              <FileText size={18} className="text-[#b67c2c]" strokeWidth={1.8} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-[#4b5564] uppercase tracking-wide">Uploaded file</p>
              <p className="text-sm font-semibold text-[#111A24] truncate">{file.name}</p>
            </div>
          </div>

          <div className="h-1.5 rounded-full bg-[#ece8e1] overflow-hidden mb-3">
            <div
              className="h-full bg-[#b67c2c] transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="flex items-center gap-2 text-sm text-[#4b5564]">
            <Loader2 size={15} className="animate-spin text-[#b67c2c] shrink-0" />
            {LOADING_STEPS[loadingStep]}
          </div>
        </div>

        <p className="text-xs text-[#6b7280]">Usually completes within a few seconds.</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="py-6 text-center space-y-6">
        <AlertCircle size={36} className="text-[#b67c2c] mx-auto" strokeWidth={1.5} />
        <div>
          <h2 className="text-2xl font-bold text-[#111A24] mb-2">Unable to read document</h2>
          <p className="text-sm text-[#4b5564]">{errorMessage}</p>
        </div>
        <button
          type="button"
          onClick={onSkip}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#111A24] hover:bg-[#111A24]/90 text-white font-semibold px-8 py-3.5 rounded-lg transition-colors text-sm"
        >
          Continue manually
          <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="space-y-0">
      <div className="pb-6 border-b border-[#ece8e1]">
        <p className="text-[#b67c2c] text-xs font-semibold uppercase tracking-[0.18em] mb-3">
          Document Review
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#111A24] leading-tight mb-2">
          Initial findings from your quote
        </h2>
        <p className="text-sm text-[#4b5564] leading-relaxed">
          These details were identified from your uploaded document. Please confirm or update them in the next step.
        </p>
      </div>

      <div className="py-5 border-b border-[#ece8e1]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-[#faf9f7] border border-[#e7e1d8] flex items-center justify-center shrink-0">
              <FileText size={18} className="text-[#b67c2c]" strokeWidth={1.8} />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-[#4b5564]">Source document</p>
              <p className="text-sm font-semibold text-[#111A24] truncate">{result.fileName}</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#4b5564]">
            <CheckCircle2 size={14} className="text-[#b67c2c] shrink-0" />
            Review complete
          </div>
        </div>
        {result.source === "mock" && (
          <p className="mt-3 text-[11px] text-[#6b7280] italic">
            Preview data for demonstration purposes.
          </p>
        )}
      </div>

      {(fields.total || fields.builder) && (
        <div className="py-6 border-b border-[#ece8e1]">
          <div className="grid sm:grid-cols-2 gap-6">
            {fields.total && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#4b5564] mb-1">
                  Quote total
                </p>
                <p className="text-3xl font-bold text-[#111A24] tracking-tight">{fields.total}</p>
              </div>
            )}
            {fields.builder && (
              <div className="sm:text-right sm:ml-auto">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#4b5564] mb-1">
                  Builder
                </p>
                <p className="text-lg font-semibold text-[#111A24]">{fields.builder}</p>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="py-6 grid sm:grid-cols-2 gap-8 border-b border-[#ece8e1]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#111A24] mb-1">
            Project
          </p>
          <div className="w-8 h-[2px] bg-[#b67c2c] mb-3" />
          <DetailRow label="Type" value={fields.projectType ?? "-"} />
          <DetailRow label="Stage" value={fields.stage ?? "-"} />
          <DetailRow label="Budget range" value={fields.budget ?? "-"} />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#111A24] mb-1">
            Location
          </p>
          <div className="w-8 h-[2px] bg-[#b67c2c] mb-3" />
          <DetailRow label="Suburb" value={fields.suburb ?? "-"} />
          <DetailRow label="State" value={fields.state ?? "-"} />
        </div>
      </div>

      <div className="pt-6 space-y-4">
        <p className="text-xs text-[#6b7280] leading-relaxed">
          Figures are indicative and based on document review only. Eduardo Mendes will verify all details before any formal advice is provided.
        </p>

        <button
          type="button"
          onClick={() => onComplete(result)}
          className={cn(
            "w-full inline-flex items-center justify-center gap-2",
            "bg-[#b67c2c] hover:bg-[#9f6c27] text-white font-semibold",
            "px-6 py-3.5 rounded-lg text-sm uppercase tracking-[0.12em] transition-colors"
          )}
        >
          Continue to your details
          <ArrowRight size={16} strokeWidth={2.25} />
        </button>
      </div>
    </div>
  );
}
