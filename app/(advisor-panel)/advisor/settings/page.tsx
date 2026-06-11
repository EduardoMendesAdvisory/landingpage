import { Metadata } from "next";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { PageHeader } from "@/components/shared/PageHeader";
import { AdvisorBankSettingsForm } from "@/components/advisor/AdvisorBankSettingsForm";
import { getSavedBankDetails } from "@/features/invoices/actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Settings" };

export default async function AdvisorSettingsPage() {
  const savedBankDetails = await getSavedBankDetails();

  return (
    <>
      <DashboardHeader title="AdvisorHQ" userName="Eduardo" userInitials="EM" />
      <div className="flex-1 px-6 py-8 space-y-6">
        <PageHeader
          title="Settings"
          description="AdvisorHQ preferences and invoice defaults."
        />

        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-navy uppercase tracking-wide">
            Invoice bank details
          </h2>
          <AdvisorBankSettingsForm initial={savedBankDetails} />
        </section>

        <section className="space-y-3">
          <h2 className="text-sm font-semibold text-navy uppercase tracking-wide">
            Integrations
          </h2>
          <div className="bg-white rounded-2xl border border-border p-6 text-sm text-muted-foreground shadow-[0_2px_8px_rgba(0,0,0,0.04)] max-w-lg">
            <p>
              Calendly webhook and API keys are configured via environment variables
              on the server (Netlify). Contact your developer to update{" "}
              <code className="text-xs bg-light-bg px-1 py-0.5 rounded">
                CALENDLY_API_KEY
              </code>{" "}
              or{" "}
              <code className="text-xs bg-light-bg px-1 py-0.5 rounded">
                CALENDLY_ORGANIZATION_URI
              </code>
              .
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
