"use client";

import { useState, useEffect, useTransition } from "react";
import {
  ChevronLeft,
  Loader2,
  ShieldCheck,
  Lock,
  MessageCircle,
  Check,
  Home,
  MapPin,
  Flag,
  DollarSign,
  BarChart3,
  TrendingDown,
  AlertTriangle,
  ChevronRight,
  Star,
} from "lucide-react";
import Link from "next/link";
import { StepProjectType } from "./StepProjectType";
import { StepLocation } from "./StepLocation";
import { StepProjectStage } from "./StepProjectStage";
import { StepBudgetQuote } from "./StepBudgetQuote";
import { StepLeadCapture, type LeadData } from "./StepLeadCapture";
import { submitFreeAssessment, submitPaidAssessment, uploadLeadQuote } from "@/features/assessment/actions";
import { FOOTER_BRAND_LOGO } from "@/lib/branding";
import { consumePendingQuote, peekPendingQuote } from "@/lib/pending-quote";
import { cn } from "@/lib/utils";

const STEPS_CONFIG = [
  { label: "Project Type", shortLabel: "Project" },
  { label: "Location",     shortLabel: "Location" },
  { label: "Current Stage", shortLabel: "Stage" },
  { label: "Budget",       shortLabel: "Budget" },
  { label: "Results",      shortLabel: "Results" },
];

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
};

function validateStep(step: number, data: WizardData): string | null {
  if (step === 1 && !data.projectType) return "Please select a project type.";
  if (step === 2 && !data.state) return "Please select your state.";
  if (step === 3 && !data.projectStage) return "Please select your project stage.";
  if (step === 4 && !data.budgetRange) return "Please select a budget range.";
  return null;
}

export type WizardMode = "free" | "paid";

interface AssessmentWizardProps {
  mode?: WizardMode;
  /** For paid mode: pre-existing lead ID (from Stripe session) */
  leadId?: string;
}

export function AssessmentWizard({ mode = "free", leadId: initialLeadId }: AssessmentWizardProps) {
  const STORAGE_KEY = `em_assessment_wizard_${mode}`;
  const TOTAL_WIZARD_STEPS = 4;

  // phase: 'capture' = Step 0 (lead info), 'assessment' = Steps 1–4
  const [phase, setPhase] = useState<"capture" | "assessment">(
    mode === "free" ? "capture" : "assessment"
  );
  const [leadId, setLeadId] = useState<string | null>(initialLeadId ?? null);
  const [leadData, setLeadData] = useState<LeadData | null>(null);

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
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as {
          step: number;
          data: WizardData;
          phase?: "capture" | "assessment";
          leadId?: string;
          leadData?: LeadData;
        };
        if (parsed.data) {
          setData(parsed.data);
          setStep(Math.min(parsed.step ?? 1, TOTAL_WIZARD_STEPS));
          if (parsed.phase) setPhase(parsed.phase);
          if (parsed.leadId) setLeadId(parsed.leadId);
          if (parsed.leadData) setLeadData(parsed.leadData);
        }
      }
    } catch { /* ignore */ }
    const pending = peekPendingQuote();
    if (pending) setPendingQuoteName(pending.name);
    setHydrated(true);
  }, [STORAGE_KEY]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, data, phase, leadId, leadData }));
    } catch { /* ignore */ }
  }, [step, data, phase, leadId, leadData, hydrated, STORAGE_KEY]);

  function handleLeadCaptured(id: string, ld: LeadData) {
    setLeadId(id);
    setLeadData(ld);

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
      }));
      setPhase("assessment");
      setStep(1);
    });
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
    if (step === 1 && mode === "free") {
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

  // ── Step 0: Lead Capture ──────────────────────────────────────────────────
  if (phase === "capture") {
    return (
      <div className="flex flex-col flex-1">
        <header className="bg-navy px-6 py-5 border-b border-white/10">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <div className="min-w-0">
              <Link href="/" className="flex items-center gap-3">
                <img
                  src="https://rdeavyxckvkfwjvmxugs.supabase.co/storage/v1/object/public/media/logo%20EM_hor%20white.png"
                  alt="Eduardo Mendes Advisory"
                  className="h-9 w-auto"
                />
              </Link>
              <p className="text-white/70 text-xs mt-2">
                Preliminary AI Assessment &nbsp;·&nbsp;
                <span className="text-amber font-medium">Your Details</span>
                &nbsp;·&nbsp; ~2 minutes
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2.5 border border-white/15 rounded-xl px-4 py-2.5 shrink-0">
              <ShieldCheck size={18} className="text-amber shrink-0" />
              <div className="text-xs leading-tight">
                <p className="text-white font-medium">Your information is secure</p>
                <p className="text-white/40">We never share your data</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-8">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_300px] gap-6 items-start">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
              <StepLeadCapture
                onComplete={handleLeadCaptured}
                pendingQuoteName={pendingQuoteName}
              />
            </div>

            {/* Sidebar */}
            <aside className="space-y-4 hidden lg:block">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber/10 flex items-center justify-center shrink-0">
                    <BarChart3 size={20} className="text-amber" />
                  </div>
                  <div>
                    <p className="font-semibold text-navy text-sm">What you&apos;ll get</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                      A personalised preliminary assessment based on your project details.
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <p className="font-semibold text-navy text-sm mb-4">Your preliminary results include</p>
                <div className="space-y-3">
                  {[
                    { icon: BarChart3,    label: "Opportunity Score",     desc: "See your project's potential rating." },
                    { icon: TrendingDown, label: "Potential Savings",      desc: "Estimated range based on your details." },
                    { icon: AlertTriangle,label: "Risk Areas Identified",  desc: "Key risks flagged for your project type." },
                    { icon: ChevronRight, label: "Recommended Actions",    desc: "Priority steps to move forward." },
                  ].map((b) => (
                    <div key={b.label} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-amber/10 flex items-center justify-center shrink-0 mt-0.5">
                        <b.icon size={14} className="text-amber" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-navy">{b.label}</p>
                        <p className="text-xs text-gray-500 leading-relaxed">{b.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <div className="flex items-start gap-3">
                  <ShieldCheck size={18} className="text-green-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-green-700">Trusted by Owner Builders</p>
                    <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                      Thousands of Owner Builders Australia-wide trust Eduardo Mendes for expert guidance.
                    </p>
                    <div className="flex items-center gap-1.5 mt-2">
                      {[1,2,3,4,5].map((n) => (
                        <Star key={n} size={12} className={n < 5 ? "fill-amber text-amber" : "fill-amber/40 text-amber/40"} />
                      ))}
                      <span className="text-xs text-gray-500">4.9 (120+ reviews)</span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </main>

        <footer className="bg-white border-t border-gray-100 py-4 px-6">
          <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs text-gray-400">
            <div className="flex items-center gap-2">
              <Lock size={13} />
              <span className="font-medium text-gray-600">Secure SSL encryption</span>
              <span>256-bit protection</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageCircle size={13} />
              <span>Need help? <a href="/contact" className="text-navy hover:underline">Chat with our team</a></span>
            </div>
            <div className="flex items-center gap-2">
              <img
                src={FOOTER_BRAND_LOGO}
                alt="Eduardo Mendes Advisory"
                className="h-6 w-auto"
              />
              <span>Owner Builder Advisor</span>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // ── Steps 1–4: Assessment ─────────────────────────────────────────────────
  const displayStep = step;
  const headerTitle = mode === "free" ? "Preliminary AI Assessment" : "Project Intake";

  return (
    <div className="flex flex-col flex-1">
      {/* ── Dark header ───────────────────────────────────────────── */}
      <header className="bg-navy px-6 py-5 border-b border-white/10">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="min-w-0">
            <Link href="/" className="flex items-center gap-3">
              <img
                src="https://rdeavyxckvkfwjvmxugs.supabase.co/storage/v1/object/public/media/logo%20EM_hor%20white.png"
                alt="Eduardo Mendes Advisory"
                className="h-9 w-auto"
              />
            </Link>
            <p className="text-white/70 text-xs mt-2">
              {headerTitle} &nbsp;·&nbsp;
              <span className="text-amber font-medium">Step {displayStep} of 5</span>
              &nbsp;·&nbsp; ~2 minutes
            </p>
          </div>

          {/* Step progress */}
          <nav className="hidden md:flex items-center gap-0" aria-label="Assessment steps">
            {STEPS_CONFIG.map((s, i) => {
              const idx = i + 1;
              const isDone = idx < displayStep;
              const isActive = idx === displayStep;
              return (
                <div key={s.label} className="flex items-center">
                  <div className="flex flex-col items-center gap-1">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                      isDone   && "bg-amber text-navy",
                      isActive && "bg-amber text-navy ring-2 ring-amber/30",
                      !isDone && !isActive && "border border-white/25 text-white/40"
                    )}>
                      {isDone ? <Check size={14} strokeWidth={3} /> : idx}
                    </div>
                    <span className={cn(
                      "text-[10px] whitespace-nowrap",
                      isActive ? "text-amber font-medium" : isDone ? "text-white/60" : "text-white/30"
                    )}>
                      {s.shortLabel}
                    </span>
                  </div>
                  {i < STEPS_CONFIG.length - 1 && (
                    <div className={cn("w-10 h-px mx-1 mb-4", idx < displayStep ? "bg-amber/60" : "bg-white/15")} />
                  )}
                </div>
              );
            })}
          </nav>

          <div className="hidden sm:flex items-center gap-2.5 border border-white/15 rounded-xl px-4 py-2.5 shrink-0">
            <ShieldCheck size={18} className="text-amber shrink-0" />
            <div className="text-xs leading-tight">
              <p className="text-white font-medium">Your information is secure</p>
              <p className="text-white/40">We never share your data</p>
            </div>
          </div>
        </div>
      </header>

      {/* ── Body ──────────────────────────────────────────────────── */}
      <main className="flex-1 px-4 py-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_300px] gap-6 items-start">

          {/* Left: content card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
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
                }}
                onChange={updateData}
              />
            )}

            {(validationError || submitError) && (
              <div className="mt-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {validationError ?? submitError}
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={handleBack}
                disabled={isPending}
                className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-navy transition-colors"
              >
                <ChevronLeft size={16} />
                Back
              </button>

              {step < TOTAL_WIZARD_STEPS ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isPending}
                  className="flex items-center gap-2 bg-navy hover:bg-navy/90 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
                >
                  {CONTINUE_LABELS[step - 1]}
                  <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isPending}
                  className="flex items-center gap-2 bg-navy hover:bg-navy/90 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm min-w-[200px] justify-center"
                >
                  {isPending ? (
                    <><Loader2 size={15} className="animate-spin" /> Generating Results…</>
                  ) : (
                    <><BarChart3 size={15} /> Get My Assessment Results</>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Right: contextual sidebar */}
          <aside className="space-y-4 hidden lg:block">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-amber/10 flex items-center justify-center shrink-0">
                  <sidebar.icon size={20} className="text-amber" />
                </div>
                <div>
                  <p className="font-semibold text-navy text-sm">{sidebar.whyTitle}</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{sidebar.whyBody}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <p className="font-semibold text-navy text-sm mb-4">What you&apos;ll get in results</p>
              <div className="space-y-3">
                {sidebar.benefits.map((b) => (
                  <div key={b.label} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-amber/10 flex items-center justify-center shrink-0 mt-0.5">
                      <b.icon size={14} className="text-amber" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-navy">{b.label}</p>
                      <p className="text-xs text-gray-500 leading-relaxed">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck size={18} className="text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-green-700">Trusted by Owner Builders</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    Thousands of Owner Builders Australia-wide trust Eduardo Mendes for expert guidance.
                  </p>
                  <div className="flex items-center gap-1.5 mt-2">
                    {[1,2,3,4,5].map((n) => (
                      <Star key={n} size={12} className={n < 5 ? "fill-amber text-amber" : "fill-amber/40 text-amber/40"} />
                    ))}
                    <span className="text-xs text-gray-500">4.9 (120+ reviews)</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* ── Trust footer ──────────────────────────────────────────── */}
      <footer className="bg-white border-t border-gray-100 py-4 px-6">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <Lock size={13} />
            <span className="font-medium text-gray-600">Secure SSL encryption</span>
            <span>256-bit protection</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle size={13} />
            <span>Need help? <a href="/contact" className="text-navy hover:underline">Chat with our team</a></span>
          </div>
          <div className="flex items-center gap-2">
            <img
              src={FOOTER_BRAND_LOGO}
              alt="Eduardo Mendes Advisory"
              className="h-6 w-auto"
            />
            <span>Owner Builder Advisor</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
