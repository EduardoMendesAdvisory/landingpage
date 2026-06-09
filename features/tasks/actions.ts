"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type ActionResult = { success: true } | { error: string };

async function requireAdmin(): Promise<{ userId: string } | { error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized." };

  const { data: adminUser } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if ((adminUser as { role: string } | null)?.role !== "admin") {
    return { error: "Unauthorized." };
  }

  return { userId: user.id };
}

async function resolveClientLinks(clientId: string) {
  const admin = createAdminClient();

  const { data: client } = await admin
    .from("clients")
    .select("user_id, lead_id")
    .eq("id", clientId)
    .single();

  if (!client) return null;

  const clientRow = client as { user_id: string; lead_id: string | null };

  const { data: project } = await admin
    .from("projects")
    .select("id")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return {
    userId: clientRow.user_id,
    leadId: clientRow.lead_id,
    projectId: (project as { id: string } | null)?.id ?? null,
  };
}

export async function createClientTask(input: {
  clientId: string;
  title: string;
  description?: string;
  dueDate?: string;
}): Promise<ActionResult & { taskId?: string }> {
  const auth = await requireAdmin();
  if ("error" in auth) return auth;

  const title = input.title.trim();
  if (!title) return { error: "Task title is required." };

  const links = await resolveClientLinks(input.clientId);
  if (!links) return { error: "Client not found." };

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("tasks")
    .insert({
      client_id: input.clientId,
      project_id: links.projectId,
      lead_id: links.leadId,
      assigned_to: links.userId,
      title,
      description: input.description?.trim() || null,
      due_date: input.dueDate || null,
      status: "pending",
    })
    .select("id")
    .single();

  if (error || !data) {
    console.error("[createClientTask]", error);
    return { error: "Could not create task." };
  }

  revalidatePath("/advisor/clients");
  revalidatePath(`/advisor/clients/${input.clientId}`);
  revalidatePath("/buildiq/dashboard");
  revalidatePath("/buildiq/project");
  return { success: true, taskId: (data as { id: string }).id };
}

export async function updateClientTask(input: {
  taskId: string;
  title: string;
  description?: string;
  dueDate?: string | null;
  status?: string;
}): Promise<ActionResult> {
  const auth = await requireAdmin();
  if ("error" in auth) return auth;

  const title = input.title.trim();
  if (!title) return { error: "Task title is required." };

  const admin = createAdminClient();
  const { data: task } = await admin
    .from("tasks")
    .select("client_id")
    .eq("id", input.taskId)
    .single();

  if (!task) return { error: "Task not found." };

  const { error } = await admin
    .from("tasks")
    .update({
      title,
      description: input.description?.trim() || null,
      due_date: input.dueDate || null,
      status: input.status ?? "pending",
      completed_at: input.status === "completed" ? new Date().toISOString() : null,
    })
    .eq("id", input.taskId);

  if (error) {
    console.error("[updateClientTask]", error);
    return { error: "Could not update task." };
  }

  const clientId = (task as { client_id: string | null }).client_id;
  revalidatePath("/advisor/clients");
  if (clientId) revalidatePath(`/advisor/clients/${clientId}`);
  revalidatePath("/buildiq/dashboard");
  return { success: true };
}

export async function deleteClientTask(taskId: string): Promise<ActionResult> {
  const auth = await requireAdmin();
  if ("error" in auth) return auth;

  const admin = createAdminClient();
  const { data: task } = await admin
    .from("tasks")
    .select("client_id")
    .eq("id", taskId)
    .single();

  if (!task) return { error: "Task not found." };

  const { error } = await admin.from("tasks").delete().eq("id", taskId);

  if (error) {
    console.error("[deleteClientTask]", error);
    return { error: "Could not delete task." };
  }

  const clientId = (task as { client_id: string | null }).client_id;
  revalidatePath("/advisor/clients");
  if (clientId) revalidatePath(`/advisor/clients/${clientId}`);
  revalidatePath("/buildiq/dashboard");
  return { success: true };
}

export async function completeClientTask(taskId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "You must be signed in." };

  const { data: clientRow } = await supabase
    .from("clients")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  const clientId = (clientRow as { id: string } | null)?.id;
  if (!clientId) return { error: "Client account not found." };

  const { error } = await supabase
    .from("tasks")
    .update({
      status: "completed",
      completed_at: new Date().toISOString(),
    })
    .eq("id", taskId)
    .eq("client_id", clientId);

  if (error) {
    console.error("[completeClientTask]", error);
    return { error: "Could not complete task." };
  }

  revalidatePath("/buildiq/dashboard");
  revalidatePath("/buildiq/project");
  return { success: true };
}
