export const DEFAULT_CALENDLY_URL =
  "https://calendly.com/eduardomendes-web/free-15-min-consultation";

export function getCalendlyBaseUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_CALENDLY_URL?.trim();
  return fromEnv || DEFAULT_CALENDLY_URL;
}

export type CalendlyUrlOptions = {
  service?: string | null;
  lead?: string | null;
  email?: string | null;
  name?: string | null;
  phone?: string | null;
  clientId?: string | null;
  /** Calendly custom answer slots, e.g. { a1: "0412345678" } */
  customAnswers?: Record<string, string>;
};

export function buildCalendlyUrl(
  baseUrl: string,
  options?: CalendlyUrlOptions
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
  if (options?.phone) {
    url.searchParams.set("phone", options.phone);
  }
  if (options?.customAnswers) {
    for (const [key, value] of Object.entries(options.customAnswers)) {
      if (value.trim()) url.searchParams.set(key, value.trim());
    }
  }
  return url.toString();
}
