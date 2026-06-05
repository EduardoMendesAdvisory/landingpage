export interface QuoteWizardPrefill {
  projectType?: string;
  projectSubtype?: string;
  landType?: string;
  suburb?: string;
  state?: string;
  postcode?: string;
  projectStage?: string;
  budgetRange?: string;
  finishLevel?: string;
  hasQuote?: boolean;
  quoteFileName?: string;
  uploadedQuoteUrl?: string;
}

export type ExtractionConfidence = "high" | "medium" | "low";

export interface ExtractedField {
  key: string;
  label: string;
  value: string;
  confidence: ExtractionConfidence;
}

export interface QuoteExtractionResult {
  source: "mock" | "openai" | "document-ai";
  fileName: string;
  fields: ExtractedField[];
  wizardPrefill: QuoteWizardPrefill;
}

export type QuoteExtractionProvider = "mock" | "openai";
