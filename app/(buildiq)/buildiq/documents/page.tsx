import { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient, getServerUser } from "@/lib/supabase/server";
import Link from "next/link";
import { FileText, FolderOpen } from "lucide-react";
import { DocumentUploadButton } from "@/components/buildiq/DocumentUploadButton";
import { DocumentRowActions } from "@/components/buildiq/DocumentRowActions";
import { getDocumentDownloadUrl } from "@/features/buildiq/actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Documents" };

const CATEGORY_LABELS: Record<string, string> = {
  builder_quotes: "Builder Quote",
  contracts: "Contracts",
  plans: "Plans & Drawings",
  photos: "Site Photos",
  reports: "Reports",
  council_documents: "Council Documents",
  other: "Other",
};

function formatFileSize(bytes: number | null): string {
  if (bytes == null || bytes <= 0) return "--";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default async function DocumentsPage() {
  const user = await getServerUser();

  if (!user) redirect("/login?redirect=/buildiq/documents");

  const supabase = await createClient();

  const clientResult = await supabase
    .from("clients")
    .select("id")
    .eq("user_id", user.id)
    .maybeSingle();

  const client = clientResult.data as { id: string } | null;

  let documents: Array<{
    id: string;
    file_name: string;
    category: string;
    file_size: number | null;
    created_at: string;
  }> = [];

  if (client?.id) {
    const result = await supabase
      .from("documents")
      .select("id, file_name, category, file_size, created_at")
      .eq("client_id", client.id)
      .order("created_at", { ascending: false })
      .limit(50);
    documents = (result.data ?? []) as typeof documents;
  }

  const downloadUrls = new Map<string, string>();
  for (const doc of documents) {
    const result = await getDocumentDownloadUrl(doc.id);
    if ("url" in result) downloadUrls.set(doc.id, result.url);
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-xl font-bold text-[#111A24]">Project Documents</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Your files are stored securely and only visible to you and Eduardo.
          </p>
        </div>
        <DocumentUploadButton />
      </div>
      <div className="px-8 py-6">
        {documents.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 flex flex-col items-center text-center">
            <div className="h-16 w-16 rounded-full bg-[#b67c2c]/10 flex items-center justify-center mb-4">
              <FolderOpen size={28} className="text-[#b67c2c]" />
            </div>
            <h2 className="text-lg font-bold text-[#111A24] mb-2">No documents yet</h2>
            <p className="text-sm text-muted-foreground max-w-sm mb-6">
              Upload builder quotes, contracts and plans so Eduardo can review them.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <p className="text-sm font-bold text-[#111A24]">
                Your Documents ({documents.length})
              </p>
            </div>
            <div className="divide-y divide-gray-50">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50 transition-colors"
                >
                  <div className="h-9 w-9 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                    <FileText size={16} className="text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#111A24] truncate">
                      {doc.file_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {CATEGORY_LABELS[doc.category] ?? doc.category}
                    </p>
                  </div>
                  <div className="text-right shrink-0 hidden sm:block">
                    <p className="text-xs text-muted-foreground">
                      {new Date(doc.created_at).toLocaleDateString("en-AU", {
                        dateStyle: "medium",
                      })}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(doc.file_size)}
                    </p>
                  </div>
                  <DocumentRowActions
                    documentId={doc.id}
                    fileName={doc.file_name}
                    downloadUrl={downloadUrls.get(doc.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        <p className="text-xs text-muted-foreground mt-4">
          Need help uploading?{" "}
          <Link href="/buildiq/meetings" className="text-[#b67c2c] hover:underline">
            Book a meeting with Eduardo
          </Link>
        </p>
      </div>
    </div>
  );
}
