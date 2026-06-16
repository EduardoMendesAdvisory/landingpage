import { normalizeOnboardingState } from "@/lib/assessment/states";
import {
  BUDGET_LABELS,
  PROJECT_TYPE_LABELS,
  STAGE_LABELS,
  amountToBudgetRange,
  formatAud,
} from "./constants";
import type { AiQuoteAnalysis } from "./openai-extract";
import type {
  ExtractionConfidence,
  ExtractedField,
  QuoteExtractionResult,
} from "./types";

function fieldConfidence(
  value: string | number | null | undefined,
  fallback: ExtractionConfidence
): ExtractionConfidence {
  if (value == null || value === "") return "low";
  return fallback;
}

export function mapAiAnalysisToResult(
  analysis: AiQuoteAnalysis,
  fileName: string
): QuoteExtractionResult {
  const overall = analysis.confidence.overall;
  const budgetRange =
    analysis.quote_total_aud != null
      ? amountToBudgetRange(analysis.quote_total_aud)
      : undefined;

  const projectType = analysis.project_type ?? undefined;
  const projectStage = analysis.project_stage ?? "tendering_builders";
  const state = normalizeOnboardingState(analysis.state ?? undefined);

  const fields: ExtractedField[] = [];

  if (analysis.builder_name) {
    fields.push({
      key: "builder",
      label: "Builder",
      value: analysis.builder_name,
      confidence: fieldConfidence(analysis.builder_name, overall),
    });
  }

  if (analysis.quote_total_aud != null) {
    fields.push({
      key: "total",
      label: "Quote Total",
      value: formatAud(analysis.quote_total_aud),
      confidence: fieldConfidence(analysis.quote_total_aud, overall),
    });
  }

  if (analysis.suburb) {
    fields.push({
      key: "suburb",
      label: "Suburb",
      value: analysis.suburb,
      confidence: fieldConfidence(analysis.suburb, overall),
    });
  }

  if (state) {
    fields.push({
      key: "state",
      label: "State",
      value: state,
      confidence: fieldConfidence(analysis.state, overall),
    });
  }

  if (projectType) {
    fields.push({
      key: "projectType",
      label: "Project Type",
      value: PROJECT_TYPE_LABELS[projectType] ?? projectType,
      confidence: fieldConfidence(projectType, overall),
    });
  }

  fields.push({
    key: "stage",
    label: "Project Stage",
    value: STAGE_LABELS[projectStage] ?? projectStage,
    confidence: fieldConfidence(projectStage, overall),
  });

  if (budgetRange) {
    fields.push({
      key: "budget",
      label: "Budget Range",
      value: BUDGET_LABELS[budgetRange] ?? budgetRange,
      confidence: fieldConfidence(analysis.quote_total_aud, overall),
    });
  }

  return {
    source: "openai",
    fileName,
    fields,
    wizardPrefill: {
      suburb: analysis.suburb ?? undefined,
      state,
      postcode: analysis.postcode ?? undefined,
      projectType,
      projectStage,
      budgetRange,
      hasQuote: true,
      quoteFileName: fileName,
    },
  };
}
