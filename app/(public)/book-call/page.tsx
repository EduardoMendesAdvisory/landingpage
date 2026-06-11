import { Suspense } from "react";
import { Metadata } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { getCalendlyQuestionsForConfiguredEvent } from "@/lib/calendly/setup";
import { buildCalendlyPrefillParams } from "@/lib/calendly/prefill";
import BookCallFlow from "./BookCallFlow";

export const metadata: Metadata = {
  title: "Book a Call | Choose Your Service",
  description:
    "Explore Eduardo Mendes advisory services, choose the support that fits your project, and book a free 15-minute consultation.",
};

async function loadLeadPrefill(leadId: string | undefined) {
  if (!leadId) return null;

  const admin = createAdminClient();
  const { data } = await admin
    .from("leads")
    .select("email, full_name, phone")
    .eq("id", leadId)
    .maybeSingle();

  if (!data) return null;

  const row = data as {
    email: string | null;
    full_name: string | null;
    phone: string | null;
  };

  return {
    email: row.email ?? undefined,
    name: row.full_name ?? undefined,
    phone: row.phone ?? undefined,
  };
}

export default async function BookCallPage({
  searchParams,
}: {
  searchParams: Promise<{ lead?: string; service?: string }>;
}) {
  const params = await searchParams;
  const [leadPrefill, customQuestions] = await Promise.all([
    loadLeadPrefill(params.lead),
    getCalendlyQuestionsForConfiguredEvent().catch(() => []),
  ]);

  const prefillParams =
    leadPrefill || params.lead || params.service
      ? buildCalendlyPrefillParams(
          {
            email: leadPrefill?.email,
            name: leadPrefill?.name,
            phone: leadPrefill?.phone,
            leadId: params.lead ?? undefined,
            service: params.service ?? undefined,
          },
          customQuestions
        )
      : undefined;

  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center bg-white text-muted-foreground">
          Loading...
        </div>
      }
    >
      <BookCallFlow leadPrefill={leadPrefill} prefillParams={prefillParams} />
    </Suspense>
  );
}
