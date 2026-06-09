import { type NextRequest, NextResponse } from "next/server";
import {
  mergeSessionCookies,
  updateSession,
} from "@/lib/supabase/middleware";
import { hasClientAccess } from "@/lib/auth/post-login-redirect";

/**
 * RBAC Proxy — runs on every request (Next.js 16 proxy convention).
 *
 * Rules:
 * - /buildiq/* requires client access (role = client or clients row)
 * - /advisor/* requires role = admin
 * - Unauthenticated users → redirect to /login
 * - Wrong role → redirect to /unauthorized
 *
 * Session cookies from updateSession are always forwarded on redirects.
 */
export async function proxy(request: NextRequest) {
  const { supabaseResponse, user, supabase } = await updateSession(request);
  const { pathname } = request.nextUrl;

  const isAdvisorRoute = pathname.startsWith("/advisor");
  const isBuildiqRoute = pathname.startsWith("/buildiq");

  if (!isAdvisorRoute && !isBuildiqRoute) {
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

  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  const { data: clientRecord } = await supabase
    .from("clients")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  const role = (userData as { role: string } | null)?.role;

  if (isAdvisorRoute && role !== "admin") {
    return mergeSessionCookies(
      supabaseResponse,
      NextResponse.redirect(new URL("/unauthorized", request.url))
    );
  }

  if (isBuildiqRoute && !hasClientAccess(role, Boolean(clientRecord))) {
    return mergeSessionCookies(
      supabaseResponse,
      NextResponse.redirect(new URL("/unauthorized", request.url))
    );
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
