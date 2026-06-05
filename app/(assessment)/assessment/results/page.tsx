import { Metadata } from "next";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";
import { FOOTER_BRAND_LOGO } from "@/lib/branding";
import { ShieldCheck, Lock, MessageCircle, Star, Check, LayoutDashboard } from "lucide-react";
import {
  AssessmentResultsBody,
  OpportunityScoreHero,
} from "@/features/assessment/components/AssessmentResultsBody";
import {
  FreeResultsSidebar,
  PaidResultsSidebar,
} from "@/features/assessment/components/AssessmentResultsSidebars";
import { WizardCard } from "@/features/assessment/components/WizardShell";
import { StepHeader, WIZARD_PRIMARY_BTN_CLASS } from "@/features/assessment/components/wizard-ui";

export const metadata: Metadata = {
  title: "Your Assessment Results | Eduardo Mendes Advisory",
};

interface ResultsPageProps {
  searchParams: Promise<{ id?: string; lead?: string }>;
}

const STEPS = ["Project Type", "Location", "Current Stage", "Budget", "Results"];

export default async function AssessmentResultsPage({ searchParams }: ResultsPageProps) {
  const { id, lead: leadIdParam } = await searchParams;
  const admin = createAdminClient();

  let query = admin.from("assessments").select("*");
  if (id) {
    query = query.eq("id", id) as typeof query;
  } else {
    if (!leadIdParam) redirect("/assessment");
    query = query
      .eq("lead_id", leadIdParam)
      .eq("is_current", true)
      .order("created_at", { ascending: false })
      .limit(1) as typeof query;
  }

  const { data: rawAssessment, error } = await query.limit(1).single();
  if (error || !rawAssessment) redirect("/assessment");

  const a = rawAssessment as {
    id: string;
    lead_id: string;
    assessment_type: string;
    assessment_score: number;
    potential_savings_min: number | null;
    potential_savings_max: number | null;
    risk_count: number | null;
    recommended_actions_count: number | null;
    benchmark_position: string | null;
  };

  const isPaid = a.assessment_type === "paid_client";
  const leadId = a.lead_id || leadIdParam || "";

  let documentCount = 0;
  if (isPaid && leadId) {
    const { count } = await admin
      .from("documents")
      .select("id", { count: "exact", head: true })
      .eq("lead_id", leadId);
    documentCount = count ?? 0;
  }

  const score = a.assessment_score ?? 75;
  const resultsData = {
    score,
    savingsMin: a.potential_savings_min ?? 18000,
    savingsMax: a.potential_savings_max ?? 42000,
    riskCount: a.risk_count ?? 4,
    actionsCount: a.recommended_actions_count ?? 7,
    benchmarkPosition: a.benchmark_position ?? "Above Average",
    documentCount,
  };

  return (
    <div className="flex flex-col flex-1 bg-[#faf9f7]">
      {/* Hero */}
      <div className="relative bg-[#111A24] overflow-hidden min-h-[420px]">
        <div
          className="absolute inset-0 bg-cover bg-[center_right] sm:bg-right bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://rdeavyxckvkfwjvmxugs.supabase.co/storage/v1/object/public/media/hero%20banner%20desktop.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#111A24]/70 via-[#111A24]/25 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111A24]/40 via-transparent to-transparent" />

        <div className="relative z-10 px-6 py-10">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_340px] gap-8 items-start">
            <div>
              <nav className="hidden md:flex items-center gap-0 mb-6">
                {STEPS.map((s, i) => {
                  const idx = i + 1;
                  const isDone = idx < 5;
                  const isActive = idx === 5;
                  return (
                    <div key={s} className="flex items-center">
                      <div className="flex flex-col items-center gap-1">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold",
                            isDone && "bg-[#b67c2c] text-white",
                            isActive && "bg-[#b67c2c] text-white ring-2 ring-[#b67c2c]/30"
                          )}
                        >
                          {isDone ? <Check size={14} strokeWidth={3} /> : idx}
                        </div>
                        <span
                          className={cn(
                            "text-[10px] whitespace-nowrap",
                            isActive ? "text-[#b67c2c] font-medium" : "text-white/60"
                          )}
                        >
                          {s}
                        </span>
                      </div>
                      {i < STEPS.length - 1 && <div className="w-10 h-px mx-1 mb-4 bg-[#b67c2c]/60" />}
                    </div>
                  );
                })}
              </nav>

              {isPaid ? (
                <>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-green-500/20 border border-green-400/30 flex items-center justify-center">
                      <Check size={24} className="text-green-400" strokeWidth={2.5} />
                    </div>
                    <p className="text-[#b67c2c] text-xs font-semibold uppercase tracking-[0.16em]">
                      Project submitted
                    </p>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-3 drop-shadow-md">
                    Your Project Has Been Submitted
                  </h1>
                  <p className="text-white/70 text-base leading-relaxed mb-8 max-w-lg">
                    Thank you. We&apos;ve received all your information. Eduardo is now reviewing your project and
                    your dashboard is ready to track progress.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-[#b67c2c] text-xs font-semibold uppercase tracking-[0.16em] mb-3 flex items-center gap-2">
                    <Star size={13} className="fill-[#b67c2c] text-[#b67c2c]" />
                    Your Preliminary Assessment
                  </p>
                  <h1 className="text-3xl sm:text-4xl font-bold text-white leading-tight mb-3 drop-shadow-md">
                    Here&apos;s What We Found
                    <br className="hidden sm:block" /> So Far
                  </h1>
                  <p className="text-white/70 text-base leading-relaxed mb-8 max-w-lg">
                    Based on the information you provided, we&apos;ve identified key opportunities and potential risks
                    in your project. Your details are saved. Book a free call with Eduardo to take the next step.
                  </p>
                </>
              )}

              <OpportunityScoreHero score={score} />
            </div>

            <div className="hidden lg:flex flex-col items-end gap-4">
              <div className="flex items-center gap-2.5 border border-white/15 rounded-xl px-4 py-2.5">
                <ShieldCheck size={18} className="text-[#b67c2c] shrink-0" />
                <div className="text-xs leading-tight">
                  <p className="text-white font-medium">Your information is secure</p>
                  <p className="text-white/40">We never share your data</p>
                </div>
              </div>
            </div>
          </div>
        </div>

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

      {/* Body */}
      <main className="flex-1 px-4 py-8 sm:py-10">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_280px] gap-6 lg:gap-8 items-start">
          <WizardCard>
            <div className="space-y-0">
              {isPaid ? (
                <>
                  <StepHeader
                    overline="Step 5 of 5"
                    title="We're on it"
                    description="Eduardo and our team are preparing your detailed assessment. Use your dashboard to follow progress, documents and updates throughout your build."
                  />
                  <div className="pb-6 border-b border-[#ece8e1]">
                    <Link href="/dashboard" className={WIZARD_PRIMARY_BTN_CLASS}>
                      <LayoutDashboard size={15} strokeWidth={2} />
                      Go to dashboard
                    </Link>
                  </div>
                </>
              ) : (
                <StepHeader
                  overline="Step 5 of 5"
                  title="Your preliminary results"
                  description="Based on the information you provided, here is an early overview of your project. Book a free call with Eduardo to discuss next steps."
                />
              )}

              <AssessmentResultsBody data={resultsData} hideSavings={isPaid} />

              <div className="border-t border-[#ece8e1] pt-6 mt-6 flex items-start gap-4">
                <div className="w-11 h-11 rounded-full bg-[#b67c2c]/10 border-2 border-[#b67c2c]/30 shrink-0 overflow-hidden">
                  <img
                    src="https://rdeavyxckvkfwjvmxugs.supabase.co/storage/v1/object/public/media/edu.png"
                    alt="Eduardo Mendes"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm text-[#4b5564] italic leading-relaxed mb-2">
                    &ldquo;My goal is to help you build with confidence and avoid costly mistakes. Let&apos;s make sure
                    you get the best outcome for your project.&rdquo;
                  </p>
                  <p className="text-sm font-semibold text-[#111A24]">Eduardo Mendes</p>
                  <p className="text-xs text-[#6b7280]">Owner Builder Advisor</p>
                </div>
              </div>
            </div>
          </WizardCard>

          <div className="hidden lg:block space-y-4">
            {isPaid ? <PaidResultsSidebar /> : <FreeResultsSidebar leadId={leadId} />}
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-[#ece8e1] py-4 px-6 mt-4">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs text-[#9ca3af]">
          <div className="flex items-center gap-2">
            <Lock size={13} />
            <span className="font-medium text-[#4b5564]">Secure SSL encryption</span>
            <span>256-bit protection</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle size={13} />
            <span>
              Need help?{" "}
              <a href="/contact" className="text-[#111A24] hover:underline">
                Chat with our team
              </a>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <img src={FOOTER_BRAND_LOGO} alt="Eduardo Mendes Advisory" className="h-6 w-auto" />
            <span>Owner Builder Advisor</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
