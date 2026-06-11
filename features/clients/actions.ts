"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { resend, FROM } from "@/lib/resend";
import {
  linkLeadRecordsToClient,
  resolveInitialProjectStage,
} from "@/lib/clients/link-client-records";

export interface ActivateClientInput {
  userId: string;
  projectName?: string;
  sendWelcomeEmail?: boolean;
}

export type ActivateClientResult =
  | { success: true; clientId: string }
  | { error: string };

export async function activateClientAsAdmin(
  input: ActivateClientInput
): Promise<ActivateClientResult> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Unauthorized." };

  const { data: adminUser } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  if ((adminUser as { role: string } | null)?.role !== "admin") {
    return { error: "Unauthorized." };
  }

  return activateClient(input);
}

/**
 * Promotes a lead to client after Eduardo's consultation.
 * Updates role, creates client + optional project, sends portal login email.
 */
export async function activateClient(
  input: ActivateClientInput
): Promise<ActivateClientResult> {
  try {
    const admin = createAdminClient();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    const { data: user, error: userError } = await admin
      .from("users")
      .select("id, email, role")
      .eq("id", input.userId)
      .single();

    if (userError || !user) {
      return { error: "User not found." };
    }

    const typedUser = user as { id: string; email: string; role: string };

    const { data: existingClient } = await admin
      .from("clients")
      .select("id")
      .eq("user_id", input.userId)
      .maybeSingle();

    if (existingClient) {
      if (typedUser.role !== "client") {
        await admin.from("users").update({ role: "client" }).eq("id", input.userId);
      }
      return { success: true, clientId: (existingClient as { id: string }).id };
    }

    const { data: lead } = await admin
      .from("leads")
      .select("id, project_type, project_stage, budget_range, location, suburb, state")
      .eq("user_id", input.userId)
      .maybeSingle();

    const { data: profile } = await admin
      .from("user_profiles")
      .select("first_name")
      .eq("user_id", input.userId)
      .maybeSingle();

    const firstName = (profile as { first_name: string | null } | null)?.first_name ?? "there";

    await admin.from("users").update({ role: "client" }).eq("id", input.userId);

    const { data: client, error: clientError } = await admin
      .from("clients")
      .insert({
        user_id: input.userId,
        lead_id: (lead as { id: string } | null)?.id ?? null,
        client_status: "active",
      })
      .select("id")
      .single();

    if (clientError || !client) {
      return { error: clientError?.message ?? "Failed to create client record." };
    }

    const leadDetails = lead as {
      id: string;
      project_type: string | null;
      project_stage: string | null;
      budget_range: string | null;
      location: string | null;
      suburb: string | null;
      state: string | null;
    } | null;

    const clientId = (client as { id: string }).id;
    const leadId = leadDetails?.id ?? null;

    await linkLeadRecordsToClient(admin, { clientId, leadId });

    const projectStage = await resolveInitialProjectStage(admin, leadId);

    const projectName =
      input.projectName ??
      (leadDetails?.project_type
        ? leadDetails.project_type
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ")
        : "Your Project");

    await admin.from("projects").insert({
      client_id: clientId,
      project_name: projectName,
      project_type: leadDetails?.project_type ?? null,
      project_status: "planning",
      project_stage: projectStage,
      budget_range: leadDetails?.budget_range ?? null,
      location: leadDetails?.location ?? null,
      suburb: leadDetails?.suburb ?? null,
      state: leadDetails?.state ?? null,
    });

    if (lead) {
      await admin
        .from("leads")
        .update({ lead_status: "client_approved" })
        .eq("id", (lead as { id: string }).id);
    }

    await admin.from("audit_logs").insert({
      user_id: input.userId,
      action: "client_activated",
      entity_type: "client",
      entity_id: clientId,
    });

    if (input.sendWelcomeEmail !== false) {
      try {
        await resend.emails.send({
          from: FROM,
          to: typedUser.email,
          subject: "Your Client Portal Access - Eduardo Mendes Advisory",
          text: [
            `Hi ${firstName},`,
            "",
            "Your client portal is now ready.",
            "",
            "Sign in with the email and password you used during your assessment to access your project dashboard, documents, and updates from Eduardo.",
            "",
            `Sign in here: ${siteUrl}/login?redirect=/buildiq/dashboard`,
            "",
            "If you forgot your password, use the Forgot Password link on the sign-in page.",
            "",
            "Best regards,",
            "Eduardo Mendes",
          ].join("\n"),
        });
      } catch (emailError) {
        console.error("[activateClient] Welcome email failed:", emailError);
      }
    }

    return { success: true, clientId };
  } catch (error) {
    console.error("[activateClient]", error);
    return { error: "Failed to activate client. Please try again." };
  }
}
