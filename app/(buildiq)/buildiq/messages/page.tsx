import { Metadata } from "next";
import { createClient, getServerUser } from "@/lib/supabase/server";
import { MessageComposer } from "@/components/buildiq/MessageComposer";
import { MessageThread, type MessageRow } from "@/components/buildiq/MessageThread";
import { resolveClientNames } from "@/lib/buildiq/get-client-context";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Messages" };

export default async function BuildIQMessagesPage() {
  const user = await getServerUser();
  if (!user) return null;

  const supabase = await createClient();

  const { data: clientRow } = await supabase
    .from("clients")
    .select("id, user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  const client = clientRow as { id: string; user_id: string } | null;

  let messages: MessageRow[] = [];

  if (client?.id) {
    const { data: messagesData } = await supabase
      .from("messages")
      .select("id, subject, content, created_at, sender_id, is_read")
      .eq("client_id", client.id)
      .order("created_at", { ascending: true })
      .limit(100);

    const rows = (messagesData ?? []) as Array<{
      id: string;
      subject: string | null;
      content: string;
      created_at: string;
      sender_id: string;
      is_read: boolean | null;
    }>;

    const senderIds = [...new Set(rows.map((m) => m.sender_id))];
    const { data: profiles } = senderIds.length
      ? await supabase
          .from("user_profiles")
          .select("user_id, first_name, last_name")
          .in("user_id", senderIds)
      : { data: [] };

    const { data: users } = senderIds.length
      ? await supabase.from("users").select("id, email").in("id", senderIds)
      : { data: [] };

    const nameByUserId = new Map<string, string>();
    for (const p of (profiles ?? []) as Array<{
      user_id: string;
      first_name: string | null;
      last_name: string | null;
    }>) {
      const { fullName } = resolveClientNames({
        first_name: p.first_name,
        last_name: p.last_name,
      });
      nameByUserId.set(p.user_id, fullName);
    }
    for (const u of (users ?? []) as Array<{ id: string; email: string }>) {
      if (!nameByUserId.has(u.id)) {
        const { fullName } = resolveClientNames({ email: u.email });
        nameByUserId.set(u.id, fullName);
      }
    }

    messages = rows.map((msg) => ({
      ...msg,
      isFromClient: msg.sender_id === client.user_id,
      senderName: msg.sender_id === client.user_id
        ? "You"
        : nameByUserId.get(msg.sender_id) ?? "Eduardo Mendes",
    }));
  }

  return (
    <div className="flex-1 min-w-0 w-full max-w-full overflow-y-auto overflow-x-hidden">
      <div className="bg-white border-b border-gray-100 pl-14 md:pl-8 pr-4 sm:pr-8 py-3 sm:py-4 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-[#111A24]">Messages</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Contact Eduardo directly. Replies appear here and by email.
        </p>
      </div>
      <div className="px-8 py-6 space-y-6 max-w-3xl">
        {!client ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
            <p className="text-sm text-muted-foreground">
              Your client account is being set up. Please check back soon.
            </p>
          </div>
        ) : (
          <>
            <MessageThread messages={messages} />
            <MessageComposer />
          </>
        )}
      </div>
    </div>
  );
}
