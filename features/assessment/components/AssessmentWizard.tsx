"use client";

import { useState, useEffect, useTransition } from "react";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StepIndicator } from "@/components/shared/StepIndicator";
import { StepProjectType } from "./StepProjectType";
import { StepLocation } from "./StepLocation";
import { StepProjectStage } from "./StepProjectStage";
import { StepBudgetQuote } from "./StepBudgetQuote";
import { submitAssessment } from "@/features/assessment/actions";

const STEP_LABELS = ["Project", "Location", "Stage", "Budget"];
const TOTAL_STEPS = 4;
const STORAGE_KEY = "em_assessment_wizard";

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

  // Load persisted state on mount
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
    } catch {
      // Ignore parse errors
    }
    setHydrated(true);
  }, []);

  // Persist state on every change
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ step, data }));
    } catch {
      // Ignore storage errors
    }
  }, [step, data, hydrated]);

  function updateData(patch: Partial<WizardData>) {
    setData((prev) => ({ ...prev, ...patch }));
    setValidationError(null);
  }

  function handleNext() {
    const error = validateStep(step, data);
    if (error) {
      setValidationError(error);
      return;
    }
    setValidationError(null);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }

  function handleBack() {
    setValidationError(null);
    setStep((s) => Math.max(s - 1, 1));
  }

  function handleSubmit() {
    const error = validateStep(4, data);
    if (error) {
      setValidationError(error);
      return;
    }
    setSubmitError(null);

    startTransition(async () => {
      const result = await submitAssessment(data);
      if (result?.error) {
        setSubmitError(result.error);
      } else {
        // Clear localStorage on success
        try { localStorage.removeItem(STORAGE_KEY); } catch {}
      }
    });
  }

  if (!hydrated) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-between">
        <StepIndicator
          currentStep={step}
          totalSteps={TOTAL_STEPS}
          labels={STEP_LABELS}
        />
        <p className="text-xs text-muted-foreground hidden sm:block">
          Step {step} of {TOTAL_STEPS}
        </p>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-warm-soil rounded-full transition-all duration-500"
          style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
        />
      </div>

      {/* Step content */}
      <div className="min-h-[360px]">
        {step === 1 && (
          <StepProjectType
            value={data.projectType}
            onChange={(v) => updateData({ projectType: v })}
          />
        )}
        {step === 2 && (
          <StepLocation
            value={{
              landType: data.landType,
              suburb: data.suburb,
              state: data.state,
              postcode: data.postcode,
            }}
            onChange={updateData}
          />
        )}
        {step === 3 && (
          <StepProjectStage
            value={data.projectStage}
            onChange={(v) => updateData({ projectStage: v })}
          />
        )}
        {step === 4 && (
          <StepBudgetQuote
            value={{
              budgetRange: data.budgetRange,
              finishLevel: data.finishLevel,
              hasQuote: data.hasQuote,
            }}
            onChange={updateData}
          />
        )}
      </div>

      {/* Validation / submit errors */}
      {(validationError || submitError) && (
        <div className="rounded-lg bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive">
          {validationError ?? submitError}
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between pt-2">
        {step > 1 ? (
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={isPending}
          >
            <ChevronLeft size={16} className="mr-1" />
            Back
          </Button>
        ) : (
          <div />
        )}

        {step < TOTAL_STEPS ? (
          <Button onClick={handleNext} disabled={isPending}>
            Continue
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="bg-warm-soil hover:bg-warm-soil/90 text-white border-transparent min-w-[160px]"
          >
            {isPending ? (
              <>
                <Loader2 size={15} className="animate-spin mr-2" />
                Generating...
              </>
            ) : (
              "Generate My Assessment"
            )}
          </Button>
        )}
      </div>

      <p className="text-xs text-muted-foreground text-center">
        Your progress is saved automatically.
      </p>
    </div>
  );
}
