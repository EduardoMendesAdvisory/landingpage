export const DEFAULT_CALENDLY_URL =
  "https://calendly.com/eduardomendes-web/free-15-min-consultation";

export function getCalendlyBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_CALENDLY_URL?.trim();
  return fromEnv || DEFAULT_CALENDLY_URL;
}

export function buildCalendlyUrl(
  baseUrl: string,
  options?: { service?: string | null; lead?: string | null }
): string {
  const url = new URL(baseUrl);
  if (options?.service) {
    url.searchParams.set("utm_content", options.service);
  }
  if (options?.lead) {
    url.searchParams.set("utm_campaign", options.lead);
  }
  return url.toString();
}
