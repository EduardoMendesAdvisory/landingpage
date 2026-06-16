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
  concept_idea: "Just Researching",
  early_planning: "Plans & Design",
  getting_approvals: "Council Approvals",
  tendering_builders: "Builder Quotes",
  design_stage: "Contract Stage",
  under_construction: "Construction",
  ready_to_build: "Renovation Planning",
  nearly_complete: "Other",
};

export const BUDGET_LABELS: Record<string, string> = {
  under_50k: "Under $100k",
  "50k_100k": "$100k - $300k",
  "100k_250k": "$300k - $500k",
  "250k_500k": "$500k - $1M",
  "500k_1m": "$1M - $2M",
  over_1m: "$2M+",
  not_sure: "Not Sure Yet",
};

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
