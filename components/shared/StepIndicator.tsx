import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
  className?: string;
}

export function StepIndicator({
  currentStep,
  totalSteps,
  labels,
  className,
}: StepIndicatorProps) {
  return (
    <div className={cn("flex items-center gap-0", className)}>
      {Array.from({ length: totalSteps }, (_, i) => {
        const stepNumber = i + 1;
        const isCompleted = stepNumber < currentStep;
        const isCurrent = stepNumber === currentStep;

        return (
          <div key={stepNumber} className="flex items-center">
            {/* Step circle */}
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex items-center justify-center w-8 h-8 rounded-full text-xs font-semibold border-2 transition-all",
                  isCompleted
                    ? "bg-navy border-navy text-white"
                    : isCurrent
                    ? "bg-warm-soil border-warm-soil text-white"
                    : "bg-white border-muted text-muted-foreground"
                )}
              >
                {isCompleted ? <Check size={14} /> : stepNumber}
              </div>
              {labels?.[i] && (
                <span
                  className={cn(
                    "text-[10px] mt-1 max-w-[60px] text-center leading-tight",
                    isCurrent
                      ? "text-warm-soil font-medium"
                      : isCompleted
                      ? "text-navy"
                      : "text-muted-foreground"
                  )}
                >
                  {labels[i]}
                </span>
              )}
            </div>

            {/* Connector line */}
            {stepNumber < totalSteps && (
              <div
                className={cn(
                  "flex-1 h-0.5 w-8 sm:w-12 mx-1 transition-colors",
                  isCompleted ? "bg-navy" : "bg-muted"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
