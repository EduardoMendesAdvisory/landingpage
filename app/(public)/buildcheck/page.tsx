import { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "BuildCheck — Builder Quote Review",
  description:
    "Eduardo personally reviews your builder quotes to find risks, overpricing, and missing items before you sign anything.",
};

export default function BuildCheckPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-navy text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-warm-soil text-sm font-semibold uppercase tracking-widest mb-3">
            BuildCheck
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold mb-5 leading-tight">
            Don&apos;t sign a builder&apos;s contract before reading this.
          </h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto mb-8">
            Eduardo reviews your builder quotes line-by-line to find overpricing,
            missing items, and risk clauses — before you&apos;re locked in.
          </p>
          <Link
            href="/assessment"
            className={cn(
              buttonVariants({ size: "lg" }),
              "bg-warm-soil hover:bg-warm-soil/90 text-white border-transparent"
            )}
          >
            Get My Free Assessment
          </Link>
        </div>
      </section>

      {/* What is BuildCheck */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-navy mb-6 text-center">
            What is BuildCheck?
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                title: "Quote Review",
                body: "Eduardo analyses your builder quote against market rates, identifies overpriced line items, and flags missing scope.",
              },
              {
                title: "Contract Analysis",
                body: "We review key contract clauses, payment schedules, and variation risks to protect you before you sign.",
              },
              {
                title: "Written Report",
                body: "You receive a clear written report with specific findings, risk ratings, and recommended actions.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-light-bg rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
              >
                <h3 className="font-semibold text-navy mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-light-bg py-16 px-4 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-navy mb-3">
            Ready to protect your project?
          </h2>
          <p className="text-muted-foreground mb-6">
            Start with a free assessment to see how Eduardo can help your project.
          </p>
          <Link
            href="/assessment"
            className={cn(
              buttonVariants(),
              "bg-navy hover:bg-navy/90 text-white border-transparent"
            )}
          >
            Start Free Assessment
          </Link>
        </div>
      </section>
    </div>
  );
}
