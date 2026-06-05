"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Upload } from "lucide-react";
import { setPendingQuote } from "@/lib/pending-quote";
import { ALLOWED_EXTENSIONS, MAX_FILE_SIZE } from "@/utils/validators";
import { cn } from "@/lib/utils";

const ACCEPT = ALLOWED_EXTENSIONS.map((ext) => `.${ext}`).join(",");

type UploadQuoteVariant = "primary" | "outline" | "link" | "nav" | "cta-outline";
type UploadQuoteSize = "default" | "compact" | "large" | "hero" | "sm";

interface UploadQuoteButtonProps {
  label?: string;
  variant?: UploadQuoteVariant;
  size?: UploadQuoteSize;
  showArrow?: boolean;
  showUploadIcon?: boolean;
  className?: string;
}

const VARIANT_STYLES: Record<UploadQuoteVariant, string> = {
  primary: "bg-[#b67c2c] hover:bg-[#9f6c27] text-white border-transparent",
  outline:
    "border-2 border-white text-white hover:bg-white hover:text-[#b67c2c] bg-transparent",
  link: "bg-transparent border-transparent p-0 normal-case tracking-normal font-normal text-inherit",
  nav: "bg-[#b67c2c] hover:bg-[#9f6c27] text-white border-transparent font-bold uppercase tracking-wider rounded-md",
  "cta-outline":
    "border-2 border-white text-white hover:bg-white hover:text-[#b67c2c] bg-transparent",
};

const SIZE_STYLES: Record<UploadQuoteSize, string> = {
  default: "px-7 py-3.5 text-sm tracking-[0.14em]",
  compact: "px-6 py-3 text-sm tracking-[0.12em]",
  large: "px-8 py-4 text-sm tracking-[0.12em] min-w-[280px] sm:min-w-[320px]",
  hero: "w-full px-6 py-3.5 text-sm tracking-wider font-bold",
  sm: "px-3 py-1.5 text-sm",
};

function validateQuoteFile(file: File): string | null {
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (!ext || !ALLOWED_EXTENSIONS.includes(ext as (typeof ALLOWED_EXTENSIONS)[number])) {
    return `File type not allowed. Accepted: ${ALLOWED_EXTENSIONS.join(", ")}`;
  }
  if (file.size > MAX_FILE_SIZE.lead) {
    return "File too large. Maximum size is 25 MB.";
  }
  return null;
}

export function UploadQuoteButton({
  label = "Upload Your Quote",
  variant = "primary",
  size = "default",
  showArrow = true,
  showUploadIcon = true,
  className,
}: UploadQuoteButtonProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);

  function openFilePicker() {
    setError(null);
    inputRef.current?.click();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateQuoteFile(file);
    if (validationError) {
      setError(validationError);
      e.target.value = "";
      return;
    }

    setPendingQuote(file);
    try {
      localStorage.removeItem("em_assessment_wizard_free");
    } catch {
      /* ignore */
    }
    router.push("/assessment?from=quote-upload");
    e.target.value = "";
  }

  const iconSize = size === "large" ? 17 : size === "hero" ? 16 : 15;
  const isLinkVariant = variant === "link";

  return (
    <div
      className={cn(
        isLinkVariant ? "inline" : "inline-flex flex-col",
        size === "hero" && "w-full max-w-[640px]",
        className
      )}
    >
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        accept={ACCEPT}
        onChange={handleFileChange}
        tabIndex={-1}
        aria-hidden
      />
      <button
        type="button"
        onClick={openFilePicker}
        className={cn(
          isLinkVariant ? "inline" : "inline-flex items-center justify-center gap-2.5",
          !isLinkVariant && "font-semibold uppercase rounded-lg",
          "transition-colors cursor-pointer select-none whitespace-nowrap",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#b67c2c]/50 focus-visible:ring-offset-2",
          VARIANT_STYLES[variant],
          !isLinkVariant && SIZE_STYLES[size]
        )}
      >
        {showUploadIcon && (
          <Upload size={iconSize} className="shrink-0" strokeWidth={2.25} />
        )}
        <span>{label}</span>
        {showArrow && (
          <ArrowRight size={iconSize - 1} className="shrink-0" strokeWidth={2.25} />
        )}
      </button>
      {error && (
        <span className="text-xs text-red-600 mt-1.5 text-center">{error}</span>
      )}
    </div>
  );
}
