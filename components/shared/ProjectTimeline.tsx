import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  PROJECT_STEPS,
  getEffectiveActiveIndex,
  getStepStatus,
} from "@/lib/buildiq/project-stages";
import { ProjectTimelineCompact } from "@/components/shared/ProjectTimelineCompact";

export type TimelineSize = "compact" | "full";

interface ProjectTimelineProps {
  stage: string | null | undefined;
  size?: TimelineSize;
  className?: string;
  assessmentSubmitted?: boolean;
  nextStepHref?: string;
  nextStepCtaLabel?: string;
}

function FullStep({
  step,
  status,
  isLast,
}: {
  step: (typeof PROJECT_STEPS)[number];
  status: "done" | "active" | "upcoming";
  isLast: boolean;
}) {
  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div
          className={cn(
            "h-9 w-9 rounded-full flex items-center justify-center shrink-0 border-2 transition-colors",
            status === "done"
              ? "bg-green-500 border-green-500"
              : status === "active"
                ? "bg-white border-[#b67c2c] shadow-[0_0_0_3px_rgba(182,124,44,0.15)]"
                : "bg-white border-gray-200"
          )}
        >
          {status === "done" ? (
            <CheckCircle2 size={16} className="text-white" />
          ) : status === "active" ? (
            <div className="h-3 w-3 rounded-full bg-[#b67c2c]" />
          ) : (
            <Circle size={14} className="text-gray-300" />
          )}
        </div>
        {!isLast && (
          <div
            className={cn(
              "w-0.5 flex-1 mt-1 min-h-[28px]",
              status === "done" ? "bg-green-500" : "bg-gray-200"
            )}
          />
        )}
      </div>
      <div className="pb-5">
        <div className="flex items-center gap-2 mb-1">
          <p
            className={cn(
              "text-sm font-semibold leading-snug",
              status === "active"
                ? "text-[#b67c2c]"
                : status === "done"
                  ? "text-[#111A24]"
                  : "text-gray-400"
            )}
          >
            {step.label}
          </p>
          {status === "active" && (
            <span className="text-[9px] font-bold uppercase tracking-wider text-white bg-[#b67c2c] px-1.5 py-0.5 rounded-full">
              Active
            </span>
          )}
          {status === "done" && (
            <span className="text-[9px] font-bold uppercase tracking-wider text-green-700 bg-green-50 border border-green-200 px-1.5 py-0.5 rounded-full">
              Done
            </span>
          )}
        </div>
        <p
          className={cn(
            "text-xs leading-relaxed max-w-prose",
            status === "upcoming" ? "text-gray-300" : "text-muted-foreground"
          )}
        >
          {step.description}
        </p>
      </div>
    </div>
  );
}

export function ProjectTimeline({
  stage,
  size = "compact",
  className,
  assessmentSubmitted = false,
  nextStepHref,
  nextStepCtaLabel,
}: ProjectTimelineProps) {
  const activeIndex = getEffectiveActiveIndex(stage, { assessmentSubmitted });

  if (size === "full") {
    return (
      <div className={cn("space-y-0", className)}>
        {PROJECT_STEPS.map((step, idx) => (
          <FullStep
            key={step.key}
            step={step}
            status={getStepStatus(idx, activeIndex)}
            isLast={idx === PROJECT_STEPS.length - 1}
          />
        ))}
      </div>
    );
  }

  return (
    <ProjectTimelineCompact
      stage={stage}
      assessmentSubmitted={assessmentSubmitted}
      nextStepHref={nextStepHref}
      nextStepCtaLabel={nextStepCtaLabel}
      className={className}
    />
  );
}
