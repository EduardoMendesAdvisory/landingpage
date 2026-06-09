import { createServerClient } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import type { Database } from "@/types/database.types";

export type SessionUser = { id: string };

/**
 * Refreshes the Supabase session cookie on every request.
 * Uses getClaims() and forwards cache headers so CDNs (e.g. Netlify) do not
 * cache authenticated responses — missing headers cause random logouts.
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

  // Do not run code between createServerClient and getClaims().
  const { data: claimsData } = await supabase.auth.getClaims();

  const userId = claimsData?.claims?.sub;
  const user: SessionUser | null =
    typeof userId === "string" && userId.length > 0 ? { id: userId } : null;

  return { supabaseResponse, user, supabase };
}

/** Copy refreshed session cookies onto redirect/error responses. */
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
