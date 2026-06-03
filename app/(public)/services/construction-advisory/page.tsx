import { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Construction Advisory",
  description: "Ongoing expert advisory support throughout your entire construction phase.",
};

export default function ConstructionAdvisoryPage() {
  return (
    <div className="bg-white">
      <section className="bg-navy text-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-warm-soil text-sm font-semibold uppercase tracking-widest mb-3">
            Services
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-5 leading-tight">
            Construction Advisory
          </h1>
          <p className="text-white/70 text-lg max-w-2xl leading-relaxed">
            Your independent expert on call throughout the entire construction phase
            — from first slab to final handover.
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="space-y-5">
              <h2 className="text-2xl font-bold text-navy">What&apos;s included</h2>
              <ul className="space-y-3">
                {[
                  "Regular site visit reports at key milestones",
                  "Progress claim review and approval guidance",
                  "Variation management and cost control",
                  "Quality and compliance monitoring",
                  "Builder communication support",
                  "Issue resolution and dispute guidance",
                  "Defect identification and documentation",
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
                <p className="text-sm font-semibold text-navy mb-1">Starting from</p>
                <p className="text-3xl font-bold text-navy">$5,000</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Scoped per project phase and complexity
                </p>
                <Link
                  href="/assessment"
                  className={cn(
                    buttonVariants(),
                    "mt-4 bg-navy hover:bg-navy/90 text-white border-transparent"
                  )}
                >
                  Get Started Free
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
