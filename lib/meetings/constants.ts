/** Free strategy consultation length configured in Calendly. */
export const STRATEGY_CALL_DURATION_MINUTES = 15;

export function meetingDurationLabel(
  meetingType: string,
  durationMinutes: number | null | undefined
): string {
  const fallback =
    meetingType === "strategy_call" ? STRATEGY_CALL_DURATION_MINUTES : null;
  const minutes = durationMinutes ?? fallback;
  return minutes ? `${minutes} min` : "";
}
