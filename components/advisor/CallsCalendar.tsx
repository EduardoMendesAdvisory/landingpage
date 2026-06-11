"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, List, CalendarDays } from "lucide-react";
import { serviceNameFromSlug } from "@/lib/invoices/constants";

export type CallEvent = {
  id: string;
  scheduled_at: string | null;
  status: string;
  invitee_name: string | null;
  invitee_email: string | null;
  service_slug: string | null;
  lead_id: string | null;
  leads: { full_name: string | null; email: string | null } | null;
};

const STATUS_DOT: Record<string, string> = {
  scheduled: "bg-blue-500",
  completed: "bg-green-500",
  cancelled: "bg-gray-400",
  no_show: "bg-red-400",
};

const STATUS_CHIP: Record<string, string> = {
  scheduled: "bg-blue-50 border-blue-200 text-blue-800",
  completed: "bg-green-50 border-green-200 text-green-800",
  cancelled: "bg-gray-50 border-gray-200 text-gray-500",
  no_show: "bg-red-50 border-red-200 text-red-700",
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
];

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function dayKey(d: Date) {
  return d.getFullYear() + "-" + d.getMonth() + "-" + d.getDate();
}

function getName(m: CallEvent) {
  return m.invitee_name ?? m.leads?.full_name ?? m.invitee_email ?? m.leads?.email ?? "Unknown";
}

interface CallsCalendarProps {
  meetings: CallEvent[];
}

export function CallsCalendar({ meetings }: CallsCalendarProps) {
  const today = new Date();
  const [view, setView] = useState<"calendar" | "list">("calendar");
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const eventsByDay = useMemo(() => {
    const map = new Map<string, CallEvent[]>();
    for (const m of meetings) {
      if (!m.scheduled_at) continue;
      const d = new Date(m.scheduled_at);
      const k = dayKey(d);
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(m);
    }
    return map;
  }, [meetings]);

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  }

  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  }

  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (Date | null)[] = [
    ...Array(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1)),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const selectedEvents = selectedDay ? (eventsByDay.get(dayKey(selectedDay)) ?? []) : null;

  const sortedList = [...meetings]
    .filter(m => m.scheduled_at)
    .sort((a, b) => new Date(a.scheduled_at!).getTime() - new Date(b.scheduled_at!).getTime());

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={prevMonth}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-navy"
          >
            <ChevronLeft size={16} />
          </button>
          <h2 className="text-sm font-semibold text-navy w-40 text-center">
            {MONTHS[month]} {year}
          </h2>
          <button
            type="button"
            onClick={nextMonth}
            className="p-2 rounded-lg hover:bg-muted transition-colors text-muted-foreground hover:text-navy"
          >
            <ChevronRight size={16} />
          </button>
          <button
            type="button"
            onClick={() => {
              setYear(today.getFullYear());
              setMonth(today.getMonth());
              setSelectedDay(today);
            }}
            className="ml-2 text-xs font-semibold text-warm-soil hover:underline px-2 py-1 rounded-lg hover:bg-warm-soil/10 transition-colors"
          >
            Today
          </button>
        </div>
        <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
          <button
            type="button"
            onClick={() => setView("calendar")}
            className={"flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors " + (view === "calendar" ? "bg-white text-navy shadow-sm" : "text-muted-foreground hover:text-navy")}
          >
            <CalendarDays size={13} />
            Calendar
          </button>
          <button
            type="button"
            onClick={() => setView("list")}
            className={"flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors " + (view === "list" ? "bg-white text-navy shadow-sm" : "text-muted-foreground hover:text-navy")}
          >
            <List size={13} />
            List
          </button>
        </div>
      </div>

      {view === "calendar" ? (
        <div className="grid lg:grid-cols-[1fr_300px] gap-4 items-start">
          {/* Grid */}
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden">
            <div className="grid grid-cols-7 border-b border-border">
              {DAYS.map(d => (
                <div key={d} className="py-2.5 text-center text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                  <span className="hidden sm:inline">{d}</span>
                  <span className="sm:hidden">{d[0]}</span>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7">
              {cells.map((date, i) => {
                if (!date) {
                  return (
                    <div
                      key={"empty-" + i}
                      className="min-h-[72px] sm:min-h-[96px] bg-gray-50/60 border-b border-r border-border/40"
                    />
                  );
                }
                const events = eventsByDay.get(dayKey(date)) ?? [];
                const isToday = isSameDay(date, today);
                const isSelected = selectedDay ? isSameDay(date, selectedDay) : false;
                const col = i % 7;
                const isLastCol = col === 6;

                return (
                  <button
                    key={date.toISOString()}
                    type="button"
                    onClick={() => setSelectedDay(isSelected ? null : date)}
                    className={
                      "min-h-[72px] sm:min-h-[96px] p-1.5 sm:p-2 border-b border-border/40 text-left transition-colors relative " +
                      (isLastCol ? "" : "border-r ") +
                      (isSelected ? "bg-navy/5 ring-1 ring-inset ring-navy/20 " : "hover:bg-light-bg ")
                    }
                  >
                    <span
                      className={
                        "inline-flex items-center justify-center text-xs font-semibold w-6 h-6 rounded-full mb-1 " +
                        (isToday ? "bg-warm-soil text-white " : isSelected ? "bg-navy text-white " : "text-navy ")
                      }
                    >
                      {date.getDate()}
                    </span>
                    <div className="space-y-0.5">
                      {events.slice(0, 2).map(ev => (
                        <div
                          key={ev.id}
                          className={"text-[10px] rounded px-1 py-0.5 truncate font-medium border " + (STATUS_CHIP[ev.status] ?? "bg-blue-50 border-blue-200 text-blue-800")}
                        >
                          <span className={"inline-block w-1.5 h-1.5 rounded-full mr-1 align-middle " + (STATUS_DOT[ev.status] ?? "bg-blue-500")} />
                          <span className="hidden sm:inline">{getName(ev)}</span>
                          <span className="sm:hidden">
                            {new Date(ev.scheduled_at!).toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                      ))}
                      {events.length > 2 && (
                        <p className="text-[10px] text-muted-foreground pl-1">+{events.length - 2}</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Day panel */}
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden">
            {selectedDay && selectedEvents !== null ? (
              <>
                <div className="px-5 py-4 border-b border-border">
                  <p className="text-sm font-semibold text-navy">
                    {selectedDay.toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long" })}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {selectedEvents.length === 0 ? "No calls" : selectedEvents.length + " call" + (selectedEvents.length > 1 ? "s" : "")}
                  </p>
                </div>
                {selectedEvents.length === 0 ? (
                  <p className="px-5 py-8 text-center text-sm text-muted-foreground">No calls scheduled.</p>
                ) : (
                  <ul className="divide-y divide-border">
                    {selectedEvents.map(ev => (
                      <li key={ev.id} className="px-5 py-4">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <Link
                            href={"/advisor/calls/" + ev.id}
                            className="text-sm font-semibold text-navy hover:text-warm-soil transition-colors"
                          >
                            {getName(ev)}
                          </Link>
                          <span className={"text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 " + (STATUS_CHIP[ev.status] ?? "bg-blue-50 border-blue-200 text-blue-800")}>
                            {ev.status}
                          </span>
                        </div>
                        {ev.invitee_email && (
                          <p className="text-xs text-muted-foreground">{ev.invitee_email}</p>
                        )}
                        {ev.scheduled_at && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {new Date(ev.scheduled_at).toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" })}
                            {ev.service_slug && " - " + serviceNameFromSlug(ev.service_slug)}
                          </p>
                        )}
                        {ev.lead_id && (
                          <Link
                            href={"/advisor/leads/" + ev.lead_id}
                            className="text-[11px] text-warm-soil hover:underline mt-1.5 inline-block"
                          >
                            View lead profile
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <div className="px-5 py-10 text-center text-sm text-muted-foreground">
                <CalendarDays size={28} className="mx-auto mb-3 opacity-30" />
                <p className="font-medium text-navy mb-1">Select a day</p>
                <p>Click any date to see calls for that day.</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* List view */
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden">
          {sortedList.length === 0 ? (
            <p className="p-10 text-center text-sm text-muted-foreground">No calls booked yet.</p>
          ) : (
            <ul className="divide-y divide-border">
              {sortedList.map(m => (
                <li key={m.id} className="flex items-start gap-4 px-5 py-4 hover:bg-light-bg transition-colors">
                  {m.scheduled_at ? (
                    <div className="shrink-0 w-12 text-center">
                      <p className="text-[10px] font-semibold text-muted-foreground uppercase">
                        {new Date(m.scheduled_at).toLocaleDateString("en-AU", { month: "short" })}
                      </p>
                      <p className="text-xl font-bold text-navy leading-none">
                        {new Date(m.scheduled_at).getDate()}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {new Date(m.scheduled_at).toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  ) : (
                    <div className="shrink-0 w-12 text-center text-xs text-muted-foreground">TBD</div>
                  )}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={"/advisor/calls/" + m.id}
                      className="text-sm font-semibold text-navy hover:text-warm-soil transition-colors"
                    >
                      {getName(m)}
                    </Link>
                    {m.invitee_email && (
                      <p className="text-xs text-muted-foreground mt-0.5">{m.invitee_email}</p>
                    )}
                    {m.service_slug && (
                      <p className="text-xs text-muted-foreground">{serviceNameFromSlug(m.service_slug)}</p>
                    )}
                    {m.lead_id && (
                      <Link href={"/advisor/leads/" + m.lead_id} className="text-[11px] text-warm-soil hover:underline mt-1 inline-block">
                        View lead
                      </Link>
                    )}
                  </div>
                  <span className={"shrink-0 text-[10px] font-semibold px-2 py-1 rounded-full border " + (STATUS_CHIP[m.status] ?? "bg-blue-50 border-blue-200 text-blue-800")}>
                    {m.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Legend */}
      {view === "calendar" && (
        <div className="flex items-center gap-4 flex-wrap px-1">
          {[
            { key: "scheduled", label: "Scheduled" },
            { key: "completed", label: "Completed" },
            { key: "cancelled", label: "Cancelled" },
            { key: "no_show", label: "No show" },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center gap-1.5">
              <span className={"w-2.5 h-2.5 rounded-full " + STATUS_DOT[key]} />
              <span className="text-xs text-muted-foreground">{label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
