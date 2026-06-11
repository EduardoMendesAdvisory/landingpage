export const INVOICE_BANK_DETAILS_KEY = "invoice_bank_details";

export type InvoiceBankDetails = {
  accountName: string;
  bsb: string;
  accountNumber: string;
  bankName?: string;
};

export function formatBsb(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 6);
  if (digits.length <= 3) return digits;
  return `${digits.slice(0, 3)}-${digits.slice(3)}`;
}

export function isValidBankDetails(details: InvoiceBankDetails): boolean {
  const bsbDigits = details.bsb.replace(/\D/g, "");
  const accountDigits = details.accountNumber.replace(/\D/g, "");
  return (
    details.accountName.trim().length > 0 &&
    bsbDigits.length === 6 &&
    accountDigits.length >= 6
  );
}

export function formatPaymentInstructions(
  details: InvoiceBankDetails,
  recipientName?: string
): string {
  const bsb = formatBsb(details.bsb);
  const reference = recipientName?.trim() || "your full name";

  return [
    "Payment by bank transfer (EFT).",
    "",
    details.bankName?.trim() ? `Bank: ${details.bankName.trim()}` : null,
    `Account name: ${details.accountName.trim()}`,
    `BSB: ${bsb}`,
    `Account number: ${details.accountNumber.trim()}`,
    "",
    `Please use ${reference} as the payment reference.`,
    "",
    "Questions? Reply to this email or contact contact@eduardomendes.com.au",
  ]
    .filter((line): line is string => line !== null)
    .join("\n");
}

export function parseSavedBankDetails(value: unknown): InvoiceBankDetails | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Record<string, unknown>;
  const accountName = typeof row.accountName === "string" ? row.accountName : "";
  const bsb = typeof row.bsb === "string" ? row.bsb : "";
  const accountNumber =
    typeof row.accountNumber === "string" ? row.accountNumber : "";
  const bankName = typeof row.bankName === "string" ? row.bankName : undefined;

  if (!accountName && !bsb && !accountNumber) return null;

  return { accountName, bsb, accountNumber, bankName };
}
