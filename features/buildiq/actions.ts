"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { resend, FROM } from "@/lib/resend";
import { ADVISOR_EMAIL } from "@/lib/buildiq/portal-config";
import type { Database } from "@/types/database.types";

type DocumentCategory = Database["public"]["Enums"]["document_category"];

export type SendMessageResult =
  | { success: true; messageId: string }
  | { error: string };

export async function sendClientMessage(input: {
  subject: string;
  content: string;
}): Promise<SendMessageResult> {
  const subject = input.subject.trim();
  const content = input.content.trim();

  if (!subject || subject.length < 2) {
    return { error: "Please enter a subject." };
  }
  if (!content || content.length < 10) {
    return { error: "Please write at least a few sentences." };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "You must be signed in." };

  const { data: clientRow } = await supabase
    .from("clients")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  const clientId = (clientRow as { id: string } | null)?.id;
  if (!clientId) {
    return { error: "Client account not found. Please contact support." };
  }

  const { data: projectRow } = await supabase
    .from("projects")
    .select("id")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const projectId = (projectRow as { id: string } | null)?.id ?? null;

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("first_name, last_name")
    .eq("user_id", user.id)
    .maybeSingle();

  const profileRow = profile as {
    first_name: string | null;
    last_name: string | null;
  } | null;

  const senderName =
    [profileRow?.first_name, profileRow?.last_name].filter(Boolean).join(" ") ||
    user.email?.split("@")[0] ||
    "Client";

  const { data: inserted, error: insertError } = await supabase
    .from("messages")
    .insert({
      client_id: clientId,
      project_id: projectId,
      sender_id: user.id,
      subject,
      content,
      is_read: false,
    })
    .select("id")
    .single();

  if (insertError || !inserted) {
    console.error("[sendClientMessage] insert:", insertError);
    return { error: "Could not save your message. Please try again." };
  }

  const messageId = (inserted as { id: string }).id;
  const clientEmail = user.email ?? "unknown";

  try {
    await resend.emails.send({
      from: FROM,
      to: ADVISOR_EMAIL,
      replyTo: clientEmail,
      subject: `[BuildIQ] ${subject}`,
      text: [
        `From: ${senderName} (${clientEmail})`,
        `Client ID: ${clientId}`,
        projectId ? `Project ID: ${projectId}` : "",
        "",
        content,
        "",
        "---",
        "Reply directly to this email to respond to the client.",
        `View in portal: ${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/buildiq/messages`,
      ]
        .filter(Boolean)
        .join("\n"),
    });
  } catch (err) {
    console.error("[sendClientMessage] email:", err);
  }

  revalidatePath("/buildiq/messages");
  return { success: true, messageId };
}

export type SignedUploadUrlResult =
  | { signedUrl: string; token: string; storagePath: string }
  | { error: string };

/**
 * Creates a time-limited signed upload URL so the browser can PUT a file
 * directly to Supabase Storage without needing a browser-side auth session.
 * Authentication is validated here on the server (always has fresh cookies).
 */
export async function getSignedUploadUrl(input: {
  fileName: string;
}): Promise<SignedUploadUrlResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "You must be signed in." };

  const safeName = input.fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
  const storagePath = `${user.id}/${Date.now()}-${safeName}`;

  const { data, error } = await supabase.storage
    .from("client-documents")
    .createSignedUploadUrl(storagePath, { upsert: false });

  if (error || !data) {
    console.error("[getSignedUploadUrl]:", error);
    return { error: "Could not prepare upload. Please try again." };
  }

  return { signedUrl: data.signedUrl, token: data.token, storagePath };
}

export type UploadDocumentResult =
  | { success: true; documentId: string }
  | { error: string };

export async function registerUploadedDocument(input: {
  fileName: string;
  storagePath: string;
  fileSize: number;
  fileType: string;
  category: DocumentCategory;
}): Promise<UploadDocumentResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "You must be signed in." };

  const { data: clientRow } = await supabase
    .from("clients")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  const clientId = (clientRow as { id: string } | null)?.id;
  if (!clientId) return { error: "Client account not found." };

  if (!input.storagePath.startsWith(`${user.id}/`)) {
    return { error: "Invalid storage path." };
  }

  const { data: projectRow } = await supabase
    .from("projects")
    .select("id")
    .eq("client_id", clientId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const projectId = (projectRow as { id: string } | null)?.id ?? null;

  const { data: inserted, error } = await supabase
    .from("documents")
    .insert({
      client_id: clientId,
      project_id: projectId,
      file_name: input.fileName,
      storage_path: input.storagePath,
      file_size: input.fileSize,
      file_type: input.fileType,
      category: input.category,
      uploaded_by: user.id,
    })
    .select("id")
    .single();

  if (error || !inserted) {
    console.error("[registerUploadedDocument]:", error);
    return { error: "Could not register document." };
  }

  revalidatePath("/buildiq/documents");
  return { success: true, documentId: (inserted as { id: string }).id };
}

export async function getDocumentDownloadUrl(
  documentId: string
): Promise<{ url: string } | { error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized." };

  const { data: doc } = await supabase
    .from("documents")
    .select("storage_path, client_id")
    .eq("id", documentId)
    .single();

  if (!doc) return { error: "Document not found." };

  const docRow = doc as { storage_path: string; client_id: string | null };

  const { data: clientRow } = await supabase
    .from("clients")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if ((clientRow as { id: string } | null)?.id !== docRow.client_id) {
    return { error: "Document not found." };
  }

  const { data: signed, error } = await supabase.storage
    .from("client-documents")
    .createSignedUrl(docRow.storage_path, 3600);

  if (error || !signed?.signedUrl) {
    return { error: "Could not generate download link." };
  }

  return { url: signed.signedUrl };
}

export type DeleteDocumentResult = { success: true } | { error: string };

export async function deleteClientDocument(
  documentId: string
): Promise<DeleteDocumentResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "You must be signed in." };

  const { data: doc } = await supabase
    .from("documents")
    .select("storage_path, client_id")
    .eq("id", documentId)
    .single();

  if (!doc) return { error: "Document not found." };

  const docRow = doc as { storage_path: string; client_id: string | null };

  const { data: clientRow } = await supabase
    .from("clients")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  if ((clientRow as { id: string } | null)?.id !== docRow.client_id) {
    return { error: "Document not found." };
  }

  if (!docRow.storage_path.startsWith(`${user.id}/`)) {
    return { error: "Invalid document path." };
  }

  const { error: storageError } = await supabase.storage
    .from("client-documents")
    .remove([docRow.storage_path]);

  if (storageError) {
    console.error("[deleteClientDocument] storage:", storageError);
    return { error: "Could not delete file from storage." };
  }

  const { error: dbError } = await supabase
    .from("documents")
    .delete()
    .eq("id", documentId);

  if (dbError) {
    console.error("[deleteClientDocument] db:", dbError);
    return { error: "Could not remove document record." };
  }

  revalidatePath("/buildiq/documents");
  return { success: true };
}

export type UpdateProfileResult = { success: true } | { error: string };

export async function updateUserProfile(input: {
  firstName: string;
  lastName: string;
  phone: string;
  suburb: string;
  state: string;
}): Promise<UpdateProfileResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "You must be signed in." };

  const firstName = input.firstName.trim();
  const lastName = input.lastName.trim();

  if (!firstName) return { error: "First name is required." };

  const { error } = await supabase.from("user_profiles").upsert(
    {
      user_id: user.id,
      first_name: firstName,
      last_name: lastName || null,
      phone: input.phone.trim() || null,
      suburb: input.suburb.trim() || null,
      state: input.state.trim() || null,
    },
    { onConflict: "user_id" }
  );

  if (error) {
    console.error("[updateUserProfile]", error);
    return { error: "Could not save profile. Please try again." };
  }

  revalidatePath("/buildiq/profile");
  revalidatePath("/buildiq/dashboard");
  revalidatePath("/buildiq/meetings");
  return { success: true };
}
