import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { User } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

const cookieOptions =
  process.env.NODE_ENV === "production" ? { secure: true as const } : undefined;

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch {
            // setAll called from a Server Component — read-only context, ignore
          }
        },
      },
      cookieOptions,
    }
  );
}

/**
 * Read the authenticated user from session cookies without contacting
 * Supabase Auth. Use in Server Components on routes already guarded by
 * proxy.ts, which refreshes tokens via getUser() once per request.
 * Calling getUser() again in Server Components can rotate refresh tokens
 * in a read-only cookie context and log users out on Netlify production.
 */
export async function getServerUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();
  return session?.user ?? null;
}
