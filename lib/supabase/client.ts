import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database.types";

// Singleton: one browser client per page session prevents competing
// autoRefreshToken timers that would sign the user out when one
// instance uses a refresh token that another instance already rotated.
let _client: ReturnType<typeof createBrowserClient<Database>> | undefined;

export function createClient() {
  if (typeof window === "undefined") {
    return createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  if (!_client) {
    _client = createBrowserClient<Database>(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }
  return _client;
}
