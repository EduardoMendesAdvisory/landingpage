import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { buildCalendlyUrl, getCalendlyBaseUrl } from "@/lib/calendly";
import { FREE_CONSULTATION_LIMIT } from "@/lib/buildiq/portal-config";
import { MeetingsBookingPanel } from "@/components/buildiq/MeetingsBookingPanel";

export const metadata: Metadata = { title: "Meetings" };

export default async function MeetingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login?redirect=/buildiq/meetings");

  const [clientResult, profileResult] = await Promise.all([
    supabase.from("clients").select("id").eq("user_id", user.id).maybeSingle(),
    supabase
      .from("user_profiles")
      .select("first_name, last_name")
      .eq("user_id", user.id)
      .maybeSingle(),
  ]);

  const client = clientResult.data as { id: string } | null;
  if (!client) {
    return (
      <div className="flex-1 overflow-y-auto px-8 py-12">
        <p className="text-sm text-muted-foreground">
          Your client account is being set up. Please check back soon.
        </p>
      </div>
    );
  }

  const profile = profileResult.data as {
    first_name: string | null;
    last_name: string | null;
  } | null;

  const fullName =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
    user.email?.split("@")[0] ||
    "";

  const { data: meetingsData } = await supabase
    .from("meetings")
    .select("id, scheduled_at, status, meeting_type, duration_minutes")
    .eq("client_id", client.id)
    .neq("status", "cancelled")
    .order("scheduled_at", { ascending: false, nullsFirst: false });

  const meetings = (meetingsData ?? []) as Array<{
    id: string;
    scheduled_at: string | null;
    status: string;
    meeting_type: string;
    duration_minutes: number | null;
  }>;

  const usedCount = meetings.length;
  const remainingFree = Math.max(0, FREE_CONSULTATION_LIMIT - usedCount);
  const canBookFree = usedCount < FREE_CONSULTATION_LIMIT;

  const calendlyUrl = buildCalendlyUrl(getCalendlyBaseUrl(), {
    email: user.email,
    name: fullName,
    clientId: client.id,
  });

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="bg-white border-b border-gray-100 px-8 py-4 sticky top-0 z-10">
        <h1 className="text-xl font-bold text-[#111A24]">Meetings</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Book and manage your strategy sessions with Eduardo.
        </p>
      </div>
      <div className="px-8 py-6">
        <MeetingsBookingPanel
          calendlyUrl={calendlyUrl}
          usedCount={usedCount}
          remainingFree={remainingFree}
          canBookFree={canBookFree}
          meetings={meetings}
        />
      </div>
    </div>
  );
}
