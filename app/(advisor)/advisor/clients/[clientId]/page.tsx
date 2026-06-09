import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { ClientTaskManager } from "@/components/advisor/ClientTaskManager";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = { title: "Client Tasks" };

export default async function AdvisorClientTasksPage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  const supabase = await createClient();

  const { data: client } = await supabase
    .from("clients")
    .select("id, user_id, client_status")
    .eq("id", clientId)
    .single();

  if (!client) notFound();

  const clientRow = client as { id: string; user_id: string; client_status: string };

  const [userResult, profileResult, tasksResult] = await Promise.all([
    supabase.from("users").select("email").eq("id", clientRow.user_id).single(),
    supabase
      .from("user_profiles")
      .select("first_name, last_name")
      .eq("user_id", clientRow.user_id)
      .maybeSingle(),
    supabase
      .from("tasks")
      .select("id, title, description, status, due_date")
      .eq("client_id", clientId)
      .order("due_date", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false }),
  ]);

  const email = (userResult.data as { email: string } | null)?.email ?? "Client";
  const profile = profileResult.data as {
    first_name: string | null;
    last_name: string | null;
  } | null;
  const clientLabel =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
    email.split("@")[0];

  const tasks = (tasksResult.data ?? []) as Array<{
    id: string;
    title: string;
    description: string | null;
    status: string;
    due_date: string | null;
  }>;

  return (
    <>
      <DashboardHeader title="AdvisorHQ" userName="Eduardo" userInitials="EM" />
      <div className="flex-1 px-6 py-8 space-y-6">
        <Link
          href="/advisor/clients"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-navy"
        >
          <ArrowLeft size={15} />
          All clients
        </Link>

        <ClientTaskManager
          clientId={clientId}
          clientLabel={clientLabel}
          initialTasks={tasks}
        />
      </div>
    </>
  );
}
