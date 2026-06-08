import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  ArrowRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock,
  FileSearch,
  FolderOpen,
  MessageSquare,
  Rocket,
} from "lucide-react";
import { ProgressCircle } from "@/components/shared/ProgressCircle";
import { StatusBadge } from "@/components/shared/StatusBadge";

export const metadata: Metadata = { title: "My Dashboard" };

const JOURNEY_STEPS = [
  "Assessment",
  "Strategy Call",
  "Quote Review",
  "Builder Selection",
  "Construction Support",
  "Project Completion",
];

function getJourneyStep(stage: string | null): number {
  if (!stage) return 0;
  const map: Record<string, number> = {
    assessment: 0,
    strategy_call: 1,
    quote_review: 2,
    builder_selection: 3,
    construction_support: 4,
    completed: 5,
  };
  return map[stage] ?? 0;
}

export default async function BuildIQDashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [profileResult, clientResult] = await Promise.all([
    supabase.from("user_profiles").select("first_name").eq("user_id", user!.id).single(),
    supabase.from("clients").select("id, client_status").eq("user_id", user!.id).single(),
  ]);

  const firstName = (profileResult.data as { first_name: string | null } | null)?.first_name ?? "there";
  const client = clientResult.data as { id: string; client_status: string } | null;

  let project = null;
  let buildcheck = null;
  let upcomingMeeting = null;
  let recentActivity: Array<{ id: string; title: string; description: string; created_at: string; type: string }> = [];
  let tasks: Array<{ id: string; title: string; description: string | null; status: string; due_date: string | null }> = [];

  if (client?.id) {
    const [projectRes, buildcheckRes, meetingRes, tasksRes] = await Promise.all([
      supabase
        .from("projects")
        .select("id, project_name, project_status, project_stage, confidence_score, budget_range, location")
        .eq("client_id", client.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single(),
      supabase
        .from("buildchecks")
        .select("id, buildcheck_status, savings_min, savings_max, risk_level")
        .order("created_at", { ascending: false })
        .limit(1)
        .single(),
      supabase
        .from("meetings")
        .select("id, meeting_type, scheduled_at, status, meeting_url")
        .eq("client_id", client.id)
        .eq("status", "scheduled")
        .order("scheduled_at", { ascending: true })
        .limit(1)
        .single(),
      supabase
        .from("tasks")
        .select("id, title, description, status, due_date, projects!inner(client_id)")
        .eq("projects.client_id", client.id)
        .neq("status", "completed")
        .order("due_date", { ascending: true })
        .limit(5),
    ]);

    project = projectRes.data;
    buildcheck = buildcheckRes.data;
    upcomingMeeting = meetingRes.data;
    tasks = (tasksRes.data ?? []) as typeof tasks;
  }

  const journeyStep = getJourneyStep((project as { project_stage: string | null } | null)?.project_stage ?? null);
  const confidence = (project as { confidence_score: number | null } | null)?.confidence_score ?? 0;

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-xl font-bold text-[#111A24]">
            Welcome back, {firstName} 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Here&apos;s what&apos;s happening with your project.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/buildiq/meetings"
            className="inline-flex items-center gap-2 bg-[#111A24] hover:bg-[#1d2a38] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            <CalendarDays size={15} />
            Book a Meeting
          </Link>
          <Link href="/buildiq/messages" className="relative p-2 text-muted-foreground hover:text-navy transition-colors">
            <Bell size={18} />
          </Link>
        </div>
      </div>

      <div className="px-8 py-6 space-y-6">
        {/* Row 1: Project card + Readiness + Advisor */}
        <div className="grid lg:grid-cols-[1fr_260px_240px] gap-5">
          {/* Project card */}
          <div className="bg-[#111A24] rounded-2xl overflow-hidden relative min-h-[170px]">
            <img
              src="https://rdeavyxckvkfwjvmxugs.supabase.co/storage/v1/object/public/media/hero%20banner%20desktop.jpg"
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-25"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#111A24]/90 to-[#111A24]/40" />
            <div className="relative p-6">
              <p className="text-white/60 text-xs uppercase tracking-wider mb-1">Your Project</p>
              {project ? (
                <>
                  <h2 className="text-xl font-bold text-white mb-2">
                    {(project as { project_name: string }).project_name}
                  </h2>
                  <div className="flex items-center gap-3 flex-wrap">
                    <div className="text-xs text-white/60">
                      Stage: <span className="text-white/90 font-medium">
                        {(project as { project_stage: string | null }).project_stage?.replace(/_/g, " ") ?? "Planning"}
                      </span>
                    </div>
                    {(project as { budget_range: string | null }).budget_range && (
                      <div className="text-xs text-white/60">
                        Budget: <span className="text-white/90 font-medium">
                          {(project as { budget_range: string }).budget_range}
                        </span>
                      </div>
                    )}
                    {(project as { location: string | null }).location && (
                      <div className="text-xs text-white/60">
                        {(project as { location: string }).location}
                      </div>
                    )}
                  </div>
                  <div className="mt-3">
                    <StatusBadge status={(project as { project_status: string }).project_status} />
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-lg font-bold text-white mb-1">No project set up yet</h2>
                  <p className="text-white/60 text-sm">Eduardo will activate your project after your strategy call.</p>
                </>
              )}
            </div>
          </div>

          {/* Readiness score */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col">
            <p className="text-xs font-semibold text-[#111A24] uppercase tracking-wider mb-3">
              Project Readiness Score
            </p>
            <div className="flex flex-col items-center flex-1 justify-center gap-2">
              <ProgressCircle value={confidence} size="md" />
              <p className="text-xs text-muted-foreground text-center mt-1">
                {confidence >= 75
                  ? "Outstanding progress"
                  : confidence >= 55
                    ? "You're making great progress"
                    : "Keep completing recommended actions"}
              </p>
              <Link
                href="/buildiq/project"
                className="text-xs text-[#b67c2c] hover:underline font-medium mt-1"
              >
                View Full Assessment →
              </Link>
            </div>
          </div>

          {/* Advisor widget */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-xs font-semibold text-[#111A24] uppercase tracking-wider mb-4">
              Your Advisor
            </p>
            <div className="flex items-start gap-3 mb-4">
              <img
                src="https://rdeavyxckvkfwjvmxugs.supabase.co/storage/v1/object/public/media/edu.png"
                alt="Eduardo Mendes"
                className="h-12 w-12 rounded-full object-cover object-top shrink-0"
              />
              <div>
                <p className="text-sm font-bold text-[#111A24]">Eduardo Mendes</p>
                <p className="text-xs text-muted-foreground">Owner Builder Advisor</p>
                <p className="text-xs text-[#111A24]/80 mt-1.5 leading-relaxed">
                  I&apos;m here to help you build smarter, avoid costly mistakes and create the home you envision.
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Link
                href="/buildiq/messages"
                className="flex items-center justify-center gap-1.5 border border-gray-200 text-[#111A24] hover:border-[#111A24] text-xs font-semibold py-2 px-3 rounded-lg transition-colors"
              >
                <MessageSquare size={13} />
                Send Message
              </Link>
              <Link
                href="/buildiq/meetings"
                className="flex items-center justify-center gap-1.5 bg-[#b67c2c] hover:bg-[#9f6c27] text-white text-xs font-semibold py-2 px-3 rounded-lg transition-colors"
              >
                <CalendarDays size={13} />
                Book Meeting
              </Link>
            </div>
          </div>
        </div>

        {/* Row 2: Journey + Tasks + Recent Activity */}
        <div className="grid lg:grid-cols-[1fr_280px] gap-5">
          {/* Journey timeline */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm font-bold text-[#111A24]">Your Project Journey</p>
              <Link href="/buildiq/project" className="text-xs text-[#b67c2c] hover:underline">
                View Full Timeline →
              </Link>
            </div>
            <div className="flex items-start gap-0 overflow-x-auto pb-2">
              {JOURNEY_STEPS.map((step, idx) => {
                const done = idx < journeyStep;
                const active = idx === journeyStep;
                return (
                  <div key={step} className="flex flex-col items-center flex-1 min-w-[90px]">
                    <div className="flex items-center w-full">
                      {idx > 0 && (
                        <div className={`flex-1 h-0.5 ${done ? "bg-green-500" : "bg-gray-200"}`} />
                      )}
                      <div
                        className={`h-9 w-9 rounded-full flex items-center justify-center shrink-0 border-2 ${
                          done
                            ? "bg-green-500 border-green-500"
                            : active
                              ? "bg-white border-[#b67c2c]"
                              : "bg-white border-gray-200"
                        }`}
                      >
                        {done ? (
                          <CheckCircle2 size={16} className="text-white" />
                        ) : active ? (
                          <div className="h-3 w-3 rounded-full bg-[#b67c2c]" />
                        ) : (
                          <Circle size={14} className="text-gray-300" />
                        )}
                      </div>
                      {idx < JOURNEY_STEPS.length - 1 && (
                        <div className={`flex-1 h-0.5 ${done ? "bg-green-500" : "bg-gray-200"}`} />
                      )}
                    </div>
                    <p className={`text-[10px] font-medium text-center mt-2 leading-tight px-1 ${
                      active ? "text-[#b67c2c]" : done ? "text-[#111A24]" : "text-gray-400"
                    }`}>
                      {step}
                    </p>
                    {active && (
                      <p className="text-[9px] text-[#b67c2c] font-semibold uppercase tracking-wider mt-0.5">
                        In Progress
                      </p>
                    )}
                    {done && (
                      <p className="text-[9px] text-green-600 font-semibold uppercase tracking-wider mt-0.5">
                        Done
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Upcoming meeting */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-xs font-semibold text-[#111A24] uppercase tracking-wider mb-3">
              Next Recommended Action
            </p>
            {upcomingMeeting ? (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CalendarDays size={16} className="text-[#b67c2c]" />
                  <p className="text-sm font-semibold text-[#111A24]">
                    {(upcomingMeeting as { meeting_type: string }).meeting_type.replace(/_/g, " ")}
                  </p>
                </div>
                {(upcomingMeeting as { scheduled_at: string | null }).scheduled_at && (
                  <p className="text-xs text-muted-foreground mb-3">
                    {new Date((upcomingMeeting as { scheduled_at: string }).scheduled_at).toLocaleString("en-AU", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    })}
                  </p>
                )}
                {(upcomingMeeting as { meeting_url: string | null }).meeting_url ? (
                  <a
                    href={(upcomingMeeting as { meeting_url: string }).meeting_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 bg-[#111A24] text-white text-xs font-semibold py-2.5 rounded-lg hover:bg-[#1d2a38] transition-colors"
                  >
                    Join Meeting
                    <ArrowRight size={13} />
                  </a>
                ) : (
                  <Link
                    href="/buildiq/meetings"
                    className="flex items-center justify-center gap-2 bg-[#111A24] text-white text-xs font-semibold py-2.5 rounded-lg hover:bg-[#1d2a38] transition-colors"
                  >
                    View Meeting
                    <ArrowRight size={13} />
                  </Link>
                )}
              </div>
            ) : (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Rocket size={16} className="text-[#b67c2c]" />
                  <p className="text-sm font-semibold text-[#111A24]">Book Your Strategy Call</p>
                </div>
                <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                  Schedule a free 15-minute call with Eduardo to discuss your project and next steps.
                </p>
                <Link
                  href="/book-call"
                  className="flex items-center justify-center gap-2 bg-[#b67c2c] hover:bg-[#9f6c27] text-white text-xs font-semibold py-2.5 rounded-lg transition-colors"
                >
                  <CalendarDays size={13} />
                  Book Now
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Row 3: Tasks + Quick links */}
        <div className="grid lg:grid-cols-[1fr_240px] gap-5">
          {/* Tasks */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold text-[#111A24]">My Tasks</p>
              {tasks.length > 0 && (
                <Link href="/buildiq/project" className="text-xs text-[#b67c2c] hover:underline">
                  View All Tasks →
                </Link>
              )}
            </div>
            {tasks.length > 0 ? (
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100"
                  >
                    <div className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${
                      task.status === "in_progress" ? "bg-[#b67c2c]" : "bg-gray-300"
                    }`} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#111A24] truncate">{task.title}</p>
                      {task.description && (
                        <p className="text-xs text-muted-foreground truncate mt-0.5">{task.description}</p>
                      )}
                    </div>
                    {task.due_date && (
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full shrink-0 ${
                        new Date(task.due_date) < new Date()
                          ? "bg-red-50 text-red-600"
                          : "bg-amber-50 text-amber-700"
                      }`}>
                        {task.due_date}
                      </span>
                    )}
                    <ArrowRight size={14} className="text-gray-300 shrink-0 mt-0.5" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle2 size={32} className="text-green-400 mb-2" />
                <p className="text-sm font-medium text-[#111A24]">All caught up!</p>
                <p className="text-xs text-muted-foreground mt-1">No pending tasks at the moment.</p>
              </div>
            )}
          </div>

          {/* Quick links */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <p className="text-xs font-semibold text-[#111A24] uppercase tracking-wider mb-4">
              Quick Actions
            </p>
            <div className="space-y-2">
              {[
                { label: "BuildCheck™", desc: "View quote reviews", href: "/buildiq/buildcheck", icon: FileSearch },
                { label: "Documents", desc: "Upload & manage files", href: "/buildiq/documents", icon: FolderOpen },
                { label: "Meetings", desc: "View upcoming calls", href: "/buildiq/meetings", icon: CalendarDays },
                { label: "Messages", desc: "Chat with Eduardo", href: "/buildiq/messages", icon: MessageSquare },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-colors group"
                >
                  <item.icon size={15} className="text-[#b67c2c] shrink-0" />
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-[#111A24]">{item.label}</p>
                    <p className="text-[10px] text-muted-foreground">{item.desc}</p>
                  </div>
                  <ArrowRight size={13} className="text-gray-300 ml-auto shrink-0 group-hover:text-[#b67c2c] transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Footer bar */}
        <div className="bg-[#111A24] rounded-2xl p-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-white">Build with confidence.</p>
            <p className="text-xs text-white/60 mt-0.5">We&apos;re here every step of the way.</p>
          </div>
          <div className="flex flex-wrap gap-6">
            {[
              { icon: FolderOpen, label: "Independent Advice", sub: "We work for you, not the builder." },
              { icon: Clock, label: "Save Time & Money", sub: "Avoid costly mistakes and delays." },
              { icon: CheckCircle2, label: "Build with Confidence", sub: "Make informed decisions." },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2.5">
                <item.icon size={18} className="text-[#b67c2c] shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-white">{item.label}</p>
                  <p className="text-[10px] text-white/50">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
