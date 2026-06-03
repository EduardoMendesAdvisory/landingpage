import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database.types";

/**
 * Admin Supabase client — uses the Service Role Key.
 * SERVER-SIDE ONLY. Never import this in client components.
 * This client bypasses RLS and is used for:
 * - DB triggers/automation in Server Actions
 * - Audit log writes
 * - Post-registration profile creation
 */
export function createAdminClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured");
  }
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
