import { Metadata } from "next";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { PageHeader } from "@/components/shared/PageHeader";
import { InvoiceForm } from "@/features/invoices/components/InvoiceForm";
import { getSavedBankDetails } from "@/features/invoices/actions";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "New Invoice" };

export default async function NewInvoicePage({
  searchParams,
}: {
  searchParams: Promise<{ leadId?: string; clientId?: string }>;
}) {
  const { leadId, clientId } = await searchParams;
  const admin = createAdminClient();
  const savedBankDetails = await getSavedBankDetails();

  const [{ data: leads }, { data: clients }] = await Promise.all([
    admin
      .from("leads")
      .select("id, full_name, email, user_id")
      .not("email", "is", null)
      .order("created_at", { ascending: false })
      .limit(50),
    admin
      .from("clients")
      .select("id, user_id")
      .eq("client_status", "active")
      .order("created_at", { ascending: false }),
  ]);

  const leadRows = (leads ?? []) as Array<{
    id: string;
    full_name: string | null;
    email: string | null;
  }>;

  const clientRows = (clients ?? []) as Array<{ id: string; user_id: string }>;
  const clientUserIds = clientRows.map((c) => c.user_id);

  const { data: clientUsers } = clientUserIds.length
    ? await admin.from("users").select("id, email").in("id", clientUserIds)
    : { data: [] };

  const emailByUserId = new Map(
    ((clientUsers ?? []) as Array<{ id: string; email: string }>).map((u) => [
      u.id,
      u.email,
    ])
  );

  const leadOptions = leadRows.map((lead) => ({
    id: lead.id,
    label: `${lead.full_name ?? lead.email} (${lead.email})`,
  }));

  const clientOptions = clientRows.map((client) => ({
    id: client.id,
    label: emailByUserId.get(client.user_id) ?? client.id.slice(0, 8),
  }));

  return (
    <>
      <DashboardHeader title="AdvisorHQ" userName="Eduardo" userInitials="EM" />
      <div className="flex-1 px-6 py-8 space-y-6">
        <PageHeader
          title="New invoice"
          description="Select a service, set the amount, and send payment instructions manually."
        />
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6">
          <InvoiceForm
            leads={leadOptions}
            clients={clientOptions}
            defaultLeadId={leadId}
            defaultClientId={clientId}
            savedBankDetails={savedBankDetails}
          />
        </div>
        <Link
          href="/advisor/invoices"
          className="text-sm text-warm-soil hover:underline"
        >
          ← Back to invoices
        </Link>
      </div>
    </>
  );
}
