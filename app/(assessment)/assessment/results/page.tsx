import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ProgressCircle } from "@/components/shared/ProgressCircle";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  getScoreLabel,
  calculateAssessmentScore,
} from "@/utils/assessment-score";
import { toTitleCase } from "@/utils/formatters";

export const metadata: Metadata = {
  title: "Your Assessment Results",
};

interface ResultsPageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function AssessmentResultsPage({
  searchParams,
}: ResultsPageProps) {
  const { id } = await searchParams;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // Fetch the specific assessment — RLS ensures it belongs to this user
  let query = supabase.from("assessments").select("*");
  if (id) {
    query = query.eq("id", id) as typeof query;
  } else {
    query = query.eq("is_current", true).order("created_at", { ascending: false }).limit(1) as typeof query;
  }
  const { data: rawAssessment, error } = await query.limit(1).single();

  if (error || !rawAssessment) {
    redirect("/assessment");
  }

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

  const summaryItems = [
    {
      label: "Project Type",
      value: toTitleCase(assessment.project_type ?? ""),
    },
    {
      label: "Location",
      value: [assessment.suburb, assessment.state].filter(Boolean).join(", ") || "Not specified",
    },
    {
      label: "Project Stage",
      value: toTitleCase(assessment.project_stage ?? ""),
    },
    {
      label: "Budget Range",
      value: toTitleCase(assessment.budget_range ?? ""),
    },
  ].filter((item) => item.value && item.value !== "Not Specified");

  return (
    <div className="flex-1 flex items-start justify-center px-4 py-10">
      <div className="w-full max-w-xl space-y-6">
        {/* Header */}
        <div className="text-center">
          <p className="text-warm-soil text-sm font-semibold uppercase tracking-widest mb-2">
            Assessment Complete
          </p>
          <h1 className="text-3xl font-bold text-navy">
            Your Project Assessment
          </h1>
        </div>

        {/* Score card */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-8 text-center">
          <ProgressCircle
            value={score}
            size="lg"
            label="Project Readiness Score"
            className="mx-auto"
          />
          <div className="mt-6">
            <p
              className={cn(
                "text-lg font-semibold",
                scoreInfo.colour === "success" && "text-success",
                scoreInfo.colour === "primary" && "text-navy",
                scoreInfo.colour === "warning" && "text-warning",
                scoreInfo.colour === "destructive" && "text-destructive"
              )}
            >
              {scoreInfo.label}
            </p>
            <p className="text-sm text-muted-foreground mt-2 max-w-sm mx-auto">
              {scoreInfo.description}
            </p>
          </div>
        </div>

        {/* Summary card */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6">
          <h2 className="text-sm font-semibold text-navy uppercase tracking-wide mb-4">
            Project Summary
          </h2>
          <div className="divide-y divide-border">
            {summaryItems.map((item) => (
              <div
                key={item.label}
                className="flex justify-between items-center py-2.5"
              >
                <span className="text-sm text-muted-foreground">
                  {item.label}
                </span>
                <span className="text-sm font-medium text-navy">
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended next step */}
        <div className="bg-navy rounded-2xl p-6 text-white">
          <p className="text-warm-soil text-xs font-semibold uppercase tracking-widest mb-2">
            Recommended Next Step
          </p>
          <h3 className="text-lg font-semibold mb-2">
            Book a Free Strategy Call with Eduardo
          </h3>
          <p className="text-white/70 text-sm mb-5">
            In a 30-minute call, Eduardo will review your project, explain what
            advisory support you need, and give you a clear path forward —
            completely free.
          </p>
          <Link
            href="/book-call"
            className={cn(
              buttonVariants(),
              "bg-warm-soil hover:bg-warm-soil/90 text-white border-transparent"
            )}
          >
            Book Free Strategy Call
          </Link>
        </div>

        {/* Retake / continue */}
        <div className="flex items-center justify-between text-sm">
          <Link
            href="/assessment"
            className="text-muted-foreground hover:text-navy transition-colors"
          >
            ← Retake Assessment
          </Link>
          <Link
            href="/register"
            className="text-navy font-medium hover:underline underline-offset-2"
          >
            Create Account to Track Progress →
          </Link>
        </div>
      </div>
    </div>
  );
}
