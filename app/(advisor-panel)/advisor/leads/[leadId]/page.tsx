import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { createAdminClient } from "@/lib/supabase/admin";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { LeadStatusBadge } from "@/components/advisor/LeadStatusBadge";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatCurrency, formatDate } from "@/utils/formatters";
import {
  formatSavingsPercentRange,
  normalizeSavingsPercent,
} from "@/lib/assessment/preliminary-metrics";
import { formatProjectScale } from "@/lib/assessment/budget-ranges";
import { ActivateClientButton } from "@/features/clients/components/ActivateClientButton";
import {
  LeadNextStepsPanel,
  LeadPipelineProvider,
  LeadStatusSelectControl,
} from "@/components/advisor/LeadPipelineSection";
import { LeadNotesEditor } from "@/components/advisor/LeadNotesEditor";
import { LeadDocumentDownloadButton } from "@/components/advisor/LeadDocumentDownloadButton";
import type { Database } from "@/types/database.types";
import { MeetingFormResponses } from "@/components/advisor/MeetingFormResponses";
import { serviceNameFromSlug } from "@/lib/invoices/constants";
import type { CalendlyFormResponse } from "@/lib/calendly/parse-webhook";
import {
  ArrowLeft,
  ExternalLink,
  FileText,
  Mail,
  MapPin,
  Phone,
  Receipt,
  CalendarDays,
  User,
  Video,
} from "lucide-react";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Lead Detail" };

type LeadStatus = Database["public"]["Enums"]["lead_status"];

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ leadId: string }>;
}) {
  const { leadId } = await params;
  const admin = createAdminClient();

  const { data: lead, error } = await admin
    .from("leads")
    .select("*")
    .eq("id", leadId)
    .single();

  if (error || !lead) notFound();

  const row = lead as {
    id: string;
    lead_status: LeadStatus;
    created_at: string;
    updated_at: string;
    full_name: string | null;
    email: string | null;
    phone: string | null;
    suburb: string | null;
    state: string | null;
    location: string | null;
    project_type: string | null;
    project_stage: string | null;
    budget_range: string | null;
    source: string | null;
    notes: string | null;
    user_id: string | null;
  };

  const [
    assessmentRes,
    documentsRes,
    meetingsRes,
    proposalsRes,
    clientRes,
    userRes,
  ] = await Promise.all([
    admin
      .from("assessments")
      .select("*")
      .eq("lead_id", leadId)
      .eq("is_current", true)
      .maybeSingle(),
    admin
      .from("documents")
      .select("id, file_name, file_size, category, created_at")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: false }),
    admin
      .from("meetings")
      .select(
        "id, meeting_type, scheduled_at, status, invitee_name, invitee_email, meeting_url, service_slug, form_responses"
      )
      .eq("lead_id", leadId)
      .order("scheduled_at", { ascending: false }),
    admin
      .from("proposals")
      .select("id, title, status, total_amount, created_at")
      .eq("lead_id", leadId)
      .order("created_at", { ascending: false }),
    admin
      .from("clients")
      .select("id, client_status, activated_at")
      .eq("lead_id", leadId)
      .maybeSingle(),
    row.user_id
      ? admin.from("users").select("email, role").eq("id", row.user_id).single()
      : Promise.resolve({ data: null }),
  ]);

  const assessment = assessmentRes.data as {
    assessment_score: number | null;
    assessment_type: string | null;
    project_subtype: string | null;
    finish_level: string | null;
    potential_savings_min: number | null;
    potential_savings_max: number | null;
    risk_count: number | null;
    recommended_actions_count: number | null;
    benchmark_position: string | null;
  } | null;

  const documents = (documentsRes.data ?? []) as Array<{
    id: string;
    file_name: string;
    file_size: number | null;
    category: string | null;
    created_at: string;
  }>;

  const meetings = (meetingsRes.data ?? []) as Array<{
    id: string;
    meeting_type: string | null;
    scheduled_at: string;
    status: string;
    invitee_name: string | null;
    invitee_email: string | null;
    meeting_url: string | null;
    service_slug: string | null;
    form_responses: CalendlyFormResponse[] | null;
  }>;

  const proposals = (proposalsRes.data ?? []) as Array<{
    id: string;
    title: string;
    status: string;
    total_amount: number;
    created_at: string;
  }>;

  const client = clientRes.data as {
    id: string;
    client_status: string;
    activated_at: string;
  } | null;

  const userEmail = (userRes.data as { email: string } | null)?.email ?? row.email;
  const displayName = row.full_name ?? userEmail ?? `Lead ${row.id.slice(0, 8)}`;

  const isClient = Boolean(client);

  const hasUpcomingCall = meetings.some(
    (m) => m.status === "scheduled" && m.scheduled_at && new Date(m.scheduled_at) > new Date()
  );
  const hasPendingInvoice = proposals.some((p) =>
    ["sent", "viewed", "draft"].includes(p.status)
  );

  return (
    <LeadPipelineProvider leadId={leadId} initialStatus={row.lead_status}>
      <DashboardHeader title="AdvisorHQ" userName="Eduardo" userInitials="EM" />
      <div className="flex-1 px-6 py-8 space-y-6">
        <Link
          href="/advisor/leads"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-navy"
        >
          <ArrowLeft size={15} />
          All leads
        </Link>

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-xl font-bold text-navy">{displayName}</h1>
                <LeadStatusBadge />
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {userEmail && (
                  <span className="inline-flex items-center gap-1.5">
                    <Mail size={14} />
                    {userEmail}
                  </span>
                )}
                {row.phone && (
                  <span className="inline-flex items-center gap-1.5">
                    <Phone size={14} />
                    {row.phone}
                  </span>
                )}
                {(row.suburb || row.state) && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={14} />
                    {[row.suburb, row.state].filter(Boolean).join(", ")}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Created {formatDate(row.created_at)}
                {row.source && ` - Source: ${row.source.replace(/_/g, " ")}`}
              </p>
            </div>

            <div className="flex flex-col items-start lg:items-end gap-3">
              <LeadStatusSelectControl />
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/advisor/invoices/new?leadId=${leadId}`}
                  className="inline-flex items-center gap-1.5 bg-navy hover:bg-navy/90 text-white text-xs font-semibold px-3 py-2 rounded-lg"
                >
                  <Receipt size={14} />
                  Create invoice
                </Link>
                {row.user_id && !isClient && (
                  <ActivateClientButton
                    userId={row.user_id}
                    userEmail={userEmail ?? "Unknown"}
                    isClient={false}
                  />
                )}
                {client && (
                  <Link
                    href={`/advisor/projects/${client.id}`}
                    className="inline-flex items-center gap-1.5 border border-border text-xs font-semibold px-3 py-2 rounded-lg hover:bg-light-bg"
                  >
                    <User size={14} />
                    Client workspace
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>

        <LeadNextStepsPanel
          leadId={leadId}
          hasUpcomingCall={hasUpcomingCall}
          hasPendingInvoice={hasPendingInvoice}
          isClient={isClient}
        />

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Assessment */}
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6 space-y-4">
            <h2 className="text-sm font-semibold text-navy uppercase tracking-wide">
              Assessment
            </h2>
            {assessment ? (
              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <dt className="text-xs text-muted-foreground">Score</dt>
                  <dd className="font-semibold text-navy">
                    {assessment.assessment_score ?? "-"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Type</dt>
                  <dd className="capitalize">
                    {assessment.assessment_type?.replace(/_/g, " ") ?? "-"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Project</dt>
                  <dd className="capitalize">
                    {row.project_type?.replace(/_/g, " ") ?? "-"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Stage</dt>
                  <dd className="capitalize">
                    {row.project_stage?.replace(/_/g, " ") ?? "-"}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Project scale</dt>
                  <dd>{formatProjectScale(row.budget_range)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">Finish</dt>
                  <dd className="capitalize">
                    {assessment.finish_level?.replace(/_/g, " ") ?? "-"}
                  </dd>
                </div>
                {(assessment.potential_savings_min != null ||
                  assessment.potential_savings_max != null) && (
                  <div className="col-span-2">
                    <dt className="text-xs text-muted-foreground">Optimisation range</dt>
                    <dd className="font-medium text-emerald-700">
                      {formatSavingsPercentRange(
                        normalizeSavingsPercent(
                          assessment.potential_savings_min,
                          assessment.potential_savings_max
                        ).min,
                        normalizeSavingsPercent(
                          assessment.potential_savings_min,
                          assessment.potential_savings_max
                        ).max
                      )}
                    </dd>
                  </div>
                )}
                {assessment.risk_count != null && (
                  <div>
                    <dt className="text-xs text-muted-foreground">Risks flagged</dt>
                    <dd>{assessment.risk_count}</dd>
                  </div>
                )}
              </dl>
            ) : (
              <p className="text-sm text-muted-foreground">No assessment submitted yet.</p>
            )}
          </div>

          {/* Documents */}
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6 space-y-4">
            <h2 className="text-sm font-semibold text-navy uppercase tracking-wide flex items-center gap-2">
              <FileText size={15} />
              Documents ({documents.length})
            </h2>
            {documents.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No documents uploaded yet.
              </p>
            ) : (
              <ul className="space-y-2">
                {documents.map((doc) => (
                  <li
                    key={doc.id}
                    className="flex items-center justify-between gap-2 py-2 border-b border-border last:border-0"
                  >
                    <LeadDocumentDownloadButton
                      documentId={doc.id}
                      fileName={doc.file_name}
                    />
                    <span className="text-[10px] text-muted-foreground shrink-0">
                      {formatDate(doc.created_at)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Meetings */}
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6 space-y-4">
            <h2 className="text-sm font-semibold text-navy uppercase tracking-wide flex items-center gap-2">
              <CalendarDays size={15} />
              Calls ({meetings.length})
            </h2>
            {meetings.length === 0 ? (
              <p className="text-sm text-muted-foreground">No calls booked yet.</p>
            ) : (
              <ul className="space-y-4">
                {meetings.map((m) => (
                  <li
                    key={m.id}
                    className="text-sm py-3 border-b border-border last:border-0 space-y-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Link
                          href={`/advisor/calls/${m.id}`}
                          className="font-medium text-navy hover:text-[#b67c2c]"
                        >
                          {m.invitee_name ?? "Consultation"}
                        </Link>
                        {m.service_slug && (
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {serviceNameFromSlug(m.service_slug)}
                          </p>
                        )}
                        {m.invitee_email && (
                          <p className="text-xs text-muted-foreground">{m.invitee_email}</p>
                        )}
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-xs text-muted-foreground">
                          {formatDate(m.scheduled_at)}
                        </p>
                        <StatusBadge status={m.status} />
                      </div>
                    </div>
                    {m.meeting_url && m.status === "scheduled" && (
                      <a
                        href={m.meeting_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs text-[#b67c2c] hover:underline"
                      >
                        <Video size={12} />
                        Join call
                        <ExternalLink size={10} />
                      </a>
                    )}
                    {(m.form_responses?.length ?? 0) > 0 && (
                      <div className="rounded-lg bg-[#faf9f7] border border-[#ece8e1] p-3">
                        <MeetingFormResponses responses={m.form_responses ?? []} />
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Invoices */}
          <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6 space-y-4">
            <h2 className="text-sm font-semibold text-navy uppercase tracking-wide flex items-center gap-2">
              <Receipt size={15} />
              Invoices ({proposals.length})
            </h2>
            {proposals.length === 0 ? (
              <p className="text-sm text-muted-foreground">No invoices yet.</p>
            ) : (
              <ul className="space-y-2">
                {proposals.map((p) => (
                  <li key={p.id}>
                    <Link
                      href={`/advisor/invoices/${p.id}`}
                      className="flex items-center justify-between text-sm py-2 border-b border-border last:border-0 hover:text-warm-soil"
                    >
                      <span className="font-medium">{p.title}</span>
                      <div className="text-right">
                        <p className="text-xs font-semibold">
                          {formatCurrency(p.total_amount)}
                        </p>
                        <StatusBadge status={p.status} />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6 space-y-3">
          <h2 className="text-sm font-semibold text-navy uppercase tracking-wide">
            Internal notes
          </h2>
          <LeadNotesEditor leadId={leadId} initialNotes={row.notes ?? ""} />
        </div>
      </div>
    </LeadPipelineProvider>
  );
}
