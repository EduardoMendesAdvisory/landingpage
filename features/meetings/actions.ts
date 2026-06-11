"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type ActionResult = { success: true } | { error: string };

async function requireAdmin(): Promise<
  { error: string } | { ok: true; userId: string }
> {
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
  return { ok: true, userId: user.id };
}

export async function saveMeetingNotes(input: {
  meetingId: string;
  notes: string;
  outcome?: string;
  nextAction?: string;
}): Promise<ActionResult> {
  const auth = await requireAdmin();
  if ("error" in auth) return auth;

  const admin = createAdminClient();
  const { data: existing } = await admin
    .from("meeting_notes")
    .select("id")
    .eq("meeting_id", input.meetingId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const payload = {
    notes: input.notes.trim() || null,
    outcome: input.outcome?.trim() || null,
    next_action: input.nextAction?.trim() || null,
    created_by: auth.userId,
  };

  if (existing) {
    const { error } = await admin
      .from("meeting_notes")
      .update(payload)
      .eq("id", (existing as { id: string }).id);
    if (error) {
      console.error("[saveMeetingNotes]", error);
      return { error: "Could not save notes." };
    }
  } else {
    const { error } = await admin.from("meeting_notes").insert({
      meeting_id: input.meetingId,
      ...payload,
    } as never);
    if (error) {
      console.error("[saveMeetingNotes]", error);
      return { error: "Could not save notes." };
    }
  }

  revalidatePath(`/advisor/calls/${input.meetingId}`);
  revalidatePath("/advisor/calls");
  return { success: true };
}

export async function markMeetingCompleted(meetingId: string): Promise<ActionResult> {
  const auth = await requireAdmin();
  if ("error" in auth) return auth;

  const admin = createAdminClient();
  const { data: meeting } = await admin
    .from("meetings")
    .select("lead_id, client_id")
    .eq("id", meetingId)
    .single();

  if (!meeting) return { error: "Meeting not found." };

  const meetingRow = meeting as { lead_id: string | null; client_id: string | null };

  const { error } = await admin
    .from("meetings")
    .update({
      status: "completed",
      ended_at: new Date().toISOString(),
    })
    .eq("id", meetingId);

  if (error) {
    console.error("[markMeetingCompleted]", error);
    return { error: "Could not update meeting." };
  }

  const leadId = meetingRow.lead_id;
  if (leadId) {
    await admin
      .from("leads")
      .update({ lead_status: "call_completed" })
      .eq("id", leadId);
    revalidatePath(`/advisor/leads/${leadId}`);
  }

  const clientId = meetingRow.client_id;
  if (clientId) {
    const { data: project } = await admin
      .from("projects")
      .select("id, project_stage")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (project) {
      const current = (project as { project_stage: string | null }).project_stage;
      const earlyStages = ["project_assessment", "assessment", "strategy_call", null];
      if (!current || earlyStages.includes(current)) {
        await admin
          .from("projects")
          .update({ project_stage: "strategy_session" })
          .eq("id", (project as { id: string }).id);
      }
    }
  }

  revalidatePath(`/advisor/calls/${meetingId}`);
  revalidatePath("/advisor/calls");
  revalidatePath("/advisor/dashboard");
  revalidatePath("/buildiq/dashboard");
  revalidatePath("/buildiq/project");
  if (clientId) {
    revalidatePath(`/advisor/projects/${clientId}`);
    revalidatePath(`/advisor/clients/${clientId}`);
  }
  return { success: true };
}
