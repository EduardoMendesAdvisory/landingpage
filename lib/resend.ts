import { Resend } from "resend";
import { BUSINESS_EMAIL } from "@/lib/site/contact";

if (!process.env.RESEND_API_KEY) {
  console.warn("RESEND_API_KEY is not set — emails will not be delivered");
}

export const resend = new Resend(
  process.env.RESEND_API_KEY || "re_placeholder_not_configured"
);

/** Primary from address — Resend verified domain. */
export const FROM_EMAIL =
  process.env.FROM_EMAIL ??
  process.env.RESEND_FROM_EMAIL ??
  BUSINESS_EMAIL;

export const FROM_NAME =
  process.env.RESEND_FROM_NAME ?? "Eduardo Mendes Advisory";

export const FROM = `${FROM_NAME} <${FROM_EMAIL}>`;
