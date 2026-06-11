import { BUILDIQ_PORTAL_PENDING_PATH } from "@/lib/auth/buildiq-access";

export type AppRole = "lead" | "client" | "admin";

export function hasClientAccess(
  role: AppRole | string | null | undefined,
  hasClientRecord: boolean,
  clientStatus?: string | null
): boolean {
  if (role === "admin") return false;
  if (role === "client" && hasClientRecord) return clientStatus !== "inactive";
  return hasClientRecord && clientStatus === "active";
}

export function resolvePostLoginPath(
  role: AppRole | string | null | undefined,
  hasClientRecord: boolean,
  redirectPath?: string,
  clientStatus?: string | null
): string {
  const safeRedirect =
    redirectPath?.startsWith("/") && !redirectPath.startsWith("//")
      ? redirectPath
      : undefined;

  if (role === "admin") {
    return safeRedirect?.startsWith("/advisor") ? safeRedirect : "/advisor/dashboard";
  }

  if (hasClientAccess(role, hasClientRecord, clientStatus)) {
    return safeRedirect?.startsWith("/buildiq") ? safeRedirect : "/buildiq/dashboard";
  }

  if (safeRedirect?.startsWith("/buildiq")) {
    return BUILDIQ_PORTAL_PENDING_PATH;
  }

  return "/assessment";
}
