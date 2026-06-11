/** Extract Calendly user UUID from a Personal Access Token (JWT). */
export function getCalendlyUserUuidFromToken(token: string): string | null {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    const payload = JSON.parse(
      Buffer.from(parts[1], "base64url").toString("utf8")
    ) as { user_uuid?: string };
    return payload.user_uuid ?? null;
  } catch {
    return null;
  }
}

export function getCalendlyUserUri(token: string): string | null {
  const uuid = getCalendlyUserUuidFromToken(token);
  return uuid ? `https://api.calendly.com/users/${uuid}` : null;
}

export function getCalendlyTokenScopes(token: string): string[] {
  try {
    const parts = token.split(".");
    if (parts.length < 2) return [];
    const payload = JSON.parse(
      Buffer.from(parts[1], "base64url").toString("utf8")
    ) as { scope?: string };
    return payload.scope?.split(/\s+/).filter(Boolean) ?? [];
  } catch {
    return [];
  }
}
