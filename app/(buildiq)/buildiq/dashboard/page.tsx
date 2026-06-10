import { Metadata } from "next";
import { createClient, getServerUser } from "@/lib/supabase/server";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  FolderOpen,
  Layers,
} from "lucide-react";
import { ProgressCircle } from "@/components/shared/ProgressCircle";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ProjectTimeline } from "@/components/shared/ProjectTimeline";
import { getClientContext } from "@/lib/buildiq/get-client-context";
import { getClientTasks } from "@/lib/buildiq/get-client-tasks";
import { resolveClientNextAction } from "@/lib/buildiq/client-next-action";
import { getNextStepCta } from "@/lib/buildiq/project-stages";
import { ClientTaskList } from "@/components/buildiq/ClientTaskList";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Dashboard" };

export default async function BuildIQDashboardPage() {
  const user = await getServerUser();
  if (!user) return null;

  const supabase = await createClient();

  const { firstName, client, project, assessmentSubmitted } =
    await getClientContext(user.id);

  let buildcheck = null;
  let upcomingMeeting = null;
  let recentMeeting = null;
  let tasks: Awaited<ReturnType<typeof getClientTasks>> = [];

  if (client?.id) {
    const [buildcheckRes, upcomingMeetingRes, recentMeetingRes, tasksList] =
      await Promise.all([
      supabase
        .from("buildchecks")
        .select("id, buildcheck_status, savings_min, savings_max, risk_level")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("meetings")
        .select("id, meeting_type, scheduled_at, status, meeting_url")
        .eq("client_id", client.id)
        .eq("status", "scheduled")
        .order("scheduled_at", { ascending: true })
        .limit(1)
        .maybeSingle(),
      supabase
        .from("meetings")
        .select("id, meeting_type, scheduled_at, status, meeting_url")
        .eq("client_id", client.id)
        .neq("status", "scheduled")
        .order("scheduled_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      getClientTasks(supabase, client.id, { limit: 5 }),
    ]);

    buildcheck = buildcheckRes.data;
    upcomingMeeting = upcomingMeetingRes.data;
    recentMeeting = recentMeetingRes.data;
    tasks = tasksList;
  }

  const nextAction = resolveClientNextAction({
    projectStage: project?.project_stage ?? null,
    upcomingMeeting: upcomingMeeting as Parameters<typeof resolveClientNextAction>[0]["upcomingMeeting"],
    recentMeeting: recentMeeting as Parameters<typeof resolveClientNextAction>[0]["recentMeeting"],
    buildcheck: buildcheck as Parameters<typeof resolveClientNextAction>[0]["buildcheck"],
    nextTask: tasks[0] ?? null,
  });

  const NextActionIcon = nextAction.icon;
  const confidence = project?.confidence_score ?? 0;
  const nextStepCta = getNextStepCta(project?.project_stage, { assessmentSubmitted });

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#b67c2c] mb-1">
            Client Dashboard
          </p>
          <h1 className="text-xl font-bold text-[#111A24]">
            Welcome back, {firstName}
          </h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Here&apos;s the latest on your project with Eduardo.
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
        </div>
      </div>

      <div className="px-8 py-6 space-y-6">
        {/* Row 1: Project banner + Readiness + Advisor */}
        <div className="grid lg:grid-cols-[1fr_260px_240px] gap-5">
          {/* Project banner */}
          <div className="rounded-2xl overflow-hidden relative min-h-[170px]">
            <img
              src="https://rdeavyxckvkfwjvmxugs.supabase.co/storage/v1/object/public/media/hero%20banner%20desktop.jpg"
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#111A24]/75 via-[#111A24]/45 to-[#111A24]/15" />
            <div className="relative p-6">
              <p className="text-white/80 text-xs uppercase tracking-wider mb-1">Your Project</p>
              {project ? (
                <>
                  <h2 className="text-xl font-bold text-white mb-2 drop-shadow-sm">
                    {project.project_name}
                  </h2>
                  <div className="flex items-center gap-3 flex-wrap">
                    {project.project_stage && (
                      <div className="text-xs text-white/75">
                        Stage:{" "}
                        <span className="text-white font-medium capitalize">
                          {project.project_stage.replace(/_/g, " ")}
                        </span>
                      </div>
                    )}
                    {project.budget_range && (
                      <div className="text-xs text-white/75">
                        Budget:{" "}
                        <span className="text-white font-medium">{project.budget_range}</span>
                      </div>
                    )}
                    {project.location && (
                      <div className="text-xs text-white/75">{project.location}</div>
                    )}
                  </div>
                  <div className="mt-3">
                    <StatusBadge status={project.project_status} />
                  </div>
                </>
              ) : (
                <>
                  <h2 className="text-lg font-bold text-white mb-1 drop-shadow-sm">
                    Your project is being set up
                  </h2>
                  <p className="text-white/80 text-sm max-w-md">
                    Eduardo is preparing your client workspace. Book a meeting if you need anything in the meantime.
                  </p>
                  <Link
                    href="/buildiq/meetings"
                    className="inline-flex items-center gap-1.5 mt-3 text-xs font-semibold text-[#b67c2c] hover:text-[#d4a04a] transition-colors"
                  >
                    <CalendarDays size={13} />
                    Book a Meeting
                  </Link>
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
                View Project Details →
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
                href="/buildiq/meetings"
                className="flex items-center justify-center gap-1.5 bg-[#b67c2c] hover:bg-[#9f6c27] text-white text-xs font-semibold py-2 px-3 rounded-lg transition-colors"
              >
                <CalendarDays size={13} />
                Book Meeting
              </Link>
              <Link
                href="/buildiq/documents"
                className="flex items-center justify-center gap-1.5 border border-gray-200 text-[#111A24] hover:border-[#111A24] text-xs font-semibold py-2 px-3 rounded-lg transition-colors"
              >
                <FolderOpen size={13} />
                Upload Documents
              </Link>
            </div>
          </div>
        </div>

        {/* Row 2: Journey timeline + Next action */}
        <div className="grid lg:grid-cols-[1fr_280px] gap-5 items-stretch">
          {/* Journey timeline — reusable component */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm font-bold text-[#111A24]">Your Project Journey</p>
              <Link href="/buildiq/project" className="text-xs text-[#b67c2c] hover:underline">
                View Full Timeline →
              </Link>
            </div>
            <ProjectTimeline
              stage={project?.project_stage}
              size="compact"
              assessmentSubmitted={assessmentSubmitted}
              nextStepHref={nextStepCta?.href}
              nextStepCtaLabel={nextStepCta?.label}
            />
          </div>

          {/* Contextual next action */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col">
            <p className="text-xs font-semibold text-[#111A24] uppercase tracking-wider mb-4">
              {nextAction.eyebrow}
            </p>
            <div className="flex flex-col flex-1">
              <div className="flex items-start gap-2.5 mb-2">
                <NextActionIcon size={16} className="text-[#b67c2c] shrink-0 mt-0.5" />
                <p className="text-sm font-semibold text-[#111A24] leading-snug">
                  {nextAction.title}
                </p>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed flex-1">
                {nextAction.description}
              </p>
              {nextAction.ctaExternal ? (
                <a
                  href={nextAction.ctaHref}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 flex items-center justify-center gap-2 bg-[#111A24] text-white text-xs font-semibold py-2.5 rounded-lg hover:bg-[#1d2a38] transition-colors"
                >
                  {nextAction.ctaLabel}
                  <ArrowRight size={13} />
                </a>
              ) : (
                <Link
                  href={nextAction.ctaHref}
                  className="mt-4 flex items-center justify-center gap-2 bg-[#b67c2c] hover:bg-[#9f6c27] text-white text-xs font-semibold py-2.5 rounded-lg transition-colors"
                >
                  {nextAction.ctaLabel}
                  <ArrowRight size={13} />
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Row 3: Tasks + Quick actions */}
        <div className="grid lg:grid-cols-[1fr_280px] gap-5 items-stretch">
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
              <ClientTaskList tasks={tasks} />
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <CheckCircle2 size={32} className="text-green-400 mb-2" />
                <p className="text-sm font-medium text-[#111A24]">All caught up!</p>
                <p className="text-xs text-muted-foreground mt-1">No pending tasks at the moment.</p>
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col">
            <p className="text-xs font-semibold text-[#111A24] uppercase tracking-wider mb-4">
              Quick Actions
            </p>
            <div className="space-y-2">
              {[
                { label: "Documents", desc: "Upload & manage files", href: "/buildiq/documents", icon: FolderOpen },
                { label: "Meetings", desc: "View upcoming calls", href: "/buildiq/meetings", icon: CalendarDays },
                { label: "Project", desc: "Track your journey", href: "/buildiq/project", icon: Layers },
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
                  <ArrowRight
                    size={13}
                    className="text-gray-300 ml-auto shrink-0 group-hover:text-[#b67c2c] transition-colors"
                  />
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
