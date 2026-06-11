import type { CalendlyCustomQuestion } from "@/lib/calendly/api";

export type LeadCalendlyPrefill = {
  email?: string;
  name?: string;
  phone?: string;
  leadId?: string;
  service?: string;
  clientId?: string;
};

/** Map lead phone to Calendly custom answer slot (a1, a2, ...). */
export function phoneAnswerIndex(
  questions: CalendlyCustomQuestion[]
): number | null {
  const phoneQuestion = questions.find((q) =>
    /phone|mobile|tel/i.test(q.name)
  );
  return phoneQuestion ? phoneQuestion.position + 1 : null;
}

export function buildCalendlyPrefillParams(
  prefill: LeadCalendlyPrefill,
  customQuestions: CalendlyCustomQuestion[] = []
): Record<string, string> {
  const params: Record<string, string> = {};

  if (prefill.email) params.email = prefill.email;
  if (prefill.name) params.name = prefill.name;
  if (prefill.leadId) params.utm_campaign = prefill.leadId;
  if (prefill.service) params.utm_content = prefill.service;
  if (prefill.clientId) params.utm_term = prefill.clientId;

  if (prefill.phone) {
    const index = phoneAnswerIndex(customQuestions);
    if (index) {
      params[`a${index}`] = prefill.phone;
    }
  }

  return params;
}
