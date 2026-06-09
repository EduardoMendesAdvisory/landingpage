import { Metadata } from "next";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { PageHeader } from "@/components/shared/PageHeader";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDate } from "@/utils/formatters";
import { ArrowRight, Briefcase, ListTodo } from "lucide-react";

export const metadata: Metadata = { title: "Clients" };

export default async function AdvisorClientsPage() {
  const supabase = await createClient();

  const { data: clientsData } = await supabase
    .from("clients")
    .select("id, client_status, activated_at, user_id")
    .eq("client_status", "active")
    .order("activated_at", { ascending: false });

  const clients = (clientsData ?? []) as Array<{
    id: string;
    client_status: string;
    activated_at: string;
    user_id: string;
  }>;

  const userIds = clients.map((c) => c.user_id);
  const clientIds = clients.map((c) => c.id);

  const [usersResult, profilesResult, tasksResult] = await Promise.all([
    userIds.length
      ? supabase.from("users").select("id, email").in("id", userIds)
      : Promise.resolve({ data: [] }),
    userIds.length
      ? supabase
          .from("user_profiles")
          .select("user_id, first_name, last_name")
          .in("user_id", userIds)
      : Promise.resolve({ data: [] }),
    clientIds.length
      ? supabase
          .from("tasks")
          .select("client_id")
          .in("client_id", clientIds)
          .neq("status", "completed")
      : Promise.resolve({ data: [] }),
  ]);

  const emailByUserId = new Map(
    ((usersResult.data ?? []) as Array<{ id: string; email: string }>).map((u) => [
      u.id,
      u.email,
    ])
  );

  const nameByUserId = new Map(
    ((profilesResult.data ?? []) as Array<{
      user_id: string;
      first_name: string | null;
      last_name: string | null;
    }>).map((p) => [
      p.user_id,
      [p.first_name, p.last_name].filter(Boolean).join(" "),
    ])
  );

  const pendingTasksByClient = new Map<string, number>();
  for (const row of (tasksResult.data ?? []) as Array<{ client_id: string | null }>) {
    if (!row.client_id) continue;
    pendingTasksByClient.set(
      row.client_id,
      (pendingTasksByClient.get(row.client_id) ?? 0) + 1
    );
  }

  return (
    <>
      <DashboardHeader title="AdvisorHQ" userName="Eduardo" userInitials="EM" />
      <div className="flex-1 px-6 py-8 space-y-6">
        <PageHeader
          title="Clients"
          description="Manage active clients and assign tasks they need to complete."
        />

        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden">
          {clients.length === 0 ? (
            <div className="p-10 text-center text-sm text-muted-foreground">
              No active clients yet. Activate a lead from the dashboard to get started.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Client
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Status
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Active since
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Open tasks
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {clients.map((client) => {
                  const email = emailByUserId.get(client.user_id) ?? "Unknown";
                  const name = nameByUserId.get(client.user_id);
                  const label = name || email.split("@")[0];
                  const openTasks = pendingTasksByClient.get(client.id) ?? 0;

                  return (
                    <tr key={client.id} className="hover:bg-light-bg transition-colors">
                      <td className="px-5 py-3">
                        <p className="font-medium text-navy">{label}</p>
                        <p className="text-xs text-muted-foreground">{email}</p>
                      </td>
                      <td className="px-5 py-3">
                        <StatusBadge status={client.client_status} />
                      </td>
                      <td className="px-5 py-3 text-muted-foreground text-xs">
                        {formatDate(client.activated_at)}
                      </td>
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center gap-1.5 text-xs font-medium text-navy">
                          <ListTodo size={14} className="text-warm-soil" />
                          {openTasks}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        <Link
                          href={`/advisor/clients/${client.id}`}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-warm-soil hover:underline"
                        >
                          Manage tasks
                          <ArrowRight size={13} />
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <Link
          href="/advisor/dashboard"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-navy"
        >
          <Briefcase size={15} />
          Back to dashboard
        </Link>
      </div>
    </>
  );
}
