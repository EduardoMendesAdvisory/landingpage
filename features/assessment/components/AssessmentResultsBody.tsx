import { cn } from "@/lib/utils";
import {
  TrendingUp,
  AlertTriangle,
  ListChecks,
  BarChart3,
  Info,
  ShieldCheck,
  Star,
  Check,
} from "lucide-react";
import { StepFootnote, StepSection } from "./wizard-ui";

export interface AssessmentResultsData {
  score: number;
  savingsMin: number;
  savingsMax: number;
  riskCount: number;
  actionsCount: number;
  benchmarkPosition: string;
  documentCount?: number;
}

export function getReviewPriority(score: number): string {
  if (score >= 75) return "High Priority";
  if (score >= 55) return "Medium Priority";
  return "Standard Review";
}

export function getOpportunityLabel(score: number): { label: string; colour: string; bg: string } {
  if (score >= 75) return { label: "High Opportunity", colour: "text-green-700", bg: "bg-green-100" };
  if (score >= 55) return { label: "Good Opportunity", colour: "text-blue-700", bg: "bg-blue-100" };
  if (score >= 35) return { label: "Moderate Opportunity", colour: "text-amber-700", bg: "bg-amber/10" };
  return { label: "Early Stage", colour: "text-gray-600", bg: "bg-gray-100" };
}

export function formatCurrency(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1000)}k`;
  return `$${n}`;
}

const INSIGHTS = [
  {
    colour: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-100",
    icon: TrendingUp,
    label: "Strong potential for cost optimisation",
    desc: "Your project shows several opportunities to reduce costs without compromising quality.",
  },
  {
    colour: "text-amber-600",
    bg: "bg-amber/5",
    border: "border-amber/20",
    icon: AlertTriangle,
    label: "Contract terms may need review",
    desc: "Some standard terms in similar projects have led to unexpected variations.",
  },
  {
    colour: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
    icon: BarChart3,
    label: "Builder comparison recommended",
    desc: "Comparing multiple quotes could improve value and reduce future risk.",
  },
  {
    colour: "text-navy",
    bg: "bg-gray-50",
    border: "border-gray-100",
    icon: ListChecks,
    label: "Careful planning can reduce delays",
    desc: "Early attention to key milestones can help keep your project on track.",
  },
];

function MetricCell({
  label,
  value,
  hint,
  valueClassName,
}: {
  label: string;
  value: React.ReactNode;
  hint: string;
  valueClassName?: string;
}) {
  return (
    <div className="rounded-lg border border-[#ece8e1] bg-[#faf9f7] p-3 text-center">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#4b5564] mb-1.5">{label}</p>
      <div className={cn("text-sm font-bold text-[#111A24] leading-tight", valueClassName)}>{value}</div>
      <p className="text-[11px] text-[#6b7280] mt-1.5 leading-snug">{hint}</p>
    </div>
  );
}

export function AssessmentResultsBody({
  data,
  hideSavings = false,
}: {
  data: AssessmentResultsData;
  hideSavings?: boolean;
}) {
  return (
    <div className="space-y-0">
      <StepSection title="Preliminary overview" hint="Based on the information you provided so far.">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {hideSavings ? (
            <MetricCell
              label="Review priority"
              value={getReviewPriority(data.score)}
              hint="Areas Eduardo will focus on first."
              valueClassName="text-[#b67c2c] text-xs sm:text-sm"
            />
          ) : (
            <MetricCell
              label="Potential savings"
              value={
                <>
                  {formatCurrency(data.savingsMin)}
                  <span className="block text-xs font-semibold text-green-600 mt-0.5">
                    to {formatCurrency(data.savingsMax)}
                  </span>
                </>
              }
              hint="Estimated range for your project."
              valueClassName="text-green-600"
            />
          )}
          <MetricCell
            label="Risk areas"
            value={data.riskCount}
            hint="Issues that may impact cost, time or quality."
            valueClassName="text-2xl text-[#b67c2c]"
          />
          <MetricCell
            label="Recommended actions"
            value={data.actionsCount}
            hint="Steps to improve outcomes and reduce risk."
            valueClassName="text-2xl"
          />
          <MetricCell
            label="Benchmark position"
            value={data.benchmarkPosition}
            hint="Relative to similar projects in your area."
            valueClassName="text-xs sm:text-sm text-blue-600"
          />
        </div>

        {hideSavings && data.documentCount !== undefined && data.documentCount > 0 && (
          <div className="flex items-start gap-3 rounded-lg border border-[#ece8e1] bg-[#faf9f7] px-4 py-3 mt-4 text-xs text-[#4b5564]">
            <Info size={14} className="shrink-0 mt-0.5 text-[#b67c2c]" />
            <span>
              <strong className="text-[#111A24]">
                {data.documentCount} document{data.documentCount === 1 ? "" : "s"}
              </strong>{" "}
              on file for Eduardo&apos;s expert review.
            </span>
          </div>
        )}
      </StepSection>

      <StepSection title="Key insights (preliminary)" hint="Early findings from your project details.">
        <div className="space-y-2.5">
          {INSIGHTS.map((insight) => (
            <div
              key={insight.label}
              className={cn("flex items-start gap-3 p-3 rounded-lg border", insight.bg, insight.border)}
            >
              <insight.icon size={15} className={cn("shrink-0 mt-0.5", insight.colour)} strokeWidth={1.8} />
              <div>
                <p className="text-sm font-semibold text-[#111A24]">{insight.label}</p>
                <p className="text-xs text-[#6b7280] mt-0.5 leading-relaxed">{insight.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </StepSection>

      <div className="py-6 border-b border-[#ece8e1]">
        <div className="flex items-start gap-3 rounded-lg border border-[#ece8e1] bg-[#faf9f7] px-4 py-3 text-xs text-[#4b5564]">
          <Info size={14} className="shrink-0 mt-0.5 text-[#b67c2c]" />
          <span>
            This is a <strong className="text-[#111A24]">preliminary assessment</strong> based on the information you
            provided. Eduardo&apos;s expert review will provide deeper insights tailored to your specific project.
          </span>
        </div>
      </div>

      <div className="pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {[
            { icon: ShieldCheck, label: "100% Confidential", desc: "Your project details are always kept private." },
            { icon: Star, label: "Expert Guidance", desc: "Over 30 years of construction industry experience." },
            { icon: Check, label: "Owner Builder Focused", desc: "Specialised support for owner builders like you." },
          ].map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-[#ece8e1] bg-[#faf9f7] p-3 flex gap-2.5"
            >
              <item.icon size={16} className="text-[#b67c2c] shrink-0 mt-0.5" strokeWidth={1.8} />
              <div>
                <p className="text-xs font-semibold text-[#111A24]">{item.label}</p>
                <p className="text-[11px] text-[#6b7280] mt-0.5 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <StepFootnote>
        Results are indicative only and do not constitute formal advice. Eduardo will confirm findings during your review.
      </StepFootnote>
    </div>
  );
}

export function OpportunityScoreHero({ score }: { score: number }) {
  const opportunity = getOpportunityLabel(score);

  return (
    <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 inline-flex items-center gap-5 max-w-sm">
      <div className="relative w-20 h-20 shrink-0">
        <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
          <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="8" />
          <circle
            cx="40"
            cy="40"
            r="32"
            fill="none"
            stroke="#F5A623"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${(score / 100) * 201} 201`}
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xl font-bold text-white">
          {score}%
        </span>
      </div>
      <div>
        <p className="text-white/60 text-xs font-medium">Opportunity Score</p>
        <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", opportunity.bg, opportunity.colour)}>
          {opportunity.label}
        </span>
        <p className="text-white/60 text-xs mt-1.5 leading-relaxed">
          Your project shows strong potential for optimisation and cost savings.
        </p>
      </div>
    </div>
  );
}
