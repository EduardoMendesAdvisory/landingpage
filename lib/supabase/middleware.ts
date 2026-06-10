import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import type { Database } from "@/types/database.types";
import {
  AUTH_USER_EMAIL_HEADER,
  AUTH_USER_ID_HEADER,
} from "@/lib/supabase/auth-headers";

export type SessionUser = { id: string };

type CookieToSet = {
  name: string;
  value: string;
  options?: Parameters<NextResponse["cookies"]["set"]>[2];
};

/**
 * Refreshes the Supabase session on every request.
 *
 * Uses getUser() so token refresh (and refresh-token rotation) happens HERE
 * in the proxy, where setAll CAN write cookies to the response.
 */
export async function updateSession(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  let pendingCookies: CookieToSet[] = [];
  let supabaseResponse = NextResponse.next({
    request: { headers: requestHeaders },
  });

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          pendingCookies = cookiesToSet;
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({
            request: { headers: requestHeaders },
          });
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
    requestHeaders.set(AUTH_USER_ID_HEADER, user.id);
    if (user.email) requestHeaders.set(AUTH_USER_EMAIL_HEADER, user.email);
  }

  // Rebuild once so Server Components receive auth headers (Netlify RSC gap).
  supabaseResponse = NextResponse.next({
    request: { headers: requestHeaders },
  });
  pendingCookies.forEach(({ name, value, options }) =>
    supabaseResponse.cookies.set(name, value, options)
  );

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
