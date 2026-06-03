import { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About Eduardo Mendes",
  description:
    "Independent construction advisor helping Australian homeowners build smarter and save more.",
};

export default function AboutPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="bg-navy text-white py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-warm-soil text-sm font-semibold uppercase tracking-widest mb-3">
            About Eduardo
          </p>
          <h1 className="text-4xl font-bold mb-5 leading-tight">
            Independent advice you can trust.
          </h1>
          <p className="text-white/70 text-lg leading-relaxed">
            Eduardo Mendes is an independent construction advisor with years of
            experience helping Australian homeowners navigate the complexities of
            building, renovating, and owner building projects.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto space-y-8">
          <div>
            <h2 className="text-2xl font-bold text-navy mb-4">
              Why independent advice matters
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Builders, architects, and real estate agents each have their own
              commercial interests. As an independent advisor, Eduardo works
              exclusively for you — the homeowner — with no referral fees,
              kickbacks, or conflicts of interest.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-navy mb-4">
              What Eduardo brings to your project
            </h2>
            <ul className="space-y-3">
              {[
                "Deep understanding of Australian construction contracts and builder practices",
                "Ability to identify hidden risks, overpriced quotes, and missing scope items",
                "Practical, plain-English advice that empowers you to make confident decisions",
                "Honest assessment of your project — even when the answer isn't what you want to hear",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                  <span className="text-warm-soil font-bold mt-0.5">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-navy rounded-2xl p-8 text-white">
            <blockquote className="text-lg font-medium leading-relaxed mb-4">
              &ldquo;My goal is simple: to make sure every homeowner has the same
              level of knowledge as the builder sitting across the table from
              them.&rdquo;
            </blockquote>
            <p className="text-white/60 text-sm">— Eduardo Mendes</p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-light-bg py-16 px-4 text-center">
        <div className="max-w-xl mx-auto">
          <h2 className="text-2xl font-bold text-navy mb-3">
            Start with a free conversation
          </h2>
          <p className="text-muted-foreground mb-6">
            Book a free 30-minute strategy call to discuss your project.
          </p>
          <Link
            href="/book-call"
            className={cn(
              buttonVariants(),
              "bg-navy hover:bg-navy/90 text-white border-transparent"
            )}
          >
            Book a Free Call
          </Link>
        </div>
      </section>
    </div>
  );
}
