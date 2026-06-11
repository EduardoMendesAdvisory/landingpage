import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  CheckCircle2,
  ClipboardList,
  FileText,
  Receipt,
  UserCheck,
  UserPlus,
  XCircle,
} from "lucide-react";
import type { LeadStatus } from "@/lib/leads/constants";

export type LeadJourneyStep = {
  id: string;
  label: string;
  description: string;
};

export type AdvisorNextAction = {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
  icon: LucideIcon;
};

// Pipeline stages on the lead detail page - written for Eduardo, not the lead.
export const LEAD_JOURNEY_STEPS: LeadJourneyStep[] = [
  {
    id: "captured",
    label: "Lead captured",
    description: "New contact entered the pipeline with source and contact details.",
  },
  {
    id: "assessment",
    label: "Assessment submitted",
    description: "Lead completed the preliminary or paid project assessment.",
  },
  {
    id: "call",
    label: "Strategy call",
    description: "Consultation booked and completed with the lead.",
  },
  {
    id: "qualified",
    label: "Qualified",
    description: "Lead confirmed as a fit for advisory services.",
  },
  {
    id: "invoice",
    label: "Invoice & payment",
    description: "Service proposal sent and payment received.",
  },
  {
    id: "client",
    label: "Client portal",
    description: "BuildIQ access activated and project underway.",
  },
];

const STATUS_TO_STEP_INDEX: Record<LeadStatus, number> = {
  new: 0,
  assessment_started: 0,
  preliminary_assessment_completed: 1,
  assessment_completed: 1,
  call_booked: 2,
  call_completed: 2,
  qualified: 3,
  not_qualified: 2,
  client_approved: 4,
  converted: 5,
  lost: 2,
  closed: 5,
};

// Action cards for Eduardo - imperative voice, lead referred to in third person.
const ADVISOR_ACTIONS: Record<LeadStatus, AdvisorNextAction> = {
  new: {
    eyebrow: "Action required",
    title: "Qualify the new lead",
    description:
      "Review contact details, source and project type. Send the assessment link or follow up if they need help getting started.",
    ctaLabel: "Preview assessment flow",
    ctaHref: "/assessment",
    icon: UserPlus,
  },
  assessment_started: {
    eyebrow: "Waiting on lead",
    title: "Assessment in progress",
    description:
      "The lead started the assessment but has not submitted it yet. No action needed unless they reach out.",
    icon: ClipboardList,
  },
  preliminary_assessment_completed: {
    eyebrow: "Action required",
    title: "Review the preliminary assessment",
    description:
      "Check the lead's score, uploaded documents and risk flags. Follow up to get a strategy call booked if nothing is scheduled within 48 hours.",
    ctaLabel: "Lead book-call link",
    ctaHref: "/book-call",
    icon: FileText,
  },
  assessment_completed: {
    eyebrow: "Action required",
    title: "Review the paid assessment",
    description:
      "The paid assessment is complete. Review findings and confirm whether a strategy call is already scheduled.",
    icon: FileText,
  },
  call_booked: {
    eyebrow: "Before the call",
    title: "Prepare for the strategy session",
    description:
      "Review Calendly answers, assessment results and uploaded documents. Prepare talking points for the meeting.",
    icon: CalendarDays,
  },
  call_completed: {
    eyebrow: "Action required",
    title: "Qualify and send proposal",
    description:
      "Add post-call notes, set status to Qualified or Not Qualified, then send an invoice for the recommended service.",
    ctaLabel: "Create invoice",
    icon: UserCheck,
  },
  qualified: {
    eyebrow: "Action required",
    title: "Send invoice",
    description:
      "Create and send an invoice with payment instructions. Once paid, activate their BuildIQ portal access.",
    ctaLabel: "Create invoice",
    icon: Receipt,
  },
  not_qualified: {
    eyebrow: "Pipeline closed",
    title: "Lead not qualified",
    description:
      "Optionally add a note explaining why. No further action unless the lead re-engages later.",
    icon: XCircle,
  },
  client_approved: {
    eyebrow: "Action required",
    title: "Activate client portal",
    description:
      "Payment received or approved manually. Activate BuildIQ access so the client can log in.",
    icon: UserCheck,
  },
  converted: {
    eyebrow: "Client active",
    title: "Monitor onboarding",
    description:
      "The client is in BuildIQ. Track documents, meetings and project progress from their workspace.",
    icon: CheckCircle2,
  },
  lost: {
    eyebrow: "Pipeline closed",
    title: "Lead lost",
    description: "No further action. Keep internal notes for reference if they return.",
    icon: XCircle,
  },
  closed: {
    eyebrow: "Pipeline closed",
    title: "Lead archived",
    description: "This lead is closed. Re-open by changing status if they return.",
    icon: CheckCircle2,
  },
};

export function getLeadJourneyProgress(status: LeadStatus): {
  activeIndex: number;
  steps: Array<LeadJourneyStep & { state: "done" | "current" | "upcoming" }>;
} {
  const activeIndex = STATUS_TO_STEP_INDEX[status] ?? 0;

  const steps = LEAD_JOURNEY_STEPS.map((step, index) => {
    let state: "done" | "current" | "upcoming" = "upcoming";
    if (index < activeIndex) state = "done";
    else if (index === activeIndex) state = "current";
    return { ...step, state };
  });

  return { activeIndex, steps };
}

export function resolveAdvisorNextAction(input: {
  status: LeadStatus;
  leadId: string;
  hasUpcomingCall: boolean;
  hasPendingInvoice: boolean;
  isClient: boolean;
}): AdvisorNextAction {
  const base = ADVISOR_ACTIONS[input.status];

  if (
    input.hasUpcomingCall &&
    ["preliminary_assessment_completed", "assessment_completed", "call_booked"].includes(
      input.status
    )
  ) {
    return {
      eyebrow: "Upcoming call",
      title: "Strategy call scheduled",
      description:
        "Review the lead's assessment and Calendly form answers before the meeting. The join link is in Calls.",
      ctaLabel: "View calls",
      ctaHref: "/advisor/calls",
      icon: CalendarDays,
    };
  }

  if (
    input.hasPendingInvoice &&
    ["qualified", "call_completed", "client_approved"].includes(input.status)
  ) {
    return {
      eyebrow: "Payment pending",
      title: "Invoice awaiting payment",
      description:
        "Invoice sent but not yet paid. Follow up if needed, or activate portal access once payment is confirmed.",
      ctaLabel: "View invoices",
      ctaHref: "/advisor/invoices",
      icon: Receipt,
    };
  }

  if (input.isClient && input.status !== "converted") {
    return {
      eyebrow: "Client active",
      title: "Portal access live",
      description:
        "This lead is now a client. Manage their project from the client workspace.",
      ctaLabel: "Open workspace",
      ctaHref: "/advisor/projects",
      icon: CheckCircle2,
    };
  }

  const action = { ...base };
  if (action.ctaHref === "/book-call") {
    action.ctaHref = `/book-call?lead=${input.leadId}`;
  }
  if (action.ctaLabel === "Create invoice") {
    action.ctaHref = `/advisor/invoices/new?leadId=${input.leadId}`;
  }

  return action;
}
