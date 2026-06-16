export const ALL_AU_STATES = [
  "NSW",
  "VIC",
  "QLD",
  "SA",
  "WA",
  "ACT",
  "TAS",
  "NT",
] as const;

/** Only Queensland is serviced during onboarding. */
export const ONBOARDING_STATE = "QLD" as const;

export function isOnboardingStateSelectable(state: string): boolean {
  return state === ONBOARDING_STATE;
}

export function normalizeOnboardingState(state: string | null | undefined): string {
  return state === ONBOARDING_STATE ? ONBOARDING_STATE : ONBOARDING_STATE;
}
