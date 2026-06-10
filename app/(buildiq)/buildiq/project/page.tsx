import { Metadata } from "next";
import { createClient, getServerUser } from "@/lib/supabase/server";
import Link from "next/link";
import {
  CalendarDays,
  CheckCircle2,
  Circle,
  Clock,
  Edit3,
  Home,
  MapPin,
  TrendingUp,
} from "lucide-react";
import { ProgressCircle } from "@/components/shared/ProgressCircle";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ProjectTimeline } from "@/components/shared/ProjectTimeline";
import { getClientContext } from "@/lib/buildiq/get-client-context";
import { getClientTasks } from "@/lib/buildiq/get-client-tasks";
import { getEffectiveActiveIndex, getNextStepCta } from "@/lib/buildiq/project-stages";
import { ClientTaskList } from "@/components/buildiq/ClientTaskList";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "My Project" };

type Project = {
  id: string;
  project_name: string;
  project_type: string | null;
  project_status: string;
  project_stage: string | null;
  location: string | null;
  suburb: string | null;
  state: string | null;
  budget_range: string | null;
  confidence_score: number | null;
  notes: string | null;
  started_at: string | null;
  created_at: string;
};

type Milestone = {
  id: string;
  milestone_name: string;
  milestone_description: string | null;
  status: string;
  due_date: string | null;
  completed_at: string | null;
  order_index: number;
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "--";
  return new Date(dateStr).toLocaleDateString("en-AU", { dateStyle: "medium" });
}

export default async function MyProjectPage() {
  const user = await getServerUser();
  if (!user) return null;

  const supabase = await createClient();

  const { project: ctxProject, assessmentSubmitted } = await getClientContext(user.id);

  const clientResult = await supabase
    .from("clients")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  const client = clientResult.data as { id: string } | null;

  let project: Project | null = null;
  let milestones: Milestone[] = [];
  let tasks: Awaited<ReturnType<typeof getClientTasks>> = [];

  if (client?.id) {
    const [projectRes, tasksList] = await Promise.all([
      supabase
        .from("projects")
        .select("id, project_name, project_type, project_status, project_stage, location, suburb, state, budget_range, confidence_score, notes, started_at, created_at")
        .eq("client_id", client.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
      getClientTasks(supabase, client.id, { limit: 20 }),
    ]);

    project = projectRes.data as Project | null;
    tasks = tasksList;
    if (project?.id) {
      milestones = ((await supabase
        .from("project_timeline")
        .select("id, milestone_name, milestone_description, status, due_date, completed_at, order_index")
        .eq("project_id", project.id)
        .order("order_index", { ascending: true })).data ?? []) as Milestone[];
    }
  }

  const journeyIndex = getEffectiveActiveIndex(project?.project_stage ?? null, {
    assessmentSubmitted,
  });
  const nextStepCta = getNextStepCta(project?.project_stage ?? ctxProject?.project_stage, {
    assessmentSubmitted,
  });
  const completedMilestones = milestones.filter((m) => m.status === "completed").length;
  const progress = milestones.length > 0 ? Math.round((completedMilestones / milestones.length) * 100) : 0;

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-xl font-bold text-[#111A24]">My Project</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Overview and progress of your project journey.</p>
        </div>
        <Link
          href="/buildiq/meetings"
          className="inline-flex items-center gap-2 bg-[#111A24] hover:bg-[#1d2a38] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <CalendarDays size={15} />
          Book a Meeting
        </Link>
      </div>

      <div className="px-8 py-6 space-y-5">
        {!project ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 rounded-full bg-[#b67c2c]/10 flex items-center justify-center mb-4">
              <Home size={28} className="text-[#b67c2c]" />
            </div>
            <h2 className="text-lg font-bold text-[#111A24] mb-2">Project setup in progress</h2>
            <p className="text-sm text-muted-foreground max-w-md mb-6 leading-relaxed">
              Eduardo is configuring your project workspace. Book a meeting anytime for updates or to share new documents.
            </p>
            <Link
              href="/buildiq/meetings"
              className="inline-flex items-center gap-2 bg-[#b67c2c] hover:bg-[#9f6c27] text-white font-semibold px-6 py-3 rounded-lg text-sm transition-colors"
            >
              <CalendarDays size={15} />
              Book a Meeting
            </Link>
          </div>
        ) : (
          <>
            {/* Project hero card */}
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="grid lg:grid-cols-[1fr_260px]">
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <h2 className="text-2xl font-bold text-[#111A24]">{project.project_name}</h2>
                      {(project.suburb || project.state) && (
                        <div className="flex items-center gap-1.5 mt-1 text-muted-foreground text-sm">
                          <MapPin size={13} />
                          <span>{[project.suburb, project.state].filter(Boolean).join(", ")}</span>
                        </div>
                      )}
                    </div>
                    <StatusBadge status={project.project_status} />
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Project Stage</p>
                      <p className="text-sm font-semibold text-[#b67c2c] capitalize">
                        {project.project_stage?.replace(/_/g, " ") ?? "Planning"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Project Start</p>
                      <div className="flex items-center gap-1.5 text-sm font-medium text-[#111A24]">
                        <CalendarDays size={13} className="text-muted-foreground" />
                        {formatDate(project.started_at ?? project.created_at)}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-0.5">Budget</p>
                      <p className="text-sm font-medium text-[#111A24]">{project.budget_range ?? "--"}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 border-l border-gray-100 p-6 flex flex-col items-center justify-center gap-2">
                  <p className="text-xs font-semibold text-[#111A24] uppercase tracking-wider">Project Confidence</p>
                  <ProgressCircle value={project.confidence_score ?? 0} size="md" />
                  <p className="text-xs text-muted-foreground text-center">
                    {(project.confidence_score ?? 0) >= 75 ? "High Confidence" :
                     (project.confidence_score ?? 0) >= 55 ? "On Track" : "Building Progress"}
                  </p>
                </div>
              </div>
            </div>

            {/* Journey + At a Glance */}
            <div className="grid lg:grid-cols-[1fr_280px] gap-5">
              {/* Journey timeline — reusable component */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <p className="text-sm font-bold text-[#111A24] mb-5">Project Journey</p>
                <ProjectTimeline
                  stage={project.project_stage}
                  size="compact"
                  assessmentSubmitted={assessmentSubmitted}
                  nextStepHref={nextStepCta?.href}
                  nextStepCtaLabel={nextStepCta?.label}
                />
                {project.notes && (
                  <div className="mt-5 bg-[#b67c2c]/5 border border-[#b67c2c]/15 rounded-xl p-4">
                    <p className="text-xs font-semibold text-[#b67c2c] mb-1">Current Stage Notes</p>
                    <p className="text-xs text-[#111A24]/80 leading-relaxed">{project.notes}</p>
                  </div>
                )}
              </div>

              {/* At a glance */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-bold text-[#111A24]">Project At a Glance</p>
                  <Link href="/buildiq/profile" className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors">
                    <Edit3 size={14} className="text-muted-foreground" />
                  </Link>
                </div>
                <div className="space-y-3 text-sm">
                  {[
                    { label: "Budget", value: project.budget_range ?? "--" },
                    { label: "Project Type", value: project.project_type?.replace(/_/g, " ") ?? "--" },
                    { label: "Location", value: [project.suburb, project.state].filter(Boolean).join(", ") || "--" },
                    { label: "Started", value: formatDate(project.started_at ?? project.created_at) },
                  ].map((row) => (
                    <div key={row.label} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <span className="text-xs text-muted-foreground">{row.label}</span>
                      <span className="text-xs font-semibold text-[#111A24] capitalize">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Milestones + Progress */}
            <div className="grid lg:grid-cols-2 gap-5">
              {/* Key Milestones */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <p className="text-sm font-bold text-[#111A24] mb-4">Key Milestones</p>
                {milestones.length > 0 ? (
                  <div className="space-y-2">
                    {milestones.map((m) => (
                      <div key={m.id} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                        {m.status === "completed" ? (
                          <CheckCircle2 size={16} className="text-green-500 shrink-0 mt-0.5" />
                        ) : m.status === "in_progress" ? (
                          <div className="h-4 w-4 rounded-full border-2 border-[#b67c2c] flex items-center justify-center shrink-0 mt-0.5">
                            <div className="h-1.5 w-1.5 rounded-full bg-[#b67c2c]" />
                          </div>
                        ) : (
                          <Circle size={16} className="text-gray-300 shrink-0 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-semibold ${
                            m.status === "completed" ? "text-[#111A24]" :
                            m.status === "in_progress" ? "text-[#b67c2c]" : "text-gray-400"
                          }`}>
                            {m.milestone_name}
                          </p>
                          {m.milestone_description && (
                            <p className="text-[10px] text-muted-foreground mt-0.5">{m.milestone_description}</p>
                          )}
                        </div>
                        <span className={`text-[10px] font-medium shrink-0 ${
                          m.status === "completed" ? "text-green-600" :
                          m.status === "in_progress" ? "text-[#b67c2c]" : "text-gray-400"
                        }`}>
                          {m.status === "completed" ? formatDate(m.completed_at) :
                           m.due_date ? formatDate(m.due_date) : "Upcoming"}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-8 text-center">
                    <Clock size={28} className="text-gray-200 mb-2" />
                    <p className="text-sm text-muted-foreground">No milestones set yet.</p>
                    <p className="text-xs text-muted-foreground mt-1">Eduardo will add milestones as your project progresses.</p>
                  </div>
                )}
              </div>

              {/* Project Progress bars */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <p className="text-sm font-bold text-[#111A24] mb-4">Project Progress</p>
                <div className="space-y-4">
                  {[
                    { label: "Assessment & Strategy", pct: journeyIndex >= 2 ? 100 : journeyIndex === 1 ? 70 : journeyIndex === 0 ? 40 : 0 },
                    { label: "Detailed Review", pct: journeyIndex >= 4 ? 100 : journeyIndex === 3 ? 65 : 0 },
                    { label: "Advisory Support", pct: journeyIndex >= 5 ? 65 : 0 },
                    { label: "Completion", pct: journeyIndex >= 6 ? 100 : 0 },
                  ].map((bar) => (
                    <div key={bar.label}>
                      <div className="flex justify-between items-center mb-1.5">
                        <span className="text-xs font-medium text-[#111A24]">{bar.label}</span>
                        <span className="text-xs font-bold text-[#111A24]">{bar.pct}%</span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            bar.pct === 100 ? "bg-green-500" : "bg-[#b67c2c]"
                          }`}
                          style={{ width: `${bar.pct}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-5 bg-amber-50 border border-amber-100 rounded-xl p-4 flex items-start gap-3">
                  <TrendingUp size={16} className="text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-800 leading-relaxed">
                    {progress > 0
                      ? `Great progress! ${progress}% of milestones completed. We're here to support you every step of the way.`
                      : "Your project is just getting started. Eduardo will guide you through each step."}
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <p className="text-sm font-bold text-[#111A24] mb-4">My Tasks</p>
                {tasks.length > 0 ? (
                  <ClientTaskList tasks={tasks} />
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No pending tasks. Eduardo will assign action items here when needed.
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
