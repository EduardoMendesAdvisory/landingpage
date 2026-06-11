import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

export const BUILDIQ_PORTAL_PENDING_PATH = "/portal-pending";

type Supabase = SupabaseClient<Database>;

export type BuildIQAccessResult =
  | { allowed: true }
  | { allowed: false; redirectTo: string };

export async function checkBuildIQPortalAccess(
  supabase: Supabase,
  userId: string
): Promise<BuildIQAccessResult> {
  const [{ data: userRow }, { data: clientRow }] = await Promise.all([
    supabase.from("users").select("role").eq("id", userId).single(),
    supabase
      .from("clients")
      .select("id, client_status")
      .eq("user_id", userId)
      .maybeSingle(),
  ]);

  const role = (userRow as { role: string } | null)?.role;

  if (role === "admin") {
    return { allowed: false, redirectTo: "/advisor/dashboard" };
  }

  const client = clientRow as { id: string; client_status: string } | null;

  if (!client || client.client_status !== "active") {
    return { allowed: false, redirectTo: BUILDIQ_PORTAL_PENDING_PATH };
  }

  return { allowed: true };
}

export function hasActiveClientPortalAccess(
  role: string | null | undefined,
  client: { client_status: string } | null | undefined
): boolean {
  if (role === "admin") return false;
  return Boolean(client && client.client_status === "active");
}
