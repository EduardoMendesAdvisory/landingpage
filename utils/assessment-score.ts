/**
 * Assessment Scoring Formula — BR-01
 *
 * Deterministic weighted score based on four factors.
 * Each factor returns 0–100. Final score = average of all four.
 * No AI — pure lookup table. Explainable to Eduardo.
 */

export type ScoreInput = {
  projectType: string;
  projectStage: string;
  budgetRange: string;
  state: string;
};

function projectTypeScore(projectType: string): number {
  const scores: Record<string, number> = {
    new_home_build: 90,
    major_renovation: 80,
    addition_extension: 75,
    granny_flat: 70,
    owner_builder: 85,
    commercial_small: 65,
  };
  return scores[projectType] ?? 60;
}

function projectStageScore(projectStage: string): number {
  const scores: Record<string, number> = {
    concept_idea: 20,
    early_planning: 35,
    design_stage: 55,
    getting_approvals: 65,
    tendering_builders: 80,
    ready_to_build: 90,
    under_construction: 75,
    nearly_complete: 95,
  };
  return scores[projectStage] ?? 40;
}

function budgetRangeScore(budgetRange: string): number {
  const scores: Record<string, number> = {
    under_50k: 30,
    "50k_100k": 45,
    "100k_250k": 60,
    "250k_500k": 75,
    "500k_1m": 85,
    over_1m: 90,
    not_sure: 25,
  };
  return scores[budgetRange] ?? 40;
}

function stateScore(state: string): number {
  const scores: Record<string, number> = {
    NSW: 90,
    VIC: 90,
    QLD: 85,
    SA: 80,
    WA: 75,
    ACT: 85,
    TAS: 70,
    NT: 65,
    OTHER: 60,
  };
  return scores[state?.toUpperCase()] ?? 70;
}

export function calculateAssessmentScore(input: ScoreInput): number {
  const scores = [
    projectTypeScore(input.projectType),
    projectStageScore(input.projectStage),
    budgetRangeScore(input.budgetRange),
    stateScore(input.state),
  ];

  const average = scores.reduce((sum, s) => sum + s, 0) / scores.length;
  return Math.round(average);
}

export type ScoreLabel = {
  label: string;
  description: string;
  colour: "success" | "warning" | "destructive" | "primary";
};

export function getScoreLabel(score: number): ScoreLabel {
  if (score >= 75) {
    return {
      label: "Strong Readiness",
      description:
        "Your project is well-positioned for advisory support. Eduardo can add significant value at this stage.",
      colour: "success",
    };
  }
  if (score >= 55) {
    return {
      label: "Good Readiness",
      description:
        "Your project is progressing well. A strategy call will clarify the best next steps.",
      colour: "primary",
    };
  }
  if (score >= 35) {
    return {
      label: "Early Stage",
      description:
        "Your project is in the early stages. Eduardo can help you build a solid foundation before committing to builders.",
      colour: "warning",
    };
  }
  return {
    label: "Planning Phase",
    description:
      "You're at the start of your journey. This is the perfect time to speak with Eduardo before making key decisions.",
    colour: "destructive",
  };
}
