export type CalendlyFormResponse = {
  question: string;
  answer: string;
  position?: number;
};

export type ParsedCalendlyInvitee = {
  calendlyEventId: string | null;
  calendlyEventUrl: string | null;
  calendlyInviteeUri: string | null;
  inviteeEmail: string | null;
  inviteeName: string | null;
  scheduledAt: string | null;
  endedAt: string | null;
  durationMinutes: number | null;
  meetingUrl: string | null;
  serviceSlug: string | null;
  leadId: string | null;
  clientId: string | null;
  formResponses: CalendlyFormResponse[];
  canceled: boolean;
};

type CalendlyWebhookBody = {
  event?: string;
  payload?: Record<string, unknown>;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function eventUuidFromUri(uri: string | null): string | null {
  if (!uri) return null;
  const parts = uri.split("/");
  return parts[parts.length - 1] || null;
}

function meetingDurationMinutes(start?: string | null, end?: string | null): number | null {
  if (!start || !end) return 15;
  const ms = new Date(end).getTime() - new Date(start).getTime();
  if (Number.isNaN(ms) || ms <= 0) return 15;
  return Math.round(ms / 60000);
}

function parseFormResponses(raw: unknown): CalendlyFormResponse[] {
  if (!Array.isArray(raw)) return [];
  const results: CalendlyFormResponse[] = [];
  raw.forEach((item, index) => {
    const row = asRecord(item);
    if (!row) return;
    const question = asString(row.question);
    const answer = asString(row.answer);
    if (!question || !answer) return;
    results.push({
      question,
      answer,
      position: typeof row.position === "number" ? row.position : index,
    });
  });
  return results;
}

export function extractPhoneFromFormResponses(
  responses: CalendlyFormResponse[]
): string | null {
  for (const item of responses) {
    if (/phone|mobile|tel/i.test(item.question)) {
      return item.answer.trim() || null;
    }
  }
  return null;
}

export function parseCalendlyWebhook(body: CalendlyWebhookBody): ParsedCalendlyInvitee | null {
  const payload = asRecord(body.payload);
  if (!payload) return null;

  const legacyInvitee = asRecord(payload.invitee);
  const legacyEvent = asRecord(payload.event);
  const scheduledEvent = asRecord(payload.scheduled_event);
  const tracking = asRecord(payload.tracking);
  const location = scheduledEvent ? asRecord(scheduledEvent.location) : null;

  const inviteeEmail =
    asString(payload.email) ??
    asString(legacyInvitee?.email);
  const inviteeName =
    asString(payload.name) ??
    asString(legacyInvitee?.name);

  const scheduledAt =
    asString(scheduledEvent?.start_time) ??
    asString(legacyEvent?.start_time);
  const endedAt =
    asString(scheduledEvent?.end_time) ??
    asString(legacyEvent?.end_time);

  const calendlyEventUrl =
    asString(scheduledEvent?.uri) ??
    asString(legacyEvent?.uri);
  const calendlyEventId =
    asString(scheduledEvent?.uuid) ??
    asString(legacyEvent?.uuid) ??
    eventUuidFromUri(calendlyEventUrl);

  const calendlyInviteeUri =
    asString(payload.uri) ?? asString(legacyInvitee?.uri);

  const meetingUrl =
    asString(location?.join_url) ??
    asString(location?.location) ??
    asString(scheduledEvent?.location);

  const formResponses = parseFormResponses(payload.questions_and_answers);

  const leadId = asString(tracking?.utm_campaign);
  const clientId = asString(tracking?.utm_term);
  const serviceSlug = asString(tracking?.utm_content);

  const canceled =
    body.event === "invitee.canceled" ||
    asString(payload.status)?.toLowerCase() === "canceled";

  return {
    calendlyEventId,
    calendlyEventUrl,
    calendlyInviteeUri,
    inviteeEmail: inviteeEmail?.toLowerCase() ?? null,
    inviteeName,
    scheduledAt,
    endedAt,
    durationMinutes: meetingDurationMinutes(scheduledAt, endedAt),
    meetingUrl,
    serviceSlug,
    leadId,
    clientId,
    formResponses,
    canceled,
  };
}
