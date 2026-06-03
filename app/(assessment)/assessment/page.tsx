import { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { AssessmentWizard } from "@/features/assessment/components/AssessmentWizard";

export const metadata: Metadata = {
  title: "Free Project Assessment",
  description:
    "Get your personalised project readiness score in under 3 minutes.",
};

export default async function AssessmentPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Unauthenticated users must register first
  if (!user) {
    redirect("/register?redirect=/assessment");
  }

  // Clients already have a project — send them to their portal
  const { data: userData } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = (userData as { role: string } | null)?.role;
  if (role === "client") redirect("/buildiq/dashboard");
  if (role === "admin") redirect("/advisor/dashboard");

  return (
    <div className="flex-1 flex items-start justify-center px-4 py-10">
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <p className="text-warm-soil text-sm font-semibold uppercase tracking-widest mb-2">
            Free Assessment
          </p>
          <h1 className="text-3xl font-bold text-navy">
            Project Readiness Assessment
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            4 quick questions. Get your personalised score in under 3 minutes.
          </p>
        </div>

        {/* Wizard card */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-6 sm:p-8">
          <AssessmentWizard />
        </div>
      </div>
    </div>
  );
}
