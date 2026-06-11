import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { processCalendlyBooking } from "@/lib/calendly/process-booking";
import { fetchCalendlyInvitee, fetchCalendlyEvent } from "@/lib/calendly/api";

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" ? (value as Record<string, unknown>) : null;
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

/** Enriches the postMessage payload with real invitee/event data from the Calendly API. */
async function enrichFromCalendlyApi(
  inviteeUri: string | null,
  eventUri: string | null
): Promise<{
  email: string | null;
  name: string | null;
  scheduledAt: string | null;
  endedAt: string | null;
  joinUrl: string | null;
  formResponses: Array<{ question: string; answer: string; position: number }>;
  tracking: Record<string, string | null>;
}> {
  const hasApiKey = Boolean(process.env.CALENDLY_API_KEY?.trim());

  if (!hasApiKey) {
    return { email: null, name: null, scheduledAt: null, endedAt: null, joinUrl: null, formResponses: [], tracking: {} };
  }

  const [invitee, event] = await Promise.all([
    inviteeUri ? fetchCalendlyInvitee(inviteeUri) : null,
    eventUri ? fetchCalendlyEvent(eventUri) : null,
  ]);

  const formResponses = invitee?.questions_and_answers ?? [];
  const rawTracking = invitee?.tracking ?? {};
  const tracking: Record<string, string | null> = {
    utm_campaign: rawTracking.utm_campaign ?? null,
    utm_content: rawTracking.utm_content ?? null,
    utm_term: rawTracking.utm_term ?? null,
  };

  const joinUrl =
    event?.location?.join_url ??
    (typeof event?.location?.location === "string" ? event.location.location : null) ??
    null;

  return {
    email: invitee?.email ?? null,
    name: invitee?.name ?? null,
    scheduledAt: event?.start_time ?? null,
    endedAt: event?.end_time ?? null,
    joinUrl,
    formResponses,
    tracking,
  };
}

/** Normalize Calendly embed postMessage into webhook shape. */
async function normalizeBookingBody(body: Record<string, unknown>): Promise<{
  event?: string;
  payload?: Record<string, unknown>;
}> {
  const event = String(body.event ?? "");

  if (event !== "calendly.event_scheduled") {
    return {
      event: body.event as string | undefined,
      payload: asRecord(body.payload) ?? undefined,
    };
  }

  const rawPayload = asRecord(body.payload) ?? {};
  // Calendly embed postMessage format: payload.event.uri and payload.invitee.uri
  const legacyEventObj = asRecord(rawPayload.event);
  const legacyInviteeObj = asRecord(rawPayload.invitee);

  const inviteeUri =
    asString(rawPayload.invitee_uri) ??
    asString(legacyInviteeObj?.uri);
  const eventUri =
    asString(rawPayload.event_uri) ??
    asString(legacyEventObj?.uri);

  // Tracking from our own tracking param (service, leadId, email, name we passed)
  const clientTracking = asRecord(body.tracking) ?? {};

  // Fetch real data from Calendly API
  const enriched = await enrichFromCalendlyApi(inviteeUri, eventUri);

  // Merge: API data wins over client tracking, client tracking wins over nothing
  const email =
    enriched.email ??
    asString(clientTracking.email);
  const name =
    enriched.name ??
    asString(clientTracking.name);

  const tracking: Record<string, string | null> = {
    utm_content:
      asString(enriched.tracking.utm_content) ??
      asString(clientTracking.service),
    utm_campaign:
      asString(enriched.tracking.utm_campaign) ??
      asString(clientTracking.leadId),
    utm_term:
      asString(enriched.tracking.utm_term) ??
      asString(clientTracking.clientId),
  };

  const merged: Record<string, unknown> = {
    email,
    name,
    uri: inviteeUri,
    questions_and_answers: enriched.formResponses.length > 0 ? enriched.formResponses : null,
    scheduled_event: {
      uri: eventUri,
      start_time: enriched.scheduledAt,
      end_time: enriched.endedAt,
      location: enriched.joinUrl ? { join_url: enriched.joinUrl } : null,
    },
    tracking,
  };

  console.log("[sync-booking] normalized payload:", {
    email,
    name,
    scheduledAt: enriched.scheduledAt,
    service: tracking.utm_content,
    leadId: tracking.utm_campaign,
    hasApiKey: Boolean(process.env.CALENDLY_API_KEY?.trim()),
    inviteeUri,
    eventUri,
  });

  return { event: "invitee.created", payload: merged };
}

export async function POST(request: NextRequest) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const row = asRecord(body);
  if (!row) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  console.log("[sync-booking] received:", JSON.stringify(row).slice(0, 400));

  const normalized = await normalizeBookingBody(row);
  const admin = createAdminClient();
  const result = await processCalendlyBooking(admin, normalized);

  console.log("[sync-booking] result:", result);

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 500 });
  }

  if ("meetingId" in result && result.ok) {
    revalidatePath("/advisor/dashboard");
    revalidatePath("/advisor/leads");
    revalidatePath("/advisor/calls");
    if (result.leadId) revalidatePath(`/advisor/leads/${result.leadId}`);
  }

  return NextResponse.json(result);
}
