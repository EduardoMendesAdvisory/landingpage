"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Send, Loader2 } from "lucide-react";
import { replyToClientMessage } from "@/features/messages/actions";

interface AdvisorMessageReplyProps {
  clientId: string;
  defaultSubject?: string;
}

export function AdvisorMessageReply({
  clientId,
  defaultSubject = "",
}: AdvisorMessageReplyProps) {
  const router = useRouter();
  const [subject, setSubject] = useState(defaultSubject);
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    startTransition(async () => {
      const result = await replyToClientMessage({ clientId, subject, content });
      if ("error" in result) {
        setError(result.error);
        return;
      }
      setContent("");
      setSuccess(true);
      router.refresh();
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4"
    >
      <div>
        <h2 className="text-sm font-bold text-[#111A24] mb-1">Reply to client</h2>
        <p className="text-xs text-muted-foreground">
          Your reply appears in the client portal and is emailed to them.
        </p>
      </div>

      <div>
        <label htmlFor="reply-subject" className="block text-xs font-semibold text-[#111A24] mb-1.5">
          Subject
        </label>
        <input
          id="reply-subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#b67c2c]/30 focus:border-[#b67c2c]"
          disabled={pending}
          required
        />
      </div>

      <div>
        <label htmlFor="reply-content" className="block text-xs font-semibold text-[#111A24] mb-1.5">
          Message
        </label>
        <textarea
          id="reply-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#b67c2c]/30 focus:border-[#b67c2c]"
          disabled={pending}
          required
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}
      {success && (
        <p className="text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">
          Reply sent.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 bg-[#111A24] hover:bg-[#1d2a38] disabled:opacity-60 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
      >
        {pending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
        Send reply
      </button>
    </form>
  );
}
