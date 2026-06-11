"use client";

import { useRef, useState, useTransition } from "react";
import { Upload, Loader2 } from "lucide-react";
import { uploadAdvisorDocumentToClient } from "@/features/documents/actions";
import type { Database } from "@/types/database.types";

type DocumentCategory = Database["public"]["Enums"]["document_category"];

const CATEGORIES: { value: DocumentCategory; label: string }[] = [
  { value: "reports", label: "Reports" },
  { value: "builder_quotes", label: "Builder Quote" },
  { value: "contracts", label: "Contracts" },
  { value: "plans", label: "Plans & Drawings" },
  { value: "council_documents", label: "Council Documents" },
  { value: "other", label: "Other" },
];

interface AdvisorDocumentUploadProps {
  clientId: string;
}

export function AdvisorDocumentUpload({ clientId }: AdvisorDocumentUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState<DocumentCategory>("reports");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pending, startTransition] = useTransition();

  function openPicker() {
    inputRef.current?.click();
  }

  function handleFiles(files: FileList | null) {
    if (!files?.length) return;
    const file = files[0];
    setError(null);
    setSuccess(false);

    startTransition(async () => {
      const base64 = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          resolve(result.split(",")[1] ?? "");
        };
        reader.onerror = () => reject(new Error("Could not read file."));
        reader.readAsDataURL(file);
      });

      const result = await uploadAdvisorDocumentToClient({
        clientId,
        fileName: file.name,
        fileBase64: base64,
        fileType: file.type || "application/octet-stream",
        fileSize: file.size,
        category,
        description: description || undefined,
      });

      if ("error" in result) {
        setError(result.error);
        return;
      }

      setDescription("");
      setSuccess(true);
      window.location.reload();
    });
  }

  return (
    <div className="bg-white rounded-2xl border border-border p-5 space-y-4 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
      <div>
        <h3 className="text-sm font-semibold text-navy">Share document with client</h3>
        <p className="text-xs text-muted-foreground mt-1">
          Uploaded files appear on the client&apos;s BuildIQ documents page.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="doc-category" className="block text-xs font-semibold text-navy mb-1.5">
            Category
          </label>
          <select
            id="doc-category"
            value={category}
            onChange={(e) => setCategory(e.target.value as DocumentCategory)}
            className="w-full rounded-lg border border-border px-3 py-2.5 text-sm"
            disabled={pending}
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="doc-desc" className="block text-xs font-semibold text-navy mb-1.5">
            Description (optional)
          </label>
          <input
            id="doc-desc"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g. Action plan summary"
            className="w-full rounded-lg border border-border px-3 py-2.5 text-sm"
            disabled={pending}
          />
        </div>
      </div>

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.webp,.xls,.xlsx"
        onChange={(e) => handleFiles(e.target.files)}
      />

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}
      {success && (
        <p className="text-sm text-green-700 bg-green-50 rounded-lg px-3 py-2">
          Document shared with client.
        </p>
      )}

      <button
        type="button"
        onClick={openPicker}
        disabled={pending}
        className="inline-flex items-center gap-2 bg-warm-soil hover:bg-warm-soil/90 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2.5 rounded-lg"
      >
        {pending ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
        Upload for client
      </button>
    </div>
  );
}
