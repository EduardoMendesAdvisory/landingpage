/** In-memory store for a quote file selected before entering the assessment flow. */
let pendingQuoteFile: File | null = null;

export function setPendingQuote(file: File): void {
  pendingQuoteFile = file;
}

export function peekPendingQuote(): File | null {
  return pendingQuoteFile;
}

export function consumePendingQuote(): File | null {
  const file = pendingQuoteFile;
  pendingQuoteFile = null;
  return file;
}

export function clearPendingQuote(): void {
  pendingQuoteFile = null;
}
