import { Metadata } from "next";
import Link from "next/link";
import { MessageSquare } from "lucide-react";

export const metadata: Metadata = { title: "Messages" };

export default function MessagesPage() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="bg-white border-b border-gray-100 px-8 py-4 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-[#111A24]">Messages</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Your conversations with Eduardo.</p>
      </div>
      <div className="px-8 py-12 flex flex-col items-center text-center">
        <div className="h-16 w-16 rounded-full bg-[#b67c2c]/10 flex items-center justify-center mb-4">
          <MessageSquare size={28} className="text-[#b67c2c]" />
        </div>
        <h2 className="text-lg font-bold text-[#111A24] mb-2">No messages yet</h2>
        <p className="text-sm text-muted-foreground max-w-sm mb-6">Your conversation with Eduardo will appear here once your project is set up.</p>
        <a href="mailto:contact@eduardomendes.com.au" className="inline-flex items-center gap-2 bg-[#b67c2c] hover:bg-[#9f6c27] text-white font-semibold px-6 py-3 rounded-lg text-sm transition-colors">
          <MessageSquare size={15} />
          Email Eduardo
        </a>
      </div>
    </div>
  );
}
