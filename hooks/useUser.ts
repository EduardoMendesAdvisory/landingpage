"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface UserState {
  user: User | null;
  role: string | null;
  loading: boolean;
}

/**
 * Client-side hook to access the current authenticated user and their role.
 *
 * NOTE: For Server Components, use createClient() from @/lib/supabase/server
 * and call supabase.auth.getUser() directly — do not use this hook.
 *
 * This hook is for Client Components that need reactive auth state.
 */
export function useUser(): UserState {
  const [state, setState] = useState<UserState>({
    user: null,
    role: null,
    loading: true,
  });

  useEffect(() => {
    const supabase = createClient();

    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setState({ user: null, role: null, loading: false });
        return;
      }

      const { data: userData } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      setState({
        user,
        role: (userData as { role: string } | null)?.role ?? null,
        loading: false,
      });
    }

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session?.user) {
        setState({ user: null, role: null, loading: false });
      } else {
        loadUser();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  return state;
}
