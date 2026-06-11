import { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { PageHeader } from "@/components/shared/PageHeader";
import {
  ProjectsTable,
  type AdvisorProjectRow,
} from "@/components/advisor/ProjectsTable";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Projects" };

type FilterMode = "all" | "pending-reviews" | "open-tasks";

export default async function AdvisorProjectsPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const { filter: filterParam } = await searchParams;
  const initialFilter: FilterMode =
    filterParam === "pending-reviews" || filterParam === "open-tasks"
      ? filterParam
      : "all";

  const admin = createAdminClient();

  const { data: clientsData } = await admin
    .from("clients")
    .select("id, user_id, activated_at, lead_id")
    .eq("client_status", "active")
    .order("activated_at", { ascending: false });

  const clients = (clientsData ?? []) as Array<{
    id: string;
    user_id: string;
    activated_at: string;
    lead_id: string | null;
  }>;

  if (clients.length === 0) {
    return (
      <>
        <DashboardHeader title="AdvisorHQ" userName="Eduardo" userInitials="EM" />
        <div className="flex-1 px-6 py-8 space-y-6">
          <PageHeader
            title="Projects"
            description="Active clients, quote reviews and project journeys in one place."
          />
          <ProjectsTable rows={[]} initialFilter={initialFilter} />
        </div>
      </>
    );
  }

  const clientIds = clients.map((c) => c.id);
  const userIds = clients.map((c) => c.user_id);
  const leadIds = clients.map((c) => c.lead_id).filter((id): id is string => Boolean(id));

  const [usersRes, profilesRes, projectsRes, tasksRes, messagesRes, buildchecksRes] =
    await Promise.all([
      admin.from("users").select("id, email").in("id", userIds),
      admin
        .from("user_profiles")
        .select("user_id, first_name, last_name")
        .in("user_id", userIds),
      admin
        .from("projects")
        .select("id, client_id, project_name, project_stage, project_status, updated_at")
        .in("client_id", clientIds)
        .order("updated_at", { ascending: false }),
      admin
        .from("tasks")
        .select("client_id")
        .in("client_id", clientIds)
        .neq("status", "completed"),
      admin
        .from("messages")
        .select("client_id, sender_id, is_read")
        .in("client_id", clientIds)
        .eq("is_read", false),
      admin
        .from("buildchecks")
        .select("id, project_id, lead_id, buildcheck_status"),
    ]);

  const emailByUserId = new Map(
    ((usersRes.data ?? []) as Array<{ id: string; email: string }>).map((u) => [
      u.id,
      u.email,
    ])
  );

  const nameByUserId = new Map(
    ((profilesRes.data ?? []) as Array<{
      user_id: string;
      first_name: string | null;
      last_name: string | null;
    }>).map((p) => [
      p.user_id,
      [p.first_name, p.last_name].filter(Boolean).join(" "),
    ])
  );

  const projectByClient = new Map<string, (typeof projects)[0]>();
  const projects = (projectsRes.data ?? []) as Array<{
    id: string;
    client_id: string;
    project_name: string;
    project_stage: string | null;
    project_status: string;
    updated_at: string;
  }>;

  for (const project of projects) {
    if (!projectByClient.has(project.client_id)) {
      projectByClient.set(project.client_id, project);
    }
  }

  const openTasksByClient = new Map<string, number>();
  for (const row of (tasksRes.data ?? []) as Array<{ client_id: string | null }>) {
    if (!row.client_id) continue;
    openTasksByClient.set(row.client_id, (openTasksByClient.get(row.client_id) ?? 0) + 1);
  }

  const userIdByClient = new Map(clients.map((c) => [c.id, c.user_id]));
  const unreadByClient = new Map<string, number>();
  for (const msg of (messagesRes.data ?? []) as Array<{
    client_id: string | null;
    sender_id: string;
    is_read: boolean | null;
  }>) {
    if (!msg.client_id) continue;
    const clientUserId = userIdByClient.get(msg.client_id);
    if (clientUserId && msg.sender_id === clientUserId) {
      unreadByClient.set(msg.client_id, (unreadByClient.get(msg.client_id) ?? 0) + 1);
    }
  }

  const projectIdToClient = new Map(
    projects.map((p) => [p.id, p.client_id])
  );
  const leadIdToClient = new Map(
    clients.filter((c) => c.lead_id).map((c) => [c.lead_id!, c.id])
  );

  const pendingReviewsByClient = new Map<string, number>();
  for (const bc of (buildchecksRes.data ?? []) as Array<{
    project_id: string | null;
    lead_id: string | null;
    buildcheck_status: string;
  }>) {
    if (bc.buildcheck_status === "completed") continue;
    const clientId =
      (bc.project_id ? projectIdToClient.get(bc.project_id) : null) ??
      (bc.lead_id ? leadIdToClient.get(bc.lead_id) : null);
    if (!clientId) continue;
    pendingReviewsByClient.set(
      clientId,
      (pendingReviewsByClient.get(clientId) ?? 0) + 1
    );
  }

  const rows: AdvisorProjectRow[] = clients.map((client) => {
    const email = emailByUserId.get(client.user_id) ?? "Unknown";
    const name = nameByUserId.get(client.user_id);
    const project = projectByClient.get(client.id);

    return {
      clientId: client.id,
      displayLabel: name || email.split("@")[0],
      email,
      projectId: project?.id ?? null,
      projectName: project?.project_name ?? null,
      projectStage: project?.project_stage ?? null,
      projectStatus: project?.project_status ?? null,
      openTasks: openTasksByClient.get(client.id) ?? 0,
      pendingReviews: pendingReviewsByClient.get(client.id) ?? 0,
      unreadMessages: unreadByClient.get(client.id) ?? 0,
      activatedAt: client.activated_at,
    };
  });

  const pendingReviewsTotal = rows.reduce((sum, r) => sum + r.pendingReviews, 0);

  return (
    <>
      <DashboardHeader title="AdvisorHQ" userName="Eduardo" userInitials="EM" />
      <div className="flex-1 px-6 py-8 space-y-6">
        <PageHeader
          title="Projects"
          description={`${rows.length} active client${rows.length === 1 ? "" : "s"}${pendingReviewsTotal > 0 ? `  -  ${pendingReviewsTotal} quote review${pendingReviewsTotal === 1 ? "" : "s"} pending` : ""}`}
        />
        <ProjectsTable rows={rows} initialFilter={initialFilter} />
      </div>
    </>
  );
}
