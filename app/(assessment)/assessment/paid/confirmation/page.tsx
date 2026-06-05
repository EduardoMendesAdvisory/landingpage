import { Metadata } from "next";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  ShieldCheck,
  Lock,
  MessageCircle,
  Check,
  Clock,
  LayoutDashboard,
  Star,
  FileText,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Project Submitted | Eduardo Mendes Advisory",
};

interface PageProps {
  searchParams: Promise<{ assessment?: string }>;
}

const STEPS_CONFIG = ["Project Type", "Location", "Current Stage", "Budget", "Results"];

function formatCurrency(n: number): string {
  if (n >= 1000) return `$${Math.round(n / 1000)}k`;
  return `$${n}`;
}

export default async function PaidConfirmationPage({ searchParams }: PageProps) {
  const { assessment: assessmentId } = await searchParams;
  if (!assessmentId) redirect("/");

  const admin = createAdminClient();

  const { data: a, error } = await admin
    .from("assessments")
    .select("*")
    .eq("id", assessmentId)
    .single();

  if (error || !a) redirect("/");

  const assessment = a as {
    assessment_score: number;
    potential_savings_min: number | null;
    potential_savings_max: number | null;
    risk_count: number | null;
    recommended_actions_count: number | null;
    benchmark_position: string | null;
    project_type: string | null;
    project_stage: string | null;
    state: string | null;
  };

  const score = assessment.assessment_score ?? 75;
  const savingsMin = assessment.potential_savings_min ?? 18000;
  const savingsMax = assessment.potential_savings_max ?? 42000;
  const riskCount = assessment.risk_count ?? 4;
  const actionsCount = assessment.recommended_actions_count ?? 7;

  return (
    <div className="flex flex-col flex-1 bg-gray-50">
      {/* ?? Header (step 5 active) ????????????????????????????????? */}
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
              Project Intake &nbsp;·&nbsp;
              <span className="text-amber font-medium">Step 5 of 5 — Submitted</span>
            </p>
          </div>

          <nav className="hidden md:flex items-center gap-0">
            {STEPS_CONFIG.map((s, i) => {
              const idx = i + 1;
              return (
                <div key={s} className="flex items-center">
                  <div className="flex flex-col items-center gap-1">
                    <div className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                      "bg-amber text-navy"
                    )}>
                      {idx < 5 ? <Check size={14} strokeWidth={3} /> : idx}
                    </div>
                    <span className={cn(
                      "text-[10px] whitespace-nowrap",
                      idx === 5 ? "text-amber font-medium" : "text-white/60"
                    )}>{s}</span>
                  </div>
                  {i < STEPS_CONFIG.length - 1 && (
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

      {/* ?? Body ??????????????????????????????????????????????????? */}
      <main className="flex-1 px-4 py-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_300px] gap-6 items-start">

          {/* Left: main content */}
          <div className="space-y-5">

            {/* Success heading */}
            <div className="text-center py-4">
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
                <Check size={32} className="text-green-600" strokeWidth={2.5} />
              </div>
              <h1 className="text-3xl font-bold text-navy mb-2">Your Project Has Been Submitted!</h1>
              <p className="text-gray-500 text-base max-w-md mx-auto leading-relaxed">
                Thank you! We&apos;ve received all your information and Eduardo is now reviewing your project.
              </p>
            </div>

            {/* Preliminary AI Assessment Overview */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <p className="text-sm font-bold text-navy">Preliminary AI Assessment Overview</p>
                <span className="text-gray-400 cursor-help" title="Based on the information you provided">?</span>
              </div>
              <p className="text-xs text-gray-500 mb-4">Based on the information you provided, here&apos;s what our AI analysis has identified so far.</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Opportunity Score */}
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <div className="text-xs font-medium text-gray-500 mb-2">Opportunity Score</div>
                  <div className="text-2xl font-bold text-green-600">{score}%</div>
                  <div className="text-[10px] text-green-600 font-medium mt-1">High Opportunity</div>
                  <p className="text-[10px] text-gray-400 mt-1 leading-tight">Your project shows strong potential for optimisation.</p>
                </div>

                {/* Potential Savings */}
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <div className="text-xs font-medium text-gray-500 mb-2">Potential Savings</div>
                  <div className="text-base font-bold text-green-600 leading-tight">
                    {formatCurrency(savingsMin)}<br/>– {formatCurrency(savingsMax)}
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2 leading-tight">Based on similar projects in your area.</p>
                </div>

                {/* Risk Areas */}
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <div className="text-xs font-medium text-gray-500 mb-2">Risk Areas Identified</div>
                  <div className="text-2xl font-bold text-amber">{riskCount}</div>
                  <div className="text-[10px] text-amber font-medium mt-1">Areas to Review</div>
                  <p className="text-[10px] text-gray-400 mt-1 leading-tight">Potential issues that could impact your project.</p>
                </div>

                {/* Recommended Actions */}
                <div className="bg-gray-50 rounded-xl p-4 text-center">
                  <div className="text-xs font-medium text-gray-500 mb-2">Recommended Actions</div>
                  <div className="text-2xl font-bold text-navy">{actionsCount}</div>
                  <div className="text-[10px] text-blue-600 font-medium mt-1">Next Steps</div>
                  <p className="text-[10px] text-gray-400 mt-1 leading-tight">Key actions to improve value and reduce risk.</p>
                </div>
              </div>
            </div>

            {/* Preliminary note */}
            <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-700">
              <FileText size={14} className="shrink-0 mt-0.5 text-blue-500" />
              <span>
                <strong>This is a preliminary AI assessment.</strong> Eduardo&apos;s expert review will provide deeper insights and tailored recommendations specific to your project.
              </span>
            </div>

            {/* We're on it card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col sm:flex-row items-center gap-6">
              <div className="w-24 h-24 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 96 96" className="w-16 h-16 opacity-60" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="16" y="48" width="64" height="32" rx="4" stroke="#1B2A4A" strokeWidth="3"/>
                  <polygon points="8,48 48,16 88,48" stroke="#1B2A4A" strokeWidth="3" fill="none"/>
                  <rect x="38" y="60" width="20" height="20" rx="2" stroke="#F5A623" strokeWidth="2.5"/>
                </svg>
              </div>
              <div className="text-center sm:text-left">
                <p className="font-bold text-navy text-base mb-1">We&apos;re on it!</p>
                <p className="text-sm text-gray-500 leading-relaxed mb-4">
                  Eduardo and our team are working on providing you with the most accurate and valuable insights possible.
                </p>
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 bg-navy hover:bg-navy/90 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm"
                >
                  <LayoutDashboard size={15} />
                  Go to My Dashboard
                </Link>
              </div>
            </div>

            {/* Trust strip */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Lock,        label: "Your Data is Secure",   desc: "We use bank-level encryption and never share your information." },
                { icon: Star,        label: "Expert Review",          desc: "Eduardo personally reviews every project to provide you with the best advice." },
                { icon: ShieldCheck, label: "Trusted by Builders",    desc: "Hundreds of owner builders trust Eduardo to protect their investment." },
              ].map((item) => (
                <div key={item.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex gap-2.5">
                  <item.icon size={16} className="text-amber shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-navy">{item.label}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: What happens next */}
          <aside className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="font-bold text-navy text-sm mb-4">What Happens Next?</p>

              <div className="space-y-4">
                {[
                  { icon: Check,    colour: "text-green-600", bg: "bg-green-100",  label: "Information Received",       desc: "We've received your project details and documents.", done: true },
                  { icon: Check,    colour: "text-green-600", bg: "bg-green-100",  label: "Project Created",             desc: "Your project has been created and added to our review queue.", done: true },
                  { icon: Clock,    colour: "text-amber",      bg: "bg-amber/10",  label: "Eduardo Reviewing Your Project", desc: "Eduardo is now reviewing your information in detail.", active: true },
                  { icon: FileText, colour: "text-gray-400",  bg: "bg-gray-100",   label: "Personalised Report in Progress", desc: "We're preparing your detailed assessment and recommendations." },
                  { icon: MessageCircle, colour: "text-gray-400", bg: "bg-gray-100", label: "Results Delivered",       desc: "You'll receive your full assessment and recommendations." },
                ].map((step, i) => (
                  <div key={step.label} className="flex items-start gap-3">
                    <div className={cn("w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5", step.bg)}>
                      <step.icon size={13} className={step.colour} />
                    </div>
                    <div>
                      <p className={cn("text-xs font-semibold", step.active ? "text-navy" : step.done ? "text-gray-600" : "text-gray-400")}>
                        {step.label}
                      </p>
                      <p className="text-[11px] text-gray-400 leading-relaxed mt-0.5">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Turnaround */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-3">
                <Clock size={18} className="text-amber shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-navy">Estimated Turnaround</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-navy mb-1">48 – 72 Hours</p>
              <p className="text-xs text-gray-500 leading-relaxed">
                You&apos;ll be notified via email when your assessment is ready.
              </p>
            </div>

            <Link
              href="/dashboard"
              className="flex items-center justify-center gap-2 w-full bg-navy hover:bg-navy/90 text-white font-semibold py-3 rounded-xl transition-colors text-sm"
            >
              <LayoutDashboard size={15} />
              Go to My Dashboard
            </Link>
          </aside>
        </div>
      </main>

      {/* ?? Trust footer ???????????????????????????????????????????? */}
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
