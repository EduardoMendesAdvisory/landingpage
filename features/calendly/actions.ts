"use server";

import { createClient } from "@/lib/supabase/server";
import { runCalendlySetup } from "@/lib/calendly/setup";

async function requireAdmin(): Promise<{ ok: true } | { error: string }> {
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

  return { ok: true };
}

export async function setupCalendlyIntegration() {
  const auth = await requireAdmin();
  if ("error" in auth) return auth;

  return runCalendlySetup();
}
