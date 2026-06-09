import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { AssessmentWizard } from "@/features/assessment/components/AssessmentWizard";

export const metadata: Metadata = {
  title: "Free Preliminary AI Assessment | Eduardo Mendes Advisory",
  description:
    "Get your personalised preliminary AI assessment in under 2 minutes. Identify potential savings, risks and next steps for your project.",
};

type PageProps = {
  searchParams: Promise<{ from?: string; service?: string }>;
};

export default async function AssessmentPage({ searchParams }: PageProps) {
  const { service } = await searchParams;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let skipLeadCapture = false;
  let registeredLeadId: string | undefined;

  if (user) {
    const { data: lead } = await supabase
      .from("leads")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (lead) {
      skipLeadCapture = true;
      registeredLeadId = (lead as { id: string }).id;

      if (service) {
        await supabase
          .from("leads")
          .update({
            source: `service_${service}`,
          })
          .eq("id", registeredLeadId);
      }
    }
  }

  return (
    <AssessmentWizard
      mode="free"
      skipLeadCapture={skipLeadCapture}
      registeredLeadId={registeredLeadId}
    />
  );
}
