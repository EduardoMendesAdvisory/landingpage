import { type NextRequest, NextResponse } from "next/server";
import {
  mergeSessionCookies,
  updateSession,
} from "@/lib/supabase/middleware";

const ADVISOR_LOGIN = "/advisor/login";

/**
 * Protected routes:
 *   /buildiq/*   — client portal (session required)
 *   /advisor/*   — AdvisorHQ panel (session required, except master login)
 */
export async function proxy(request: NextRequest) {
  const { supabaseResponse, user } = await updateSession(request);
  const { pathname } = request.nextUrl;

  const isAdvisorLogin = pathname === ADVISOR_LOGIN;
  const isAdvisorPanel =
    pathname.startsWith("/advisor") && !isAdvisorLogin;
  const isBuildiq = pathname.startsWith("/buildiq");
  const isProtected = isAdvisorPanel || isBuildiq;

  if (!isProtected) {
    return supabaseResponse;
  }

  if (!user) {
    const loginUrl = new URL(
      isAdvisorPanel ? ADVISOR_LOGIN : "/login",
      request.url
    );
    loginUrl.searchParams.set("redirect", pathname);
    return mergeSessionCookies(
      supabaseResponse,
      NextResponse.redirect(loginUrl)
    );
  }

  supabaseResponse.headers.set(
    "cache-control",
    "no-store, no-cache, must-revalidate"
  );
  supabaseResponse.headers.set("pragma", "no-cache");
  supabaseResponse.headers.set("expires", "0");

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
