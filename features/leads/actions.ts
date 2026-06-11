"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import type { LeadStatus } from "@/lib/leads/constants";
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

export async function updateLeadStatus(input: {
  leadId: string;
  status: LeadStatus;
}): Promise<ActionResult> {
  const auth = await requireAdmin();
  if ("error" in auth) return auth;

  const admin = createAdminClient();
  const { error } = await admin
    .from("leads")
    .update({ lead_status: input.status })
    .eq("id", input.leadId);

  if (error) {
    console.error("[updateLeadStatus]", error);
    return { error: "Could not update status." };
  }

  revalidatePath("/advisor/leads");
  revalidatePath(`/advisor/leads/${input.leadId}`);
  revalidatePath("/advisor/dashboard");
  return { success: true };
}

export async function updateLeadNotes(input: {
  leadId: string;
  notes: string;
}): Promise<ActionResult> {
  const auth = await requireAdmin();
  if ("error" in auth) return auth;

  const admin = createAdminClient();
  const { error } = await admin
    .from("leads")
    .update({ notes: input.notes.trim() || null })
    .eq("id", input.leadId);

  if (error) {
    console.error("[updateLeadNotes]", error);
    return { error: "Could not save notes." };
  }

  revalidatePath(`/advisor/leads/${input.leadId}`);
  return { success: true };
}

export async function getLeadDocumentDownloadUrl(
  documentId: string
): Promise<{ url: string } | { error: string }> {
  const auth = await requireAdmin();
  if ("error" in auth) return auth;

  const admin = createAdminClient();
  const { data: doc, error } = await admin
    .from("documents")
    .select("storage_path, lead_id")
    .eq("id", documentId)
    .single();

  if (error || !doc) return { error: "Document not found." };

  const row = doc as { storage_path: string; lead_id: string | null };
  if (!row.lead_id) return { error: "Not a lead document." };

  const { data: signed, error: signError } = await admin.storage
    .from("lead-documents")
    .createSignedUrl(row.storage_path, 3600);

  if (signError || !signed?.signedUrl) {
    console.error("[getLeadDocumentDownloadUrl]", signError);
    return { error: "Could not generate download link." };
  }

  return { url: signed.signedUrl };
}
