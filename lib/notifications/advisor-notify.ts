import type { createAdminClient } from "@/lib/supabase/admin";
import type { Database } from "@/types/database.types";
import { getMasterAdminEmails } from "@/lib/auth/master-access";

type AdminClient = ReturnType<typeof createAdminClient>;
type NotificationType = Database["public"]["Enums"]["notification_type"];

export async function getAdvisorUserIds(admin: AdminClient): Promise<string[]> {
  const emails = getMasterAdminEmails();

  const [{ data: byEmail }, { data: byRole }] = await Promise.all([
    emails.length
      ? admin.from("users").select("id").in("email", emails)
      : Promise.resolve({ data: [] }),
    admin.from("users").select("id").eq("role", "admin"),
  ]);

  const ids = new Set<string>();
  for (const row of (byEmail ?? []) as Array<{ id: string }>) ids.add(row.id);
  for (const row of (byRole ?? []) as Array<{ id: string }>) ids.add(row.id);
  return [...ids];
}

export async function notifyAdvisors(
  admin: AdminClient,
  input: {
    type: NotificationType;
    title: string;
    message: string;
    actionUrl?: string;
    entityType?: string;
    entityId?: string;
  }
) {
  const userIds = await getAdvisorUserIds(admin);
  if (!userIds.length) return;

  const rows = userIds.map((userId) => ({
    user_id: userId,
    notification_type: input.type,
    title: input.title,
    message: input.message,
    action_url: input.actionUrl ?? null,
    entity_type: input.entityType ?? null,
    entity_id: input.entityId ?? null,
    is_read: false,
  }));

  await admin.from("notifications").insert(rows as never);
}
