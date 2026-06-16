import { BUSINESS_EMAIL } from "@/lib/site/contact";

/** Default AdvisorHQ login — only this address unless MASTER_ADMIN_EMAILS overrides. */
export const DEFAULT_MASTER_ADMIN_EMAIL = BUSINESS_EMAIL;

/** Emails allowed to use the master (AdvisorHQ) login. Comma-separated in env. */
export function getMasterAdminEmails(): string[] {
  const fromEnv = process.env.MASTER_ADMIN_EMAILS?.split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  if (fromEnv?.length) {
    const unique = new Set(fromEnv);
    unique.add(DEFAULT_MASTER_ADMIN_EMAIL);
    return [...unique];
  }

  return [DEFAULT_MASTER_ADMIN_EMAIL];
}

export function isMasterAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return getMasterAdminEmails().includes(email.trim().toLowerCase());
}

export const ADVISOR_LOGIN_PATH = "/advisor/login";
export const ADVISOR_DASHBOARD_PATH = "/advisor/dashboard";
