"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { FileSearch, Loader2 } from "lucide-react";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { formatDate } from "@/utils/formatters";
import { updateBuildcheckReview } from "@/features/buildchecks/actions";
import type { Database } from "@/types/database.types";

type BuildcheckStatus = Database["public"]["Enums"]["buildcheck_status"];

export type BuildcheckRow = {
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
};

const STATUS_OPTIONS: BuildcheckStatus[] = ["pending", "reviewing", "completed"];

interface BuildcheckReviewPanelProps {
  clientId: string;
  buildchecks: BuildcheckRow[];
}

export function BuildcheckReviewPanel({
  clientId,
  buildchecks,
}: BuildcheckReviewPanelProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(
    buildchecks.find((b) => b.buildcheck_status !== "completed")?.id ?? null
  );

  function refresh() {
    router.refresh();
  }

  function handleSave(buildcheck: BuildcheckRow, form: HTMLFormElement) {
    setError(null);
    const data = new FormData(form);

    startTransition(async () => {
      const result = await updateBuildcheckReview({
        buildcheckId: buildcheck.id,
        clientId,
        status: data.get("status") as BuildcheckStatus,
        notes: String(data.get("notes") ?? ""),
        riskLevel: String(data.get("risk_level") ?? ""),
        summary: String(data.get("summary") ?? ""),
        savingsMin: data.get("savings_min")
          ? Number(data.get("savings_min"))
          : null,
        savingsMax: data.get("savings_max")
          ? Number(data.get("savings_max"))
          : null,
      });

      if ("error" in result) {
        setError(result.error);
        return;
      }
      refresh();
    });
  }

  if (buildchecks.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-border p-8 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <FileSearch size={24} className="text-muted-foreground mx-auto mb-3" />
        <p className="text-sm text-muted-foreground">
          No quote reviews on file for this client yet.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>
      )}
      {buildchecks.map((bc) => {
        const isOpen = expandedId === bc.id;
        return (
          <div
            key={bc.id}
            className="bg-white rounded-2xl border border-border overflow-hidden shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
          >
            <button
              type="button"
              onClick={() => setExpandedId(isOpen ? null : bc.id)}
              className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-light-bg transition-colors"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-navy truncate">{bc.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {bc.builder_name ? `${bc.builder_name}  -  ` : ""}
                  Submitted {formatDate(bc.created_at)}
                  {bc.quote_amount != null &&
                    `  -  $${bc.quote_amount.toLocaleString("en-AU")}`}
                </p>
              </div>
              <StatusBadge status={bc.buildcheck_status} />
            </button>

            {isOpen && (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSave(bc, e.currentTarget);
                }}
                className="border-t border-border px-5 py-4 space-y-4"
              >
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-navy mb-1.5">
                      Review status
                    </label>
                    <select
                      name="status"
                      defaultValue={bc.buildcheck_status}
                      disabled={pending}
                      className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s}>
                          {s.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-navy mb-1.5">
                      Risk level
                    </label>
                    <input
                      name="risk_level"
                      defaultValue={bc.risk_level ?? ""}
                      placeholder="e.g. Medium"
                      disabled={pending}
                      className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-navy mb-1.5">
                      Savings min ($)
                    </label>
                    <input
                      name="savings_min"
                      type="number"
                      defaultValue={bc.savings_min ?? ""}
                      disabled={pending}
                      className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-navy mb-1.5">
                      Savings max ($)
                    </label>
                    <input
                      name="savings_max"
                      type="number"
                      defaultValue={bc.savings_max ?? ""}
                      disabled={pending}
                      className="w-full rounded-lg border border-border px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy mb-1.5">
                    Summary for client
                  </label>
                  <textarea
                    name="summary"
                    defaultValue={bc.summary ?? ""}
                    rows={2}
                    disabled={pending}
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm resize-none"
                    placeholder="Key findings the client will see..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-navy mb-1.5">
                    Internal notes
                  </label>
                  <textarea
                    name="notes"
                    defaultValue={bc.notes ?? ""}
                    rows={2}
                    disabled={pending}
                    className="w-full rounded-lg border border-border px-3 py-2 text-sm resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={pending}
                  className="inline-flex items-center gap-2 bg-navy hover:bg-navy/90 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2 rounded-lg"
                >
                  {pending ? <Loader2 size={14} className="animate-spin" /> : null}
                  Save review
                </button>
              </form>
            )}
          </div>
        );
      })}
    </div>
  );
}
