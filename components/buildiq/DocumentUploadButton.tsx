"use client";

import { useRef, useState, useTransition } from "react";
import { Upload, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { registerUploadedDocument } from "@/features/buildiq/actions";
import type { Database } from "@/types/database.types";

type DocumentCategory = Database["public"]["Enums"]["document_category"];

const CATEGORIES: { value: DocumentCategory; label: string }[] = [
  { value: "builder_quotes", label: "Builder Quote" },
  { value: "contracts", label: "Contracts" },
  { value: "plans", label: "Plans & Drawings" },
  { value: "photos", label: "Site Photos" },
  { value: "reports", label: "Reports" },
  { value: "council_documents", label: "Council Documents" },
  { value: "other", label: "Other" },
];

interface Props {
  userId: string;
}

export function DocumentUploadButton({ userId }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState<DocumentCategory>("other");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function openPicker() {
    inputRef.current?.click();
  }

  async function handleFiles(files: FileList | null) {
    if (!files?.length) return;

    const file = files[0];
    setError(null);

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const storagePath = `${userId}/${Date.now()}-${safeName}`;

    startTransition(async () => {
      // Use the singleton browser client — no getUser() call here, we received
      // userId from the authenticated server component, so the user is signed in.
      const supabase = createClient();

      const { error: uploadError } = await supabase.storage
        .from("client-documents")
        .upload(storagePath, file, { upsert: false });

      if (uploadError) {
        console.error("[DocumentUpload]", uploadError);
        if (uploadError.message.toLowerCase().includes("auth") ||
            uploadError.message.toLowerCase().includes("unauthorized") ||
            uploadError.message.toLowerCase().includes("jwt")) {
          setError("Session expired. Please refresh the page and try again.");
        } else {
          setError("Upload failed. Please try again.");
        }
        return;
      }

      const result = await registerUploadedDocument({
        fileName: file.name,
        storagePath,
        fileSize: file.size,
        fileType: file.type || "application/octet-stream",
        category,
      });

      if ("error" in result) {
        setError(result.error);
        return;
      }

      window.location.reload();
    });
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value as DocumentCategory)}
        className="rounded-lg border border-gray-200 px-2 py-2 text-xs text-[#111A24] bg-white"
        disabled={pending}
        aria-label="Document category"
      >
        {CATEGORIES.map((c) => (
          <option key={c.value} value={c.value}>
            {c.label}
          </option>
        ))}
      </select>

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp,.xls,.xlsx"
        onChange={(e) => handleFiles(e.target.files)}
      />

      <button
        type="button"
        onClick={openPicker}
        disabled={pending}
        className="inline-flex items-center gap-2 bg-[#111A24] hover:bg-[#1d2a38] disabled:opacity-60 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
      >
        {pending ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
        Upload Documents
      </button>

      {error && (
        <p className="text-xs text-red-600 max-w-xs">{error}</p>
      )}
    </div>
  );
}
