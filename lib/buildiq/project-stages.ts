// Single source of truth for the 7-step client journey.

export type ProjectStage =
  | "project_assessment"
  | "strategy_session"
  | "service_engagement"
  | "detailed_review"
  | "action_plan_delivered"
  | "advisory_support"
  | "completed";

export type StepDefinition = {
  key: ProjectStage;
  label: string;
  /** Legend text shown below each step. */
  description: string;
};

export const PROJECT_STEPS: StepDefinition[] = [
  {
    key: "project_assessment",
    label: "Project Assessment",
    description:
      "Your project information, documents, and assessment details have been submitted and recorded.",
  },
  {
    key: "strategy_session",
    label: "Strategy Session",
    description:
      "A consultation session with Eduardo Mendes to discuss your project, goals, challenges, and recommended direction.",
  },
  {
    key: "service_engagement",
    label: "Service Engagement",
    description:
      "Your selected service has been confirmed and activated, allowing work to commence.",
  },
  {
    key: "detailed_review",
    label: "Detailed Review",
    description:
      "A detailed review of your documents, plans, quotations, contracts, or project information is underway.",
  },
  {
    key: "action_plan_delivered",
    label: "Action Plan Delivered",
    description:
      "Recommendations, findings, and strategic guidance have been prepared and delivered for your review.",
  },
  {
    key: "advisory_support",
    label: "Advisory Support",
    description:
      "Ongoing support, clarification, and additional guidance are being provided as required.",
  },
  {
    key: "completed",
    label: "Completed",
    description:
      "All agreed services have been delivered and the project has been successfully concluded.",
  },
];

export function getStepIndex(stage: string | null | undefined): number {
  if (!stage) return 0;
  const idx = PROJECT_STEPS.findIndex((s) => s.key === stage);
  return idx >= 0 ? idx : 0;
}

export function isValidStage(value: unknown): value is ProjectStage {
  return typeof value === "string" && PROJECT_STEPS.some((s) => s.key === value);
}

export function normaliseStage(stage: string | null | undefined): ProjectStage | null {
  if (!stage) return null;
  const LEGACY: Record<string, ProjectStage> = {
    assessment: "project_assessment",
    strategy_call: "strategy_session",
    quote_review: "detailed_review",
    builder_selection: "detailed_review",
    construction_support: "advisory_support",
  };
  if (isValidStage(stage)) return stage;
  return LEGACY[stage] ?? null;
}

export function getEffectiveActiveIndex(
  stage: string | null | undefined,
  options?: { assessmentSubmitted?: boolean }
): number {
  const base = getStepIndex(normaliseStage(stage));
  if (options?.assessmentSubmitted && base === 0) return 1;
  return base;
}

export function getCurrentFocusStep(
  stage: string | null | undefined,
  options?: { assessmentSubmitted?: boolean }
): StepDefinition {
  const idx = getEffectiveActiveIndex(stage, options);
  return PROJECT_STEPS[Math.min(idx, PROJECT_STEPS.length - 1)];
}

export function getNextStepCta(
  stage: string | null | undefined,
  options?: { assessmentSubmitted?: boolean }
): { href: string; label: string } | null {
  const focus = getCurrentFocusStep(stage, options);
  const CTAS: Partial<Record<ProjectStage, { href: string; label: string }>> = {
    project_assessment: { href: "/assessment", label: "Complete Assessment" },
    strategy_session: { href: "/buildiq/meetings", label: "Book Strategy Call" },
    service_engagement: { href: "/buildiq/documents", label: "Upload Documents" },
    detailed_review: { href: "/buildiq/documents", label: "Upload Documents" },
    action_plan_delivered: { href: "/buildiq/documents", label: "View Documents" },
    advisory_support: { href: "/buildiq/meetings", label: "Book Meeting" },
  };
  return CTAS[focus.key] ?? null;
}

export type StepStatus = "done" | "active" | "upcoming";

export function getStepStatus(stepIndex: number, activeIndex: number): StepStatus {
  if (stepIndex < activeIndex) return "done";
  if (stepIndex === activeIndex) return "active";
  return "upcoming";
}
