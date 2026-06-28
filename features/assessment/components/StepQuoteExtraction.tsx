"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  Loader2,
  Upload,
} from "lucide-react";
import { extractQuoteFromUpload } from "@/features/assessment/quote-extraction-actions";
import type { QuoteExtractionResult } from "@/lib/quote-extraction";
import { ALLOWED_EXTENSIONS } from "@/utils/validators";
import { cn } from "@/lib/utils";

const LOADING_STEPS = [
  "Reading document structure",
  "Checking this is a builder quote",
  "Extracting builder and pricing",
  "Matching project details",
];

const ACCEPT = ALLOWED_EXTENSIONS.map((ext) => `.${ext}`).join(",");

interface StepQuoteExtractionProps {
  file: File;
  onComplete: (result: QuoteExtractionResult) => void;
  onSkip: () => void;
  onReplaceFile: (file: File) => void;
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

export function StepQuoteExtraction({
  file,
  onComplete,
  onSkip,
  onReplaceFile,
}: StepQuoteExtractionProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"loading" | "success" | "manual">("loading");
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<QuoteExtractionResult | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setStatus("loading");
      setLoadingStep(0);
      setErrorMessage(null);
      setResult(null);

      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await extractQuoteFromUpload(formData);
        if (cancelled) return;

        if (!response.ok) {
          setErrorMessage(response.message);
          setStatus("manual");
          return;
        }

        setResult(response.result);
        setStatus("success");
      } catch {
        if (cancelled) return;
        setErrorMessage(
          "We couldn't read details from your document automatically. Please continue and enter your project details manually."
        );
        setStatus("manual");
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
    }, 1200);

    return () => clearInterval(interval);
  }, [status]);

  const fields = useMemo(
    () => (result ? getFieldMap(result) : {}),
    [result]
  );

  function handleReplaceFile(selected: FileList | null) {
    const next = selected?.[0];
    if (!next) return;
    onReplaceFile(next);
    if (inputRef.current) inputRef.current.value = "";
  }

  if (status === "loading") {
    const progress = ((loadingStep + 1) / LOADING_STEPS.length) * 100;

    return (
      <div className="py-4">
        <div className="mb-8">
          <p className="text-[#b67c2c] text-xs font-semibold uppercase tracking-[0.18em] mb-3">
            Document Review
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#111A24] leading-tight mb-2">
            Analysing your builder quote
          </h2>
          <p className="text-sm text-[#4b5564] leading-relaxed max-w-lg">
            Our system is reading your document to confirm it is a builder quote and extract key project details.
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

        <p className="text-xs text-[#6b7280]">This usually takes 10–30 seconds.</p>
      </div>
    );
  }

  if (status === "manual") {
    const manualMessage =
      errorMessage ??
      "We couldn't read details from your document automatically. Your file will still be saved — please continue and enter your project details manually.";

    return (
      <div className="py-6 space-y-6">
        <div className="text-center">
          <div className="w-14 h-14 rounded-full bg-[#faf9f7] border border-[#ece8e1] flex items-center justify-center mx-auto mb-4">
            <FileText size={28} className="text-[#b67c2c]" strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl font-bold text-[#111A24] mb-2">Document uploaded</h2>
          <p className="text-sm text-[#4b5564] max-w-md mx-auto leading-relaxed">
            {manualMessage}
          </p>
        </div>

        <div className="rounded-xl border border-[#ece8e1] bg-[#faf9f7] p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#4b5564] mb-2">
            Uploaded file
          </p>
          <p className="text-sm font-semibold text-[#111A24] truncate">{file.name}</p>
          <p className="text-xs text-[#6b7280] mt-2 leading-relaxed">
            Eduardo will review your document as part of your assessment. For now, please continue with the standard questions below.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <input
            ref={inputRef}
            type="file"
            className="sr-only"
            accept={ACCEPT}
            onChange={(e) => handleReplaceFile(e.target.files)}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="inline-flex items-center justify-center gap-2 border border-[#ece8e1] bg-white hover:bg-[#faf9f7] text-[#111A24] font-semibold px-6 py-3.5 rounded-lg transition-colors text-sm"
          >
            <Upload size={16} />
            Upload a different file
          </button>
          <button
            type="button"
            onClick={onSkip}
            className="inline-flex items-center justify-center gap-2 bg-[#111A24] hover:bg-[#111A24]/90 text-white font-semibold px-6 py-3.5 rounded-lg transition-colors text-sm"
          >
            Continue manually
            <ArrowRight size={16} />
          </button>
        </div>
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
          These details were identified from your uploaded document. Please confirm or update them in the next steps.
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
            Builder quote identified
          </div>
        </div>
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
