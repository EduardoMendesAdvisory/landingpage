import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

/**
 * RBAC Middleware — runs on every request (Edge runtime).
 *
 * Rules:
 * - /buildiq/* requires role = client
 * - /advisor/* requires role = admin
 * - Unauthenticated users → redirect to /login
 * - Wrong role → redirect to /unauthorized
 *
 * SEC-03: Never use SUPABASE_SERVICE_ROLE_KEY here.
 * SEC-01: Role checked from DB (auth.uid() = id via RLS).
 */
export async function proxy(request: NextRequest) {
  const { supabaseResponse, user, supabase } = await updateSession(request);
  const { pathname } = request.nextUrl;

  const isAdvisorRoute = pathname.startsWith("/advisor");
  const isBuildiqRoute = pathname.startsWith("/buildiq");

  // Not a protected route — just refresh session and continue
  if (!isAdvisorRoute && !isBuildiqRoute) {
    return supabaseResponse;
  }

  // Protected route but no session — send to login
  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // User is authenticated — check role from DB
  // Explicit cast needed: Supabase string-literal select inference is limited
  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = (userData as { role: string } | null)?.role;

  if (isAdvisorRoute && role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  if (isBuildiqRoute && role !== "client") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimisation)
     * - favicon.ico
     * - public image files
     */
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
