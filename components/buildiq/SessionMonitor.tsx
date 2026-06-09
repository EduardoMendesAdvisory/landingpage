"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

/** Debug-only: logs browser session state after each navigation. */
export function SessionMonitor() {
  const pathname = usePathname();

  useEffect(() => {
    const run = async () => {
      const supabase = createClient();
      const cookieNames = document.cookie
        .split(";")
        .map((c) => c.trim().split("=")[0])
        .filter(Boolean);
      const { data: { user }, error } = await supabase.auth.getUser();
      // #region agent log
      fetch('http://127.0.0.1:7897/ingest/0b40bcdf-20cc-46c3-ab5a-b68a1f5e1bf9', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': 'ca573b' },
        body: JSON.stringify({
          sessionId: 'ca573b', runId: 'run1', hypothesisId: 'B-nav',
          location: 'SessionMonitor.tsx:useEffect',
          message: 'browser session after navigation',
          data: {
            pathname,
            hasUser: !!user,
            error: error?.message ?? null,
            cookieCount: cookieNames.length,
            hasSbCookie: cookieNames.some(n => n.startsWith('sb-')),
            cookieNames,
          },
          timestamp: Date.now(),
        }),
      }).catch(() => {});
      // #endregion
    };
    run();
  }, [pathname]);

  return null;
}
