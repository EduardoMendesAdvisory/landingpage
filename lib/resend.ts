import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  console.warn("RESEND_API_KEY is not set — emails will not be delivered");
}

export const resend = new Resend(process.env.RESEND_API_KEY ?? "");

export const FROM_EMAIL =
  process.env.RESEND_FROM_EMAIL ?? "noreply@eduardomendes.com.au";

export const FROM_NAME =
  process.env.RESEND_FROM_NAME ?? "Eduardo Mendes Advisory";

export const FROM = `${FROM_NAME} <${FROM_EMAIL}>`;
