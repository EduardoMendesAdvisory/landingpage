"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { resend, FROM } from "@/lib/resend";

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

export async function replyToClientMessage(input: {
  clientId: string;
  subject: string;
  content: string;
}): Promise<ActionResult> {
  const auth = await requireAdmin();
  if ("error" in auth) return auth;

  const subject = input.subject.trim();
  const content = input.content.trim();
  if (!subject || !content) return { error: "Subject and message are required." };

  const admin = createAdminClient();

  const { data: client } = await admin
    .from("clients")
    .select("user_id")
    .eq("id", input.clientId)
    .single();

  if (!client) return { error: "Client not found." };

  const userId = (client as { user_id: string }).user_id;

  const { data: user } = await admin
    .from("users")
    .select("email")
    .eq("id", userId)
    .single();

  const clientEmail = (user as { email: string } | null)?.email;
  if (!clientEmail) return { error: "Client email not found." };

  const { data: project } = await admin
    .from("projects")
    .select("id")
    .eq("client_id", input.clientId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error: insertError } = await admin.from("messages").insert({
    client_id: input.clientId,
    project_id: (project as { id: string } | null)?.id ?? null,
    sender_id: auth.userId,
    subject,
    content,
    is_read: false,
  } as never);

  if (insertError) {
    console.error("[replyToClientMessage]", insertError);
    return { error: "Could not send reply." };
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  try {
    await resend.emails.send({
      from: FROM,
      to: clientEmail,
      subject: `Re: ${subject}`,
      text: [
        content,
        "",
        `View and reply in your portal: ${siteUrl}/buildiq/messages`,
        "",
        "Eduardo Mendes Advisory",
      ].join("\n"),
    });
  } catch (err) {
    console.error("[replyToClientMessage] email:", err);
  }

  revalidatePath("/advisor/messages");
  revalidatePath("/advisor/projects");
  revalidatePath(`/advisor/projects/${input.clientId}`);
  revalidatePath(`/advisor/clients/${input.clientId}`);
  revalidatePath("/buildiq/messages");
  return { success: true };
}

export async function markClientMessagesRead(clientId: string): Promise<ActionResult> {
  const auth = await requireAdmin();
  if ("error" in auth) return auth;

  const admin = createAdminClient();

  const { data: client } = await admin
    .from("clients")
    .select("user_id")
    .eq("id", clientId)
    .single();

  if (!client) return { error: "Client not found." };

  const clientUserId = (client as { user_id: string }).user_id;

  await admin
    .from("messages")
    .update({ is_read: true })
    .eq("client_id", clientId)
    .neq("sender_id", auth.userId)
    .eq("is_read", false);

  revalidatePath("/advisor/messages");
  revalidatePath("/advisor/projects");
  revalidatePath(`/advisor/projects/${clientId}`);
  revalidatePath(`/advisor/clients/${clientId}`);
  return { success: true };
}

export async function markMessagesReadForClientUser(): Promise<ActionResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized." };

  const { data: client } = await supabase
    .from("clients")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  const clientId = (client as { id: string } | null)?.id;
  if (!clientId) return { error: "Client not found." };

  await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("client_id", clientId)
    .neq("sender_id", user.id)
    .eq("is_read", false);

  revalidatePath("/buildiq/messages");
  return { success: true };
}
