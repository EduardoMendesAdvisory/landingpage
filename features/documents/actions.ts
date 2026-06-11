"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { createDocumentSignedUrl } from "@/lib/documents/storage";
import type { Database } from "@/types/database.types";

type DocumentCategory = Database["public"]["Enums"]["document_category"];
type ActionResult = { success: true; documentId?: string } | { error: string };

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

export async function uploadAdvisorDocumentToClient(input: {
  clientId: string;
  fileName: string;
  fileBase64: string;
  fileType: string;
  fileSize: number;
  category?: DocumentCategory;
  description?: string;
}): Promise<ActionResult> {
  const auth = await requireAdmin();
  if ("error" in auth) return auth;

  const admin = createAdminClient();

  const { data: client } = await admin
    .from("clients")
    .select("user_id, lead_id")
    .eq("id", input.clientId)
    .single();

  if (!client) return { error: "Client not found." };

  const clientRow = client as { user_id: string; lead_id: string | null };
  const safeName = input.fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePath = `${clientRow.user_id}/advisor-${Date.now()}-${safeName}`;
  const buffer = Buffer.from(input.fileBase64, "base64");

  const { error: uploadError } = await admin.storage
    .from("client-documents")
    .upload(storagePath, buffer, {
      contentType: input.fileType || "application/octet-stream",
      upsert: false,
    });

  if (uploadError) {
    console.error("[uploadAdvisorDocumentToClient]", uploadError);
    return { error: "Upload failed." };
  }

  const { data: project } = await admin
    .from("projects")
    .select("id")
    .eq("client_id", input.clientId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: inserted, error: insertError } = await admin
    .from("documents")
    .insert({
      client_id: input.clientId,
      lead_id: clientRow.lead_id,
      project_id: (project as { id: string } | null)?.id ?? null,
      file_name: input.fileName,
      file_size: input.fileSize,
      file_type: input.fileType || null,
      storage_path: storagePath,
      category: input.category ?? "reports",
      description: input.description?.trim() || null,
      uploaded_by: auth.userId,
    } as never)
    .select("id")
    .single();

  if (insertError || !inserted) {
    console.error("[uploadAdvisorDocumentToClient] db", insertError);
    return { error: "Could not register document." };
  }

  revalidatePath("/advisor/projects");
  revalidatePath(`/advisor/projects/${input.clientId}`);
  revalidatePath(`/advisor/clients/${input.clientId}`);
  revalidatePath("/buildiq/documents");
  return { success: true, documentId: (inserted as { id: string }).id };
}

export async function getAdvisorClientDocumentUrl(
  documentId: string
): Promise<{ url: string } | { error: string }> {
  const auth = await requireAdmin();
  if ("error" in auth) return auth;

  const admin = createAdminClient();
  const { data: doc } = await admin
    .from("documents")
    .select("storage_path, client_id, lead_id")
    .eq("id", documentId)
    .single();

  if (!doc) return { error: "Document not found." };

  const row = doc as {
    storage_path: string;
    client_id: string | null;
    lead_id: string | null;
  };

  const preferred = row.lead_id && !row.storage_path.includes("/advisor-")
    ? "lead-documents"
    : "client-documents";

  const url = await createDocumentSignedUrl(admin, row.storage_path, preferred);
  if (!url) return { error: "Could not generate download link." };

  return { url };
}
