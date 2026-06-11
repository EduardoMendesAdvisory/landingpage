"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

export type AdvisorMessageThreadSummary = {
  clientId: string;
  clientLabel: string;
  email: string;
  lastSubject: string | null;
  lastPreview: string;
  lastAt: string;
  unread: number;
};

interface AdvisorMessagesInboxProps {
  threads: AdvisorMessageThreadSummary[];
  selectedClientId: string | null;
}

export function AdvisorMessagesInbox({
  threads,
  selectedClientId,
}: AdvisorMessagesInboxProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function hrefFor(clientId: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("client", clientId);
    return `${pathname}?${params.toString()}`;
  }

  if (threads.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
        <p className="text-sm text-muted-foreground">No client messages yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-100">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Conversations ({threads.length})
        </p>
      </div>
      <div className="divide-y divide-gray-50 max-h-[calc(100vh-220px)] overflow-y-auto">
        {threads.map((thread) => {
          const active = thread.clientId === selectedClientId;
          return (
            <Link
              key={thread.clientId}
              href={hrefFor(thread.clientId)}
              className={cn(
                "block px-4 py-3 transition-colors",
                active ? "bg-[#b67c2c]/10 border-l-2 border-[#b67c2c]" : "hover:bg-gray-50"
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-sm font-semibold text-[#111A24] truncate">
                  {thread.clientLabel}
                </p>
                {thread.unread > 0 && (
                  <span className="text-[10px] font-bold bg-[#b67c2c] text-white px-1.5 py-0.5 rounded-full shrink-0">
                    {thread.unread}
                  </span>
                )}
              </div>
              <p className="text-[10px] text-muted-foreground truncate">{thread.email}</p>
              {thread.lastSubject && (
                <p className="text-xs font-medium text-muted-foreground mt-1 truncate">
                  {thread.lastSubject}
                </p>
              )}
              <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
                {thread.lastPreview}
              </p>
              <time className="text-[10px] text-muted-foreground mt-1 block">
                {new Date(thread.lastAt).toLocaleString("en-AU", {
                  dateStyle: "short",
                  timeStyle: "short",
                })}
              </time>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
