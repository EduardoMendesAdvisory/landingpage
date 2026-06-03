import { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Pre-Construction Advisory",
  description:
    "Expert guidance through design, approvals, and builder selection before you commit to anything.",
};

export default function PreConstructionAdvisoryPage() {
  return (
    <div className="bg-white">
      <section className="bg-navy text-white py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-warm-soil text-sm font-semibold uppercase tracking-widest mb-3">
            Services
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-5 leading-tight">
            Pre-Construction Advisory
          </h1>
          <p className="text-white/70 text-lg max-w-2xl leading-relaxed">
            The most critical phase of any project. The decisions made before
            construction begins will affect your budget, timeline, and quality
            for the entire build.
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
                  "Design review and constructability assessment",
                  "Builder selection criteria and shortlist support",
                  "Tender document preparation and analysis",
                  "Quote comparison and scope gap analysis",
                  "Contract negotiation guidance",
                  "Risk identification and mitigation strategies",
                  "Budget validation and contingency planning",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="text-warm-soil font-bold mt-0.5 shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-5">
              <h2 className="text-2xl font-bold text-navy">Best for</h2>
              <ul className="space-y-3">
                {[
                  "New home builds in design or approval stage",
                  "Major renovations before tender",
                  "Owner builders preparing for construction",
                  "Anyone who has received builder quotes and is unsure",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="text-navy font-bold mt-0.5 shrink-0">→</span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="bg-light-bg rounded-2xl p-6 mt-4">
                <p className="text-sm font-semibold text-navy mb-1">Starting from</p>
                <p className="text-3xl font-bold text-navy">$3,500</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Custom quotes available based on project scope
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
