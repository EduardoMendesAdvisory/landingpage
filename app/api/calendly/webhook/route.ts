import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

type CalendlyWebhookPayload = {
  event?: string;
  payload?: {
    event?: {
      uuid?: string;
      start_time?: string;
      end_time?: string;
    };
    invitee?: {
      email?: string;
      name?: string;
    };
    tracking?: {
      utm_term?: string;
      utm_campaign?: string;
    };
  };
};

function meetingDurationMinutes(start?: string, end?: string): number | null {
  if (!start || !end) return 30;
  const ms = new Date(end).getTime() - new Date(start).getTime();
  if (Number.isNaN(ms) || ms <= 0) return 30;
  return Math.round(ms / 60000);
}

export async function POST(request: NextRequest) {
  let body: CalendlyWebhookPayload;

  try {
    body = (await request.json()) as CalendlyWebhookPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventType = body.event ?? "";
  if (eventType !== "invitee.created" && eventType !== "invitee.canceled") {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const admin = createAdminClient();
  const tracking = body.payload?.tracking;
  const invitee = body.payload?.invitee;
  const event = body.payload?.event;

  let clientId = tracking?.utm_term?.trim() || null;
  let leadId = tracking?.utm_campaign?.trim() || null;

  if (!clientId && invitee?.email) {
    const { data: userRow } = await admin
      .from("users")
      .select("id")
      .eq("email", invitee.email.toLowerCase())
      .maybeSingle();

    if (userRow) {
      const userId = (userRow as { id: string }).id;
      const { data: clientRow } = await admin
        .from("clients")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();
      clientId = (clientRow as { id: string } | null)?.id ?? null;

      if (!leadId) {
        const { data: leadRow } = await admin
          .from("leads")
          .select("id")
          .eq("user_id", userId)
          .maybeSingle();
        leadId = (leadRow as { id: string } | null)?.id ?? null;
      }
    }
  }

  const calendlyEventId = event?.uuid ?? null;

  if (eventType === "invitee.canceled" && calendlyEventId) {
    await admin
      .from("meetings")
      .update({ status: "cancelled" })
      .eq("calendly_event_id", calendlyEventId);
    return NextResponse.json({ ok: true });
  }

  if (!clientId && !leadId) {
    return NextResponse.json({ ok: true, skipped: "no owner" });
  }

  if (calendlyEventId) {
    const { data: existing } = await admin
      .from("meetings")
      .select("id")
      .eq("calendly_event_id", calendlyEventId)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ ok: true, duplicate: true });
    }
  }

  const duration = meetingDurationMinutes(event?.start_time, event?.end_time);

  await admin.from("meetings").insert({
    client_id: clientId,
    lead_id: leadId,
    meeting_type: "strategy_call",
    scheduled_at: event?.start_time ?? null,
    duration_minutes: duration,
    status: "scheduled",
    calendly_event_id: calendlyEventId,
  } as never);

  return NextResponse.json({ ok: true });
}
