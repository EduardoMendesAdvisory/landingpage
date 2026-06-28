"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, X } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDate } from "@/utils/formatters";
import { formatProjectScale } from "@/lib/assessment/budget-ranges";
import { ActivateClientButton } from "@/features/clients/components/ActivateClientButton";
import { LEAD_STATUS_OPTIONS } from "@/lib/leads/constants";
import type { LeadStatus } from "@/lib/leads/constants";

export type AdvisorLeadRow = {
  id: string;
  lead_status: string;
  created_at: string;
  project_type: string | null;
  budget_range: string | null;
  email: string | null;
  phone: string | null;
  suburb: string | null;
  state: string | null;
  user_id: string | null;
  source: string | null;
  displayLabel: string;
  isClient: boolean;
  accountEmail: string | null;
};

function formatStatusLabel(status: string): string {
  return status.replace(/_/g, " ");
}

function leadSearchHaystack(lead: AdvisorLeadRow): string {
  return [
    lead.displayLabel,
    lead.email,
    lead.accountEmail,
    lead.phone,
    lead.suburb,
    lead.state,
    lead.project_type,
    lead.budget_range,
    lead.source,
    lead.lead_status,
    lead.id,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

interface LeadsTableProps {
  leads: AdvisorLeadRow[];
}

export function LeadsTable({ leads }: LeadsTableProps) {
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return leads.filter((lead) => {
      if (statusFilter !== "all" && lead.lead_status !== statusFilter) {
        return false;
      }
      if (!q) return true;
      return leadSearchHaystack(lead).includes(q);
    });
  }, [leads, query, statusFilter]);

  const hasFilters = query.trim().length > 0 || statusFilter !== "all";

  function clearFilters() {
    setQuery("");
    setStatusFilter("all");
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, phone, location, project..."
            className="w-full rounded-xl border border-border bg-white pl-9 pr-9 py-2.5 text-sm text-navy placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-warm-soil/25 focus:border-warm-soil"
            aria-label="Search leads"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-navy"
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as LeadStatus | "all")}
          className="rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-navy min-w-[180px] focus:outline-none focus:ring-2 focus:ring-warm-soil/25 focus:border-warm-soil"
          aria-label="Filter by status"
        >
          <option value="all">All statuses</option>
          {LEAD_STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {formatStatusLabel(status)}
            </option>
          ))}
        </select>

        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-navy hover:bg-light-bg transition-colors shrink-0"
          >
            Clear filters
          </button>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Showing {filtered.length} of {leads.length} leads
      </p>

      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden">
        {leads.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            No leads yet. They appear here after someone completes the assessment.
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-10 text-center text-sm text-muted-foreground">
            No leads match your search. Try a different name, email or status.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[720px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">
                    Lead
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">
                    Project
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">
                    Location
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">
                    Status
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">
                    Date
                  </th>
                  <th className="text-right px-5 py-3 text-xs font-semibold text-muted-foreground uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filtered.map((lead) => (
                  <tr key={lead.id} className="hover:bg-light-bg transition-colors">
                    <td className="px-5 py-3">
                      <Link
                        href={`/advisor/leads/${lead.id}`}
                        className="font-medium text-navy hover:text-warm-soil"
                      >
                        {lead.displayLabel}
                      </Link>
                      {lead.email && lead.displayLabel !== lead.email && (
                        <p className="text-xs text-muted-foreground mt-0.5">{lead.email}</p>
                      )}
                      {!lead.user_id && (
                        <p className="text-[10px] text-amber-700 mt-0.5">Anonymous lead</p>
                      )}
                    </td>
                    <td className="px-5 py-3 text-xs text-muted-foreground">
                      <p className="capitalize">
                        {lead.project_type?.replace(/_/g, " ") ?? "-"}
                      </p>
                      {lead.budget_range && (
                        <p className="text-[10px] mt-0.5">{formatProjectScale(lead.budget_range)}</p>
                      )}
                    </td>
                    <td className="px-5 py-3 text-xs text-muted-foreground">
                      {[lead.suburb, lead.state].filter(Boolean).join(", ") || "-"}
                    </td>
                    <td className="px-5 py-3">
                      <StatusBadge status={lead.lead_status} />
                    </td>
                    <td className="px-5 py-3 text-xs text-muted-foreground">
                      {formatDate(lead.created_at)}
                    </td>
                    <td className="px-5 py-3 text-right space-y-1">
                      <Link
                        href={`/advisor/leads/${lead.id}`}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-warm-soil hover:underline"
                      >
                        View
                        <ArrowRight size={12} />
                      </Link>
                      {lead.user_id && (
                        <div className="flex justify-end">
                          <ActivateClientButton
                            userId={lead.user_id}
                            userEmail={
                              lead.accountEmail ?? lead.email ?? lead.displayLabel
                            }
                            isClient={lead.isClient}
                          />
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
