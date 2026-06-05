import type { QuoteExtractionResult } from "./types";

const MOCK_PROFILES = [
  {
    builderName: "Coastal Homes Pty Ltd",
    totalAmount: "$487,500",
    suburb: "Buderim",
    state: "QLD",
    postcode: "4556",
    projectType: "new_home_build",
    projectStage: "tendering_builders",
    budgetRange: "250k_500k",
  },
  {
    builderName: "Metro Build Group",
    totalAmount: "$312,000",
    suburb: "Ivanhoe",
    state: "VIC",
    postcode: "3079",
    projectType: "major_renovation",
    projectStage: "design_stage",
    budgetRange: "100k_250k",
  },
  {
    builderName: "Sunshine Constructions",
    totalAmount: "$625,000",
    suburb: "Noosa Heads",
    state: "QLD",
    postcode: "4567",
    projectType: "owner_builder",
    projectStage: "tendering_builders",
    budgetRange: "500k_1m",
  },
] as const;

const PROJECT_TYPE_LABELS: Record<string, string> = {
  new_home_build: "New Home Build",
  major_renovation: "Major Renovation",
  owner_builder: "Owner Builder",
};

const STAGE_LABELS: Record<string, string> = {
  tendering_builders: "Builder Quotes",
  design_stage: "Contract Stage",
};

const BUDGET_LABELS: Record<string, string> = {
  "100k_250k": "$100k - $250k",
  "250k_500k": "$250k - $500k",
  "500k_1m": "$500k - $1M",
};

function pickProfile(fileName: string) {
  let hash = 0;
  for (let i = 0; i < fileName.length; i++) {
    hash = (hash + fileName.charCodeAt(i)) % MOCK_PROFILES.length;
  }
  return MOCK_PROFILES[hash] ?? MOCK_PROFILES[0];
}

export async function mockExtractQuote(file: File): Promise<QuoteExtractionResult> {
  await new Promise((resolve) => setTimeout(resolve, 2800));

  const profile = pickProfile(file.name);

  return {
    source: "mock",
    fileName: file.name,
    fields: [
      { key: "builder", label: "Builder", value: profile.builderName, confidence: "high" },
      { key: "total", label: "Quote Total", value: profile.totalAmount, confidence: "high" },
      { key: "suburb", label: "Suburb", value: profile.suburb, confidence: "medium" },
      { key: "state", label: "State", value: profile.state, confidence: "high" },
      { key: "projectType", label: "Project Type", value: PROJECT_TYPE_LABELS[profile.projectType] ?? profile.projectType, confidence: "medium" },
      { key: "stage", label: "Project Stage", value: STAGE_LABELS[profile.projectStage] ?? profile.projectStage, confidence: "medium" },
      { key: "budget", label: "Budget Range", value: BUDGET_LABELS[profile.budgetRange] ?? profile.budgetRange, confidence: "high" },
    ],
    wizardPrefill: {
      suburb: profile.suburb,
      state: profile.state,
      postcode: profile.postcode,
      projectType: profile.projectType,
      projectStage: profile.projectStage,
      budgetRange: profile.budgetRange,
      hasQuote: true,
      quoteFileName: file.name,
    },
  };
}
