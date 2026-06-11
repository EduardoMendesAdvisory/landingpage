import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, ExternalLink, Mail, User, Video } from "lucide-react";
import { createAdminClient } from "@/lib/supabase/admin";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { MeetingFormResponses } from "@/components/advisor/MeetingFormResponses";
import { MeetingNotesEditor } from "@/components/advisor/MeetingNotesEditor";
import { formatDate } from "@/utils/formatters";
import { serviceNameFromSlug } from "@/lib/invoices/constants";
import { meetingDurationLabel } from "@/lib/meetings/constants";
import type { CalendlyFormResponse } from "@/lib/calendly/parse-webhook";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Call Detail" };

export default async function CallDetailPage({
  params,
}: {
  params: Promise<{ meetingId: string }>;
}) {
  const { meetingId } = await params;
  const admin = createAdminClient();

  const { data: meeting, error } = await admin
    .from("meetings")
    .select(
      "id, scheduled_at, status, duration_minutes, invitee_name, invitee_email, meeting_url, service_slug, form_responses, lead_id, leads(id, full_name, email, phone, lead_status)"
    )
    .eq("id", meetingId)
    .single();

  if (error || !meeting) notFound();

  const row = meeting as {
    id: string;
    scheduled_at: string | null;
    status: string;
    duration_minutes: number | null;
    invitee_name: string | null;
    invitee_email: string | null;
    meeting_url: string | null;
    service_slug: string | null;
    form_responses: CalendlyFormResponse[] | null;
    lead_id: string | null;
    leads: {
      id: string;
      full_name: string | null;
      email: string | null;
      phone: string | null;
      lead_status: string;
    } | null;
  };

  const { data: noteRow } = await admin
    .from("meeting_notes")
    .select("notes, outcome, next_action")
    .eq("meeting_id", meetingId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const note = noteRow as {
    notes: string | null;
    outcome: string | null;
    next_action: string | null;
  } | null;

  const displayName =
    row.invitee_name ?? row.leads?.full_name ?? row.invitee_email ?? "Call";
  const displayEmail = row.invitee_email ?? row.leads?.email;
  const formResponses = row.form_responses ?? [];

  return (
    <>
      <DashboardHeader title="AdvisorHQ" userName="Eduardo" userInitials="EM" />
      <div className="flex-1 px-6 py-8 space-y-6">
        <Link
          href="/advisor/calls"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-navy"
        >
          <ArrowLeft size={15} />
          All calls
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-navy">{displayName}</h1>
            {displayEmail && (
              <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1.5">
                <Mail size={14} />
                {displayEmail}
              </p>
            )}
          </div>
          <StatusBadge status={row.status} />
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6 space-y-4">
            <h2 className="text-sm font-semibold text-navy uppercase tracking-wide flex items-center gap-2">
              <CalendarDays size={15} />
              Booking details
            </h2>
            <dl className="space-y-3 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground uppercase tracking-wide">Scheduled</dt>
                <dd className="text-navy mt-0.5">
                  {row.scheduled_at ? formatDate(row.scheduled_at) : "-"}
                  {(() => {
                    const label = meetingDurationLabel("strategy_call", row.duration_minutes);
                    return label ? ` - ${label}` : "";
                  })()}
                </dd>
              </div>
              {row.service_slug && (
                <div>
                  <dt className="text-xs text-muted-foreground uppercase tracking-wide">Service</dt>
                  <dd className="text-navy mt-0.5">{serviceNameFromSlug(row.service_slug)}</dd>
                </div>
              )}
              {row.meeting_url && (
                <div>
                  <dt className="text-xs text-muted-foreground uppercase tracking-wide">Join link</dt>
                  <dd className="mt-0.5">
                    <a
                      href={row.meeting_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[#b67c2c] hover:underline text-sm"
                    >
                      <Video size={14} />
                      Open meeting
                      <ExternalLink size={12} />
                    </a>
                  </dd>
                </div>
              )}
              {row.lead_id && row.leads && (
                <div>
                  <dt className="text-xs text-muted-foreground uppercase tracking-wide">Linked lead</dt>
                  <dd className="mt-0.5">
                    <Link
                      href={`/advisor/leads/${row.lead_id}`}
                      className="inline-flex items-center gap-1.5 text-[#b67c2c] hover:underline"
                    >
                      <User size={14} />
                      {row.leads.full_name ?? row.leads.email ?? "View lead"}
                    </Link>
                  </dd>
                </div>
              )}
            </dl>
          </div>

          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6 space-y-4">
            <h2 className="text-sm font-semibold text-navy uppercase tracking-wide">
              Calendly form answers
            </h2>
            <MeetingFormResponses responses={formResponses} />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6 space-y-4">
          <h2 className="text-sm font-semibold text-navy uppercase tracking-wide">
            Post-call notes
          </h2>
          <MeetingNotesEditor
            meetingId={meetingId}
            initialNotes={note?.notes ?? ""}
            initialOutcome={note?.outcome ?? ""}
            initialNextAction={note?.next_action ?? ""}
            status={row.status}
          />
        </div>
      </div>
    </>
  );
}
