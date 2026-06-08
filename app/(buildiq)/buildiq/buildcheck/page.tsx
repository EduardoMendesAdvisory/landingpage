import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Circle,
  FileSearch,
  ShieldCheck,
  TrendingUp,
  Upload,
  Zap,
} from "lucide-react";
import { ProgressCircle } from "@/components/shared/ProgressCircle";

export const metadata: Metadata = { title: "BuildCheck(TM)" };

const BUILDCHECK_STEPS = [
  "Quote Uploaded",
  "BuildCheck Started",
  "Review Completed",
  "Strategy Call",
  "Final Recommendations",
];

type Finding = {
  id: string;
  title: string;
  description: string | null;
  severity: string;
  finding_type: string;
};

type Buildcheck = {
  id: string;
  buildcheck_status: string;
  savings_min: number | null;
  savings_max: number | null;
  risk_level: string | null;
  summary: string | null;
  completed_at: string | null;
  created_at: string;
  builder_name: string | null;
  quote_amount: number | null;
};

function getSeverityStyle(severity: string) {
  if (severity === "high") return { bg: "bg-red-50", text: "text-red-700", border: "border-red-200", dot: "bg-red-500" };
  if (severity === "medium") return { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200", dot: "bg-amber-500" };
  return { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", dot: "bg-blue-400" };
}

function SavingsBar({ min, max }: { min: number; max: number }) {
  const percentage = Math.min(((max / 100000) * 100), 100);
  return (
    <div>
      <div className="flex justify-between text-xs text-muted-foreground mb-1.5">
        <span>Low</span><span>Medium</span><span>High</span>
      </div>
      <div className="h-3 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-amber-400 to-[#b67c2c]"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="mt-2 flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-[#b67c2c]" />
        <span className="text-xs font-semibold text-[#b67c2c]">
          {max > 70000 ? "High Opportunity" : max > 30000 ? "Medium Opportunity" : "Low Opportunity"}
        </span>
      </div>
    </div>
  );
}

export default async function BuildCheckPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const clientResult = await supabase
    .from("clients")
    .select("id")
    .eq("user_id", user!.id)
    .single();

  const client = clientResult.data as { id: string } | null;

  let buildcheck: Buildcheck | null = null;
  let findings: Finding[] = [];
  let opportunities = 0;
  let risks = 0;

  if (client?.id) {
    const bcResult = await supabase
      .from("buildchecks")
      .select("id, buildcheck_status, savings_min, savings_max, risk_level, summary, completed_at, created_at, builder_name, quote_amount")
      .order("created_at", { ascending: false })
      .limit(1)
      .single();

    buildcheck = bcResult.data as Buildcheck | null;

    if (buildcheck?.id) {
      const findingsResult = await supabase
        .from("buildcheck_findings")
        .select("id, title, description, severity, finding_type")
        .eq("buildcheck_id", buildcheck.id)
        .order("order_index", { ascending: true });

      findings = (findingsResult.data ?? []) as Finding[];
      opportunities = findings.filter((f) => f.finding_type === "opportunity").length;
      risks = findings.filter((f) => f.finding_type === "risk").length;
    }
  }

  const statusStep = buildcheck
    ? buildcheck.buildcheck_status === "completed" ? 2
    : buildcheck.buildcheck_status === "reviewing" ? 1
    : 0
    : -1;

  return (
    <div className="flex-1 overflow-y-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-xl font-bold text-[#111A24]">BuildCheck(TM)</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Independent review of your builder quote</p>
        </div>
        <Link
          href="/buildiq/meetings"
          className="inline-flex items-center gap-2 bg-[#111A24] hover:bg-[#1d2a38] text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
        >
          <CalendarDays size={15} />
          Book a Review Meeting
        </Link>
      </div>

      <div className="px-8 py-6 space-y-5">
        {!buildcheck ? (
          /* Empty state */
          <div className="bg-white rounded-2xl border border-gray-100 p-12 flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 rounded-full bg-[#b67c2c]/10 flex items-center justify-center mb-4">
              <FileSearch size={28} className="text-[#b67c2c]" />
            </div>
            <h2 className="text-lg font-bold text-[#111A24] mb-2">No BuildCheck yet</h2>
            <p className="text-sm text-muted-foreground max-w-md mb-6 leading-relaxed">
              Upload your builder quote and Eduardo will conduct an independent review to identify risks, savings opportunities, and key recommendations.
            </p>
            <Link
              href="/assessment"
              className="inline-flex items-center gap-2 bg-[#b67c2c] hover:bg-[#9f6c27] text-white font-semibold px-6 py-3 rounded-lg text-sm transition-colors"
            >
              <Upload size={15} />
              Start Free Assessment
            </Link>
          </div>
        ) : (
          <>
            {/* Status hero */}
            <div className="bg-[#111A24] rounded-2xl overflow-hidden relative">
              <img
                src="https://rdeavyxckvkfwjvmxugs.supabase.co/storage/v1/object/public/media/hero%20banner%20desktop.jpg"
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-15"
              />
              <div className="relative p-6 grid sm:grid-cols-3 gap-6">
                <div>
                  <p className="text-white/60 text-xs uppercase tracking-wider mb-2">We work for you --</p>
                  <h2 className="text-2xl font-bold text-white leading-tight mb-1">
                    not the builder.
                  </h2>
                  <p className="text-white/60 text-sm leading-relaxed">
                    Our independent review helps you make confident, informed decisions.
                  </p>
                </div>
                <div className="flex flex-col gap-3">
                  <div>
                    <p className="text-white/50 text-xs mb-1">Builder Quote Status</p>
                    <div className="flex items-center gap-2">
                      {buildcheck.buildcheck_status === "completed" ? (
                        <CheckCircle2 size={18} className="text-green-400" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border-2 border-[#b67c2c] border-t-transparent animate-spin" />
                      )}
                      <span className="text-white font-semibold capitalize">
                        {buildcheck.buildcheck_status === "completed" ? "Review Complete" :
                         buildcheck.buildcheck_status === "reviewing" ? "In Review" : "Pending"}
                      </span>
                    </div>
                    {buildcheck.completed_at && (
                      <p className="text-white/40 text-xs mt-1">
                        Completed {new Date(buildcheck.completed_at).toLocaleDateString("en-AU", { dateStyle: "medium" })}
                      </p>
                    )}
                  </div>
                </div>
                <div>
                  {buildcheck.savings_min != null && buildcheck.savings_max != null ? (
                    <div>
                      <p className="text-white/50 text-xs mb-1">Potential Savings Identified</p>
                      <p className="text-2xl font-bold text-[#b67c2c]">
                        ${buildcheck.savings_min.toLocaleString()} - ${buildcheck.savings_max.toLocaleString()}
                      </p>
                      <p className="text-white/50 text-xs mt-1">
                        {buildcheck.risk_level === "high" ? "High Opportunity" :
                         buildcheck.risk_level === "medium" ? "Medium Opportunity" : "Low Opportunity"}
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-white/50 text-xs mb-1">Analysis in progress</p>
                      <p className="text-white/80 text-sm">Eduardo is reviewing your documents.</p>
                    </div>
                  )}
                </div>
              </div>
              {buildcheck.buildcheck_status === "completed" && (
                <div className="relative border-t border-white/10 px-6 py-3 flex gap-3">
                  <Link
                    href="/buildiq/documents"
                    className="inline-flex items-center gap-2 border border-white/30 text-white hover:bg-white/10 text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                  >
                    <FileSearch size={13} />
                    Download Full Report
                  </Link>
                  <Link
                    href="/buildiq/meetings"
                    className="inline-flex items-center gap-2 border border-[#b67c2c] bg-[#b67c2c]/20 text-[#b67c2c] hover:bg-[#b67c2c]/30 text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
                  >
                    <CalendarDays size={13} />
                    Book Review Meeting
                  </Link>
                </div>
              )}
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { icon: Zap, value: opportunities, label: "Opportunities", sub: "Cost-saving opportunities identified", colour: "text-green-600", bg: "bg-green-50" },
                { icon: AlertTriangle, value: risks, label: "Risks", sub: "Areas requiring attention", colour: "text-amber-600", bg: "bg-amber-50" },
                { icon: ShieldCheck, value: findings.length, label: "Recommendations", sub: "Suggested improvements", colour: "text-blue-600", bg: "bg-blue-50" },
              ].map((stat) => (
                <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-5 flex items-start gap-4">
                  <div className={`h-11 w-11 rounded-full ${stat.bg} flex items-center justify-center shrink-0`}>
                    <stat.icon size={20} className={stat.colour} />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[#111A24]">{stat.value}</p>
                    <p className="text-sm font-semibold text-[#111A24]">{stat.label}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{stat.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Findings + Savings */}
            <div className="grid lg:grid-cols-2 gap-5">
              {/* Top Findings */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <p className="text-sm font-bold text-[#111A24] mb-4">Top Findings</p>
                {findings.length > 0 ? (
                  <div className="space-y-2">
                    {findings.slice(0, 5).map((finding) => {
                      const style = getSeverityStyle(finding.severity);
                      return (
                        <div
                          key={finding.id}
                          className={`flex items-start gap-3 p-3 rounded-xl border ${style.bg} ${style.border}`}
                        >
                          <div className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${style.dot}`} />
                          <div className="flex-1 min-w-0">
                            <p className={`text-xs font-semibold ${style.text}`}>{finding.title}</p>
                            {finding.description && (
                              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed line-clamp-2">
                                {finding.description}
                              </p>
                            )}
                          </div>
                          <ArrowRight size={14} className="text-gray-300 shrink-0 mt-0.5" />
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-8 text-center">
                    <TrendingUp size={28} className="text-gray-200 mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {buildcheck.buildcheck_status === "completed"
                        ? "No findings recorded."
                        : "Findings will appear here once the review is complete."}
                    </p>
                  </div>
                )}
              </div>

              {/* Savings opportunity */}
              <div className="bg-white rounded-2xl border border-gray-100 p-6">
                <p className="text-sm font-bold text-[#111A24] mb-4">Savings Opportunity</p>
                {buildcheck.savings_min != null && buildcheck.savings_max != null ? (
                  <div className="space-y-5">
                    <SavingsBar min={buildcheck.savings_min} max={buildcheck.savings_max} />
                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-xs text-muted-foreground mb-1">Potential Savings</p>
                      <p className="text-2xl font-bold text-[#111A24]">
                        ${buildcheck.savings_min.toLocaleString()} - ${buildcheck.savings_max.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        By addressing the findings in this report
                      </p>
                    </div>
                    <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-start gap-3">
                      <ShieldCheck size={16} className="text-green-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-green-800 leading-relaxed">
                        Addressing these findings now can help you avoid costly mistakes and save significant money.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center py-8 text-center">
                    <ProgressCircle value={0} size="sm" />
                    <p className="text-sm text-muted-foreground mt-3">
                      Savings analysis will appear once the review is complete.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* BuildCheck Journey */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <p className="text-sm font-bold text-[#111A24] mb-5">Your BuildCheck Journey</p>
              <div className="flex items-start">
                {BUILDCHECK_STEPS.map((step, idx) => {
                  const done = idx <= statusStep;
                  const active = idx === statusStep + 1;
                  return (
                    <div key={step} className="flex flex-col items-center flex-1">
                      <div className="flex items-center w-full">
                        {idx > 0 && (
                          <div className={`flex-1 h-0.5 ${done ? "bg-green-500" : "bg-gray-200"}`} />
                        )}
                        <div
                          className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 border-2 ${
                            done
                              ? "bg-green-500 border-green-500"
                              : active
                                ? "bg-white border-[#b67c2c]"
                                : "bg-white border-gray-200"
                          }`}
                        >
                          {done ? (
                            <CheckCircle2 size={14} className="text-white" />
                          ) : active ? (
                            <div className="h-2.5 w-2.5 rounded-full bg-[#b67c2c]" />
                          ) : (
                            <Circle size={12} className="text-gray-300" />
                          )}
                        </div>
                        {idx < BUILDCHECK_STEPS.length - 1 && (
                          <div className={`flex-1 h-0.5 ${done ? "bg-green-500" : "bg-gray-200"}`} />
                        )}
                      </div>
                      <p className={`text-[10px] font-medium text-center mt-2 leading-tight px-1 ${
                        done ? "text-[#111A24]" : active ? "text-[#b67c2c]" : "text-gray-400"
                      }`}>
                        {step}
                      </p>
                      {buildcheck.buildcheck_status === "completed" && step === "Review Completed" && (
                        <p className="text-[9px] text-green-600 font-bold uppercase tracking-wide mt-0.5">?</p>
                      )}
                      {active && <p className="text-[9px] text-[#b67c2c] font-semibold uppercase tracking-wider mt-0.5">Next Step</p>}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
