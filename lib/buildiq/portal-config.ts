/** Free strategy consultations included in the client portal. */
export const FREE_CONSULTATION_LIMIT = 3;

export const ADVISOR_EMAIL =
  process.env.ADVISOR_EMAIL ?? "contact@eduardomendes.com.au";

export const PAID_CALENDLY_URL =
  process.env.NEXT_PUBLIC_PAID_CALENDLY_URL?.trim() || null;
