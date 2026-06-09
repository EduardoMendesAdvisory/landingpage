export type RegisterOnboardingPath = "quote" | "assessment" | "service";

/** All registration paths continue into the standard assessment onboarding. */
export function resolvePostRegisterPath(
  path: RegisterOnboardingPath,
  serviceSlug?: string | null
): string {
  const params = new URLSearchParams();

  if (path === "quote") {
    params.set("from", "quote-upload");
  }

  if (path === "service" && serviceSlug) {
    params.set("service", serviceSlug);
  }

  const query = params.toString();
  return query ? `/assessment?${query}` : "/assessment";
}

export const REGISTER_PATH_LABELS: Record<
  RegisterOnboardingPath,
  { title: string; description: string }
> = {
  quote: {
    title: "Upload your quote",
    description: "Attach your builder quote, then complete the standard onboarding.",
  },
  assessment: {
    title: "Free preliminary assessment",
    description: "Start the standard onboarding with a few questions about your project.",
  },
  service: {
    title: "Choose a service",
    description: "Tell us which service you need, then complete the standard onboarding.",
  },
};

export const ONBOARDING_ENTRY_PATH = "/assessment";
