export const DEFAULT_CALENDLY_URL =
  "https://calendly.com/eduardomendes-web/free-15-min-consultation";

export function getCalendlyBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_CALENDLY_URL?.trim();
  return fromEnv || DEFAULT_CALENDLY_URL;
}

export function buildCalendlyUrl(
  baseUrl: string,
  options?: {
    service?: string | null;
    lead?: string | null;
    email?: string | null;
    name?: string | null;
    clientId?: string | null;
  }
): string {
  const url = new URL(baseUrl);
  if (options?.service) {
    url.searchParams.set("utm_content", options.service);
  }
  if (options?.lead) {
    url.searchParams.set("utm_campaign", options.lead);
  }
  if (options?.clientId) {
    url.searchParams.set("utm_term", options.clientId);
  }
  if (options?.email) {
    url.searchParams.set("email", options.email);
  }
  if (options?.name) {
    url.searchParams.set("name", options.name);
  }
  return url.toString();
}
