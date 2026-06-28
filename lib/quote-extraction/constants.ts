export const EXTRACTION_SUPPORTED_EXTENSIONS = [
  "pdf",
  "png",
  "jpg",
  "jpeg",
  "webp",
] as const;

export type ExtractionSupportedExtension =
  (typeof EXTRACTION_SUPPORTED_EXTENSIONS)[number];

export const PROJECT_TYPE_LABELS: Record<string, string> = {
  new_home_build: "New Home Build",
  major_renovation: "Major Renovation",
  addition_extension: "Extension",
  granny_flat: "Granny Flat",
  owner_builder: "Owner Builder",
  commercial_small: "Commercial",
};

export const STAGE_LABELS: Record<string, string> = {
  concept_idea: "Just starting out",
  early_planning: "Plans & design",
  getting_approvals: "Approvals",
  tendering_builders: "Getting quotes",
  design_stage: "Contract review",
  ready_to_build: "Ready to start",
  under_construction: "On site now",
  nearly_complete: "Something else",
};

export { BUDGET_LABELS, PROJECT_SCALE_LABELS } from "@/lib/assessment/budget-ranges";

export function amountToBudgetRange(amount: number): string {
  if (amount < 100_000) return "under_50k";
  if (amount < 300_000) return "50k_100k";
  if (amount < 500_000) return "100k_250k";
  if (amount < 1_000_000) return "250k_500k";
  if (amount < 2_000_000) return "500k_1m";
  return "over_1m";
}

export function formatAud(amount: number): string {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function isExtractionSupportedExtension(
  ext: string
): ext is ExtractionSupportedExtension {
  return (EXTRACTION_SUPPORTED_EXTENSIONS as readonly string[]).includes(ext);
}
