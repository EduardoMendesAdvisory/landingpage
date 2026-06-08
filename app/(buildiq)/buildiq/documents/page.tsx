import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { FileText, FolderOpen, Upload } from "lucide-react";

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

export default async function DocumentsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const clientResult = await supabase.from("clients").select("id").eq("user_id", user!.id).single();
  const client = clientResult.data as { id: string } | null;

  let documents: Array<{ id: string; file_name: string; category: string; file_size: number | null; created_at: string }> = [];

  if (client?.id) {
    const result = await supabase
      .from("documents")
      .select("id, file_name, category, file_size, created_at")
      .eq("client_id", client.id)
      .order("created_at", { ascending: false })
      .limit(20);
    documents = (result.data ?? []) as typeof documents;
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-xl font-bold text-[#111A24]">Project Documents</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Everything related to your project in one place.</p>
        </div>
        <Link href="/assessment" className="inline-flex items-center gap-2 bg-[#111A24] hover:bg-[#1d2a38] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors">
          <Upload size={15} />
          Upload Documents
        </Link>
      </div>
      <div className="px-8 py-6">
        {documents.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 flex flex-col items-center text-center">
            <div className="h-16 w-16 rounded-full bg-[#b67c2c]/10 flex items-center justify-center mb-4">
              <FolderOpen size={28} className="text-[#b67c2c]" />
            </div>
            <h2 className="text-lg font-bold text-[#111A24] mb-2">No documents yet</h2>
            <p className="text-sm text-muted-foreground max-w-sm mb-6">Upload your builder quotes, contracts and plans so Eduardo can review them.</p>
            <Link href="/assessment" className="inline-flex items-center gap-2 bg-[#b67c2c] hover:bg-[#9f6c27] text-white font-semibold px-6 py-3 rounded-lg text-sm transition-colors">
              <Upload size={15} />
              Upload Documents
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <p className="text-sm font-bold text-[#111A24]">Recent Documents ({documents.length})</p>
            </div>
            <div className="divide-y divide-gray-50">
              {documents.map((doc) => (
                <div key={doc.id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50 transition-colors">
                  <div className="h-9 w-9 rounded-lg bg-red-50 flex items-center justify-center shrink-0">
                    <FileText size={16} className="text-red-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#111A24] truncate">{doc.file_name}</p>
                    <p className="text-xs text-muted-foreground">{CATEGORY_LABELS[doc.category] ?? doc.category}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-muted-foreground">
                      {new Date(doc.created_at).toLocaleDateString("en-AU", { dateStyle: "medium" })}
                    </p>
                    {doc.file_size && (
                      <p className="text-xs text-muted-foreground">{(doc.file_size / 1024 / 1024).toFixed(1)} MB</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
