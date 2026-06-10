import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import type { Database } from "@/types/database.types";
import {
  AUTH_USER_EMAIL_HEADER,
  AUTH_USER_ID_HEADER,
} from "@/lib/supabase/auth-headers";

export type SessionUser = { id: string };

/**
 * Refreshes the Supabase session on every request.
 *
 * Uses getUser() so token refresh (and refresh-token rotation) happens HERE
 * in the proxy, where setAll CAN write cookies to the response.
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
          // Mutating request.cookies updates the Cookie header forwarded to
          // Server Components, so RSC sees the refreshed tokens too.
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
      cookieOptions:
        process.env.NODE_ENV === "production" ? { secure: true } : undefined,
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // Forward verified identity to Server Components (Netlify RSC gap).
    request.headers.set(AUTH_USER_ID_HEADER, user.id);
    if (user.email) request.headers.set(AUTH_USER_EMAIL_HEADER, user.email);

    const refreshedCookies = supabaseResponse.cookies.getAll();
    const carriedHeaders = ["cache-control", "expires", "pragma"]
      .map((name) => [name, supabaseResponse.headers.get(name)] as const)
      .filter((entry): entry is readonly [string, string] => Boolean(entry[1]));

    supabaseResponse = NextResponse.next({ request });
    refreshedCookies.forEach((cookie) => supabaseResponse.cookies.set(cookie));
    carriedHeaders.forEach(([name, value]) =>
      supabaseResponse.headers.set(name, value)
    );
  }

  return { supabaseResponse, user };
}

/** Copy refreshed session cookies onto redirect responses. */
export function mergeSessionCookies(
  sessionResponse: NextResponse,
  response: NextResponse
): NextResponse {
  sessionResponse.cookies.getAll().forEach((cookie) => {
    response.cookies.set(cookie);
  });
  for (const header of ["cache-control", "expires", "pragma"]) {
    const value = sessionResponse.headers.get(header);
    if (value) response.headers.set(header, value);
  }
  return response;
}
