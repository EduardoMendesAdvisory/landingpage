import {
  ensureCalendlyWebhook,
  getCalendlyConfig,
  listEventTypes,
} from "@/lib/calendly/api";
import { getCalendlyTokenScopes } from "@/lib/calendly/token";
import { getCalendlyBaseUrl } from "@/lib/calendly";

export type CalendlySetupResult =
  | {
      ok: true;
      webhook: { created: boolean; callbackUrl: string };
      eventTypes: Array<{ name: string; scheduling_url: string; active: boolean }>;
      configuredUrl: string;
      urlMatch: boolean;
    }
  | { ok: false; error: string };

export async function runCalendlySetup(): Promise<CalendlySetupResult> {
  try {
    const { userUri, webhookUrl, apiKey } = getCalendlyConfig();
    if (!userUri) {
      return { ok: false, error: "CALENDLY_API_KEY invalid or CALENDLY_USER_URI missing." };
    }

    const scopes = getCalendlyTokenScopes(apiKey);
    if (!scopes.includes("webhooks:write")) {
      return {
        ok: false,
        error: "Calendly token needs webhooks:write scope to register the webhook.",
      };
    }

    const eventTypes = await listEventTypes(userUri);
    const configuredUrl = getCalendlyBaseUrl().split("?")[0];
    const urlMatch = eventTypes.some(
      (et) =>
        et.active &&
        (configuredUrl === et.scheduling_url ||
          configuredUrl.endsWith(et.scheduling_url.split("/").pop() ?? ""))
    );

    const webhook = await ensureCalendlyWebhook();

    return {
      ok: true,
      webhook: { created: webhook.created, callbackUrl: webhookUrl },
      eventTypes: eventTypes.map((et) => ({
        name: et.name,
        scheduling_url: et.scheduling_url,
        active: et.active,
      })),
      configuredUrl,
      urlMatch,
    };
  } catch (error) {
    return {
      ok: false,
      error: error instanceof Error ? error.message : "Calendly setup failed.",
    };
  }
}

export async function getCalendlyQuestionsForConfiguredEvent() {
  const { userUri } = getCalendlyConfig();
  if (!userUri || !process.env.CALENDLY_API_KEY?.trim()) return [];

  const base = getCalendlyBaseUrl().split("?")[0];
  const eventTypes = await listEventTypes(userUri);
  const match = eventTypes.find(
    (et) => et.scheduling_url === base || base.includes(et.scheduling_url)
  );

  return match?.custom_questions ?? [];
}
