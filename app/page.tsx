import Link from "next/link";
import {
  FileSearch,
  HardHat,
  Wrench,
  Home,
  CheckCircle2,
  Star,
  ArrowRight,
  Upload,
  Calendar,
  BarChart3,
  ShieldCheck,
} from "lucide-react";
import { PublicNav } from "@/components/layout/PublicNav";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const services = [
  {
    title: "BuildCheck",
    description:
      "Eduardo personally reviews your builder quotes to identify overpricing, missing scope, and contract risks before you sign.",
    href: "/buildcheck",
    price: "From $1,500",
    icon: FileSearch,
  },
  {
    title: "Pre-Construction Advisory",
    description:
      "Expert guidance through design review, builder selection, and contract negotiation before a single brick is laid.",
    href: "/services/pre-construction-advisory",
    price: "From $3,500",
    icon: BarChart3,
  },
  {
    title: "Construction Advisory",
    description:
      "Ongoing advisory and site visit reports throughout the entire construction phase so nothing gets past you.",
    href: "/services/construction-advisory",
    price: "From $5,000",
    icon: Wrench,
  },
  {
    title: "Owner Builder Program",
    description:
      "Complete end-to-end advisory for owner builders from permit application to practical completion and handover.",
    href: "/services/owner-builder-program",
    price: "From $8,000",
    icon: HardHat,
  },
];

const stats = [
  { value: "100%", label: "Independent Advice" },
  { value: "30+", label: "Years Experience" },
  { value: "500+", label: "Clients Helped" },
  { value: "Australia-Wide", label: "All States & Territories" },
];

const howItWorks = [
  {
    step: 1,
    title: "Upload Your Documents",
    description: "Share your builder quote, plans, or contracts securely through the platform.",
    icon: Upload,
  },
  {
    step: 2,
    title: "Receive Initial Assessment",
    description: "Eduardo reviews your documents and identifies the key risks and opportunities.",
    icon: FileSearch,
  },
  {
    step: 3,
    title: "Book Expert Advice",
    description: "Choose the advisory package that fits your needs and stage of project.",
    icon: Calendar,
  },
  {
    step: 4,
    title: "Build With Confidence",
    description: "Make informed decisions at every stage with Eduardo in your corner.",
    icon: ShieldCheck,
  },
];

const testimonials = [
  {
    quote: "Eduardo's review saved us over $22,000 and helped us avoid a major variation issue later in the build.",
    name: "James & Sarah",
    location: "Brisbane, QLD",
    stars: 5,
  },
  {
    quote: "The BuildCheck report was incredibly detailed. Eduardo found 4 provisional sums that weren't clearly defined.",
    name: "Michael T.",
    location: "Sydney, NSW",
    stars: 5,
  },
  {
    quote: "As first-time owner builders we had no idea what we were getting into. Eduardo's program was invaluable.",
    name: "Rachel & Dan",
    location: "Melbourne, VIC",
    stars: 5,
  },
];

const faqs = [
  {
    q: "How much does a BuildCheck cost?",
    a: "BuildCheck starts from $1,500 for a standard residential quote review. Complex projects may vary.",
  },
  {
    q: "Do you work outside of Queensland?",
    a: "Yes. Eduardo provides advisory services across all Australian states and territories.",
  },
  {
    q: "What if I don't have a builder quote yet?",
    a: "That's fine — start with the free assessment to understand your project readiness before engaging a builder.",
  },
];

export default function HomePage() {
  return (
    <>
      <PublicNav />
      <main className="flex-1">

        {/* ── Hero ──────────────────────────────────────────── */}
        <section className="bg-navy text-white py-24 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-warm-soil text-xs font-bold uppercase tracking-widest mb-5">
              Independent Construction Advisory · Real Results
            </p>
            <h1 className="text-5xl sm:text-6xl font-bold leading-tight mb-6 max-w-3xl mx-auto">
              Build Smarter.
              <br />
              <span className="text-amber">Save More.</span>
            </h1>
            <p className="text-white/65 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Eduardo Mendes helps Australian homeowners, renovators, and owner
              builders protect their investment with honest, independent advice
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
                <Upload size={17} className="mr-2" />
                Free Project Assessment
              </Link>
              <Link
                href="/book-call"
                className={cn(
                  buttonVariants({ size: "lg", variant: "outline" }),
                  "border-white/25 text-white hover:bg-white/10 text-base px-8"
                )}
              >
                <Calendar size={17} className="mr-2" />
                Book a Free Call
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-6 text-xs text-white/40">
              <span>✓ No credit card</span>
              <span>✓ No commitment</span>
              <span>✓ Results in under 3 minutes</span>
            </div>
          </div>
        </section>

        {/* ── Stats bar ────────────────────────────────────── */}
        <section className="bg-white border-b border-gray-100 py-10 px-4">
          <div className="max-w-5xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <p className="text-2xl font-bold text-navy">{s.value}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Why section ──────────────────────────────────── */}
        <section className="bg-[#F8F9FA] py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-warm-soil text-xs font-bold uppercase tracking-widest mb-3">Why Homeowners Work With Eduardo</p>
              <h2 className="text-3xl font-bold text-navy mb-3">
                Because building mistakes are expensive.
              </h2>
              <p className="text-gray-500 max-w-xl mx-auto text-sm leading-relaxed">
                Most homeowners don't know what they don't know. Eduardo bridges the gap
                between you and your builder — so you protect your budget, timeline, and sanity.
              </p>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              {[
                { icon: CheckCircle2, title: "100% Independent",   body: "No builder referral fees. No kickbacks. Eduardo works exclusively for you." },
                { icon: Home,         title: "Plain-English Advice", body: "No jargon. Just clear, actionable guidance you can act on right now." },
                { icon: ShieldCheck,  title: "Australia-Wide",     body: "Serving homeowners across all states and territories, remotely or on-site." },
              ].map((p) => (
                <div key={p.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-amber/10 flex items-center justify-center mb-4">
                    <p.icon size={20} className="text-amber" />
                  </div>
                  <h3 className="font-semibold text-navy mb-2">{p.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{p.body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Services ─────────────────────────────────────── */}
        <section className="bg-navy py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-warm-soil text-xs font-bold uppercase tracking-widest mb-3">Our Services</p>
              <h2 className="text-3xl font-bold text-white mb-3">
                Expert advisory at every stage
              </h2>
              <p className="text-white/50 text-sm max-w-lg mx-auto">
                From quote review to final handover — Eduardo is in your corner every step of the way.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              {services.map((service) => {
                const Icon = service.icon;
                return (
                  <Link
                    key={service.href}
                    href={service.href}
                    className="group flex gap-4 bg-white/5 hover:bg-white/10 rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-amber/15 flex items-center justify-center shrink-0">
                      <Icon size={22} className="text-amber" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-white group-hover:text-amber transition-colors">
                          {service.title}
                        </h3>
                        <span className="text-xs text-white/40 shrink-0">{service.price}</span>
                      </div>
                      <p className="text-sm text-white/60 leading-relaxed">{service.description}</p>
                      <p className="text-xs text-amber font-medium mt-3 flex items-center gap-1 group-hover:gap-2 transition-all">
                        Learn more <ArrowRight size={12} />
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Eduardo section ──────────────────────────────── */}
        <section className="bg-white py-20 px-4">
          <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-warm-soil text-xs font-bold uppercase tracking-widest mb-4">Eduardo Mendes</p>
              <h2 className="text-3xl font-bold text-navy mb-5 leading-tight">
                Builders build every day.<br />
                Most homeowners build once.
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-5">
                That knowledge gap is what Eduardo fixes. With 30+ years of hands-on construction
                experience, Eduardo gives you the independent, expert perspective you need to make
                confident, cost-effective decisions.
              </p>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                You're not alone. Eduardo is the guide from your side of the table.
              </p>
              <Link href="/book-call" className={cn(buttonVariants(), "bg-navy hover:bg-navy/90 text-white border-transparent")}>
                <Calendar size={15} className="mr-2" />
                Book a Free Strategy Call
              </Link>
            </div>
            <div className="bg-[#F8F9FA] rounded-2xl p-8 border border-gray-100">
              <div className="flex items-center gap-1 mb-1">
                {[1,2,3,4,5].map((n) => (
                  <Star key={n} size={14} className="fill-amber text-amber" />
                ))}
              </div>
              <p className="text-gray-700 text-sm leading-relaxed italic mb-4">
                &ldquo;Eduardo&apos;s review saved us over $22,000 and helped us avoid a major variation later in the build.&rdquo;
              </p>
              <p className="text-sm font-semibold text-navy">James &amp; Sarah</p>
              <p className="text-xs text-gray-400">Brisbane, QLD</p>
            </div>
          </div>
        </section>

        {/* ── How It Works ─────────────────────────────────── */}
        <section className="bg-[#F8F9FA] py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-warm-soil text-xs font-bold uppercase tracking-widest mb-3">How It Works</p>
              <h2 className="text-3xl font-bold text-navy">From question to confidence in 4 steps</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {howItWorks.map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.step} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm relative">
                    <div className="w-8 h-8 rounded-full bg-amber flex items-center justify-center text-navy font-bold text-sm mb-4">
                      {step.step}
                    </div>
                    <Icon size={22} className="text-warm-soil mb-3" />
                    <h3 className="font-semibold text-navy text-sm mb-2">{step.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{step.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── Testimonials ─────────────────────────────────── */}
        <section className="bg-white py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-warm-soil text-xs font-bold uppercase tracking-widest mb-3">What Our Clients Say</p>
              <h2 className="text-3xl font-bold text-navy">Trusted by Australian homeowners</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div key={t.name} className="bg-[#F8F9FA] rounded-2xl p-6 border border-gray-100">
                  <div className="flex items-center gap-0.5 mb-4">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <Star key={i} size={13} className="fill-amber text-amber" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed italic mb-5">&ldquo;{t.quote}&rdquo;</p>
                  <div>
                    <p className="text-sm font-semibold text-navy">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.location}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA strip ────────────────────────────────────── */}
        <section className="bg-warm-soil py-16 px-4 text-white text-center">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-bold mb-4">Ready to Build Smarter?</h2>
            <p className="text-white/80 mb-8 text-sm leading-relaxed">
              Complete the free assessment and get your personalised Project Readiness Score in under 3 minutes.
              No credit card. No commitment.
            </p>
            <Link
              href="/assessment"
              className="inline-flex items-center gap-2 bg-navy hover:bg-navy/90 text-white font-semibold px-8 py-4 rounded-xl transition-colors text-sm"
            >
              <BarChart3 size={17} />
              Start Free Assessment
            </Link>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────── */}
        <section className="bg-[#F8F9FA] py-20 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-warm-soil text-xs font-bold uppercase tracking-widest mb-3">Frequently Asked Questions</p>
              <h2 className="text-2xl font-bold text-navy">Common questions</h2>
            </div>
            <div className="space-y-4">
              {faqs.map((faq) => (
                <div key={faq.q} className="bg-white rounded-2xl border border-gray-100 p-6">
                  <p className="font-semibold text-navy text-sm mb-2">{faq.q}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <PublicFooter />
    </>
  );
}
