import { resend, FROM, FROM_EMAIL } from "@/lib/resend";
import { renderBrandedEmail, type BrandedEmailContent } from "@/lib/emails/layout";

export type SendBrandedEmailInput = {
  to: string | string[];
  subject: string;
  content: BrandedEmailContent;
  replyTo?: string;
  text?: string;
};

export type SendEmailResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

export async function sendBrandedEmail(
  input: SendBrandedEmailInput
): Promise<SendEmailResult> {
  if (!process.env.RESEND_API_KEY) {
    console.error("[sendBrandedEmail] RESEND_API_KEY is not configured");
    return { ok: false, error: "Email service is not configured." };
  }

  const html = renderBrandedEmail(input.content);

  try {
    const { data, error } = await resend.emails.send({
      from: FROM,
      to: input.to,
      subject: input.subject,
      html,
      text: input.text,
      replyTo: input.replyTo,
    });

    if (error) {
      console.error("[sendBrandedEmail]", error);
      return { ok: false, error: error.message ?? "Failed to send email." };
    }

    return { ok: true, id: data?.id ?? "sent" };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to send email.";
    console.error("[sendBrandedEmail]", err);
    return { ok: false, error: message };
  }
}

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export { FROM_EMAIL };
