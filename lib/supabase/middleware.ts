import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import type { Database } from "@/types/database.types";

export type SessionUser = { id: string };

/**
 * Refreshes the Supabase session on every request and returns the active
 * session user (or null).
 *
 * Uses getSession() — not getClaims() — because getClaims() rejects expired
 * JWTs with AuthInvalidJwtError, causing the proxy to see no user and redirect
 * to /login even when a valid refresh token is present.
 *
 * getSession() reads the session from cookies and, if the access token is
 * expired, silently refreshes it using the refresh token. The new tokens are
 * written back to the response via the setAll handler.
 *
 * The layouts use getUser() for cryptographically verified auth; getSession()
 * here is intentionally optimistic (used only for redirect decisions).
 */
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
          Object.entries(headers).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value)
          );
        },
      },
    }
  );

  // getSession() reads from cookies; if the access token is expired it uses
  // the refresh token and fires TOKEN_REFRESHED → setAll saves new cookies.
  // Do NOT add code between createServerClient and getSession().
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const user: SessionUser | null = session?.user?.id
    ? { id: session.user.id }
    : null;

  return { supabaseResponse, user };
}

/** Copy refreshed session cookies onto redirect responses. */
export function mergeSessionCookies(
  sessionResponse: NextResponse,
  response: NextResponse
): NextResponse {
  sessionResponse.cookies.getAll().forEach(({ name, value }) => {
    response.cookies.set(name, value);
  });
  for (const header of ["cache-control", "expires", "pragma"]) {
    const value = sessionResponse.headers.get(header);
    if (value) response.headers.set(header, value);
  }
  return response;
}
