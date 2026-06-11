"use client";

import { useEffect, useRef } from "react";

export type CalendlyTrackingContext = {
  service?: string | null;
  leadId?: string | null;
  clientId?: string | null;
  /** Passed as fallback when Calendly API key is not configured */
  email?: string | null;
  /** Passed as fallback when Calendly API key is not configured */
  name?: string | null;
};

interface CalendlyEmbedProps {
  url: string;
  tracking?: CalendlyTrackingContext;
}

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: { url: string; parentElement: HTMLElement }) => void;
    };
  }
}

const CALENDLY_SCRIPT = "https://assets.calendly.com/assets/external/widget.js";

async function syncBookingToServer(data: Record<string, unknown>, tracking?: CalendlyTrackingContext) {
  console.log("[CalendlyEmbed] booking detected, syncing to server...", {
    event: data.event,
    tracking,
    payload: data.payload,
  });
  try {
    const res = await fetch("/api/calendly/sync-booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...data, tracking }),
    });
    const json = await res.json();
    console.log("[CalendlyEmbed] sync result:", json);
  } catch (err) {
    console.error("[CalendlyEmbed] sync failed", err);
  }
}

export function CalendlyEmbed({ url, tracking }: CalendlyEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackingRef = useRef(tracking);
  trackingRef.current = tracking;

  useEffect(() => {
    function onMessage(event: MessageEvent) {
      const data = event.data;
      if (!data || typeof data !== "object") return;
      const row = data as Record<string, unknown>;
      if (typeof row.event !== "string") return;
      if (row.event === "calendly.event_scheduled") {
        void syncBookingToServer(row, trackingRef.current ?? undefined);
      }
    }

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const initWidget = () => {
      if (!window.Calendly || !containerRef.current) return;
      containerRef.current.innerHTML = "";
      window.Calendly.initInlineWidget({
        url,
        parentElement: containerRef.current,
      });
    };

    const existingScript = document.querySelector(`script[src="${CALENDLY_SCRIPT}"]`);

    if (existingScript) {
      if (window.Calendly) {
        initWidget();
      } else {
        existingScript.addEventListener("load", initWidget);
        return () => existingScript.removeEventListener("load", initWidget);
      }
      return;
    }

    const script = document.createElement("script");
    script.src = CALENDLY_SCRIPT;
    script.async = true;
    script.onload = initWidget;
    document.head.appendChild(script);
  }, [url]);

  return (
    <div
      ref={containerRef}
      className="w-full rounded-xl overflow-hidden border border-border bg-white"
      style={{ minWidth: "320px", height: "700px" }}
    />
  );
}
