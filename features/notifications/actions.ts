"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export type AdvisorNotification = {
  id: string;
  title: string;
  message: string | null;
  action_url: string | null;
  is_read: boolean | null;
  created_at: string;
  notification_type: string;
};

type ActionResult = { success: true } | { error: string };

async function requireAdminUserId(): Promise<{ userId: string } | { error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized." };

  const { data: row } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if ((row as { role: string } | null)?.role !== "admin") {
    return { error: "Unauthorized." };
  }

  return { userId: user.id };
}

export async function getAdvisorNotifications(): Promise<{
  unreadCount: number;
  notifications: AdvisorNotification[];
}> {
  const auth = await requireAdminUserId();
  if ("error" in auth) return { unreadCount: 0, notifications: [] };

  const admin = createAdminClient();

  const [{ count: unreadCount }, { data }] = await Promise.all([
    admin
      .from("notifications")
      .select("id", { count: "exact", head: true })
      .eq("user_id", auth.userId)
      .eq("is_read", false),
    admin
      .from("notifications")
      .select("id, title, message, action_url, is_read, created_at, notification_type")
      .eq("user_id", auth.userId)
      .order("created_at", { ascending: false })
      .limit(20),
  ]);

  const notifications = (data ?? []) as AdvisorNotification[];

  return { unreadCount: unreadCount ?? 0, notifications };
}

export async function markNotificationRead(notificationId: string): Promise<ActionResult> {
  const auth = await requireAdminUserId();
  if ("error" in auth) return auth;

  const admin = createAdminClient();
  await admin
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId)
    .eq("user_id", auth.userId);

  revalidatePath("/advisor/dashboard");
  return { success: true };
}

export async function markAllNotificationsRead(): Promise<ActionResult> {
  const auth = await requireAdminUserId();
  if ("error" in auth) return auth;

  const admin = createAdminClient();
  await admin
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", auth.userId)
    .eq("is_read", false);

  revalidatePath("/advisor/dashboard");
  return { success: true };
}
