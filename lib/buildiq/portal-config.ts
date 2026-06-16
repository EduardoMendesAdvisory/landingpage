import { BUSINESS_EMAIL } from "@/lib/site/contact";

/** Free strategy consultations included in the client portal. */
export const FREE_CONSULTATION_LIMIT = 3;

export const ADVISOR_EMAIL = process.env.ADVISOR_EMAIL ?? BUSINESS_EMAIL;

export const PAID_CALENDLY_URL =
  process.env.NEXT_PUBLIC_PAID_CALENDLY_URL?.trim() || null;
