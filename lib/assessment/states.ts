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

export const QLD_SERVICE_NOTICE =
  "Eduardo Mendes Advisory currently serves residential and owner-builder projects in Queensland only.";

export function isOnboardingStateSelectable(state: string): boolean {
  return state === ONBOARDING_STATE;
}

export function normalizeOnboardingState(state: string | null | undefined): string {
  return state === ONBOARDING_STATE ? ONBOARDING_STATE : ONBOARDING_STATE;
}
