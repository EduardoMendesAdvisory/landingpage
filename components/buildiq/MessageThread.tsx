"use client";

import { useEffect } from "react";
import { markMessagesReadForClientUser } from "@/features/messages/actions";

export type MessageRow = {
  id: string;
  subject: string | null;
  content: string;
  created_at: string;
  sender_id: string;
  is_read: boolean | null;
  senderName: string;
  isFromClient: boolean;
};

interface MessageThreadProps {
  messages: MessageRow[];
}

export function MessageThread({ messages }: MessageThreadProps) {
  useEffect(() => {
    markMessagesReadForClientUser().catch(() => {});
  }, []);

  if (messages.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
        <p className="text-sm text-muted-foreground">
          No messages yet. Send Eduardo a message below.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <p className="text-sm font-bold text-[#111A24]">
          Conversation ({messages.length})
        </p>
      </div>
      <div className="divide-y divide-gray-50 max-h-[480px] overflow-y-auto">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`px-6 py-4 ${msg.isFromClient ? "bg-white" : "bg-[#b67c2c]/5"}`}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div>
                <p className="text-sm font-semibold text-[#111A24]">
                  {msg.isFromClient ? "You" : msg.senderName}
                </p>
                {msg.subject && (
                  <p className="text-xs font-medium text-muted-foreground mt-0.5">
                    {msg.subject}
                  </p>
                )}
              </div>
              <time className="text-[10px] text-muted-foreground shrink-0">
                {new Date(msg.created_at).toLocaleString("en-AU", {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </time>
            </div>
            <p className="text-sm text-[#111A24] whitespace-pre-wrap">{msg.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
