import {
  CalendarDays,
  FileSearch,
  FolderOpen,
  type LucideIcon,
} from "lucide-react";

type Meeting = {
  meeting_type: string;
  scheduled_at: string | null;
  status: string;
  meeting_url: string | null;
};

type Buildcheck = {
  buildcheck_status: string;
  savings_min: number | null;
  savings_max: number | null;
};

type Task = {
  title: string;
  description: string | null;
  due_date: string | null;
};

export type ClientNextAction = {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  ctaExternal?: boolean;
  icon: LucideIcon;
};

const STAGE_ACTIONS: Record<string, ClientNextAction> = {
  project_assessment: {
    eyebrow: "What's Next",
    title: "Book your Strategy Session",
    description:
      "Your assessment is complete. Book a free discovery call with Eduardo to discuss your project and the best path forward.",
    ctaLabel: "Book Strategy Call",
    ctaHref: "/buildiq/meetings",
    icon: CalendarDays,
  },
  strategy_session: {
    eyebrow: "What's Next",
    title: "Service Engagement",
    description:
      "Your strategy session is complete. Eduardo will recommend the right service for your project. Check your documents for next steps.",
    ctaLabel: "View Documents",
    ctaHref: "/buildiq/documents",
    icon: FolderOpen,
  },
  service_engagement: {
    eyebrow: "What's Next",
    title: "Upload your documents",
    description:
      "Your service is active. Share your builder quote, contract and plans so Eduardo can begin the detailed review.",
    ctaLabel: "Upload Documents",
    ctaHref: "/buildiq/documents",
    icon: FolderOpen,
  },
  detailed_review: {
    eyebrow: "Review Underway",
    title: "Detailed review in progress",
    description:
      "Eduardo is analysing your documents. You will be notified as soon as your action plan is ready.",
    ctaLabel: "View Documents",
    ctaHref: "/buildiq/documents",
    icon: FileSearch,
  },
  action_plan_delivered: {
    eyebrow: "Action Plan Ready",
    title: "Your action plan is available",
    description:
      "Eduardo has delivered your recommendations and report. Review your documents and take the next steps with confidence.",
    ctaLabel: "View Documents",
    ctaHref: "/buildiq/documents",
    icon: FileSearch,
  },
  advisory_support: {
    eyebrow: "Advisory Support Active",
    title: "Ongoing support active",
    description:
      "Eduardo is providing active advisory support. Book a meeting anytime for guidance on your build, variations or site decisions.",
    ctaLabel: "Book Meeting",
    ctaHref: "/buildiq/meetings",
    icon: CalendarDays,
  },
  completed: {
    eyebrow: "Project Complete",
    title: "Service successfully completed",
    description:
      "Congratulations on reaching this milestone. Review your project documents and summary anytime.",
    ctaLabel: "View Project",
    ctaHref: "/buildiq/project",
    icon: FileSearch,
  },
};

function formatMeetingType(type: string): string {
  return type
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function formatMeetingDate(date: string): string {
  return new Date(date).toLocaleString("en-AU", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function resolveClientNextAction(input: {
  projectStage: string | null;
  upcomingMeeting: Meeting | null;
  recentMeeting: Meeting | null;
  buildcheck: Buildcheck | null;
  nextTask: Task | null;
}): ClientNextAction {
  const { projectStage, upcomingMeeting, recentMeeting, buildcheck, nextTask } = input;

  // 1. Upcoming meeting takes priority
  if (upcomingMeeting) {
    return {
      eyebrow: "Upcoming Meeting",
      title: formatMeetingType(upcomingMeeting.meeting_type),
      description: upcomingMeeting.scheduled_at
        ? formatMeetingDate(upcomingMeeting.scheduled_at)
        : "Your next call with Eduardo is scheduled.",
      ctaLabel: upcomingMeeting.meeting_url ? "Join Meeting" : "View Meeting",
      ctaHref: upcomingMeeting.meeting_url ?? "/buildiq/meetings",
      ctaExternal: Boolean(upcomingMeeting.meeting_url),
      icon: CalendarDays,
    };
  }

  // 2. Pending task
  if (nextTask) {
    return {
      eyebrow: "Your Next Task",
      title: nextTask.title,
      description:
        nextTask.description ??
        (nextTask.due_date
          ? `Due ${new Date(nextTask.due_date).toLocaleDateString("en-AU", { dateStyle: "medium" })}`
          : "Complete this to keep your project moving forward."),
      ctaLabel: "View Task",
      ctaHref: "/buildiq/project",
      icon: FileSearch,
    };
  }

  // 3. BuildCheck completed
  if (buildcheck?.buildcheck_status === "completed") {
    const savings =
      buildcheck.savings_min && buildcheck.savings_max
        ? ` Potential savings identified: $${buildcheck.savings_min.toLocaleString()}-$${buildcheck.savings_max.toLocaleString()}.`
        : "";
    return {
      eyebrow: "BuildCheck Ready",
      title: "Your review is complete",
      description: `Eduardo has finished your BuildCheck.${savings} Review the findings and next steps.`,
      ctaLabel: "View Documents",
      ctaHref: "/buildiq/documents",
      icon: FileSearch,
    };
  }

  // 4. BuildCheck in progress
  if (buildcheck && ["reviewing", "in_progress", "pending"].includes(buildcheck.buildcheck_status)) {
    return {
      eyebrow: "BuildCheck Update",
      title: "Review in progress",
      description:
        "Eduardo is analysing your quote. You will receive a notification when your report is ready to view.",
      ctaLabel: "View Documents",
      ctaHref: "/buildiq/documents",
      icon: FileSearch,
    };
  }

  // 5. Recent meeting completed - prompt document upload
  if (recentMeeting && ["completed", "done", "past"].includes(recentMeeting.status)) {
    const meetingLabel = formatMeetingType(recentMeeting.meeting_type);
    const meetingDate = recentMeeting.scheduled_at
      ? ` on ${formatMeetingDate(recentMeeting.scheduled_at)}`
      : "";
    return {
      eyebrow: "What's Next",
      title: `${meetingLabel} complete`,
      description: `Great progress${meetingDate}. Upload your builder quote and documents so Eduardo can begin your review.`,
      ctaLabel: "Upload Documents",
      ctaHref: "/buildiq/documents",
      icon: FolderOpen,
    };
  }

  // 6. Stage-based default
  if (projectStage && STAGE_ACTIONS[projectStage]) {
    return STAGE_ACTIONS[projectStage];
  }

  // 7. Absolute fallback
  return {
    eyebrow: "What's Next",
    title: "Keep your project moving",
    description:
      "Share any new quotes, plans, or questions with Eduardo. He will guide you on the next best step.",
    ctaLabel: "Book Meeting",
    ctaHref: "/buildiq/meetings",
    icon: CalendarDays,
  };
}
