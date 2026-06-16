import type { createAdminClient } from "@/lib/supabase/admin";
import {
  extractPhoneFromFormResponses,
  parseCalendlyWebhook,
} from "@/lib/calendly/parse-webhook";
import { notifyAdvisors } from "@/lib/notifications/advisor-notify";
import { sendMeetingBookingConfirmationEmail } from "@/lib/emails/templates";
import { STRATEGY_CALL_DURATION_MINUTES } from "@/lib/meetings/constants";

type AdminClient = ReturnType<typeof createAdminClient>;

export type ProcessBookingResult =
  | { ok: true; meetingId: string; leadId: string | null; created: boolean }
  | { ok: true; skipped: true; reason: string }
  | { ok: true; duplicate: true }
  | { error: string };

async function resolveLeadAndClient(
  admin: AdminClient,
  parsed: {
    leadId: string | null;
    clientId: string | null;
    inviteeEmail: string | null;
  }
): Promise<{ leadId: string | null; clientId: string | null }> {
  let leadId = parsed.leadId;
  let clientId = parsed.clientId;

  if (!clientId && parsed.inviteeEmail) {
    const { data: userRow } = await admin
      .from("users")
      .select("id")
      .eq("email", parsed.inviteeEmail)
      .maybeSingle();

    if (userRow) {
      const userId = (userRow as { id: string }).id;
      const { data: clientRow } = await admin
        .from("clients")
        .select("id")
        .eq("user_id", userId)
        .maybeSingle();
      clientId = (clientRow as { id: string } | null)?.id ?? clientId;

      if (!leadId) {
        const { data: leadRow } = await admin
          .from("leads")
          .select("id")
          .eq("user_id", userId)
          .maybeSingle();
        leadId = (leadRow as { id: string } | null)?.id ?? leadId;
      }
    }
  }

  if (!leadId && parsed.inviteeEmail) {
    const { data: leadByEmail } = await admin
      .from("leads")
      .select("id")
      .eq("email", parsed.inviteeEmail)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    leadId = (leadByEmail as { id: string } | null)?.id ?? null;
  }

  if (leadId && !clientId) {
    const { data: clientFromLead } = await admin
      .from("clients")
      .select("id")
      .eq("lead_id", leadId)
      .maybeSingle();
    clientId = (clientFromLead as { id: string } | null)?.id ?? null;
  }

  return { leadId, clientId };
}

async function findOrCreateLead(
  admin: AdminClient,
  input: {
    inviteeEmail: string | null;
    inviteeName: string | null;
    phone: string | null;
    serviceSlug: string | null;
    existingLeadId: string | null;
  }
): Promise<{ leadId: string | null; created: boolean }> {
  if (input.existingLeadId) {
    const { data } = await admin
      .from("leads")
      .select("id")
      .eq("id", input.existingLeadId)
      .maybeSingle();
    if (data) return { leadId: (data as { id: string }).id, created: false };
  }

  if (input.inviteeEmail) {
    const { data: byEmail } = await admin
      .from("leads")
      .select("id")
      .eq("email", input.inviteeEmail)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (byEmail) return { leadId: (byEmail as { id: string }).id, created: false };
  }

  if (!input.inviteeEmail && !input.inviteeName) {
    return { leadId: null, created: false };
  }

  let userId: string | null = null;
  if (input.inviteeEmail) {
    const { data: userRow } = await admin
      .from("users")
      .select("id")
      .eq("email", input.inviteeEmail)
      .maybeSingle();
    userId = (userRow as { id: string } | null)?.id ?? null;
  }

  const source = input.serviceSlug
    ? `book-call:${input.serviceSlug}`
    : "book-call";

  const { data: inserted, error } = await admin
    .from("leads")
    .insert({
      user_id: userId,
      email: input.inviteeEmail,
      full_name: input.inviteeName,
      phone: input.phone,
      lead_status: "call_booked",
      source,
    } as never)
    .select("id")
    .single();

  if (error || !inserted) {
    console.error("[findOrCreateLead]", error);
    return { leadId: null, created: false };
  }

  return { leadId: (inserted as { id: string }).id, created: true };
}

async function syncLeadFromBooking(
  admin: AdminClient,
  leadId: string,
  input: {
    inviteeEmail: string | null;
    inviteeName: string | null;
    phone: string | null;
  }
) {
  const { data: lead } = await admin
    .from("leads")
    .select("email, full_name, phone, lead_status")
    .eq("id", leadId)
    .maybeSingle();

  if (!lead) return;

  const row = lead as {
    email: string | null;
    full_name: string | null;
    phone: string | null;
    lead_status: string;
  };

  const updates: Record<string, string> = { lead_status: "call_booked" };

  if (!row.email && input.inviteeEmail) updates.email = input.inviteeEmail;
  if (!row.full_name && input.inviteeName) updates.full_name = input.inviteeName;
  if (!row.phone && input.phone) updates.phone = input.phone;

  await admin.from("leads").update(updates as never).eq("id", leadId);
}

export async function processCalendlyBooking(
  admin: AdminClient,
  body: { event?: string; payload?: Record<string, unknown> }
): Promise<ProcessBookingResult> {
  const eventType = String(body.event ?? "");

  if (eventType !== "invitee.created" && eventType !== "invitee.canceled") {
    return { ok: true, skipped: true, reason: "unsupported_event" };
  }

  const parsed = parseCalendlyWebhook(body);
  if (!parsed) {
    return { error: "Invalid payload" };
  }

  let { leadId, clientId } = await resolveLeadAndClient(admin, parsed);

  if (parsed.canceled && parsed.calendlyEventId) {
    await admin
      .from("meetings")
      .update({ status: "cancelled" })
      .eq("calendly_event_id", parsed.calendlyEventId);
    return { ok: true, skipped: true, reason: "canceled" };
  }

  if (!parsed.inviteeEmail && !leadId && !clientId) {
    return { ok: true, skipped: true, reason: "no_owner" };
  }

  if (parsed.calendlyEventId) {
    const { data: existing } = await admin
      .from("meetings")
      .select("id")
      .eq("calendly_event_id", parsed.calendlyEventId)
      .maybeSingle();

    if (existing) {
      return { ok: true, duplicate: true };
    }
  } else if (parsed.calendlyInviteeUri) {
    const { data: existingByInvitee } = await admin
      .from("meetings")
      .select("id")
      .eq("calendly_invitee_uri", parsed.calendlyInviteeUri)
      .maybeSingle();

    if (existingByInvitee) {
      return { ok: true, duplicate: true };
    }
  }

  const phone = extractPhoneFromFormResponses(parsed.formResponses);

  let leadCreated = false;
  if (!leadId) {
    const result = await findOrCreateLead(admin, {
      inviteeEmail: parsed.inviteeEmail,
      inviteeName: parsed.inviteeName,
      phone,
      serviceSlug: parsed.serviceSlug,
      existingLeadId: parsed.leadId,
    });
    leadId = result.leadId;
    leadCreated = result.created;
  }

  if (!parsed.scheduledAt && !parsed.calendlyEventId && !parsed.calendlyInviteeUri) {
    return { ok: true, skipped: true, reason: "incomplete_booking" };
  }

  const durationMinutes =
    parsed.durationMinutes ?? STRATEGY_CALL_DURATION_MINUTES;

  const { data: meeting, error: insertError } = await admin
    .from("meetings")
    .insert({
      client_id: clientId,
      lead_id: leadId,
      meeting_type: "strategy_call",
      scheduled_at: parsed.scheduledAt,
      duration_minutes: durationMinutes,
      status: "scheduled",
      calendly_event_id: parsed.calendlyEventId,
      calendly_event_url: parsed.calendlyEventUrl,
      calendly_invitee_uri: parsed.calendlyInviteeUri,
      meeting_url: parsed.meetingUrl,
      invitee_name: parsed.inviteeName,
      invitee_email: parsed.inviteeEmail,
      form_responses: parsed.formResponses.length > 0 ? parsed.formResponses : null,
      service_slug: parsed.serviceSlug,
    } as never)
    .select("id")
    .single();

  if (insertError) {
    console.error("[processCalendlyBooking] insert failed", insertError);
    return { error: "Insert failed" };
  }

  const meetingId = (meeting as { id: string }).id;

  if (leadId) {
    await syncLeadFromBooking(admin, leadId, {
      inviteeEmail: parsed.inviteeEmail,
      inviteeName: parsed.inviteeName,
      phone,
    });
  }

  const inviteeLabel = parsed.inviteeName ?? parsed.inviteeEmail ?? "Someone";
  const serviceLabel = parsed.serviceSlug
    ? parsed.serviceSlug.replace(/_/g, " ")
    : "strategy call";

  await notifyAdvisors(admin, {
    type: "call_booked",
    title: leadCreated ? "New lead booked a call" : "New call booked",
    message: `${inviteeLabel} booked a ${serviceLabel} consultation.${
      parsed.scheduledAt
        ? ` Scheduled for ${new Date(parsed.scheduledAt).toLocaleString("en-AU", {
            dateStyle: "medium",
            timeStyle: "short",
          })}.`
        : ""
    }`,
    actionUrl: leadId ? `/advisor/leads/${leadId}` : `/advisor/calls/${meetingId}`,
    entityType: leadId ? "lead" : "meeting",
    entityId: leadId ?? meetingId,
  });

  if (parsed.inviteeEmail) {
    const confirmation = await sendMeetingBookingConfirmationEmail({
      email: parsed.inviteeEmail,
      inviteeName: parsed.inviteeName ?? parsed.inviteeEmail.split("@")[0],
      scheduledAt: parsed.scheduledAt,
      durationMinutes,
      meetingUrl: parsed.meetingUrl,
      serviceLabel: parsed.serviceSlug,
    });
    if (!confirmation.ok) {
      console.error("[processCalendlyBooking] confirmation email:", confirmation.error);
    }
  }

  return { ok: true, meetingId, leadId, created: leadCreated };
}
