import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import type { Database } from "@/types/database.types";

export type SessionUser = { id: string };

/**
 * Refreshes the Supabase session on every request.
 *
 * Uses getUser() — not getSession() or getClaims() — so that any token
 * refresh (and the resulting refresh-token rotation) happens HERE in the
 * proxy, where setAll CAN write the new cookies to the response. If refresh
 * happened inside a Server Component (read-only cookie context), the new
 * tokens would be silently dropped, the old refresh token would be invalid,
 * and the next request would be logged out.
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
          // Update the in-memory request so downstream Server Components
          // see the refreshed tokens via cookies().
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          // Rebuild the response with the updated request and set cookies.
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
          // Forward cache-control headers that prevent CDN caching of auth responses.
          Object.entries(headers).forEach(([key, value]) =>
            supabaseResponse.headers.set(key, value)
          );
        },
      },
      cookieOptions:
        process.env.NODE_ENV === "production" ? { secure: true } : undefined,
    }
  );

  // IMPORTANT: Do not add any code between createServerClient and getUser().
  // getUser() contacts the Supabase auth server; if the access token is
  // expired it uses the refresh token (rotating it) and calls setAll above
  // to persist the new tokens in the response before the page renders.
  const {
    data: { user },
  } = await supabase.auth.getUser();

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
