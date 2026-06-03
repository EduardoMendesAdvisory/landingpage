import Link from "next/link";
import { PublicNav } from "@/components/layout/PublicNav";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const services = [
  {
    title: "BuildCheck",
    description:
      "Eduardo personally reviews your builder quotes to identify overpricing, missing scope, and contract risks.",
    href: "/buildcheck",
    price: "From $1,500",
  },
  {
    title: "Pre-Construction Advisory",
    description:
      "Expert guidance through design review, builder selection, and contract negotiation.",
    href: "/services/pre-construction-advisory",
    price: "From $3,500",
  },
  {
    title: "Construction Advisory",
    description:
      "Ongoing advisory and site visit reports throughout the entire construction phase.",
    href: "/services/construction-advisory",
    price: "From $5,000",
  },
  {
    title: "Owner Builder Program",
    description:
      "Complete end-to-end advisory for owner builders from permit to handover.",
    href: "/services/owner-builder-program",
    price: "From $8,000",
  },
];

const trustPoints = [
  {
    title: "100% Independent",
    body: "No builder referral fees. No kickbacks. Eduardo works exclusively for you.",
  },
  {
    title: "Plain-English Advice",
    body: "No jargon. Just clear, actionable guidance you can act on immediately.",
  },
  {
    title: "Australia-Wide",
    body: "Serving homeowners across all states and territories.",
  },
];

export default function HomePage() {
  return (
    <>
      <PublicNav />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-navy text-white py-24 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-warm-soil text-sm font-semibold uppercase tracking-widest mb-4">
              Independent Construction Advisory
            </p>
            <h1 className="text-5xl sm:text-6xl font-bold leading-tight mb-6 max-w-3xl mx-auto">
              Build Smarter.
              <br />
              Save More.
            </h1>
            <p className="text-white/70 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Eduardo Mendes helps Australian homeowners, renovators, and owner
              builders protect their investment — with honest, independent advice
              at every stage.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/assessment"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-warm-soil hover:bg-warm-soil/90 text-white border-transparent text-base px-8"
                )}
              >
                Free Project Assessment
              </Link>
              <Link
                href="/book-call"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "border-white/30 text-white hover:bg-white/10 text-base px-8"
                )}
              >
                Book a Free Call
              </Link>
            </div>
            <p className="text-white/40 text-xs mt-6">
              No credit card. No commitment. Just honest advice.
            </p>
          </div>
        </section>

        {/* Trust strip */}
        <section className="bg-light-bg py-12 px-4">
          <div className="max-w-5xl mx-auto grid sm:grid-cols-3 gap-6">
            {trustPoints.map((p) => (
              <div key={p.title} className="text-center">
                <h3 className="font-semibold text-navy mb-1">{p.title}</h3>
                <p className="text-sm text-muted-foreground">{p.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Services */}
        <section className="bg-white py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-navy mb-3">
                How Eduardo helps you
              </h2>
              <p className="text-muted-foreground">
                Expert advisory services across every phase of your construction journey.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {services.map((service) => (
                <Link
                  key={service.href}
                  href={service.href}
                  className="group block bg-light-bg hover:bg-white rounded-2xl p-6 border border-transparent hover:border-border shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-semibold text-navy group-hover:text-warm-soil transition-colors">
                      {service.title}
                    </h3>
                    <span className="text-xs text-muted-foreground ml-4 shrink-0">
                      {service.price}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {service.description}
                  </p>
                  <p className="text-xs text-navy font-medium mt-4 group-hover:text-warm-soil transition-colors">
                    Learn more →
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA strip */}
        <section className="bg-navy py-20 px-4 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">
              Not sure where to start?
            </h2>
            <p className="text-white/70 mb-8">
              Complete the free 4-question assessment and get your personalised
              Project Readiness Score in under 3 minutes.
            </p>
            <Link
              href="/assessment"
              className={cn(
                buttonVariants({ size: "lg" }),
                "bg-warm-soil hover:bg-warm-soil/90 text-white border-transparent text-base px-10"
              )}
            >
              Start Free Assessment
            </Link>
          </div>
        </section>
      </main>
      <PublicFooter />
    </>
  );
}
