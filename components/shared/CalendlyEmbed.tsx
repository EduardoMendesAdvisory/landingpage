"use client";

import { useEffect, useRef } from "react";

interface CalendlyEmbedProps {
  url: string;
}

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (options: { url: string; parentElement: HTMLElement }) => void;
    };
  }
}

const CALENDLY_SCRIPT = "https://assets.calendly.com/assets/external/widget.js";

export function CalendlyEmbed({ url }: CalendlyEmbedProps) {
  const containerRef = useRef<HTMLDivElement>(null);

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
