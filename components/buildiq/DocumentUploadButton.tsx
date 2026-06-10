"use client";

import { useRef, useState, useTransition } from "react";
import { Upload, Loader2 } from "lucide-react";
import {
  getSignedUploadUrl,
  registerUploadedDocument,
} from "@/features/buildiq/actions";
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

export function DocumentUploadButton() {
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

    startTransition(async () => {
      // Step 1: Get a signed upload URL from the server.
      // The server validates auth using fresh server-side cookies —
      // no browser Supabase client or session cookie needed here.
      const urlResult = await getSignedUploadUrl({ fileName: file.name });

      if ("error" in urlResult) {
        setError(urlResult.error);
        return;
      }

      const { signedUrl, storagePath } = urlResult;

      // Step 2: Upload directly to Supabase Storage via the signed URL.
      // This is a plain HTTP PUT — no auth headers needed (signed URL embeds the token).
      const uploadRes = await fetch(signedUrl, {
        method: "PUT",
        headers: { "Content-Type": file.type || "application/octet-stream" },
        body: file,
      });

      if (!uploadRes.ok) {
        const detail = await uploadRes.text().catch(() => "");
        console.error("[DocumentUpload] PUT failed:", uploadRes.status, detail);
        setError("Upload failed. Please try again.");
        return;
      }

      // Step 3: Register the document in the database via server action.
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
