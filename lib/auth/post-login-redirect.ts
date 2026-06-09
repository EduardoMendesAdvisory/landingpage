export type AppRole = "lead" | "client" | "admin";

export function hasClientAccess(
  role: AppRole | string | null | undefined,
  hasClientRecord: boolean
): boolean {
  return role === "client" || hasClientRecord;
}

export function resolvePostLoginPath(
  role: AppRole | string | null | undefined,
  hasClientRecord: boolean,
  redirectPath?: string
): string {
  const safeRedirect =
    redirectPath?.startsWith("/") && !redirectPath.startsWith("//")
      ? redirectPath
      : undefined;

  if (role === "admin") {
    return safeRedirect?.startsWith("/advisor") ? safeRedirect : "/advisor/dashboard";
  }

  if (hasClientAccess(role, hasClientRecord)) {
    return safeRedirect?.startsWith("/buildiq") ? safeRedirect : "/buildiq/dashboard";
  }

  return "/assessment";
}
