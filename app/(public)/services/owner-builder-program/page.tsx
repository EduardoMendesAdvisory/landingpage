import { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Owner Builder Program",
  description:
    "Complete end-to-end advisory support for owner builders from concept to completion.",
};

export default function OwnerBuilderProgramPage() {
  return (
    <div className="bg-white">
      <section className="bg-navy text-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-warm-soil text-sm font-semibold uppercase tracking-widest mb-3">
            Services
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-5 leading-tight">
            Owner Builder Program
          </h1>
          <p className="text-white/70 text-lg max-w-2xl leading-relaxed">
            The complete advisory program for owner builders — from obtaining your
            permit to handing over the keys.
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-navy mb-5">
                What&apos;s covered
              </h2>
              <ul className="space-y-3">
                {[
                  "Owner builder permit guidance and requirements",
                  "Subcontractor selection and management",
                  "Builder quote and contract review for all trades",
                  "Project scheduling and sequencing",
                  "Regular site visits and milestone inspections",
                  "Progress claim review and payment management",
                  "Cost control and variation tracking",
                  "Defect management and rectification",
                  "Handover checklist and final inspection",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="text-warm-soil font-bold mt-0.5 shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-5">
              <div className="bg-light-bg rounded-2xl p-6">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Program investment
                </p>
                <p className="text-3xl font-bold text-navy">From $8,000</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Scoped to your project size and duration
                </p>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                  Most owner builder clients save 10–20% of their total project
                  cost through Eduardo&apos;s guidance and trade management.
                </p>
                <Link
                  href="/assessment"
                  className={cn(
                    buttonVariants(),
                    "mt-4 bg-navy hover:bg-navy/90 text-white border-transparent"
                  )}
                >
                  Start With Free Assessment
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
