import { PUBLIC_SERVICES } from "@/lib/services-catalog";

export const DEFAULT_PAYMENT_INSTRUCTIONS =
  process.env.INVOICE_PAYMENT_INSTRUCTIONS ??
  [
    "Payment by bank transfer (EFT).",
    "",
    "Please use your full name as the payment reference.",
    "",
    "Bank details will be confirmed by Eduardo upon receipt of this invoice.",
    "",
    "Questions? Reply to this email or contact contact@eduardomendes.com.au",
  ].join("\n");

export function serviceNameFromSlug(slug: string): string {
  const match = PUBLIC_SERVICES.find((s) => s.slug === slug);
  return match?.name ?? slug.replace(/-/g, " ");
}
