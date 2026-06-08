import { Metadata } from "next";
import Link from "next/link";
import { CalendarDays } from "lucide-react";

export const metadata: Metadata = { title: "Meetings" };

export default function MeetingsPage() {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-xl font-bold text-[#111A24]">Meetings</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your meetings, calls and strategy sessions with Eduardo.</p>
        </div>
        <Link
          href="/book-call"
          className="inline-flex items-center gap-2 bg-[#111A24] hover:bg-[#1d2a38] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <CalendarDays size={15} />
          Book New Meeting
        </Link>
      </div>
      <div className="px-8 py-12 flex flex-col items-center text-center">
        <div className="h-16 w-16 rounded-full bg-[#b67c2c]/10 flex items-center justify-center mb-4">
          <CalendarDays size={28} className="text-[#b67c2c]" />
        </div>
        <h2 className="text-lg font-bold text-[#111A24] mb-2">No meetings yet</h2>
        <p className="text-sm text-muted-foreground max-w-sm mb-6">Book a free 15-minute consultation with Eduardo to discuss your project.</p>
        <Link href="/book-call" className="inline-flex items-center gap-2 bg-[#b67c2c] hover:bg-[#9f6c27] text-white font-semibold px-6 py-3 rounded-lg text-sm transition-colors">
          <CalendarDays size={15} />
          Book a Meeting
        </Link>
      </div>
    </div>
  );
}
