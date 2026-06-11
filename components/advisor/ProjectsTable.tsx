"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, Search, X } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { ProjectTimeline } from "@/components/shared/ProjectTimeline";
import { formatDate } from "@/utils/formatters";
import { normaliseStage, PROJECT_STEPS } from "@/lib/buildiq/project-stages";
import { cn } from "@/lib/utils";

export type AdvisorProjectRow = {
  clientId: string;
  displayLabel: string;
  email: string;
  projectId: string | null;
  projectName: string | null;
  projectStage: string | null;
  projectStatus: string | null;
  openTasks: number;
  pendingReviews: number;
  unreadMessages: number;
  activatedAt: string;
};

type FilterMode = "all" | "pending-reviews" | "open-tasks";

function stageLabel(stage: string | null): string {
  const normalised = normaliseStage(stage);
  const step = PROJECT_STEPS.find((s) => s.key === normalised);
  return step?.label ?? "Not set";
}

function rowHaystack(row: AdvisorProjectRow): string {
  return [
    row.displayLabel,
    row.email,
    row.projectName,
    stageLabel(row.projectStage),
    row.projectStatus,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

interface ProjectsTableProps {
  rows: AdvisorProjectRow[];
  initialFilter?: FilterMode;
}

export function ProjectsTable({ rows, initialFilter = "all" }: ProjectsTableProps) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterMode>(initialFilter);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(() => new Set());

  function toggleExpanded(clientId: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(clientId)) next.delete(clientId);
      else next.add(clientId);
      return next;
    });
  }

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((row) => {
      if (filter === "pending-reviews" && row.pendingReviews === 0) return false;
      if (filter === "open-tasks" && row.openTasks === 0) return false;
      if (!q) return true;
      return rowHaystack(row).includes(q);
    });
  }, [rows, query, filter]);

  const hasFilters = query.trim().length > 0 || filter !== "all";
  const pendingReviewTotal = rows.reduce((sum, r) => sum + r.pendingReviews, 0);

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row gap-3">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by client name, email or project..."
            className="w-full rounded-xl border border-border bg-white pl-9 pr-9 py-2.5 text-sm text-navy placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-warm-soil/25 focus:border-warm-soil"
            aria-label="Search projects"
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
          value={filter}
          onChange={(e) => setFilter(e.target.value as FilterMode)}
          className="rounded-xl border border-border bg-white px-3 py-2.5 text-sm text-navy min-w-[200px] focus:outline-none focus:ring-2 focus:ring-warm-soil/25 focus:border-warm-soil"
          aria-label="Filter projects"
        >
          <option value="all">All clients</option>
          <option value="pending-reviews">
            Pending quote reviews{pendingReviewTotal > 0 ? ` (${pendingReviewTotal})` : ""}
          </option>
          <option value="open-tasks">With open tasks</option>
        </select>

        {hasFilters && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setFilter("all");
            }}
            className="rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-medium text-muted-foreground hover:text-navy hover:bg-light-bg transition-colors shrink-0"
          >
            Clear filters
          </button>
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Showing {filtered.length} of {rows.length} active clients
      </p>

      {rows.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-10 text-center text-sm text-muted-foreground">
          No active clients yet. Activate a lead from the pipeline to create their project.
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-10 text-center text-sm text-muted-foreground">
          No clients match your filters.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((row) => {
            const isExpanded = expandedIds.has(row.clientId);

            return (
            <div
              key={row.clientId}
              className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden"
            >
              <div className="p-6 space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => toggleExpanded(row.clientId)}
                    className="flex items-start gap-3 min-w-0 text-left group flex-1"
                    aria-expanded={isExpanded}
                  >
                    <span
                      className={cn(
                        "mt-1 shrink-0 flex h-7 w-7 items-center justify-center rounded-lg border border-border bg-light-bg text-muted-foreground transition-all group-hover:border-warm-soil/30 group-hover:text-warm-soil",
                        isExpanded && "rotate-180 border-warm-soil/30 text-warm-soil"
                      )}
                    >
                      <ChevronDown size={16} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-lg font-semibold text-navy group-hover:text-warm-soil transition-colors">
                        {row.displayLabel}
                      </p>
                      <p className="text-sm text-muted-foreground mt-0.5">{row.email}</p>
                      {row.projectName && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {row.projectName}  -  Active since {formatDate(row.activatedAt)}
                        </p>
                      )}
                      {!isExpanded && row.projectStage && (
                        <p className="text-[11px] text-warm-soil/80 mt-1.5 font-medium">
                          Journey: {stageLabel(row.projectStage)}
                        </p>
                      )}
                    </div>
                  </button>

                  <div className="flex flex-wrap items-center gap-2 shrink-0">
                    {row.pendingReviews > 0 && (
                      <span className="text-[10px] font-bold uppercase tracking-wide bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                        {row.pendingReviews} quote review{row.pendingReviews > 1 ? "s" : ""}
                      </span>
                    )}
                    {row.openTasks > 0 && (
                      <span className="text-[10px] font-bold uppercase tracking-wide bg-blue-50 text-blue-800 px-2 py-1 rounded-full">
                        {row.openTasks} open task{row.openTasks > 1 ? "s" : ""}
                      </span>
                    )}
                    {row.unreadMessages > 0 && (
                      <span className="text-[10px] font-bold uppercase tracking-wide bg-warm-soil/15 text-warm-soil px-2 py-1 rounded-full">
                        {row.unreadMessages} unread
                      </span>
                    )}
                    {row.projectStatus && <StatusBadge status={row.projectStatus} />}
                    <Link
                      href={`/advisor/projects/${row.clientId}`}
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-xs font-semibold text-warm-soil hover:underline ml-1"
                    >
                      Open workspace
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>

                {isExpanded && (
                  <div className="pt-2 border-t border-border/60">
                    {row.projectStage ? (
                      <>
                        <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                          Journey: {stageLabel(row.projectStage)}
                        </p>
                        <ProjectTimeline
                          stage={normaliseStage(row.projectStage)}
                          size="compact"
                          assessmentSubmitted
                        />
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground py-2">
                        No project stage set yet. Open the workspace to configure this client&apos;s journey.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
