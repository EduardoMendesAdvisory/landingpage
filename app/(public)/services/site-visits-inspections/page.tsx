import { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Site Visits & Inspections",
  description: "Professional site inspections at critical construction milestones.",
};

export default function SiteVisitsPage() {
  return (
    <div className="bg-white">
      <section className="bg-navy text-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-warm-soil text-sm font-semibold uppercase tracking-widest mb-3">
            Services
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-5 leading-tight">
            Site Visits &amp; Inspections
          </h1>
          <p className="text-white/70 text-lg max-w-2xl leading-relaxed">
            Professional eyes on your project at the moments that matter most.
            Written reports you can act on.
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                stage: "Slab / Footing",
                body: "Verify footings, reinforcement, and concrete work before slab is poured.",
              },
              {
                stage: "Frame Inspection",
                body: "Check structural framing, bracing, tie-downs, and compliance with approved plans.",
              },
              {
                stage: "Lock-up / Pre-Lock-up",
                body: "Review external cladding, windows, doors, and weatherproofing.",
              },
              {
                stage: "Fit-out / Fix",
                body: "Inspect internal fit-out, fixtures, joinery, and finishes quality.",
              },
              {
                stage: "Pre-Handover",
                body: "Comprehensive defect inspection before you accept the keys.",
              },
              {
                stage: "Progress Claim",
                body: "Verify work claimed in builder progress invoices is actually complete.",
              },
            ].map((item) => (
              <div key={item.stage} className="bg-light-bg rounded-xl p-5">
                <p className="text-sm font-semibold text-navy mb-2">{item.stage}</p>
                <p className="text-sm text-muted-foreground">{item.body}</p>
              </div>
            ))}
          </div>

          <div className="bg-navy rounded-2xl p-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="font-bold text-lg mb-1">From $750 per inspection</p>
              <p className="text-white/70 text-sm">
                Includes written report and photo documentation.
              </p>
            </div>
            <Link
              href="/assessment"
              className={cn(
                buttonVariants(),
                "bg-warm-soil hover:bg-warm-soil/90 text-white border-transparent whitespace-nowrap"
              )}
            >
              Book an Inspection
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
