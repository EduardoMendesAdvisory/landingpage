import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

export type ClientTask = {
  id: string;
  title: string;
  description: string | null;
  status: string;
  due_date: string | null;
};

type Supabase = SupabaseClient<Database>;

export async function getClientTasks(
  supabase: Supabase,
  clientId: string,
  options?: { limit?: number; includeCompleted?: boolean }
): Promise<ClientTask[]> {
  const limit = options?.limit ?? 10;

  let query = supabase
    .from("tasks")
    .select("id, title, description, status, due_date")
    .eq("client_id", clientId)
    .order("due_date", { ascending: true, nullsFirst: false })
    .order("created_at", { ascending: false })
    .limit(limit);

  if (!options?.includeCompleted) {
    query = query.neq("status", "completed");
  }

  const { data, error } = await query;

  if (error) {
    console.error("[getClientTasks]", error);
    return [];
  }

  return (data ?? []) as ClientTask[];
}

export function formatTaskDueDate(dueDate: string | null): string | null {
  if (!dueDate) return null;
  return new Date(dueDate).toLocaleDateString("en-AU", { dateStyle: "medium" });
}

export function isTaskOverdue(dueDate: string | null): boolean {
  if (!dueDate) return false;
  const due = new Date(dueDate);
  due.setHours(23, 59, 59, 999);
  return due < new Date();
}
