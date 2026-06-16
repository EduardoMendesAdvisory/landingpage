"use server";

import { extractQuoteFromBuffer } from "@/lib/quote-extraction/extract-server";
import type { ExtractQuoteResponse } from "@/lib/quote-extraction/extract-server";

export async function extractQuoteFromUpload(
  formData: FormData
): Promise<ExtractQuoteResponse> {
  const file = formData.get("file");

  if (!(file instanceof File) || file.size === 0) {
    return {
      ok: false,
      code: "unsupported_format",
      message: "Please select a file to upload.",
    };
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  return extractQuoteFromBuffer({
    buffer,
    fileName: file.name,
    mimeType: file.type || undefined,
  });
}
