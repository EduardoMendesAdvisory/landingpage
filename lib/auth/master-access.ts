import { BUSINESS_EMAIL } from "@/lib/site/contact";

/** Emails allowed to use the master (AdvisorHQ) login. Comma-separated in env. */
export function getMasterAdminEmails(): string[] {
  const raw =
    process.env.MASTER_ADMIN_EMAILS ??
    process.env.ADVISOR_EMAIL ??
    BUSINESS_EMAIL;

  return raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isMasterAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return getMasterAdminEmails().includes(email.trim().toLowerCase());
}

export const ADVISOR_LOGIN_PATH = "/advisor/login";
export const ADVISOR_DASHBOARD_PATH = "/advisor/dashboard";
