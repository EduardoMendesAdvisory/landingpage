/** Qualitative project scale - no dollar amounts shown to clients. */
export const PROJECT_SCALE_LABELS: Record<string, string> = {
  under_50k: "Compact project",
  "50k_100k": "Small project",
  "100k_250k": "Medium project",
  "250k_500k": "Large project",
  "500k_1m": "Major project",
  over_1m: "Very large project",
  not_sure: "Not sure yet",
};

export const PROJECT_SCALE_OPTIONS = [
  {
    value: "under_50k",
    label: "Compact",
    sub: "Minor works or a small renovation",
  },
  {
    value: "50k_100k",
    label: "Small",
    sub: "Single area or modest upgrade",
  },
  {
    value: "100k_250k",
    label: "Medium",
    sub: "Typical renovation or secondary dwelling",
  },
  {
    value: "250k_500k",
    label: "Large",
    sub: "Full renovation or smaller new build",
  },
  {
    value: "500k_1m",
    label: "Major",
    sub: "New home or substantial project",
  },
  {
    value: "over_1m",
    label: "Very large",
    sub: "High-complexity or prestige build",
  },
  {
    value: "not_sure",
    label: "Not sure yet",
    sub: "Still working out scope and scale",
  },
] as const;

export function formatProjectScale(value: string | null | undefined): string {
  if (!value) return "-";
  return PROJECT_SCALE_LABELS[value] ?? value.replace(/_/g, " ");
}

/** @deprecated Use formatProjectScale - kept for internal tier keys. */
export const BUDGET_LABELS = PROJECT_SCALE_LABELS;
