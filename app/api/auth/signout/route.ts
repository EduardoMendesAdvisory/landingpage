import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

function safeNextPath(request: NextRequest): string {
  const next = request.nextUrl.searchParams.get("next");
  if (next?.startsWith("/") && !next.startsWith("//")) return next;
  return "/login";
}

/** Sign out must be a POST: Next.js prefetches GET links in production. */
export async function POST(request: NextRequest) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect(safeNextPath(request));
}

/** Prefetched GETs must never destroy the session. */
export async function GET(request: NextRequest) {
  return NextResponse.redirect(new URL(safeNextPath(request), request.url));
}
