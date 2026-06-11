import type { CalendlyFormResponse } from "@/lib/calendly/parse-webhook";

interface MeetingFormResponsesProps {
  responses: CalendlyFormResponse[];
}

export function MeetingFormResponses({ responses }: MeetingFormResponsesProps) {
  if (responses.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No additional form answers from Calendly.
      </p>
    );
  }

  return (
    <dl className="space-y-3">
      {responses.map((item) => (
        <div key={`${item.position ?? 0}-${item.question}`} className="text-sm">
          <dt className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
            {item.question}
          </dt>
          <dd className="text-navy mt-0.5 whitespace-pre-wrap">{item.answer}</dd>
        </div>
      ))}
    </dl>
  );
}
