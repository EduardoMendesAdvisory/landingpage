"use client";

import { useTransition } from "react";
import { Download, Loader2 } from "lucide-react";
import { getLeadDocumentDownloadUrl } from "@/features/leads/actions";

interface LeadDocumentDownloadButtonProps {
  documentId: string;
  fileName: string;
}

export function LeadDocumentDownloadButton({
  documentId,
  fileName,
}: LeadDocumentDownloadButtonProps) {
  const [isPending, startTransition] = useTransition();

  function handleDownload() {
    startTransition(async () => {
      const result = await getLeadDocumentDownloadUrl(documentId);
      if ("url" in result) {
        window.open(result.url, "_blank", "noopener,noreferrer");
      }
    });
  }

  return (
    <button
      type="button"
      onClick={handleDownload}
      disabled={isPending}
      className="inline-flex items-center gap-1.5 text-xs font-semibold text-warm-soil hover:underline disabled:opacity-50"
    >
      {isPending ? (
        <Loader2 size={13} className="animate-spin" />
      ) : (
        <Download size={13} />
      )}
      {fileName}
    </button>
  );
}
