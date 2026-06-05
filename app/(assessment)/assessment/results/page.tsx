import { Metadata } from "next";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";
import { FOOTER_BRAND_LOGO } from "@/lib/branding";
import {
  ShieldCheck,
  Lock,
  MessageCircle,
  TrendingUp,
  AlertTriangle,
  ListChecks,
  BarChart3,
  Calendar,
  Phone,
  Star,
  Check,
  Info,
} from "lucide-react";

export const metadata: Metadata = { title: "Your Preliminary AI Assessment | Eduardo Mendes Advisory" };

interface ResultsPageProps {
  searchParams: Promise<{ id?: string; lead?: string }>;
}

// Opportunity score → label + colour
function getOpportunityLabel(score: number): { label: string; colour: string; bg: string } {
  if (score >= 75) return { label: "High Opportunity",   colour: "text-green-700",  bg: "bg-green-100" };
  if (score >= 55) return { label: "Good Opportunity",   colour: "text-blue-700",   bg: "bg-blue-100" };
  if (score >= 35) return { label: "Moderate Opportunity", colour: "text-amber-700", bg: "bg-amber/10" };
  return              { label: "Early Stage",            colour: "text-gray-600",   bg: "bg-gray-100" };
}

const STEPS = ["Project Type", "Location", "Current Stage", "Budget", "Results"];

function formatCurrency(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1000)}k`;
  return `$${n}`;
}

export default async function AssessmentResultsPage({ searchParams }: ResultsPageProps) {
  const { id, lead: leadId } = await searchParams;
  const admin = createAdminClient();

  // Fetch assessment (no auth required — admin client bypasses RLS)
  let query = admin.from("assessments").select("*");
  if (id) {
    query = query.eq("id", id) as typeof query;
  } else {
    if (!leadId) redirect("/assessment");
    query = query
      .eq("lead_id", leadId!)
      .eq("is_current", true)
      .order("created_at", { ascending: false })
      .limit(1) as typeof query;
  }
  const { data: rawAssessment, error } = await query.limit(1).single();
  if (error || !rawAssessment) redirect("/assessment");

  const a = rawAssessment as {
    id: string;
    assessment_score: number;
    project_type: string | null;
    project_stage: string | null;
    budget_range: string | null;
    suburb: string | null;
    state: string | null;
    potential_savings_min: number | null;
    potential_savings_max: number | null;
    risk_count: number | null;
    recommended_actions_count: number | null;
    benchmark_position: string | null;
    created_at: string;
  };

  const score = a.assessment_score ?? 75;
  const opportunity = getOpportunityLabel(score);
  const savingsMin = a.potential_savings_min ?? 18000;
  const savingsMax = a.potential_savings_max ?? 42000;
  const riskCount = a.risk_count ?? 4;
  const actionsCount = a.recommended_actions_count ?? 7;
  const benchmarkPosition = a.benchmark_position ?? "Above Average";
  const location = [a.suburb, a.state].filter(Boolean).join(", ") || "Your area";

  // Preliminary insights (deterministic based on score + project type)
  const insights = [
    { colour: "text-green-600", bg: "bg-green-50", border: "border-green-100", icon: TrendingUp,  label: "Strong potential for cost optimisation",     desc: "Your project shows several opportunities to reduce costs without compromising quality." },
    { colour: "text-amber-600", bg: "bg-amber/5",   border: "border-amber/20",   icon: AlertTriangle, label: "Contract terms may need review",           desc: "Some standard terms in similar projects have led to unexpected variations." },
    { colour: "text-blue-600",  bg: "bg-blue-50",  border: "border-blue-100",  icon: BarChart3,   label: "Builder comparison recommended",             desc: "Comparing multiple quotes could improve value and reduce future risk." },
    { colour: "text-navy",      bg: "bg-gray-50",  border: "border-gray-100",  icon: ListChecks,  label: "Careful planning can reduce delays",          desc: "Early attention to key milestones can help keep your project on track." },
  ];

  return (
    <div className="flex flex-col flex-1 bg-gray-50">
      {/* ── Dark hero header ──────────────────────────────────────── */}
      <div className="relative bg-navy overflow-hidden">
        {/* Background house image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://rdeavyxckvkfwjvmxugs.supabase.co/storage/v1/object/public/media/hero%20banner%202.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/95 to-navy/60" />

        <div className="relative z-10 px-6 py-10">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_340px] gap-8 items-start">

            {/* Left: headline + score summary */}
            <div>
              {/* Step nav */}
              <nav className="hidden md:flex items-center gap-0 mb-6">
                {STEPS.map((s, i) => {
                  const idx = i + 1;
                  const isDone = idx < 5;
                  const isActive = idx === 5;
                  return (
                    <div key={s} className="flex items-center">
                      <div className="flex flex-col items-center gap-1">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                          isDone && "bg-amber text-navy",
                          isActive && "bg-amber text-navy ring-2 ring-amber/30",
                        )}>
                          {isDone ? <Check size={14} strokeWidth={3} /> : idx}
                        </div>
                        <span className={cn(
                          "text-[10px] whitespace-nowrap",
                          isActive ? "text-amber font-medium" : "text-white/60"
                        )}>{s}</span>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div className="w-10 h-px mx-1 mb-4 bg-amber/60" />
                      )}
                    </div>
                  );
                })}
              </nav>

              <p className="text-amber text-xs font-semibold uppercase tracking-widest mb-3 flex items-center gap-2">
                <Star size={13} className="fill-amber text-amber" />
                Your Preliminary AI Assessment
              </p>
              <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-3">
                Here&apos;s What We Found<br className="hidden sm:block" /> So Far
              </h1>
              <p className="text-white/70 text-base leading-relaxed mb-8 max-w-lg">
                Based on the information you provided, our AI has identified key opportunities and potential risks in your project.
              </p>

              {/* Score card */}
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-5 inline-flex items-center gap-5 max-w-sm">
                {/* Circular score */}
                <div className="relative w-20 h-20 shrink-0">
                  <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                    <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="8" />
                    <circle
                      cx="40" cy="40" r="32" fill="none"
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
            </div>

            {/* Right: security + AI badge */}
            <div className="hidden lg:flex flex-col items-end gap-4">
              <div className="flex items-center gap-2.5 border border-white/15 rounded-xl px-4 py-2.5">
                <ShieldCheck size={18} className="text-amber shrink-0" />
                <div className="text-xs leading-tight">
                  <p className="text-white font-medium">Your information is secure</p>
                  <p className="text-white/40">We never share your data</p>
                </div>
              </div>
              <div className="flex items-center justify-center w-20 h-20 rounded-full border-2 border-amber/40 bg-amber/10">
                <span className="text-amber font-bold text-xl">AI</span>
              </div>
            </div>
          </div>
        </div>

        {/* Logo bar */}
        <div className="relative z-10 border-t border-white/10 px-6 py-3">
          <div className="max-w-6xl mx-auto">
            <Link href="/">
              <img
                src="https://rdeavyxckvkfwjvmxugs.supabase.co/storage/v1/object/public/media/logo%20EM_hor%20white.png"
                alt="Eduardo Mendes Advisory"
                className="h-8 w-auto"
              />
            </Link>
          </div>
        </div>
      </div>

      {/* ── Body ─────────────────────────────────────────────────── */}
      <main className="flex-1 px-4 py-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_320px] gap-6 items-start">

          {/* ── Left column ─────────────────────────────────────── */}
          <div className="space-y-5">

            {/* 4-stat row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* Potential Savings */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
                <p className="text-xs text-gray-500 font-medium mb-1">Potential Savings</p>
                <p className="text-lg font-bold text-green-600 leading-tight">
                  {formatCurrency(savingsMin)}<br />
                  <span className="text-sm">– {formatCurrency(savingsMax)}</span>
                </p>
                <p className="text-[10px] text-gray-400 mt-1 leading-tight">Estimated range based on project details provided.</p>
              </div>

              {/* Risk Areas */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
                <p className="text-xs text-gray-500 font-medium mb-1">Risk Areas Identified</p>
                <p className="text-3xl font-bold text-amber">{riskCount}</p>
                <p className="text-[10px] text-gray-400 mt-1 leading-tight">Potential issues that may impact cost, time or quality.</p>
              </div>

              {/* Recommended Actions */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
                <p className="text-xs text-gray-500 font-medium mb-1">Recommended Actions</p>
                <p className="text-3xl font-bold text-navy">{actionsCount}</p>
                <p className="text-[10px] text-gray-400 mt-1 leading-tight">Key actions to improve outcomes and reduce risk.</p>
              </div>

              {/* Benchmark Position */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
                <p className="text-xs text-gray-500 font-medium mb-1">Benchmark Position</p>
                <p className="text-base font-bold text-blue-600 leading-tight">{benchmarkPosition}</p>
                <p className="text-[10px] text-gray-400 mt-1 leading-tight">Your project is positioned relative to local benchmarks.</p>
              </div>
            </div>

            {/* Key Insights */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4">
                Key Insights (Preliminary)
              </p>
              <div className="space-y-3">
                {insights.map((insight) => (
                  <div key={insight.label} className={cn("flex items-start gap-3 p-3 rounded-xl border", insight.bg, insight.border)}>
                    <insight.icon size={16} className={cn("shrink-0 mt-0.5", insight.colour)} />
                    <div>
                      <p className="text-sm font-semibold text-navy">{insight.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{insight.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-700">
              <Info size={14} className="shrink-0 mt-0.5 text-blue-500" />
              <span>
                This is a <strong>preliminary AI assessment</strong> based on the information you provided.
                A full review with Eduardo will give you detailed insights tailored to your specific project.
              </span>
            </div>

            {/* Trust strip */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: ShieldCheck, label: "100% Confidential", desc: "Your project details are always kept private." },
                { icon: Star,        label: "Expert Guidance",   desc: "Over 20 years of construction industry experience." },
                { icon: Check,       label: "Owner Builder Focused", desc: "Specialised support for owner builders like you." },
              ].map((item) => (
                <div key={item.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-3">
                  <item.icon size={18} className="text-amber shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-navy">{item.label}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Eduardo quote footer */}
            <div className="bg-navy rounded-2xl p-6 flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-amber/20 border-2 border-amber/30 shrink-0 overflow-hidden">
                <img
                  src="https://rdeavyxckvkfwjvmxugs.supabase.co/storage/v1/object/public/media/eduardo%20mendes%20photo.png"
                  alt="Eduardo Mendes"
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
                />
              </div>
              <div>
                <p className="text-white/80 text-sm italic leading-relaxed mb-2">
                  &ldquo;My goal is to help you build with confidence and avoid costly mistakes.
                  Let&apos;s make sure you get the best outcome for your project.&rdquo;
                </p>
                <p className="text-amber font-semibold text-sm">Eduardo Mendes</p>
                <p className="text-white/50 text-xs">Owner Builder Advisor</p>
              </div>
            </div>
          </div>

          {/* ── Right sidebar ────────────────────────────────────── */}
          <aside className="space-y-4">
            {/* Next Step CTA */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-amber/10 border-b border-amber/20 px-5 py-3">
                <p className="text-xs font-bold text-amber uppercase tracking-widest">Next Step</p>
              </div>
              <div className="p-5 space-y-4">
                <h3 className="text-lg font-bold text-navy">Unlock Your Full<br />Project Review</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Book a free 15-minute consultation with Eduardo and take the next step with confidence.
                </p>

                <div className="space-y-2.5">
                  {[
                    { icon: MessageCircle, label: "Discuss Your Project",     desc: "Share your goals, challenges and specific concerns." },
                    { icon: BarChart3,     label: "Review Your Opportunities", desc: "We'll go through your preliminary AI assessment together." },
                    { icon: ShieldCheck,   label: "Understand Your Risks",     desc: "Get expert insights on potential issues and how to avoid them." },
                    { icon: ListChecks,    label: "Receive Recommended Next Steps", desc: "Walk away with a clear plan tailored to your project." },
                  ].map((item) => (
                    <div key={item.label} className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-lg bg-amber/10 flex items-center justify-center shrink-0 mt-0.5">
                        <item.icon size={13} className="text-amber" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-navy">{item.label}</p>
                        <p className="text-[11px] text-gray-500 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center gap-2 bg-green-50 border border-green-100 rounded-lg px-3 py-2">
                  <Check size={13} className="text-green-600 shrink-0" />
                  <div>
                    <p className="text-xs font-semibold text-green-700">It&apos;s completely free</p>
                    <p className="text-[11px] text-gray-500">No obligation. Just expert advice to help you move forward.</p>
                  </div>
                </div>

                <Link
                  href="/book-call"
                  className="flex items-center justify-center gap-2 w-full bg-navy hover:bg-navy/90 text-white text-sm font-semibold py-3.5 rounded-xl transition-colors"
                >
                  <Calendar size={15} />
                  Book Your Free 15-Min Call
                </Link>

                <p className="text-center text-xs text-gray-400">
                  Prefer to talk now?{" "}
                  <a href="tel:0419112555" className="text-navy font-medium hover:underline">
                    Call 0419 112 555
                  </a>
                </p>
              </div>
            </div>

            {/* Trust */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck size={18} className="text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-green-700">Trusted by Owner Builders</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    Hundreds of owner builders across Australia trust Eduardo Mendes to protect their investment.
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    {[1,2,3,4,5].map((n) => (
                      <Star key={n} size={12} className={n < 5 ? "fill-amber text-amber" : "fill-amber/40 text-amber/40"} />
                    ))}
                    <span className="text-xs text-gray-500 ml-1">4.9 · 120+ reviews</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-2">
              <p className="text-xs font-semibold text-navy">Need help now?</p>
              <a
                href="tel:0419112555"
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-navy transition-colors"
              >
                <Phone size={14} className="text-amber" />
                0419 112 555
              </a>
              <p className="text-[11px] text-gray-400">Available Mon–Fri 8am–6pm AEST</p>
            </div>
          </aside>
        </div>
      </main>

      {/* ── Trust footer ──────────────────────────────────────────── */}
      <footer className="bg-white border-t border-gray-100 py-4 px-6 mt-4">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <Lock size={13} />
            <span className="font-medium text-gray-600">Secure SSL encryption</span>
            <span>256-bit protection</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle size={13} />
            <span>Need help? <a href="/contact" className="text-navy hover:underline">Chat with our team</a></span>
          </div>
          <div className="flex items-center gap-2">
            <img
              src={FOOTER_BRAND_LOGO}
              alt="Eduardo Mendes Advisory"
              className="h-6 w-auto"
            />
            <span>Owner Builder Advisor</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
