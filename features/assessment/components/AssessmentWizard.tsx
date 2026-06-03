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
import { Button } from "@/components/ui/button";
import { StepProjectType } from "./StepProjectType";
import { StepLocation } from "./StepLocation";
import { StepProjectStage } from "./StepProjectStage";
import { StepBudgetQuote } from "./StepBudgetQuote";
import { submitAssessment } from "@/features/assessment/actions";
import { cn } from "@/lib/utils";

const TOTAL_STEPS = 4;
const STORAGE_KEY = "em_assessment_wizard";

const STEP_CONFIG = [
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

interface WizardData {
  projectType: string;
  landType: string;
  suburb: string;
  state: string;
  postcode: string;
  projectStage: string;
  budgetRange: string;
  finishLevel: string;
  hasQuote: boolean;
}

const INITIAL_DATA: WizardData = {
  projectType: "",
  landType: "",
  suburb: "",
  state: "",
  postcode: "",
  projectStage: "",
  budgetRange: "",
  finishLevel: "",
  hasQuote: false,
};

function validateStep(step: number, data: WizardData): string | null {
  if (step === 1 && !data.projectType) return "Please select a project type.";
  if (step === 2 && !data.state) return "Please select your state.";
  if (step === 3 && !data.projectStage) return "Please select your project stage.";
  if (step === 4 && !data.budgetRange) return "Please select a budget range.";
  return null;
}

export function AssessmentWizard() {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<WizardData>(INITIAL_DATA);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as { step: number; data: WizardData };
        if (parsed.data && parsed.step) {
          setData(parsed.data);
          setStep(Math.min(parsed.step, TOTAL_STEPS));
        }
      }
    } catch { /* ignore */ }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, data }));
    } catch { /* ignore */ }
  }, [step, data, hydrated]);

  function updateData(patch: Partial<WizardData>) {
    setData((prev) => ({ ...prev, ...patch }));
    setValidationError(null);
  }

  function handleNext() {
    const error = validateStep(step, data);
    if (error) { setValidationError(error); return; }
    setValidationError(null);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }

  function handleBack() {
    setValidationError(null);
    setStep((s) => Math.max(s - 1, 1));
  }

  function handleSubmit() {
    const error = validateStep(4, data);
    if (error) { setValidationError(error); return; }
    setSubmitError(null);
    startTransition(async () => {
      const result = await submitAssessment(data);
      if (result?.error) {
        setSubmitError(result.error);
      } else {
        try { localStorage.removeItem(STORAGE_KEY); } catch {}
      }
    });
  }

  const sidebar = SIDEBAR_CONTENT[step - 1];
  const continueLabel = ["Continue to Location", "Continue to Stage", "Continue to Budget", ""][step - 1];

  if (!hydrated) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-white/40" />
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1">
      {/* ── Dark header ───────────────────────────────────────────── */}
      <header className="bg-navy px-6 py-5 border-b border-white/10">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">

          {/* Logo + title */}
          <div className="min-w-0">
            <Link href="/" className="flex items-center gap-3">
              <span className="text-amber font-bold text-2xl leading-none">EM</span>
              <div>
                <p className="text-white font-bold text-sm leading-tight tracking-wide">EDUARDO MENDES</p>
                <p className="text-white/50 text-[10px] tracking-widest uppercase">Owner Builder Advisory</p>
              </div>
            </Link>
            <p className="text-white/70 text-xs mt-2">
              BuildCheck™ Assessment &nbsp;·&nbsp;
              <span className="text-amber font-medium">Step {step} of 5</span>
              &nbsp;·&nbsp; ~2 minutes
            </p>
          </div>

          {/* Step progress — hidden on small screens */}
          <nav className="hidden md:flex items-center gap-0" aria-label="Assessment steps">
            {STEP_CONFIG.map((s, i) => {
              const idx = i + 1;
              const isDone = idx < step;
              const isActive = idx === step;
              return (
                <div key={s.label} className="flex items-center">
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                        isDone  && "bg-amber text-navy",
                        isActive && "bg-amber text-navy ring-2 ring-amber/30",
                        !isDone && !isActive && "border border-white/25 text-white/40"
                      )}
                    >
                      {isDone ? <Check size={14} strokeWidth={3} /> : idx}
                    </div>
                    <span className={cn(
                      "text-[10px] whitespace-nowrap",
                      isActive ? "text-amber font-medium" : isDone ? "text-white/60" : "text-white/30"
                    )}>
                      {s.shortLabel}
                    </span>
                  </div>
                  {i < STEP_CONFIG.length - 1 && (
                    <div className={cn(
                      "w-10 h-px mx-1 mb-4",
                      idx < step ? "bg-amber/60" : "bg-white/15"
                    )} />
                  )}
                </div>
              );
            })}
          </nav>

          {/* Security badge */}
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
                value={{ budgetRange: data.budgetRange, finishLevel: data.finishLevel, hasQuote: data.hasQuote }}
                onChange={updateData}
              />
            )}

            {/* Validation / submit errors */}
            {(validationError || submitError) && (
              <div className="mt-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                {validationError ?? submitError}
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  disabled={isPending}
                  className="flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-navy transition-colors"
                >
                  <ChevronLeft size={16} />
                  Back
                </button>
              ) : (
                <div />
              )}

              {step < TOTAL_STEPS ? (
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isPending}
                  className="flex items-center gap-2 bg-navy hover:bg-navy/90 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
                >
                  {continueLabel}
                  <ChevronRight size={16} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isPending}
                  className="flex items-center gap-2 bg-navy hover:bg-navy/90 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm min-w-[180px] justify-center"
                >
                  {isPending ? (
                    <><Loader2 size={15} className="animate-spin" /> Generating…</>
                  ) : (
                    <><BarChart3 size={15} /> Continue to Results</>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Right: contextual sidebar */}
          <aside className="space-y-4 hidden lg:block">
            {/* Why this matters */}
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

            {/* What you'll get */}
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

            {/* Trust badge */}
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
            <div>
              <span className="font-medium text-gray-600">Secure SSL encryption</span>
              <span className="ml-1">256-bit protection</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle size={13} />
            <span>Need help? <a href="/contact" className="text-navy hover:underline">Chat with our team</a></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-amber font-bold text-sm">EM</span>
            <div>
              <span className="font-medium text-gray-600">Eduardo Mendes</span>
              <span className="ml-1">Owner Builder Advisor</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
