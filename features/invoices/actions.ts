"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { resend, FROM } from "@/lib/resend";
import { activateClient } from "@/features/clients/actions";
import {
  DEFAULT_PAYMENT_INSTRUCTIONS,
  serviceNameFromSlug,
} from "@/lib/invoices/constants";
import {
  formatPaymentInstructions,
  INVOICE_BANK_DETAILS_KEY,
  parseSavedBankDetails,
  type InvoiceBankDetails,
} from "@/lib/invoices/bank-details";
import type { PublicServiceSlug } from "@/lib/services-catalog";

type ActionResult = { success: true; invoiceId?: string } | { error: string };

async function requireAdmin(): Promise<{ userId: string } | { error: string }> {
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

  return { userId: user.id };
}

type RecipientInfo = {
  email: string;
  name: string;
  leadId: string | null;
  clientId: string | null;
  userId: string | null;
};

async function resolveRecipient(input: {
  leadId?: string;
  clientId?: string;
}): Promise<RecipientInfo | null> {
  const admin = createAdminClient();

  if (input.clientId) {
    const { data: client } = await admin
      .from("clients")
      .select("id, user_id, lead_id")
      .eq("id", input.clientId)
      .single();

    if (!client) return null;

    const row = client as {
      id: string;
      user_id: string;
      lead_id: string | null;
    };

    const { data: user } = await admin
      .from("users")
      .select("email")
      .eq("id", row.user_id)
      .single();

    const { data: profile } = await admin
      .from("user_profiles")
      .select("first_name, last_name")
      .eq("user_id", row.user_id)
      .maybeSingle();

    const profileRow = profile as {
      first_name: string | null;
      last_name: string | null;
    } | null;

    const name =
      [profileRow?.first_name, profileRow?.last_name].filter(Boolean).join(" ") ||
      (user as { email: string } | null)?.email ||
      "Client";

    return {
      email: (user as { email: string }).email,
      name,
      leadId: row.lead_id,
      clientId: row.id,
      userId: row.user_id,
    };
  }

  if (input.leadId) {
    const { data: lead } = await admin
      .from("leads")
      .select("id, email, full_name, user_id")
      .eq("id", input.leadId)
      .single();

    if (!lead) return null;

    const row = lead as {
      id: string;
      email: string | null;
      full_name: string | null;
      user_id: string | null;
    };

    let email = row.email;
    let name = row.full_name ?? "there";

    if (row.user_id) {
      const { data: user } = await admin
        .from("users")
        .select("email")
        .eq("id", row.user_id)
        .single();
      if (user) email = (user as { email: string }).email;
    }

    if (!email) return null;

    return {
      email,
      name,
      leadId: row.id,
      clientId: null,
      userId: row.user_id,
    };
  }

  return null;
}

export async function getSavedBankDetails(): Promise<InvoiceBankDetails | null> {
  const auth = await requireAdmin();
  if ("error" in auth) return null;

  const admin = createAdminClient();
  const { data } = await admin
    .from("advisor_settings")
    .select("value")
    .eq("key", INVOICE_BANK_DETAILS_KEY)
    .maybeSingle();

  return parseSavedBankDetails((data as { value: unknown } | null)?.value);
}

export async function saveBankDetails(
  details: InvoiceBankDetails
): Promise<ActionResult> {
  const auth = await requireAdmin();
  if ("error" in auth) return auth;

  const admin = createAdminClient();
  const { error } = await admin.from("advisor_settings").upsert(
    {
      key: INVOICE_BANK_DETAILS_KEY,
      value: {
        accountName: details.accountName.trim(),
        bsb: details.bsb.trim(),
        accountNumber: details.accountNumber.trim(),
        bankName: details.bankName?.trim() || null,
      },
      updated_by: auth.userId,
    } as never,
    { onConflict: "key" }
  );

  if (error) {
    console.error("[saveBankDetails]", error);
    return { error: "Could not save bank details." };
  }

  return { success: true };
}

export async function createInvoice(input: {
  leadId?: string;
  clientId?: string;
  serviceSlug: PublicServiceSlug;
  amount: number;
  notes?: string;
  paymentInstructions?: string;
  bankDetails?: InvoiceBankDetails;
  saveBankDetails?: boolean;
  validUntil?: string;
}): Promise<ActionResult> {
  const auth = await requireAdmin();
  if ("error" in auth) return auth;

  if (!input.leadId && !input.clientId) {
    return { error: "Select a lead or client." };
  }

  if (!input.amount || input.amount <= 0) {
    return { error: "Amount must be greater than zero." };
  }

  const recipient = await resolveRecipient({
    leadId: input.leadId,
    clientId: input.clientId,
  });

  if (!recipient) {
    return { error: "Could not find recipient email for this lead or client." };
  }

  const admin = createAdminClient();
  const serviceName = serviceNameFromSlug(input.serviceSlug);

  let paymentInstructions = input.paymentInstructions?.trim() || "";
  if (!paymentInstructions && input.bankDetails) {
    paymentInstructions = formatPaymentInstructions(
      input.bankDetails,
      recipient.name
    );
  }
  if (!paymentInstructions) {
    paymentInstructions = DEFAULT_PAYMENT_INSTRUCTIONS;
  }

  if (input.saveBankDetails && input.bankDetails) {
    await saveBankDetails(input.bankDetails);
  }

  const { data: proposal, error } = await admin
    .from("proposals")
    .insert({
      client_id: recipient.clientId,
      lead_id: recipient.leadId,
      title: `${serviceName}  -  Invoice`,
      status: "draft",
      total_amount: input.amount,
      service_slug: input.serviceSlug,
      recipient_email: recipient.email,
      recipient_name: recipient.name,
      payment_instructions: paymentInstructions,
      notes: input.notes?.trim() || null,
      valid_until: input.validUntil || null,
    })
    .select("id")
    .single();

  if (error || !proposal) {
    console.error("[createInvoice]", error);
    return { error: "Failed to create invoice." };
  }

  const invoiceId = (proposal as { id: string }).id;

  await admin.from("proposal_items").insert({
    proposal_id: invoiceId,
    item_name: serviceName,
    description: input.notes?.trim() || null,
    quantity: 1,
    unit_price: input.amount,
    total_price: input.amount,
    order_index: 0,
  });

  revalidatePath("/advisor/invoices");
  return { success: true, invoiceId };
}

export async function sendInvoice(invoiceId: string): Promise<ActionResult> {
  const auth = await requireAdmin();
  if ("error" in auth) return auth;

  const admin = createAdminClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const { data: proposal, error } = await admin
    .from("proposals")
    .select("*")
    .eq("id", invoiceId)
    .single();

  if (error || !proposal) return { error: "Invoice not found." };

  const row = proposal as {
    id: string;
    status: string;
    title: string;
    total_amount: number;
    recipient_email: string | null;
    recipient_name: string | null;
    payment_instructions: string | null;
    valid_until: string | null;
    service_slug: string | null;
  };

  if (row.status === "paid") {
    return { error: "This invoice is already paid." };
  }

  const email = row.recipient_email;
  if (!email) return { error: "Invoice has no recipient email." };

  const invoiceUrl = `${siteUrl}/proposal/${invoiceId}`;
  const serviceName = row.service_slug
    ? serviceNameFromSlug(row.service_slug)
    : row.title;

  const amountFormatted = new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(row.total_amount);

  try {
    await resend.emails.send({
      from: FROM,
      to: email,
      subject: `Invoice from Eduardo Mendes Advisory  -  ${serviceName}`,
      text: [
        `Hi ${row.recipient_name ?? "there"},`,
        "",
        `Please find your invoice for ${serviceName}.`,
        "",
        `Amount due: ${amountFormatted}`,
        row.valid_until ? `Valid until: ${row.valid_until}` : "",
        "",
        "View your invoice online:",
        invoiceUrl,
        "",
        "Payment instructions:",
        row.payment_instructions ?? DEFAULT_PAYMENT_INSTRUCTIONS,
        "",
        "Once payment is received, Eduardo will confirm and send your client portal access.",
        "",
        "Best regards,",
        "Eduardo Mendes",
        "Eduardo Mendes Owner Builder Advisory",
      ]
        .filter(Boolean)
        .join("\n"),
    });
  } catch (err) {
    console.error("[sendInvoice] email:", err);
    return { error: "Failed to send invoice email." };
  }

  await admin
    .from("proposals")
    .update({ status: "sent", sent_at: new Date().toISOString() })
    .eq("id", invoiceId);

  revalidatePath("/advisor/invoices");
  revalidatePath(`/advisor/invoices/${invoiceId}`);
  revalidatePath(`/proposal/${invoiceId}`);

  return { success: true, invoiceId };
}

export async function markInvoicePaid(invoiceId: string): Promise<ActionResult> {
  const auth = await requireAdmin();
  if ("error" in auth) return auth;

  const admin = createAdminClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const now = new Date().toISOString();

  const { data: proposal, error } = await admin
    .from("proposals")
    .select("*")
    .eq("id", invoiceId)
    .single();

  if (error || !proposal) return { error: "Invoice not found." };

  const row = proposal as {
    id: string;
    status: string;
    client_id: string | null;
    lead_id: string | null;
    recipient_email: string | null;
    recipient_name: string | null;
    total_amount: number;
    title: string;
    service_slug: string | null;
  };

  if (row.status === "paid") {
    return { error: "Invoice is already marked as paid." };
  }

  let clientId = row.client_id;
  let userId: string | null = null;

  if (clientId) {
    const { data: client } = await admin
      .from("clients")
      .select("user_id")
      .eq("id", clientId)
      .single();
    userId = (client as { user_id: string } | null)?.user_id ?? null;
  } else if (row.lead_id) {
    const { data: lead } = await admin
      .from("leads")
      .select("user_id")
      .eq("id", row.lead_id)
      .single();
    userId = (lead as { user_id: string | null } | null)?.user_id ?? null;
  }

  if (userId) {
    const activation = await activateClient({ userId, sendWelcomeEmail: false });
    if ("error" in activation) {
      return { error: activation.error };
    }
    clientId = activation.clientId;
  }

  await admin
    .from("proposals")
    .update({
      status: "paid",
      paid_at: now,
      client_id: clientId ?? row.client_id,
    })
    .eq("id", invoiceId);

  if (clientId) {
    await admin.from("payments").insert({
      client_id: clientId,
      proposal_id: invoiceId,
      amount: row.total_amount,
      currency: "AUD",
      payment_status: "completed",
      paid_at: now,
    });
  }

  const email = row.recipient_email;
  const name = row.recipient_name ?? "there";
  const serviceName = row.service_slug
    ? serviceNameFromSlug(row.service_slug)
    : row.title;

  if (email) {
    try {
      const portalBlock = userId
        ? [
            "Your client portal is now ready.",
            "",
            `Sign in here: ${siteUrl}/login?redirect=/buildiq/dashboard`,
            "",
            "Use the email and password from your assessment registration.",
            "If you forgot your password, use Forgot Password on the sign-in page.",
          ]
        : [
            "To access your client portal, create your account first:",
            "",
            `${siteUrl}/register?redirect=/buildiq/dashboard`,
            "",
            `Please register using this email address: ${email}`,
          ];

      await resend.emails.send({
        from: FROM,
        to: email,
        subject: "Payment confirmed  -  your client portal is ready",
        text: [
          `Hi ${name},`,
          "",
          `Thank you  -  your payment for ${serviceName} has been confirmed.`,
          "",
          ...portalBlock,
          "",
          "Best regards,",
          "Eduardo Mendes",
        ].join("\n"),
      });
    } catch (err) {
      console.error("[markInvoicePaid] email:", err);
    }
  }

  if (row.lead_id) {
    await admin
      .from("leads")
      .update({ lead_status: "converted" })
      .eq("id", row.lead_id);
  }

  revalidatePath("/advisor/invoices");
  revalidatePath(`/advisor/invoices/${invoiceId}`);
  revalidatePath("/buildiq/dashboard");
  revalidatePath(`/proposal/${invoiceId}`);

  return { success: true, invoiceId };
}
