import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProgressCircle } from "@/components/shared/ProgressCircle";
import { cn } from "@/lib/utils";
import { getScoreLabel } from "@/utils/assessment-score";
import { toTitleCase } from "@/utils/formatters";
import {
  ShieldCheck,
  Lock,
  MessageCircle,
  Check,
  Home,
  MapPin,
  Flag,
  DollarSign,
  AlertTriangle,
  Calendar,
  UploadCloud,
  Map,
  BarChart3,
  Users,
  FileCheck,
  Star,
} from "lucide-react";

export const metadata: Metadata = { title: "Your Assessment Results" };

interface ResultsPageProps {
  searchParams: Promise<{ id?: string }>;
}

const STEPS = ["Project Type", "Location", "Current Stage", "Budget", "Results"];

export default async function AssessmentResultsPage({ searchParams }: ResultsPageProps) {
  const { id } = await searchParams;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  let query = supabase.from("assessments").select("*");
  if (id) {
    query = query.eq("id", id) as typeof query;
  } else {
    query = query.eq("is_current", true).order("created_at", { ascending: false }).limit(1) as typeof query;
  }
  const { data: rawAssessment, error } = await query.limit(1).single();
  if (error || !rawAssessment) redirect("/assessment");

  const assessment = rawAssessment as {
    id: string;
    assessment_score: number;
    project_type: string | null;
    project_stage: string | null;
    budget_range: string | null;
    suburb: string | null;
    state: string | null;
    is_current: boolean;
    created_at: string;
  };

  const score = assessment.assessment_score;
  const scoreInfo = getScoreLabel(score);

  const scoreColour =
    scoreInfo.colour === "success" ? "#16a34a" :
    scoreInfo.colour === "warning" ? "#d97706" :
    scoreInfo.colour === "destructive" ? "#dc2626" : "#111A24";

  const location = [assessment.suburb, assessment.state].filter(Boolean).join(", ") || "Not specified";

  return (
    <div className="flex flex-col flex-1">
      {/* ── Dark header (step 5 active) ──────────────────────────── */}
      <header className="bg-navy px-6 py-5 border-b border-white/10">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="min-w-0">
            <Link href="/" className="flex items-center gap-3">
              <img
                src="https://rdeavyxckvkfwjvmxugs.supabase.co/storage/v1/object/public/media/logo%20EM_hor%20white.png"
                alt="Eduardo Mendes Advisory"
                className="h-9 w-auto"
              />
            </Link>
            <p className="text-white/70 text-xs mt-2">
              BuildCheck™ Assessment &nbsp;·&nbsp;
              <span className="text-amber font-medium">Step 5 of 5 — Results</span>
            </p>
          </div>

          <nav className="hidden md:flex items-center gap-0">
            {STEPS.map((s, i) => {
              const idx = i + 1;
              const isDone = idx < 5;
              const isActive = idx === 5;
              return (
                <div key={s} className="flex items-center">
                  <div className="flex flex-col items-center gap-1">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
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

          <div className="hidden sm:flex items-center gap-2.5 border border-white/15 rounded-xl px-4 py-2.5 shrink-0">
            <ShieldCheck size={18} className="text-amber shrink-0" />
            <div className="text-xs leading-tight">
              <p className="text-white font-medium">Your information is secure</p>
              <p className="text-white/40">We never share your data</p>
            </div>
          </div>
        </div>
      </header>

      {/* ── Body ────────────────────────────────────────────────── */}
      <main className="flex-1 px-4 py-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_300px] gap-6 items-start">

          {/* Left: results */}
          <div className="space-y-5">
            <div>
              <h1 className="text-2xl font-bold text-navy">Your Project Readiness Assessment</h1>
              <p className="text-sm text-gray-500 mt-1">Based on the information you provided.</p>
            </div>

            {/* Score + opportunity row */}
            <div className="grid sm:grid-cols-2 gap-4">
              {/* Score card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-5">
                <ProgressCircle value={score} size="lg" label="" className="shrink-0" />
                <div>
                  <p className="text-sm text-gray-500 font-medium">Project Readiness Score</p>
                  <p className="font-bold text-lg mt-0.5" style={{ color: scoreColour }}>
                    {scoreInfo.label}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">{scoreInfo.description}</p>
                </div>
              </div>

              {/* Potential opportunity */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                  <DollarSign size={28} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Potential Opportunity</p>
                  <p className="text-xl font-bold text-green-600 mt-0.5">5% – 15%</p>
                  <p className="text-xs text-gray-500 mt-1 leading-relaxed">cost-saving opportunities before construction begins.</p>
                </div>
              </div>
            </div>

            {/* 3-column info grid */}
            <div className="grid sm:grid-cols-3 gap-4">
              {/* Project Snapshot */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Project Snapshot</p>
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2">
                    <Home size={14} className="text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">Project Type</p>
                      <p className="text-sm font-semibold text-navy">{toTitleCase(assessment.project_type ?? "")}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin size={14} className="text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">Location</p>
                      <p className="text-sm font-semibold text-navy">{location}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Flag size={14} className="text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">Current Stage</p>
                      <p className="text-sm font-semibold text-navy">{toTitleCase(assessment.project_stage ?? "")}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <DollarSign size={14} className="text-gray-400 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-xs text-gray-400">Estimated Budget</p>
                      <p className="text-sm font-semibold text-navy">{toTitleCase(assessment.budget_range ?? "")}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommended Next Steps */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Recommended Next Steps</p>
                <div className="space-y-2">
                  {[
                    "Obtain and compare builder quotes",
                    "Review site conditions and constraints",
                    "Validate budget and cost assumptions",
                    "Confirm council requirements",
                    "Plan your construction timeline",
                  ].map((step) => (
                    <div key={step} className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Check size={9} strokeWidth={3} className="text-green-600" />
                      </div>
                      <p className="text-xs text-gray-600 leading-tight">{step}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Potential Risk Areas */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Potential Risk Areas</p>
                <div className="space-y-2.5">
                  {[
                    { label: "Budget Planning",    desc: "Your budget may not include all costs.",   icon: AlertTriangle, colour: "text-amber" },
                    { label: "Builder Selection",  desc: "Choosing the right builder is critical.",  icon: Users,         colour: "text-orange-500" },
                    { label: "Council Compliance", desc: "Stay compliant to avoid delays.",          icon: FileCheck,     colour: "text-blue-500" },
                    { label: "Site Conditions",    desc: "More information needed to assess.",       icon: Map,           colour: "text-gray-400" },
                  ].map((r) => (
                    <div key={r.label} className="flex items-start gap-2">
                      <r.icon size={14} className={cn("shrink-0 mt-0.5", r.colour)} />
                      <div>
                        <p className="text-xs font-semibold text-gray-700">{r.label}</p>
                        <p className="text-xs text-gray-400 leading-tight">{r.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Local Cost Benchmark */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Local Cost Benchmark</p>
              <p className="text-xs text-gray-500 mb-4">
                Estimated build cost for projects similar to yours in {location}.
              </p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center shrink-0">
                    <DollarSign size={24} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Estimated Build Cost</p>
                    <p className="text-xl font-bold text-green-600">$450,000 – $550,000</p>
                    <p className="text-xs text-gray-400">Based on similar projects in your area.</p>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-start gap-2 text-xs text-blue-700 flex-1">
                  <span className="shrink-0 mt-0.5">ℹ</span>
                  <span>This is a general estimate only. Actual costs vary based on design, site conditions and scope of work.</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between text-sm pt-2">
              <Link href="/assessment" className="flex items-center gap-1 text-gray-400 hover:text-navy transition-colors text-xs">
                ← Retake Assessment
              </Link>
            </div>
          </div>

          {/* Right: sidebar */}
          <aside className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="font-bold text-navy text-sm mb-4">What you&apos;ll unlock with a full review</p>
              <div className="space-y-3">
                {[
                  { icon: Map,           label: "Personalised Project Roadmap",   desc: "A step-by-step plan tailored to your goals." },
                  { icon: BarChart3,     label: "Budget Benchmarks",              desc: "Detailed cost insights and comparisons." },
                  { icon: Users,         label: "Builder Selection Guidance",     desc: "Expert tips to choose the right builder." },
                  { icon: MessageCircle, label: "Access to Ask Eduardo™",         desc: "Get answers to your biggest questions." },
                  { icon: FileCheck,     label: "Planning & Construction Checklist", desc: "Stay organised and avoid costly misses." },
                  { icon: Calendar,      label: "One-on-One Consultation",        desc: "Review your project with Eduardo." },
                ].map((b) => (
                  <div key={b.label} className="flex items-start gap-3">
                    <div className="w-7 h-7 rounded-lg bg-amber/10 flex items-center justify-center shrink-0 mt-0.5">
                      <b.icon size={14} className="text-amber" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-navy">{b.label}</p>
                      <p className="text-xs text-gray-500 leading-relaxed">{b.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
              <p className="font-bold text-navy text-sm">Ready to get expert guidance?</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                Book a free project review with Eduardo and receive your personalised roadmap.
              </p>
              <Link
                href="/book-call"
                className="flex items-center justify-center gap-2 w-full bg-navy hover:bg-navy/90 text-white text-sm font-semibold py-3 rounded-xl transition-colors"
              >
                <Calendar size={15} />
                Book Your Strategy Call
              </Link>
              <p className="text-xs text-gray-400 text-center">No obligation. 100% confidential.</p>
              <Link
                href="/assessment"
                className="flex items-center justify-center gap-2 w-full border border-gray-200 hover:border-gray-300 text-navy text-sm font-medium py-3 rounded-xl transition-colors"
              >
                <UploadCloud size={15} />
                Upload a Quote for a More Accurate Assessment
              </Link>
              <p className="text-xs text-gray-400 text-center">Get a detailed quote review and savings analysis.</p>
            </div>

            {/* Trust */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck size={18} className="text-green-600 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-semibold text-green-700">Trusted by Owner Builders</p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">
                    Thousands of Owner Builders Australia-wide trust Eduardo Mendes for expert guidance.
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    {[1,2,3,4,5].map((n) => (
                      <Star key={n} size={12} className={n < 5 ? "fill-amber text-amber" : "fill-amber/40 text-amber/40"} />
                    ))}
                    <span className="text-xs text-gray-500 ml-1">4.9 (120+ reviews)</span>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* ── Trust footer ────────────────────────────────────────── */}
      <footer className="bg-white border-t border-gray-100 py-4 px-6">
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
              src="https://rdeavyxckvkfwjvmxugs.supabase.co/storage/v1/object/public/media/logo%20EM_hor%20white.png"
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
