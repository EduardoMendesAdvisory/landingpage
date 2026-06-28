import { validateFile } from "@/utils/validators";
import { isExtractionSupportedExtension } from "./constants";
import { mapAiAnalysisToResult } from "./map-ai-response";
import {
  QuoteExtractionError,
  analyzeQuoteDocument,
} from "./openai-extract";
import type { QuoteExtractionResult } from "./types";

export type ExtractQuoteSuccess = {
  ok: true;
  result: QuoteExtractionResult;
};

export type ExtractQuoteFailure = {
  ok: false;
  code: QuoteExtractionError["code"];
  message: string;
};

export type ExtractQuoteResponse = ExtractQuoteSuccess | ExtractQuoteFailure;

export async function extractQuoteFromBuffer(input: {
  buffer: Buffer;
  fileName: string;
  mimeType?: string;
}): Promise<ExtractQuoteResponse> {
  const ext = input.fileName.split(".").pop()?.toLowerCase() ?? "";

  if (!isExtractionSupportedExtension(ext)) {
    return {
      ok: false,
      code: "unsupported_format",
      message:
        "Automatic quote review supports PDF or image files (PNG, JPG, WEBP). Please upload a PDF or clear photo of your builder quote.",
    };
  }

  const fileLike = {
    name: input.fileName,
    size: input.buffer.byteLength,
    type: input.mimeType ?? "",
  } as File;

  const validation = validateFile(fileLike, "lead");
  if (!validation.valid) {
    return {
      ok: false,
      code: "unsupported_format",
      message: validation.error,
    };
  }

  if (!process.env.OPENAI_API_KEY?.trim()) {
    return {
      ok: false,
      code: "manual_review",
      message:
        "Automatic document reading is not available yet. Your file will still be saved — please continue and enter your project details manually.",
    };
  }

  try {
    const analysis = await analyzeQuoteDocument({
      buffer: input.buffer,
      fileName: input.fileName,
      ext,
    });

    return {
      ok: true,
      result: mapAiAnalysisToResult(analysis, input.fileName),
    };
  } catch (error) {
    if (error instanceof QuoteExtractionError) {
      return {
        ok: false,
        code: error.code,
        message: error.message,
      };
    }

    console.error("[extractQuoteFromBuffer]", error);
    return {
      ok: false,
      code: "service_error",
      message: "Something went wrong while analysing your quote. Please try again.",
    };
  }
}
