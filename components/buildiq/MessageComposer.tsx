"use client";

import { useState, useTransition } from "react";
import { Send, Loader2 } from "lucide-react";
import { sendClientMessage } from "@/features/buildiq/actions";

export function MessageComposer() {
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    startTransition(async () => {
      const result = await sendClientMessage({ subject, content });
      if ("error" in result) {
        setError(result.error);
        return;
      }
      setSubject("");
      setContent("");
      setSuccess(true);
    });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4"
    >
      <div>
        <h2 className="text-sm font-bold text-[#111A24] mb-1">New message to Eduardo</h2>
        <p className="text-xs text-muted-foreground">
          Your message is saved here and emailed to Eduardo. Replies will appear in this thread.
        </p>
      </div>

      <div>
        <label htmlFor="msg-subject" className="block text-xs font-semibold text-[#111A24] mb-1.5">
          Subject
        </label>
        <input
          id="msg-subject"
          type="text"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder="e.g. Question about my builder quote"
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#b67c2c]/30 focus:border-[#b67c2c]"
          disabled={pending}
          maxLength={200}
        />
      </div>

      <div>
        <label htmlFor="msg-content" className="block text-xs font-semibold text-[#111A24] mb-1.5">
          Message
        </label>
        <textarea
          id="msg-content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your message here..."
          rows={5}
          className="w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#b67c2c]/30 focus:border-[#b67c2c]"
          disabled={pending}
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}
      {success && (
        <p className="text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">
          Message sent. Eduardo will reply here and by email.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 bg-[#b67c2c] hover:bg-[#9f6c27] disabled:opacity-60 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-colors"
      >
        {pending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
        Send message
      </button>
    </form>
  );
}
