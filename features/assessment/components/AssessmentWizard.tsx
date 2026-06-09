"use client";

import { useState, useEffect, useTransition } from "react";
import {
  ChevronLeft,
  Loader2,
  ShieldCheck,
  BarChart3,
  TrendingDown,
  AlertTriangle,
  ChevronRight,
  Home,
  MapPin,
  Flag,
  DollarSign,
  Star,
} from "lucide-react";
import { StepProjectType } from "./StepProjectType";
import { StepLocation } from "./StepLocation";
import { StepProjectStage } from "./StepProjectStage";
import { StepBudgetQuote } from "./StepBudgetQuote";
import { StepLeadCapture, type LeadData } from "./StepLeadCapture";
import { StepQuoteExtraction } from "./StepQuoteExtraction";
import { submitFreeAssessment, submitPaidAssessment, uploadLeadQuote } from "@/features/assessment/actions";
import { WizardCard, WizardShell } from "@/features/assessment/components/WizardShell";
import { consumePendingQuote, peekPendingQuote } from "@/lib/pending-quote";
import type { QuoteExtractionResult } from "@/lib/quote-extraction";

const SIDEBAR_CONTENT = [
  {
    icon: Home,
    whyTitle: "Why this matters",
    whyBody:
      "Understanding your project type helps us benchmark construction costs and provide accurate, tailored insights from the start.",
    benefits: [
      { icon: BarChart3,    label: "Cost Benchmarks",   desc: "Compare your project with similar builds in your area." },
      { icon: TrendingDown, label: "Potential Savings",  desc: "See estimated savings opportunities based on project type." },
      { icon: AlertTriangle,label: "Risk Insights",      desc: "Identify common risks for projects like yours." },
      { icon: ChevronRight, label: "Next Steps",         desc: "Get personalised recommendations for your stage." },
    ],
  },
  {
    icon: MapPin,
    whyTitle: "Why location matters",
    whyBody:
      "Local factors like council requirements, soil conditions, and market rates vary by location and can significantly impact your project costs.",
    benefits: [
      { icon: BarChart3,    label: "Local Cost Benchmarks",      desc: "See how your budget compares in your specific area." },
      { icon: Home,         label: "Site Condition Insights",    desc: "Understand potential site costs based on land characteristics." },
      { icon: AlertTriangle,label: "Risk Assessment",            desc: "Identify location-specific risks and considerations." },
      { icon: ChevronRight, label: "Council & Regulation Info",  desc: "Get insights into local council requirements." },
    ],
  },
  {
    icon: Flag,
    whyTitle: "Why your stage matters",
    whyBody:
      "Every stage of a project comes with different opportunities, risks, and actions. Understanding your stage helps Eduardo provide the right guidance.",
    benefits: [
      { icon: BarChart3,    label: "Stage-Specific Insights",   desc: "See key opportunities and risks for your current stage." },
      { icon: ChevronRight, label: "Recommended Next Steps",    desc: "Clear actions to help you move forward with confidence." },
      { icon: AlertTriangle,label: "Risk Awareness",            desc: "Identify common risks other owners face at this stage." },
      { icon: Star,         label: "Expert Guidance",           desc: "Advice tailored to your stage from Eduardo Mendes." },
    ],
  },
  {
    icon: DollarSign,
    whyTitle: "Why budget & finish level matter",
    whyBody:
      "Construction costs vary significantly based on budget and finish level. This helps Eduardo provide accurate benchmarks and savings insights.",
    benefits: [
      { icon: BarChart3,    label: "Cost Benchmarks",          desc: "See how your budget compares to similar projects." },
      { icon: TrendingDown, label: "Potential Savings",         desc: "Estimated savings opportunities based on your budget." },
      { icon: ChevronRight, label: "Value Optimisation Tips",  desc: "Recommendations to get the most value from your budget." },
      { icon: Star,         label: "Finish Level Insights",     desc: "Understand where to invest and where to save." },
    ],
  },
];

export interface UploadedFileRef {
  name: string;
  storagePath: string;
}

export interface WizardData {
  projectType: string;
  projectSubtype: string;
  landType: string;
  suburb: string;
  state: string;
  postcode: string;
  projectStage: string;
  budgetRange: string;
  finishLevel: string;
  hasQuote: boolean;
  quoteFileName: string;
  uploadedQuoteUrl: string;
  uploadedFiles: UploadedFileRef[];
  projectComment: string;
}

const INITIAL_DATA: WizardData = {
  projectType: "",
  projectSubtype: "",
  landType: "",
  suburb: "",
  state: "",
  postcode: "",
  projectStage: "",
  budgetRange: "",
  finishLevel: "",
  hasQuote: false,
  quoteFileName: "",
  uploadedQuoteUrl: "",
  uploadedFiles: [],
  projectComment: "",
};

function validateStep(step: number, data: WizardData): string | null {
  if (step === 1 && !data.projectType) return "Please select a project type.";
  if (step === 2 && !data.state) return "Please select your state.";
  if (step === 3 && !data.projectStage) return "Please select your project stage.";
  if (step === 4 && !data.budgetRange) return "Please select a budget range.";
  return null;
}

export type WizardPhase = "extract" | "capture" | "assessment";

export type WizardMode = "free" | "paid";

interface AssessmentWizardProps {
  mode?: WizardMode;
  /** For paid mode: pre-existing lead ID (from Stripe session) */
  leadId?: string;
  /** Skip contact capture when user already registered and has a lead row */
  skipLeadCapture?: boolean;
  /** Lead ID for authenticated users coming from registration */
  registeredLeadId?: string;
}

export function AssessmentWizard({
  mode = "free",
  leadId: initialLeadId,
  skipLeadCapture = false,
  registeredLeadId,
}: AssessmentWizardProps) {
  const STORAGE_KEY = `em_assessment_wizard_${mode}`;
  const TOTAL_WIZARD_STEPS = 4;

  // phase: 'extract' = AI quote analysis, 'capture' = Step 0, 'assessment' = Steps 1-4
  const [phase, setPhase] = useState<WizardPhase>(
    mode === "free" ? "capture" : "assessment"
  );
  const [leadId, setLeadId] = useState<string | null>(initialLeadId ?? null);
  const [leadData, setLeadData] = useState<LeadData | null>(null);
  const [extractFile, setExtractFile] = useState<File | null>(null);
  const [extractionResult, setExtractionResult] = useState<QuoteExtractionResult | null>(null);

  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>(INITIAL_DATA);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isUploadingQuote, setIsUploadingQuote] = useState(false);
  const [pendingQuoteName, setPendingQuoteName] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const pending = peekPendingQuote();
      const saved = localStorage.getItem(STORAGE_KEY);
      let parsed: {
        step: number;
        data: WizardData;
        phase?: WizardPhase;
        leadId?: string;
        leadData?: LeadData;
        extractionComplete?: boolean;
      } | null = null;

      if (saved) {
        parsed = JSON.parse(saved) as {
          step: number;
          data: WizardData;
          phase?: WizardPhase;
          leadId?: string;
          leadData?: LeadData;
          extractionComplete?: boolean;
        };
        if (parsed?.data) {
          setData({
            ...INITIAL_DATA,
            ...parsed.data,
            uploadedFiles: parsed.data.uploadedFiles ?? [],
            projectComment: parsed.data.projectComment ?? "",
          });
          setStep(Math.min(parsed.step ?? 1, TOTAL_WIZARD_STEPS));
          if (parsed.leadId) setLeadId(parsed.leadId);
          if (parsed.leadData) setLeadData(parsed.leadData);
        }
      }

      if (pending && mode === "free") {
        setPendingQuoteName(pending.name);
        const alreadyExtractedForFile =
          parsed?.extractionComplete === true &&
          parsed?.data?.quoteFileName === pending.name;

        if (!alreadyExtractedForFile) {
          setExtractFile(pending);
          setPhase("extract");
        } else if (parsed?.phase) {
          setPhase(parsed.phase);
        }
      } else if (skipLeadCapture && registeredLeadId) {
        setLeadId(registeredLeadId);
        if (parsed?.phase && parsed.phase !== "capture") {
          setPhase(parsed.phase);
        } else {
          setPhase("assessment");
          setStep(1);
        }
      } else if (parsed?.phase) {
        setPhase(parsed.phase);
      }
    } catch { /* ignore */ }
    setHydrated(true);
  }, [STORAGE_KEY, mode, skipLeadCapture, registeredLeadId]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          step,
          data,
          phase,
          leadId,
          leadData,
          extractionComplete: phase !== "extract" && !!extractionResult && !!data.quoteFileName,
        })
      );
    } catch { /* ignore */ }
  }, [step, data, phase, leadId, leadData, extractionResult, hydrated, STORAGE_KEY]);

  function continueWithLead(id: string) {
    setLeadId(id);

    const pendingFile = consumePendingQuote();
    if (!pendingFile) {
      setPhase("assessment");
      setStep(1);
      return;
    }

    setIsUploadingQuote(true);
    startTransition(async () => {
      const formData = new FormData();
      formData.append("leadId", id);
      formData.append("file", pendingFile);

      const result = await uploadLeadQuote(formData);
      setIsUploadingQuote(false);
      setPendingQuoteName(null);

      if ("error" in result) {
        setSubmitError(result.error);
        setPhase("assessment");
        setStep(1);
        return;
      }

      setData((prev) => ({
        ...prev,
        uploadedQuoteUrl: result.storagePath,
        quoteFileName: pendingFile.name,
        hasQuote: true,
        uploadedFiles: [{ name: pendingFile.name, storagePath: result.storagePath }],
      }));
      setPhase("assessment");
      setStep(1);
    });
  }

  function handleExtractionComplete(result: QuoteExtractionResult) {
    setExtractionResult(result);
    setData((prev) => ({
      ...prev,
      ...result.wizardPrefill,
      hasQuote: true,
      quoteFileName: result.fileName,
    }));

    if (skipLeadCapture && registeredLeadId) {
      continueWithLead(registeredLeadId);
      return;
    }

    setPhase("capture");
  }

  function handleExtractionSkip() {
    if (skipLeadCapture && registeredLeadId) {
      continueWithLead(registeredLeadId);
      return;
    }

    setPhase("capture");
  }

  function handleLeadCaptured(id: string, ld: LeadData) {
    setLeadData(ld);
    continueWithLead(id);
  }

  function updateData(patch: Partial<WizardData>) {
    setData((prev) => ({ ...prev, ...patch }));
    setValidationError(null);
  }

  function handleNext() {
    const error = validateStep(step, data);
    if (error) { setValidationError(error); return; }
    setValidationError(null);
    setStep((s) => Math.min(s + 1, TOTAL_WIZARD_STEPS));
  }

  function handleBack() {
    setValidationError(null);
    if (step === 1 && mode === "free" && !skipLeadCapture) {
      setPhase("capture");
      return;
    }
    setStep((s) => Math.max(s - 1, 1));
  }

  function handleSubmit() {
    const error = validateStep(4, data);
    if (error) { setValidationError(error); return; }
    setSubmitError(null);

    startTransition(async () => {
      let result: { error: string } | never;

      if (mode === "free") {
        if (!leadId) { setSubmitError("Session expired. Please refresh the page."); return; }
        result = await submitFreeAssessment({ leadId, wizardData: data });
      } else {
        if (!leadId) { setSubmitError("Session not found. Please contact support."); return; }
        result = await submitPaidAssessment({ leadId, wizardData: data });
      }

      if (result && "error" in result) {
        setSubmitError((result as { error: string }).error);
      } else {
        try { localStorage.removeItem(STORAGE_KEY); } catch {}
      }
    });
  }

  const sidebar = SIDEBAR_CONTENT[step - 1];
  const CONTINUE_LABELS = ["Continue to Location", "Continue to Current Stage", "Continue to Budget", ""];
  const flowTitle = mode === "free" ? "Preliminary Assessment" : "Project Intake";

  const stepBenefits = sidebar.benefits.map((b) => {
    if (mode === "paid" && b.label === "Potential Savings") {
      return { ...b, label: "Expert Review", desc: "Personalised analysis from Eduardo Mendes." };
    }
    if (mode === "paid" && b.label === "Potential Savings Opportunities") {
      return { ...b, label: "Expert Review", desc: "Personalised analysis from Eduardo Mendes." };
    }
    return b;
  });

  if (!hydrated || isUploadingQuote) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 py-20">
        <Loader2 size={28} className="animate-spin text-navy/40" />
        {isUploadingQuote && (
          <p className="text-gray-500 text-sm">Uploading your quote...</p>
        )}
      </div>
    );
  }

  // ── Quote extraction (after upload, before lead form) ─────────────────────
  if (phase === "extract" && extractFile) {
    return (
      <WizardShell flowTitle={flowTitle} phaseLabel="Document Review" narrow>
        <WizardCard>
          <StepQuoteExtraction
            file={extractFile}
            onComplete={handleExtractionComplete}
            onSkip={handleExtractionSkip}
          />
        </WizardCard>
      </WizardShell>
    );
  }

  // ── Step 0: Lead Capture (anonymous visitors only) ───────────────────────
  if (phase === "capture" && !skipLeadCapture) {
    return (
      <WizardShell
        flowTitle={flowTitle}
        phaseLabel="Your Details"
        sidebar={
          <>
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-[#ece8e1] p-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#111A24] mb-1">What you&apos;ll receive</p>
              <div className="w-8 h-[2px] bg-[#b67c2c] mb-4" />
              <p className="text-xs text-[#4b5564] leading-relaxed">
                A personalised preliminary assessment based on your project details and uploaded documents.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-[#ece8e1] p-5">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#111A24] mb-1">Your results include</p>
              <div className="w-8 h-[2px] bg-[#b67c2c] mb-4" />
              <div className="space-y-3.5">
                {[
                  { icon: BarChart3, label: "Opportunity score", desc: "Your project's potential rating." },
                  { icon: TrendingDown, label: "Potential savings", desc: "Estimated range for your build." },
                  { icon: AlertTriangle, label: "Risk areas", desc: "Key risks for your project type." },
                  { icon: ChevronRight, label: "Next steps", desc: "Priority actions to move forward." },
                ].map((b) => (
                  <div key={b.label} className="flex items-start gap-3 pb-3 border-b border-[#ece8e1] last:border-0 last:pb-0">
                    <b.icon size={15} className="text-[#b67c2c] shrink-0 mt-0.5" strokeWidth={1.8} />
                    <div>
                      <p className="text-xs font-semibold text-[#111A24]">{b.label}</p>
                      <p className="text-[11px] text-[#6b7280] leading-relaxed mt-0.5">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-[#ece8e1] bg-[#faf9f7] p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck size={16} className="text-[#b67c2c] shrink-0 mt-0.5" strokeWidth={1.8} />
                <div>
                  <p className="text-xs font-semibold text-[#111A24]">Trusted advisory</p>
                  <p className="text-[11px] text-[#6b7280] mt-1 leading-relaxed">
                    Independent guidance for owner builders and homeowners across Australia.
                  </p>
                </div>
              </div>
            </div>
          </>
        }
      >
        <WizardCard>
          <StepLeadCapture
            onComplete={handleLeadCaptured}
            pendingQuoteName={pendingQuoteName}
            initialData={
              extractionResult || data.hasQuote
                ? {
                    suburb: extractionResult?.wizardPrefill.suburb ?? data.suburb,
                    state: extractionResult?.wizardPrefill.state ?? data.state,
                  }
                : undefined
            }
            aiPrefilledFields={
              extractionResult || (data.hasQuote && (data.suburb || data.state))
                ? (["suburb", "state"] as const)
                : undefined
            }
          />
        </WizardCard>
      </WizardShell>
    );
  }

  // ── Steps 1–4: Assessment ─────────────────────────────────────────────────
  const displayStep = step;
  const stepLabels = ["Project Type", "Location", "Current Stage", "Budget"];

  return (
    <WizardShell
      flowTitle={flowTitle}
      phaseLabel={`Step ${displayStep} of 4 - ${stepLabels[displayStep - 1] ?? ""}`}
      displayStep={displayStep}
      showStepper
      sidebar={
        <>
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-[#ece8e1] p-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#111A24] mb-1">{sidebar.whyTitle}</p>
            <div className="w-8 h-[2px] bg-[#b67c2c] mb-4" />
            <p className="text-xs text-[#4b5564] leading-relaxed">{sidebar.whyBody}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-[#ece8e1] p-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#111A24] mb-1">In your results</p>
            <div className="w-8 h-[2px] bg-[#b67c2c] mb-4" />
            <div className="space-y-3.5">
              {stepBenefits.map((b) => (
                <div key={b.label} className="flex items-start gap-3 pb-3 border-b border-[#ece8e1] last:border-0 last:pb-0">
                  <b.icon size={15} className="text-[#b67c2c] shrink-0 mt-0.5" strokeWidth={1.8} />
                  <div>
                    <p className="text-xs font-semibold text-[#111A24]">{b.label}</p>
                    <p className="text-[11px] text-[#6b7280] leading-relaxed mt-0.5">{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-[#ece8e1] bg-[#faf9f7] p-5">
            <div className="flex items-start gap-3">
              <ShieldCheck size={16} className="text-[#b67c2c] shrink-0 mt-0.5" strokeWidth={1.8} />
              <div>
                <p className="text-xs font-semibold text-[#111A24]">Trusted advisory</p>
                <p className="text-[11px] text-[#6b7280] mt-1 leading-relaxed">
                  Independent guidance for owner builders and homeowners across Australia.
                </p>
              </div>
            </div>
          </div>
        </>
      }
    >
      <WizardCard>
            {step === 1 && (
              <StepProjectType value={data.projectType} onChange={(v) => updateData({ projectType: v })} />
            )}
            {step === 2 && (
              <StepLocation
                value={{ landType: data.landType, suburb: data.suburb, state: data.state, postcode: data.postcode }}
                onChange={updateData}
              />
            )}
            {step === 3 && (
              <StepProjectStage value={data.projectStage} onChange={(v) => updateData({ projectStage: v })} />
            )}
            {step === 4 && (
              <StepBudgetQuote
                leadId={leadId}
                value={{
                  budgetRange: data.budgetRange,
                  finishLevel: data.finishLevel,
                  hasQuote: data.hasQuote,
                  quoteFileName: data.quoteFileName,
                  uploadedQuoteUrl: data.uploadedQuoteUrl,
                  uploadedFiles: data.uploadedFiles,
                  projectComment: data.projectComment,
                }}
                onChange={updateData}
              />
            )}

            {(validationError || submitError) && (
              <div className="mt-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {validationError ?? submitError}
              </div>
            )}

            <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#ece8e1]">
              <button
                type="button"
                onClick={handleBack}
                disabled={isPending}
                className="flex items-center gap-1.5 text-sm font-medium text-[#6b7280] hover:text-[#111A24] transition-colors"
              >
                <ChevronLeft size={16} />
                Back
              </button>

              {step < TOTAL_WIZARD_STEPS ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isPending}
                  className="inline-flex items-center gap-2 bg-[#b67c2c] hover:bg-[#9f6c27] text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm uppercase tracking-[0.12em]"
                >
                  {CONTINUE_LABELS[step - 1]}
                  <ChevronRight size={16} strokeWidth={2.25} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isPending}
                  className="inline-flex items-center gap-2 bg-[#b67c2c] hover:bg-[#9f6c27] disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-lg transition-colors text-sm uppercase tracking-[0.12em] min-w-[220px] justify-center"
                >
                  {isPending ? (
                    <>
                      <Loader2 size={15} className="animate-spin" />
                      {mode === "paid" ? "Submitting..." : "Generating..."}
                    </>
                  ) : (
                    <>
                      <BarChart3 size={15} />
                      {mode === "paid" ? "Submit project" : "Get my results"}
                    </>
                  )}
                </button>
              )}
            </div>
      </WizardCard>
    </WizardShell>
  );
}
