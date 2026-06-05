import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { AssessmentWizard } from "@/features/assessment/components/AssessmentWizard";

export const metadata: Metadata = {
  title: "Project Intake | Eduardo Mendes Advisory",
  description: "Complete your project details so Eduardo can begin your personalised review.",
};

interface PageProps {
  searchParams: Promise<{
    service?: string;
    session_id?: string;
    demo?: string;
    lead_id?: string;
  }>;
}

export default async function PaidAssessmentPage({ searchParams }: PageProps) {
  const { service: serviceSlug, session_id, demo, lead_id } = await searchParams;
  const admin = createAdminClient();

  let resolvedLeadId: string | undefined = lead_id;

  // Demo mode (no Stripe key configured)
  if (demo === "true" && serviceSlug && !resolvedLeadId) {
    // Find the most recently created anonymous lead or create a placeholder
    const { data: recentLead } = await admin
      .from("leads")
      .select("id")
      .is("user_id", null)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    if (recentLead) {
      resolvedLeadId = recentLead.id;
    } else {
      // Create a demo lead
      const { data: newLead } = await admin
        .from("leads")
        .insert({
          full_name: "Demo Client",
          email: "demo@example.com",
          source: "paid_link",
          lead_status: "qualified",
        })
        .select("id")
        .single();
      resolvedLeadId = newLead?.id;
    }
  }

  // Stripe session verification
  if (session_id && serviceSlug && !resolvedLeadId) {
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

    if (stripeSecretKey) {
      try {
        const Stripe = (await import("stripe")).default;
        const stripe = new Stripe(stripeSecretKey, { apiVersion: "2026-05-27.dahlia" });
        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (session.payment_status !== "paid") {
          redirect(`/recommended-service/${serviceSlug}?error=payment_failed`);
        }

        // Find or create lead from email
        const customerEmail =
          typeof session.customer_details?.email === "string"
            ? session.customer_details.email
            : null;

        if (customerEmail) {
          // Look for existing lead with this email
          const { data: existingLead } = await admin
            .from("leads")
            .select("id")
            .eq("email", customerEmail.toLowerCase())
            .order("created_at", { ascending: false })
            .limit(1)
            .single();

          if (existingLead) {
            resolvedLeadId = existingLead.id;
          } else {
            // Create new lead from Stripe data
            const customerName = session.customer_details?.name ?? "Client";
            const { data: newLead } = await admin
              .from("leads")
              .insert({
                full_name: customerName,
                email: customerEmail.toLowerCase(),
                source: "paid_link",
                lead_status: "qualified",
              })
              .select("id")
              .single();
            resolvedLeadId = newLead?.id;
          }

          // Record the service recommendation as paid
          if (resolvedLeadId) {
            const { data: svc } = await admin
              .from("services")
              .select("id")
              .eq("slug", serviceSlug)
              .single();

            if (svc) {
              await admin.from("service_recommendations").upsert(
                {
                  lead_id: resolvedLeadId,
                  service_id: svc.id,
                  payment_status: "paid",
                  stripe_session_id: session_id,
                },
                { onConflict: "stripe_session_id" }
              );
            }
          }
        }
      } catch (err) {
        console.error("[paid/page] Stripe session error:", err);
        redirect(`/recommended-service/${serviceSlug}?error=session_error`);
      }
    }
  }

  if (!resolvedLeadId) {
    redirect("/");
  }

  return (
    <AssessmentWizard
      mode="paid"
      leadId={resolvedLeadId}
    />
  );
}
