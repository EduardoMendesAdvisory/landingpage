"use client";

import { CalendlyEmbed } from "@/components/shared/CalendlyEmbed";
import { CalendarDays, CreditCard, AlertCircle, Video, ExternalLink } from "lucide-react";
import Link from "next/link";
import {
  FREE_CONSULTATION_LIMIT,
  PAID_CALENDLY_URL,
} from "@/lib/buildiq/portal-config";
import { meetingDurationLabel } from "@/lib/meetings/constants";

type MeetingRow = {
  id: string;
  scheduled_at: string | null;
  status: string;
  meeting_type: string;
  duration_minutes: number | null;
  meeting_url: string | null;
};

interface MeetingsBookingPanelProps {
  calendlyUrl: string;
  clientId?: string | null;
  usedCount: number;
  remainingFree: number;
  canBookFree: boolean;
  meetings: MeetingRow[];
}

const STATUS_LABELS: Record<string, string> = {
  scheduled: "Scheduled",
  completed: "Completed",
  cancelled: "Cancelled",
  no_show: "No show",
};

export function MeetingsBookingPanel({
  calendlyUrl,
  clientId,
  usedCount,
  remainingFree,
  canBookFree,
  meetings,
}: MeetingsBookingPanelProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          <div>
            <h2 className="text-sm font-bold text-[#111A24]">Consultation allowance</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Your portal includes {FREE_CONSULTATION_LIMIT} free strategy consultations.
              Additional sessions are billed separately.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-center px-4 py-2 rounded-xl bg-[#b67c2c]/10 border border-[#b67c2c]/20">
              <p className="text-2xl font-bold text-[#b67c2c]">{remainingFree}</p>
              <p className="text-[10px] font-semibold text-[#b67c2c] uppercase tracking-wide">
                Free left
              </p>
            </div>
            <div className="text-center px-4 py-2 rounded-xl bg-gray-50 border border-gray-100">
              <p className="text-2xl font-bold text-[#111A24]">{usedCount}</p>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                Used
              </p>
            </div>
          </div>
        </div>

        {!canBookFree ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 mb-4">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-[#111A24]">
                  Free consultation limit reached
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  You have used all {FREE_CONSULTATION_LIMIT} included consultations.
                  Additional strategy sessions are charged at Eduardo&apos;s standard advisory rate.
                </p>
                <div className="flex flex-wrap gap-3 mt-4">
                  {PAID_CALENDLY_URL ? (
                    <a
                      href={PAID_CALENDLY_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 bg-[#b67c2c] hover:bg-[#9f6c27] text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      <CreditCard size={15} />
                      Book paid consultation
                    </a>
                  ) : (
                    <Link
                      href="/buildiq/meetings"
                      className="inline-flex items-center gap-2 bg-[#b67c2c] hover:bg-[#9f6c27] text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors"
                    >
                      <CreditCard size={15} />
                      Request paid session
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground mb-4">
            Pick a time below to book your next free consultation with Eduardo.
          </p>
        )}
      </div>

      {canBookFree && (
        <div className="bg-white rounded-2xl border border-gray-100 p-4">
          <CalendlyEmbed url={calendlyUrl} tracking={{ clientId }} />
        </div>
      )}

      {meetings.length > 0 && (() => {
        const visibleMeetings = meetings.filter(
          (m) => m.scheduled_at || m.status !== "scheduled"
        );
        if (visibleMeetings.length === 0) return null;

        return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
            <CalendarDays size={16} className="text-[#b67c2c]" />
            <p className="text-sm font-bold text-[#111A24]">
              Your meetings ({visibleMeetings.length})
            </p>
          </div>
          <div className="divide-y divide-gray-50">
            {visibleMeetings.map((m) => (
              <div key={m.id} className="flex items-center justify-between gap-4 px-6 py-3.5">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-[#111A24] capitalize">
                    {m.meeting_type.replace(/_/g, " ")}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {m.scheduled_at
                      ? new Date(m.scheduled_at).toLocaleString("en-AU", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : "Date pending"}
                    {(() => {
                      const label = meetingDurationLabel(m.meeting_type, m.duration_minutes);
                      return label ? ` - ${label}` : "";
                    })()}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {m.status === "scheduled" && m.meeting_url && (
                    <a
                      href={m.meeting_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold bg-[#111A24] hover:bg-[#1d2a38] text-white px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <Video size={13} />
                      Join
                      <ExternalLink size={11} className="opacity-70" />
                    </a>
                  )}
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-muted-foreground">
                    {STATUS_LABELS[m.status] ?? m.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        );
      })()}
    </div>
  );
}
