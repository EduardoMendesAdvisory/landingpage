import type { WizardData } from "@/features/assessment/components/AssessmentWizard";
import { calculateAssessmentScore } from "@/utils/assessment-score";

/** Indicative optimisation range (%), keyed like budget tiers - not a dollar promise. */
const BUDGET_SAVINGS_PERCENT: Record<string, [number, number]> = {
  under_50k: [3, 8],
  "50k_100k": [4, 10],
  "100k_250k": [5, 12],
  "250k_500k": [5, 12],
  "500k_1m": [5, 12],
  over_1m: [4, 10],
  not_sure: [3, 8],
};

export function computePreliminaryMetrics(data: WizardData): {
  savingsPercentMin: number;
  savingsPercentMax: number;
  riskCount: number;
  recommendedActionsCount: number;
  benchmarkPosition: string;
} {
  const [savingsPercentMin, savingsPercentMax] =
    BUDGET_SAVINGS_PERCENT[data.budgetRange] ?? [5, 12];

  const riskFactors = [
    data.projectType === "owner_builder",
    data.projectStage === "concept_idea" || data.projectStage === "early_planning",
    data.budgetRange === "not_sure",
    data.landType === "not_sure",
    !data.suburb,
  ];
  const riskCount = riskFactors.filter(Boolean).length + 2;

  const recommendedActionsCount = Math.min(riskCount + 3, 9);

  const score = calculateAssessmentScore({
    projectType: data.projectType,
    projectStage: data.projectStage,
    budgetRange: data.budgetRange,
    state: data.state,
  });

  const benchmarkPosition =
    score >= 80
      ? "Well Above Average"
      : score >= 65
        ? "Above Average"
        : score >= 50
          ? "Average"
          : "Below Average";

  return {
    savingsPercentMin,
    savingsPercentMax,
    riskCount,
    recommendedActionsCount,
    benchmarkPosition,
  };
}

/** Legacy rows may store dollar amounts (>100); values <=100 are treated as percentages. */
export function normalizeSavingsPercent(
  min: number | null | undefined,
  max: number | null | undefined
): { min: number; max: number } {
  const safeMin = min ?? 5;
  const safeMax = max ?? 12;

  if (safeMin > 100 || safeMax > 100) {
    return { min: 5, max: 12 };
  }

  return {
    min: Math.min(safeMin, safeMax),
    max: Math.max(safeMin, safeMax),
  };
}

export function formatSavingsPercentRange(min: number, max: number): string {
  if (min === max) return `Up to ${max}%`;
  return `${min}% - ${max}%`;
}
