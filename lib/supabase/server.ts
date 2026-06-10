import { createServerClient } from "@supabase/ssr";
import { cookies, headers } from "next/headers";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  AUTH_USER_EMAIL_HEADER,
  AUTH_USER_ID_HEADER,
} from "@/lib/supabase/auth-headers";

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

function userFromProxyHeaders(
  userId: string,
  email: string | null
): User {
  return {
    id: userId,
    email: email ?? undefined,
    app_metadata: {},
    user_metadata: {},
    aud: "authenticated",
    created_at: "",
  } as User;
}

/**
 * Read the authenticated user for Server Components on routes already
 * guarded by proxy.ts. Prefer session cookies; fall back to proxy headers
 * when cookies are unavailable in RSC on Netlify production.
 */
export async function getServerUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.user) return session.user;

  const headerStore = await headers();
  const userId = headerStore.get(AUTH_USER_ID_HEADER);
  if (!userId) return null;

  return userFromProxyHeaders(
    userId,
    headerStore.get(AUTH_USER_EMAIL_HEADER)
  );
}

/** For server actions: returns user + client (session or admin fallback). */
export async function getAuthContext(): Promise<{
  user: User;
  supabase: SupabaseClient<Database>;
} | null> {
  const user = await getServerUser();
  if (!user) return null;

  const supabase = await createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.user) {
    return { user: session.user, supabase };
  }

  return { user, supabase: createAdminClient() };
}
