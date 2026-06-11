"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/database.types";

type BuildcheckStatus = Database["public"]["Enums"]["buildcheck_status"];
type ActionResult = { success: true } | { error: string };

async function requireAdmin(): Promise<{ error: string } | { ok: true }> {
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

function revalidateClientPaths(clientId: string | null) {
  revalidatePath("/advisor/projects");
  if (clientId) {
    revalidatePath(`/advisor/projects/${clientId}`);
    revalidatePath(`/advisor/clients/${clientId}`);
  }
}

export async function updateBuildcheckReview(input: {
  buildcheckId: string;
  clientId: string;
  status: BuildcheckStatus;
  notes?: string;
  riskLevel?: string;
  savingsMin?: number | null;
  savingsMax?: number | null;
  summary?: string;
}): Promise<ActionResult> {
  const auth = await requireAdmin();
  if ("error" in auth) return auth;

  const admin = createAdminClient();

  const { error } = await admin
    .from("buildchecks")
    .update({
      buildcheck_status: input.status,
      notes: input.notes?.trim() || null,
      risk_level: input.riskLevel?.trim() || null,
      summary: input.summary?.trim() || null,
      savings_min: input.savingsMin ?? undefined,
      savings_max: input.savingsMax ?? undefined,
      ...(input.status === "completed"
        ? { completed_at: new Date().toISOString() }
        : {}),
    } as never)
    .eq("id", input.buildcheckId);

  if (error) {
    console.error("[updateBuildcheckReview]", error);
    return { error: "Could not update quote review." };
  }

  revalidateClientPaths(input.clientId);
  revalidatePath("/advisor/dashboard");
  revalidatePath("/buildiq/dashboard");
  return { success: true };
}
