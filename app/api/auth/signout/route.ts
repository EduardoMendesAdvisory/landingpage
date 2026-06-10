import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";

/** Sign out must be a POST: Next.js prefetches GET links in production,
 * which was destroying sessions moments after login. */
export async function POST(_request: NextRequest) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

/** Prefetched GETs must never destroy the session. */
export async function GET(request: NextRequest) {
  return NextResponse.redirect(new URL("/login", request.url));
}
