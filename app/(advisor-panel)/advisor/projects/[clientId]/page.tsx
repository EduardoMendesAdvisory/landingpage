import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { ClientTaskManager } from "@/components/advisor/ClientTaskManager";
import { ProjectStageEditor } from "@/components/advisor/ProjectStageEditor";
import { AdvisorDocumentUpload } from "@/components/advisor/AdvisorDocumentUpload";
import { AdvisorMessageReply } from "@/components/advisor/AdvisorMessageReply";
import { AdvisorMessageThread } from "@/components/advisor/AdvisorMessageThread";
import { BuildcheckReviewPanel } from "@/components/advisor/BuildcheckReviewPanel";
import { ProjectTimeline } from "@/components/shared/ProjectTimeline";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { normaliseStage } from "@/lib/buildiq/project-stages";
import { isAdvisorSharedDocument } from "@/lib/documents/storage";
import { getAdvisorClientDocumentUrl } from "@/features/documents/actions";
import { formatCurrency, formatDate } from "@/utils/formatters";
import { serviceNameFromSlug } from "@/lib/invoices/constants";
import {
  ArrowLeft,
  FileText,
  Mail,
  MessageSquare,
  Receipt,
  FileSearch,
} from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Client Workspace" };

const CATEGORY_LABELS: Record<string, string> = {
  builder_quotes: "Builder Quote",
  contracts: "Contracts",
  plans: "Plans & Drawings",
  photos: "Site Photos",
  reports: "Reports",
  council_documents: "Council Documents",
  other: "Other",
};

export default async function AdvisorProjectWorkspacePage({
  params,
}: {
  params: Promise<{ clientId: string }>;
}) {
  const { clientId } = await params;
  const admin = createAdminClient();

  const { data: client } = await admin
    .from("clients")
    .select("id, user_id, client_status, lead_id")
    .eq("id", clientId)
    .single();

  if (!client) notFound();

  const clientRow = client as {
    id: string;
    user_id: string;
    client_status: string;
    lead_id: string | null;
  };

  const [
    userResult,
    profileResult,
    tasksResult,
    projectResult,
    messagesResult,
    documentsResult,
    proposalsResult,
    buildchecksResult,
  ] = await Promise.all([
    admin.from("users").select("email").eq("id", clientRow.user_id).single(),
    admin
      .from("user_profiles")
      .select("first_name, last_name")
      .eq("user_id", clientRow.user_id)
      .maybeSingle(),
    admin
      .from("tasks")
      .select("id, title, description, status, due_date")
      .eq("client_id", clientId)
      .order("due_date", { ascending: true, nullsFirst: false })
      .order("created_at", { ascending: false }),
    admin
      .from("projects")
      .select("id, project_name, project_stage, notes, project_status")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    admin
      .from("messages")
      .select("id, subject, content, created_at, sender_id, is_read")
      .eq("client_id", clientId)
      .order("created_at", { ascending: true })
      .limit(100),
    admin
      .from("documents")
      .select("id, file_name, category, created_at, uploaded_by, storage_path")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false })
      .limit(20),
    admin
      .from("proposals")
      .select("id, title, status, total_amount, service_slug, sent_at, created_at")
      .eq("client_id", clientId)
      .order("created_at", { ascending: false })
      .limit(10),
    admin
      .from("buildchecks")
      .select(
        "id, title, buildcheck_status, builder_name, quote_amount, risk_level, savings_min, savings_max, summary, notes, created_at, project_id, lead_id"
      )
      .order("created_at", { ascending: false }),
  ]);

  const email = (userResult.data as { email: string } | null)?.email ?? "Client";
  const profile = profileResult.data as {
    first_name: string | null;
    last_name: string | null;
  } | null;
  const clientLabel =
    [profile?.first_name, profile?.last_name].filter(Boolean).join(" ") ||
    email.split("@")[0];

  const tasks = (tasksResult.data ?? []) as Array<{
    id: string;
    title: string;
    description: string | null;
    status: string;
    due_date: string | null;
  }>;

  const project = projectResult.data as {
    id: string;
    project_name: string;
    project_stage: string | null;
    notes: string | null;
    project_status: string;
  } | null;

  const messages = (messagesResult.data ?? []) as Array<{
    id: string;
    subject: string | null;
    content: string;
    created_at: string;
    sender_id: string;
    is_read: boolean | null;
  }>;

  const documents = (documentsResult.data ?? []) as Array<{
    id: string;
    file_name: string;
    category: string;
    created_at: string;
    uploaded_by: string | null;
    storage_path: string;
  }>;

  const proposals = (proposalsResult.data ?? []) as Array<{
    id: string;
    title: string;
    status: string;
    total_amount: number;
    service_slug: string | null;
    sent_at: string | null;
    created_at: string;
  }>;

  const allBuildchecks = (buildchecksResult.data ?? []) as Array<{
    id: string;
    title: string;
    buildcheck_status: string;
    builder_name: string | null;
    quote_amount: number | null;
    risk_level: string | null;
    savings_min: number | null;
    savings_max: number | null;
    summary: string | null;
    notes: string | null;
    created_at: string;
    project_id: string | null;
    lead_id: string | null;
  }>;

  const buildchecks = allBuildchecks.filter(
    (bc) =>
      bc.project_id === project?.id ||
      (clientRow.lead_id && bc.lead_id === clientRow.lead_id)
  );

  const lastClientMessage = [...messages]
    .reverse()
    .find((m) => m.sender_id === clientRow.user_id);

  const replySubject = lastClientMessage?.subject
    ? lastClientMessage.subject.startsWith("Re:")
      ? lastClientMessage.subject
      : `Re: ${lastClientMessage.subject}`
    : "";

  const advisorMessages = messages.map((msg) => ({
    id: msg.id,
    subject: msg.subject,
    content: msg.content,
    created_at: msg.created_at,
    isFromClient: msg.sender_id === clientRow.user_id,
  }));

  const downloadUrls = new Map<string, string>();
  for (const doc of documents) {
    const result = await getAdvisorClientDocumentUrl(doc.id);
    if ("url" in result) downloadUrls.set(doc.id, result.url);
  }

  return (
    <>
      <DashboardHeader title="AdvisorHQ" userName="Eduardo" userInitials="EM" />
      <div className="flex-1 px-6 py-8 space-y-8">
        <Link
          href="/advisor/projects"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-navy"
        >
          <ArrowLeft size={15} />
          All projects
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-navy">{clientLabel}</h1>
            <p className="text-sm text-muted-foreground mt-1 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1">
                <Mail size={14} />
                {email}
              </span>
              {project && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-light-bg text-navy">
                  {project.project_name}
                </span>
              )}
              <StatusBadge status={clientRow.client_status} />
            </p>
          </div>
          <Link
            href={`/advisor/invoices/new?clientId=${clientId}`}
            className="inline-flex items-center gap-2 bg-navy hover:bg-navy/90 text-white text-xs font-semibold px-4 py-2.5 rounded-lg"
          >
            <Receipt size={14} />
            New invoice
          </Link>
        </div>

        {project && (
          <section className="space-y-4">
            <h2 className="text-sm font-semibold text-navy uppercase tracking-wide">
              Project journey
            </h2>
            <div className="grid lg:grid-cols-2 gap-6">
              <ProjectTimeline
                stage={normaliseStage(project.project_stage)}
                size="compact"
                assessmentSubmitted
              />
              <ProjectStageEditor
                projectId={project.id}
                currentStage={normaliseStage(project.project_stage)}
                notes={project.notes}
              />
            </div>
          </section>
        )}

        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-navy uppercase tracking-wide flex items-center gap-2">
            <FileSearch size={16} />
            Quote reviews (BuildCheck)
          </h2>
          <BuildcheckReviewPanel clientId={clientId} buildchecks={buildchecks} />
        </section>

        <section className="space-y-4">
          <h2 className="text-sm font-semibold text-navy uppercase tracking-wide flex items-center gap-2">
            <Receipt size={16} />
            Invoices & proposals
          </h2>
          <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            {proposals.length === 0 ? (
              <p className="px-5 py-8 text-sm text-muted-foreground text-center">
                No invoices sent yet for this client.
              </p>
            ) : (
              <div className="divide-y divide-border">
                {proposals.map((proposal) => (
                  <Link
                    key={proposal.id}
                    href={`/advisor/invoices/${proposal.id}`}
                    className="flex items-center justify-between gap-4 px-5 py-3 hover:bg-light-bg transition-colors"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-navy truncate">
                        {proposal.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {proposal.service_slug
                          ? serviceNameFromSlug(proposal.service_slug)
                          : "Service"}{" "}
                         -  {formatDate(proposal.sent_at ?? proposal.created_at)}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-navy">
                        {formatCurrency(proposal.total_amount)}
                      </p>
                      <StatusBadge status={proposal.status} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        <section>
          <ClientTaskManager
            clientId={clientId}
            clientLabel={clientLabel}
            initialTasks={tasks}
          />
        </section>

        <section className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-navy uppercase tracking-wide flex items-center gap-2">
              <MessageSquare size={16} />
              Messages
            </h2>
            <AdvisorMessageThread
              clientId={clientId}
              clientLabel={clientLabel}
              messages={advisorMessages}
            />
            <AdvisorMessageReply clientId={clientId} defaultSubject={replySubject} />
          </div>

          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-navy uppercase tracking-wide flex items-center gap-2">
              <FileText size={16} />
              Documents
            </h2>
            <AdvisorDocumentUpload clientId={clientId} />
            <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
              {documents.length === 0 ? (
                <p className="px-5 py-8 text-sm text-muted-foreground text-center">
                  No documents on file.
                </p>
              ) : (
                <div className="divide-y divide-border">
                  {documents.map((doc) => {
                    const sharedByAdvisor = isAdvisorSharedDocument(
                      doc.uploaded_by,
                      clientRow.user_id,
                      doc.storage_path
                    );
                    return (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between gap-3 px-5 py-3"
                      >
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-navy truncate">
                            {doc.file_name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {CATEGORY_LABELS[doc.category] ?? doc.category}
                            {sharedByAdvisor && (
                              <span className="ml-2 text-warm-soil font-medium">
                                 -  Shared by you
                              </span>
                            )}
                          </p>
                        </div>
                        {downloadUrls.has(doc.id) && (
                          <a
                            href={downloadUrls.get(doc.id)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-semibold text-warm-soil hover:underline shrink-0"
                          >
                            Download
                          </a>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
