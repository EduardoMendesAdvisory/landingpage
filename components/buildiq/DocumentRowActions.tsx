"use client";

import { useState, useTransition } from "react";
import { Download, Trash2, Loader2 } from "lucide-react";
import {
  deleteClientDocument,
  getDocumentDownloadUrl,
} from "@/features/buildiq/actions";

interface DocumentRowActionsProps {
  documentId: string;
  fileName: string;
  downloadUrl?: string;
}

export function DocumentRowActions({
  documentId,
  fileName,
  downloadUrl,
}: DocumentRowActionsProps) {
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleDownload() {
    setError(null);
    startTransition(async () => {
      let url = downloadUrl;
      if (!url) {
        const result = await getDocumentDownloadUrl(documentId);
        if ("error" in result) {
          setError(result.error);
          return;
        }
        url = result.url;
      }
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      link.remove();
    });
  }

  function handleDelete() {
    const confirmed = window.confirm(
      `Delete "${fileName}"? This cannot be undone.`
    );
    if (!confirmed) return;

    setError(null);
    startTransition(async () => {
      const result = await deleteClientDocument(documentId);
      if ("error" in result) {
        setError(result.error);
        return;
      }
      window.location.reload();
    });
  }

  return (
    <div className="flex items-center gap-1 shrink-0">
      <button
        type="button"
        onClick={handleDownload}
        disabled={pending}
        title="Download"
        aria-label={`Download ${fileName}`}
        className="p-2 rounded-lg text-muted-foreground hover:text-[#111A24] hover:bg-gray-100 transition-colors disabled:opacity-50"
      >
        {pending ? (
          <Loader2 size={16} className="animate-spin" />
        ) : (
          <Download size={16} />
        )}
      </button>
      <button
        type="button"
        onClick={handleDelete}
        disabled={pending}
        title="Delete"
        aria-label={`Delete ${fileName}`}
        className="p-2 rounded-lg text-muted-foreground hover:text-red-600 hover:bg-red-50 transition-colors disabled:opacity-50"
      >
        <Trash2 size={16} />
      </button>
      {error && (
        <span className="text-[10px] text-red-600 max-w-[120px] leading-tight">
          {error}
        </span>
      )}
    </div>
  );
}
