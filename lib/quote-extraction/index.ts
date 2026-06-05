import { mockExtractQuote } from "./mock";
import type { QuoteExtractionResult } from "./types";

/**
 * Quote extraction entry point.
 *
 * Today: mock only (no external API key required).
 *
 * Future production options (set QUOTE_EXTRACTION_PROVIDER):
 * - openai    -> GPT-4o vision / file API (needs OPENAI_API_KEY)
 * - document-ai -> Google Document AI or Azure Document Intelligence
 * - llamaparse -> LlamaParse + structured JSON output
 */
export async function extractQuoteFromFile(file: File): Promise<QuoteExtractionResult> {
  const provider = process.env.NEXT_PUBLIC_QUOTE_EXTRACTION_PROVIDER ?? "mock";

  switch (provider) {
    case "mock":
    default:
      return mockExtractQuote(file);
  }
}

export type { QuoteExtractionResult, ExtractedField, ExtractionConfidence } from "./types";
