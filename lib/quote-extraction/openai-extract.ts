import {
  QUOTE_ANALYSIS_JSON_SCHEMA,
  QUOTE_ANALYSIS_SYSTEM_PROMPT,
} from "./prompt";
import type { ExtractionConfidence } from "./types";

export type QuoteExtractionFailureCode =
  | "not_a_quote"
  | "unsupported_format"
  | "unreadable"
  | "config_error"
  | "service_error";

export class QuoteExtractionError extends Error {
  constructor(
    public code: QuoteExtractionFailureCode,
    message: string
  ) {
    super(message);
    this.name = "QuoteExtractionError";
  }
}

export interface AiQuoteAnalysis {
  document_type: "builder_quote" | "other";
  rejection_reason: string | null;
  builder_name: string | null;
  quote_total_aud: number | null;
  suburb: string | null;
  state: string | null;
  postcode: string | null;
  project_type:
    | "new_home_build"
    | "major_renovation"
    | "addition_extension"
    | "granny_flat"
    | "owner_builder"
    | "commercial_small"
    | null;
  project_stage:
    | "concept_idea"
    | "early_planning"
    | "design_stage"
    | "getting_approvals"
    | "tendering_builders"
    | "ready_to_build"
    | "under_construction"
    | "nearly_complete"
    | null;
  confidence: {
    overall: ExtractionConfidence;
    is_builder_quote: ExtractionConfidence;
  };
}

const IMAGE_MIME: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  pdf: "application/pdf",
};

function getOpenAiConfig() {
  const apiKey = process.env.OPENAI_API_KEY?.trim();
  if (!apiKey) {
    throw new QuoteExtractionError(
      "config_error",
      "Quote analysis is not configured. Please contact support."
    );
  }

  return {
    apiKey,
    model: process.env.OPENAI_QUOTE_MODEL?.trim() || "gpt-4o",
  };
}

function buildUserContent(
  buffer: Buffer,
  ext: string,
  fileName: string
): Array<Record<string, unknown>> {
  const mime = IMAGE_MIME[ext] ?? "application/octet-stream";
  const base64 = buffer.toString("base64");
  const dataUrl = `data:${mime};base64,${base64}`;

  if (ext === "pdf") {
    return [
      {
        type: "file",
        file: {
          filename: fileName,
          file_data: dataUrl,
        },
      },
      {
        type: "text",
        text: "Analyse this document and return structured JSON.",
      },
    ];
  }

  return [
    {
      type: "image_url",
      image_url: {
        url: dataUrl,
        detail: "high",
      },
    },
    {
      type: "text",
      text: "Analyse this image and return structured JSON.",
    },
  ];
}

function parseAnalysis(content: string): AiQuoteAnalysis {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new QuoteExtractionError(
      "service_error",
      "We could not process the analysis response. Please try again."
    );
  }

  const data = parsed as Partial<AiQuoteAnalysis>;
  if (
    !data ||
    (data.document_type !== "builder_quote" && data.document_type !== "other") ||
    !data.confidence?.is_builder_quote
  ) {
    throw new QuoteExtractionError(
      "service_error",
      "We could not process the analysis response. Please try again."
    );
  }

  return data as AiQuoteAnalysis;
}

function validateAnalysis(analysis: AiQuoteAnalysis): void {
  const quoteConfidence = analysis.confidence.is_builder_quote;

  if (analysis.document_type === "other") {
    throw new QuoteExtractionError(
      "not_a_quote",
      analysis.rejection_reason?.trim() ||
        "This file does not appear to be a builder quote. Please upload your builder quote as a PDF or clear photo."
    );
  }

  if (quoteConfidence === "low") {
    throw new QuoteExtractionError(
      "not_a_quote",
      analysis.rejection_reason?.trim() ||
        "We could not identify this as a builder quote. Please upload a clear PDF or photo of your builder quote."
    );
  }

  const hasSignal =
    analysis.quote_total_aud != null ||
    !!analysis.builder_name?.trim() ||
    !!analysis.suburb?.trim();

  if (!hasSignal && quoteConfidence !== "high") {
    throw new QuoteExtractionError(
      "unreadable",
      "We could not read enough detail from this file. Please upload a clearer builder quote (PDF or photo)."
    );
  }
}

export async function analyzeQuoteDocument(input: {
  buffer: Buffer;
  fileName: string;
  ext: string;
}): Promise<AiQuoteAnalysis> {
  const { apiKey, model } = getOpenAiConfig();
  const userContent = buildUserContent(input.buffer, input.ext, input.fileName);

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model,
      temperature: 0.1,
      max_tokens: 1200,
      messages: [
        { role: "system", content: QUOTE_ANALYSIS_SYSTEM_PROMPT },
        { role: "user", content: userContent },
      ],
      response_format: {
        type: "json_schema",
        json_schema: QUOTE_ANALYSIS_JSON_SCHEMA,
      },
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    console.error("[quote-extraction] OpenAI error:", response.status, detail);

    if (response.status === 401 || response.status === 403) {
      throw new QuoteExtractionError(
        "config_error",
        "Quote analysis is temporarily unavailable. Please try again later."
      );
    }

    throw new QuoteExtractionError(
      "service_error",
      "We could not analyse your document right now. Please try again in a moment."
    );
  }

  const payload = (await response.json()) as {
    choices?: Array<{ message?: { content?: string | null } }>;
  };

  const content = payload.choices?.[0]?.message?.content;
  if (!content) {
    throw new QuoteExtractionError(
      "service_error",
      "We could not analyse your document. Please try again."
    );
  }

  const analysis = parseAnalysis(content);
  validateAnalysis(analysis);
  return analysis;
}
