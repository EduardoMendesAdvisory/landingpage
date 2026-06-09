import { type NextRequest, NextResponse } from "next/server";
import {
  mergeSessionCookies,
  updateSession,
} from "@/lib/supabase/middleware";

/**
 * Proxy — Next.js 16 convention (replaces middleware.ts).
 *
 * DESIGN: This layer performs an OPTIMISTIC session check only.
 * It verifies that a session JWT exists in cookies; it does NOT make DB
 * queries. DB-based role / access checks live in each layout so that a
 * transient DB error never forces a logout.
 *
 * Protected routes:
 *   /buildiq/*  — requires authenticated session
 *   /advisor/*  — requires authenticated session
 */
export async function proxy(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  const isProtected =
    pathname.startsWith("/advisor") || pathname.startsWith("/buildiq");

  if (!isProtected) {
    return supabaseResponse;
  }

  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return mergeSessionCookies(
      supabaseResponse,
      NextResponse.redirect(loginUrl)
    );
  }

  // Always prevent CDN/edge caching of authenticated pages.
  supabaseResponse.headers.set("cache-control", "no-store, no-cache, must-revalidate");
  supabaseResponse.headers.set("pragma", "no-cache");
  supabaseResponse.headers.set("expires", "0");

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
