"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { setPendingQuote } from "@/lib/pending-quote";
import { ALLOWED_EXTENSIONS, MAX_FILE_SIZE } from "@/utils/validators";
import { cn } from "@/lib/utils";

const ACCEPT = ALLOWED_EXTENSIONS.map((ext) => `.${ext}`).join(",");

interface UploadQuoteButtonProps {
  children: React.ReactNode;
  className?: string;
}

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

export function UploadQuoteButton({ children, className }: UploadQuoteButtonProps) {
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
    router.push("/assessment?from=quote-upload");
    e.target.value = "";
  }

  return (
    <span className="inline-flex flex-col items-stretch">
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        accept={ACCEPT}
        onChange={handleFileChange}
        tabIndex={-1}
        aria-hidden
      />
      <button type="button" onClick={openFilePicker} className={cn(className)}>
        {children}
      </button>
      {error && (
        <span className="text-xs text-red-600 mt-1.5 text-center">{error}</span>
      )}
    </span>
  );
}
