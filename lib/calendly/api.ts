import { getCalendlyUserUri } from "@/lib/calendly/token";

const CALENDLY_API = "https://api.calendly.com";

export type CalendlyCustomQuestion = {
  name: string;
  type: string;
  position: number;
  required: boolean;
};

export type CalendlyEventType = {
  name: string;
  uri: string;
  scheduling_url: string;
  active: boolean;
  custom_questions: CalendlyCustomQuestion[];
};

export type CalendlyWebhookSubscription = {
  uri: string;
  callback_url: string;
  state: string;
  events: string[];
  scope: string;
};

function getApiKey(): string {
  const key = process.env.CALENDLY_API_KEY?.trim();
  if (!key) throw new Error("CALENDLY_API_KEY is not set.");
  return key;
}

function getOrganizationUri(userUri: string | null): string | null {
  const fromEnv = process.env.CALENDLY_ORGANIZATION_URI?.trim();
  if (fromEnv) return fromEnv;
  // Solo Calendly accounts often use the user URI as organization context.
  return userUri;
}

async function calendlyFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${CALENDLY_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${getApiKey()}`,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  const body = (await response.json()) as T & {
    title?: string;
    message?: string;
  };

  if (!response.ok) {
    throw new Error(
      body.message ?? body.title ?? `Calendly API error (${response.status})`
    );
  }

  return body;
}

export function getCalendlyConfig() {
  const apiKey = getApiKey();
  const userUri =
    process.env.CALENDLY_USER_URI?.trim() || getCalendlyUserUri(apiKey);
  const organizationUri = userUri ? getOrganizationUri(userUri) : null;
  const webhookUrl = `${(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "")}/api/calendly/webhook`;

  return { apiKey, userUri, organizationUri, webhookUrl };
}

export async function listEventTypes(userUri: string): Promise<CalendlyEventType[]> {
  const data = await calendlyFetch<{
    collection: Array<{
      name: string;
      uri: string;
      scheduling_url: string;
      active: boolean;
      custom_questions: CalendlyCustomQuestion[];
    }>;
  }>(`/event_types?user=${encodeURIComponent(userUri)}`);

  return data.collection ?? [];
}

export async function listWebhookSubscriptions(input: {
  organizationUri: string;
  userUri: string;
}): Promise<CalendlyWebhookSubscription[]> {
  const params = new URLSearchParams({
    organization: input.organizationUri,
    user: input.userUri,
    scope: "user",
  });

  const data = await calendlyFetch<{
    collection: CalendlyWebhookSubscription[];
  }>(`/webhook_subscriptions?${params.toString()}`);

  return data.collection ?? [];
}

export async function createWebhookSubscription(input: {
  organizationUri: string;
  userUri: string;
  callbackUrl: string;
}): Promise<CalendlyWebhookSubscription & { signing_key?: string }> {
  const data = await calendlyFetch<{
    resource: CalendlyWebhookSubscription & { signing_key?: string };
  }>("/webhook_subscriptions", {
    method: "POST",
    body: JSON.stringify({
      url: input.callbackUrl,
      events: ["invitee.created", "invitee.canceled"],
      organization: input.organizationUri,
      user: input.userUri,
      scope: "user",
    }),
  });

  return data.resource;
}

export type CalendlyInvitee = {
  uri: string;
  email: string;
  name: string;
  status: string;
  created_at: string;
  questions_and_answers: Array<{ question: string; answer: string; position: number }>;
  tracking: {
    utm_campaign?: string | null;
    utm_content?: string | null;
    utm_term?: string | null;
    utm_medium?: string | null;
    utm_source?: string | null;
  } | null;
};

export type CalendlyScheduledEvent = {
  uri: string;
  start_time: string;
  end_time: string;
  status: string;
  location?: {
    type?: string;
    join_url?: string;
    location?: string;
  } | null;
};

/**
 * Fetch a single invitee from Calendly API.
 * inviteeUri example: https://api.calendly.com/scheduled_events/XXX/invitees/YYY
 */
export async function fetchCalendlyInvitee(
  inviteeUri: string
): Promise<CalendlyInvitee | null> {
  try {
    const url = new URL(inviteeUri);
    const path = url.pathname + url.search;
    const data = await calendlyFetch<{ resource: CalendlyInvitee }>(path);
    return data.resource ?? null;
  } catch (err) {
    console.error("[fetchCalendlyInvitee]", err);
    return null;
  }
}

/**
 * Fetch a single scheduled event from Calendly API.
 * eventUri example: https://api.calendly.com/scheduled_events/XXX
 */
export async function fetchCalendlyEvent(
  eventUri: string
): Promise<CalendlyScheduledEvent | null> {
  try {
    const url = new URL(eventUri);
    const path = url.pathname + url.search;
    const data = await calendlyFetch<{ resource: CalendlyScheduledEvent }>(path);
    return data.resource ?? null;
  } catch (err) {
    console.error("[fetchCalendlyEvent]", err);
    return null;
  }
}

export async function ensureCalendlyWebhook(): Promise<{
  ok: true;
  created: boolean;
  callbackUrl: string;
  subscriptionUri?: string;
}> {
  const { userUri, organizationUri, webhookUrl } = getCalendlyConfig();

  if (!userUri) {
    throw new Error(
      "Could not resolve Calendly user URI. Set CALENDLY_USER_URI or use a valid CALENDLY_API_KEY."
    );
  }

  if (!organizationUri) {
    throw new Error(
      "CALENDLY_ORGANIZATION_URI is required to register webhooks. Add it to .env.local from Calendly Integrations > API and Webhooks."
    );
  }

  const existing = await listWebhookSubscriptions({
    organizationUri,
    userUri,
  });

  const match = existing.find(
    (item) => item.callback_url === webhookUrl && item.state === "active"
  );

  if (match) {
    return {
      ok: true,
      created: false,
      callbackUrl: webhookUrl,
      subscriptionUri: match.uri,
    };
  }

  const created = await createWebhookSubscription({
    organizationUri,
    userUri,
    callbackUrl: webhookUrl,
  });

  return {
    ok: true,
    created: true,
    callbackUrl: webhookUrl,
    subscriptionUri: created.uri,
  };
}
