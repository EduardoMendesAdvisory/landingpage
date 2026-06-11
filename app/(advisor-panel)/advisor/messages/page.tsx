import { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { createAdminClient } from "@/lib/supabase/admin";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import {
  AdvisorMessagesInbox,
  type AdvisorMessageThreadSummary,
} from "@/components/advisor/AdvisorMessagesInbox";
import { AdvisorMessageThread } from "@/components/advisor/AdvisorMessageThread";
import { AdvisorMessageReply } from "@/components/advisor/AdvisorMessageReply";
import { ExternalLink } from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Messages" };

export default async function AdvisorMessagesPage({
  searchParams,
}: {
  searchParams: Promise<{ client?: string }>;
}) {
  const { client: selectedClientId } = await searchParams;
  const admin = createAdminClient();

  const { data: messagesData } = await admin
    .from("messages")
    .select("id, client_id, subject, content, created_at, sender_id, is_read")
    .order("created_at", { ascending: false })
    .limit(500);

  const messages = (messagesData ?? []) as Array<{
    id: string;
    client_id: string | null;
    subject: string | null;
    content: string;
    created_at: string;
    sender_id: string;
    is_read: boolean | null;
  }>;

  const clientIds = [
    ...new Set(messages.map((m) => m.client_id).filter(Boolean)),
  ] as string[];

  const { data: clientsData } = clientIds.length
    ? await admin.from("clients").select("id, user_id").in("id", clientIds)
    : { data: [] };

  const clients = (clientsData ?? []) as Array<{ id: string; user_id: string }>;
  const userIds = clients.map((c) => c.user_id);

  const [profilesResult, usersResult] = await Promise.all([
    userIds.length
      ? admin
          .from("user_profiles")
          .select("user_id, first_name, last_name")
          .in("user_id", userIds)
      : Promise.resolve({ data: [] }),
    userIds.length
      ? admin.from("users").select("id, email").in("id", userIds)
      : Promise.resolve({ data: [] }),
  ]);

  const userIdByClient = new Map(clients.map((c) => [c.id, c.user_id]));
  const nameByUserId = new Map(
    ((profilesResult.data ?? []) as Array<{
      user_id: string;
      first_name: string | null;
      last_name: string | null;
    }>).map((p) => [p.user_id, [p.first_name, p.last_name].filter(Boolean).join(" ")])
  );
  const emailByUserId = new Map(
    ((usersResult.data ?? []) as Array<{ id: string; email: string }>).map((u) => [
      u.id,
      u.email,
    ])
  );

  function clientLabel(clientId: string): string {
    const userId = userIdByClient.get(clientId);
    if (!userId) return "Client";
    return nameByUserId.get(userId) || emailByUserId.get(userId)?.split("@")[0] || "Client";
  }

  function clientEmail(clientId: string): string {
    const userId = userIdByClient.get(clientId);
    if (!userId) return "";
    return emailByUserId.get(userId) ?? "";
  }

  const threadMap = new Map<string, AdvisorMessageThreadSummary>();

  for (const msg of messages) {
    if (!msg.client_id) continue;
    const userId = userIdByClient.get(msg.client_id);
    const fromClient = userId ? msg.sender_id === userId : false;

    const existing = threadMap.get(msg.client_id);
    if (!existing) {
      threadMap.set(msg.client_id, {
        clientId: msg.client_id,
        clientLabel: clientLabel(msg.client_id),
        email: clientEmail(msg.client_id),
        lastSubject: msg.subject,
        lastPreview: msg.content,
        lastAt: msg.created_at,
        unread: fromClient && !msg.is_read ? 1 : 0,
      });
    } else if (fromClient && !msg.is_read) {
      existing.unread += 1;
    }
  }

  const threads = [...threadMap.values()].sort(
    (a, b) => new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime()
  );

  const activeClientId =
    selectedClientId && threadMap.has(selectedClientId)
      ? selectedClientId
      : threads[0]?.clientId ?? null;

  let conversationMessages: Array<{
    id: string;
    subject: string | null;
    content: string;
    created_at: string;
    isFromClient: boolean;
  }> = [];

  let replySubject = "";
  let activeLabel = "";

  if (activeClientId) {
    activeLabel = clientLabel(activeClientId);
    const clientUserId = userIdByClient.get(activeClientId);

    const { data: threadMessages } = await admin
      .from("messages")
      .select("id, subject, content, created_at, sender_id")
      .eq("client_id", activeClientId)
      .order("created_at", { ascending: true })
      .limit(100);

    conversationMessages = ((threadMessages ?? []) as Array<{
      id: string;
      subject: string | null;
      content: string;
      created_at: string;
      sender_id: string;
    }>).map((msg) => ({
      id: msg.id,
      subject: msg.subject,
      content: msg.content,
      created_at: msg.created_at,
      isFromClient: clientUserId ? msg.sender_id === clientUserId : false,
    }));

    const lastClientMsg = [...conversationMessages]
      .reverse()
      .find((m) => m.isFromClient);
    replySubject = lastClientMsg?.subject
      ? lastClientMsg.subject.startsWith("Re:")
        ? lastClientMsg.subject
        : `Re: ${lastClientMsg.subject}`
      : "";
  }

  return (
    <>
      <DashboardHeader title="AdvisorHQ" userName="Eduardo" userInitials="EM" />
      <div className="flex-1 overflow-y-auto">
        <div className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-10">
          <h1 className="text-xl font-bold text-[#111A24]">Messages</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Client conversations from BuildIQ. Select a client to view and reply.
          </p>
        </div>

        <div className="px-6 py-6">
          <div className="grid lg:grid-cols-[300px_1fr] gap-6 max-w-6xl">
            <Suspense
              fallback={
                <div className="bg-white rounded-2xl border border-gray-100 p-6 text-sm text-muted-foreground">
                  Loading conversations...
                </div>
              }
            >
              <AdvisorMessagesInbox
                threads={threads}
                selectedClientId={activeClientId}
              />
            </Suspense>

            <div className="space-y-6 min-w-0">
              {!activeClientId ? (
                <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
                  <p className="text-sm text-muted-foreground">
                    Select a conversation from the list, or wait for a client to send a message.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-[#111A24]">{activeLabel}</p>
                      <p className="text-xs text-muted-foreground">
                        {clientEmail(activeClientId)}
                      </p>
                    </div>
                    <Link
                      href={`/advisor/projects/${activeClientId}`}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#b67c2c] hover:underline shrink-0"
                    >
                      Open workspace
                      <ExternalLink size={12} />
                    </Link>
                  </div>

                  <AdvisorMessageThread
                    clientId={activeClientId}
                    clientLabel={activeLabel}
                    messages={conversationMessages}
                  />
                  <AdvisorMessageReply
                    clientId={activeClientId}
                    defaultSubject={replySubject}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
