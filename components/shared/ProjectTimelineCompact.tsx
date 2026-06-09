"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  PROJECT_STEPS,
  getEffectiveActiveIndex,
  getCurrentFocusStep,
  getStepStatus,
  normaliseStage,
  type StepDefinition,
  type StepStatus,
} from "@/lib/buildiq/project-stages";

interface ProjectTimelineCompactProps {
  stage: string | null | undefined;
  assessmentSubmitted?: boolean;
  nextStepHref?: string;
  nextStepCtaLabel?: string;
  className?: string;
}

function CompactStepNode({
  step,
  status,
  isFirst,
  isLast,
  isSelected,
  onSelect,
}: {
  step: StepDefinition;
  status: StepStatus;
  isFirst: boolean;
  isLast: boolean;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex flex-col items-center flex-1 min-w-[88px] max-w-[110px] group bg-transparent",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b67c2c]/40 rounded-lg"
      )}
      aria-label={`${step.label}. ${step.description}`}
      aria-current={status === "active" ? "step" : undefined}
    >
      <div className="flex items-center w-full py-1">
        {!isFirst && (
          <div
            className={cn(
              "flex-1 h-0.5 transition-colors self-center",
              status === "done" || status === "active" ? "bg-green-500" : "bg-gray-200"
            )}
          />
        )}
        {/* Fixed-size wrapper so glow/halo is never clipped */}
        <div className="relative shrink-0 w-10 h-10 flex items-center justify-center">
          {status === "active" && (
            <span
              className="absolute inset-0 rounded-full bg-[#b67c2c]/15"
              aria-hidden
            />
          )}
          {isSelected && status !== "active" && (
            <span
              className="absolute inset-0.5 rounded-full bg-[#111A24]/5"
              aria-hidden
            />
          )}
          <div
            className={cn(
              "relative z-10 h-8 w-8 rounded-full flex items-center justify-center border-2 transition-all bg-white",
              status === "done"
                ? "bg-green-500 border-green-500"
                : status === "active"
                  ? "border-[#b67c2c]"
                  : "border-gray-200 group-hover:border-gray-300"
            )}
          >
            {status === "done" ? (
              <CheckCircle2 size={15} className="text-white" />
            ) : status === "active" ? (
              <div className="h-3 w-3 rounded-full bg-[#b67c2c]" />
            ) : (
              <Circle size={13} className="text-gray-300 group-hover:text-gray-400" />
            )}
          </div>
        </div>
        {!isLast && (
          <div
            className={cn(
              "flex-1 h-0.5 self-center",
              status === "done" ? "bg-green-500" : "bg-gray-200"
            )}
          />
        )}
      </div>
      <p
        className={cn(
          "text-[9px] font-medium text-center mt-1.5 leading-tight px-0.5 transition-colors",
          isSelected || status === "active"
            ? "text-[#b67c2c]"
            : status === "done"
              ? "text-[#111A24]"
              : "text-gray-400 group-hover:text-gray-600"
        )}
      >
        {step.label}
      </p>
      {status === "active" && (
        <p className="text-[8px] text-[#b67c2c] font-bold uppercase tracking-wider mt-0.5">
          Active
        </p>
      )}
      {status === "done" && (
        <p className="text-[8px] text-green-600 font-bold uppercase tracking-wider mt-0.5">
          Done
        </p>
      )}
    </button>
  );
}

function StepLegendPanel({
  step,
  status,
  isFocusStep,
  href,
  ctaLabel,
}: {
  step: StepDefinition;
  status: StepStatus;
  isFocusStep: boolean;
  href?: string;
  ctaLabel?: string;
}) {
  const statusLabel =
    status === "active" ? "Current step" : status === "done" ? "Completed" : "Upcoming";

  return (
    <div
      className={cn(
        "mt-4 rounded-xl border px-4 py-3.5 transition-colors",
        isFocusStep
          ? "bg-[#b67c2c]/6 border-[#b67c2c]/20"
          : "bg-gray-50/80 border-gray-100"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <p
              className={cn(
                "text-[10px] font-bold uppercase tracking-wider",
                isFocusStep ? "text-[#b67c2c]" : "text-muted-foreground"
              )}
            >
              {isFocusStep ? "Next Step" : statusLabel}
            </p>
            {status === "done" && (
              <span className="text-[9px] font-semibold text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-full">
                Done
              </span>
            )}
          </div>
          <p className="text-sm font-semibold text-[#111A24] leading-snug">{step.label}</p>
          <p className="text-xs text-muted-foreground mt-1.5 leading-relaxed">{step.description}</p>
        </div>
        {isFocusStep && href && ctaLabel && step.key !== "completed" && (
          <Link
            href={href}
            className="shrink-0 inline-flex items-center gap-1.5 bg-[#b67c2c] hover:bg-[#9f6c27] text-white text-xs font-semibold px-3 py-2 rounded-lg transition-colors whitespace-nowrap self-center"
          >
            {ctaLabel}
            <ArrowRight size={12} />
          </Link>
        )}
      </div>
      <p className="text-[10px] text-muted-foreground/70 mt-2.5 pt-2.5 border-t border-gray-100/80">
        Tap any step above to view its details
      </p>
    </div>
  );
}

export function ProjectTimelineCompact({
  stage,
  assessmentSubmitted = false,
  nextStepHref,
  nextStepCtaLabel,
  className,
}: ProjectTimelineCompactProps) {
  const activeIndex = getEffectiveActiveIndex(stage, { assessmentSubmitted });
  const focusStep = getCurrentFocusStep(stage, { assessmentSubmitted });
  const focusIndex = PROJECT_STEPS.indexOf(focusStep);
  const isCompleted = normaliseStage(stage) === "completed";

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const displayIndex = selectedIndex ?? activeIndex;
  const displayStep = PROJECT_STEPS[displayIndex];
  const displayStatus = getStepStatus(displayIndex, activeIndex);
  const isFocusStep = displayIndex === focusIndex && !isCompleted;

  return (
    <div className={className}>
      <div className="flex items-start gap-0 overflow-x-auto py-2 px-1 -mx-1">
        {PROJECT_STEPS.map((step, idx) => (
          <CompactStepNode
            key={step.key}
            step={step}
            status={getStepStatus(idx, activeIndex)}
            isFirst={idx === 0}
            isLast={idx === PROJECT_STEPS.length - 1}
            isSelected={displayIndex === idx}
            onSelect={() => setSelectedIndex(idx === selectedIndex ? null : idx)}
          />
        ))}
      </div>

      <StepLegendPanel
        step={displayStep}
        status={displayStatus}
        isFocusStep={isFocusStep}
        href={nextStepHref}
        ctaLabel={nextStepCtaLabel}
      />
    </div>
  );
}
