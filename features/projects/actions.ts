"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import {
  isValidStage,
  type ProjectStage,
} from "@/lib/buildiq/project-stages";

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

function revalidateProjectPaths(clientId: string | null) {
  revalidatePath("/advisor/projects");
  revalidatePath("/buildiq/dashboard");
  revalidatePath("/buildiq/project");
  if (clientId) {
    revalidatePath(`/advisor/projects/${clientId}`);
    revalidatePath(`/advisor/clients/${clientId}`);
  }
}

export async function updateProjectStage(input: {
  projectId: string;
  stage: ProjectStage;
}): Promise<ActionResult> {
  const auth = await requireAdmin();
  if ("error" in auth) return auth;

  if (!isValidStage(input.stage)) {
    return { error: "Invalid project stage." };
  }

  const admin = createAdminClient();
  const { data: project } = await admin
    .from("projects")
    .select("client_id")
    .eq("id", input.projectId)
    .single();

  if (!project) return { error: "Project not found." };

  const { error } = await admin
    .from("projects")
    .update({ project_stage: input.stage })
    .eq("id", input.projectId);

  if (error) {
    console.error("[updateProjectStage]", error);
    return { error: "Could not update project stage." };
  }

  revalidateProjectPaths((project as { client_id: string }).client_id);
  return { success: true };
}

export async function updateProjectNotes(input: {
  projectId: string;
  notes: string;
}): Promise<ActionResult> {
  const auth = await requireAdmin();
  if ("error" in auth) return auth;

  const admin = createAdminClient();
  const { data: project } = await admin
    .from("projects")
    .select("client_id")
    .eq("id", input.projectId)
    .single();

  if (!project) return { error: "Project not found." };

  const { error } = await admin
    .from("projects")
    .update({ notes: input.notes.trim() || null })
    .eq("id", input.projectId);

  if (error) {
    console.error("[updateProjectNotes]", error);
    return { error: "Could not save project notes." };
  }

  revalidateProjectPaths((project as { client_id: string }).client_id);
  return { success: true };
}
