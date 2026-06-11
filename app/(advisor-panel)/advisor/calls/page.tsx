import { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { PageHeader } from "@/components/shared/PageHeader";
import { CallsCalendar } from "@/components/advisor/CallsCalendar";

export const metadata: Metadata = { title: "Calls" };

export default async function AdvisorCallsPage() {
  const admin = createAdminClient();

  const { data: meetingsData } = await admin
    .from("meetings")
    .select(
      "id, scheduled_at, status, invitee_name, invitee_email, service_slug, lead_id, leads(full_name, email)"
    )
    .order("scheduled_at", { ascending: true, nullsFirst: false });

  const meetings = (meetingsData ?? []) as Parameters<typeof CallsCalendar>[0]["meetings"];

  return (
    <>
      <DashboardHeader title="AdvisorHQ" userName="Eduardo" userInitials="EM" />
      <div className="flex-1 px-4 sm:px-6 py-6 sm:py-8 space-y-4">
        <PageHeader
          title="Calls"
          description="Bookings from Calendly. Click a day to see details."
        />
        <CallsCalendar meetings={meetings} />
      </div>
    </>
  );
}
