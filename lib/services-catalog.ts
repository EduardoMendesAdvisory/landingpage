export const PUBLIC_SERVICES = [
  {
    slug: "buildcheck",
    name: "BuildCheck",
    href: "/buildcheck",
    description:
      "Independent review of your builder quotes, contracts and plans before you sign.",
  },
  {
    slug: "pre-construction-advisory",
    name: "Pre-Construction Advisory",
    href: "/services/pre-construction-advisory",
    description:
      "Expert guidance through design, budget, builder selection and contract negotiation.",
  },
  {
    slug: "construction-advisory",
    name: "Construction Advisory",
    href: "/services/construction-advisory",
    description:
      "Ongoing support throughout your build to protect your investment and manage risk.",
  },
  {
    slug: "site-visits-inspections",
    name: "Site Visits & Inspections",
    href: "/services/site-visits-inspections",
    description:
      "Independent site inspections at key milestones to verify quality and compliance.",
  },
  {
    slug: "owner-builder-program",
    name: "Owner Builder Program",
    href: "/services/owner-builder-program",
    description:
      "Structured mentoring and expert guidance to manage your own build successfully.",
  },
] as const;

export type PublicServiceSlug = (typeof PUBLIC_SERVICES)[number]["slug"];

export function getBookCallUrl(params?: { service?: string; lead?: string }): string {
  const search = new URLSearchParams();
  if (params?.service) search.set("service", params.service);
  if (params?.lead) search.set("lead", params.lead);
  const query = search.toString();
  return query ? `/book-call?${query}` : "/book-call";
}

export function getConsultationUrl(service?: string): string {
  return getBookCallUrl(service ? { service } : undefined);
}
