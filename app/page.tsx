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
  Check,
  Play,
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
        <section className="bg-navy text-white py-20 px-4 overflow-hidden">
          <div className="max-w-6xl mx-auto grid md:grid-cols-[1fr_1fr] gap-12 items-center">

            {/* Left: Text */}
            <div className="relative z-10 py-4">
              <p className="text-warm-soil text-[11px] font-bold uppercase tracking-widest mb-5">
                Independent Advice · Real Results
              </p>
              <h1 className="text-5xl sm:text-6xl font-bold leading-tight mb-6">
                Build Smarter.
                <br />
                <span className="text-amber">Save More.</span>
              </h1>
              <p className="text-white/65 text-lg max-w-lg mb-8 leading-relaxed">
                Get an independent review of your builder quote and plans to avoid
                costly mistakes and confidently lead your build.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Link
                  href="/assessment"
                  className="inline-flex items-center justify-center gap-2 bg-warm-soil hover:bg-warm-soil/90 text-white font-bold px-6 py-3.5 rounded-xl transition-colors text-sm uppercase tracking-wide"
                >
                  <Upload size={16} />
                  Upload Your Quote
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 border border-white/25 hover:bg-white/10 text-white font-medium px-6 py-3.5 rounded-xl transition-colors text-sm uppercase tracking-wide"
                >
                  <Play size={14} className="fill-white" />
                  How It Works
                </a>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/40 border-t border-white/10 pt-5">
                {["Independent Advice", "30+ Years Experience", "500+ Trusted", "Honest Builder Specialist"].map((t) => (
                  <span key={t} className="flex items-center gap-1.5">
                    <Check size={11} className="text-amber shrink-0" />
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: Device mockup + house photo placeholder */}
            <div className="hidden md:flex relative rounded-2xl overflow-hidden min-h-[440px] items-center justify-center bg-gradient-to-br from-[#1c2d42] via-[#14263a] to-[#0d1c2c]">
              {/* ↓ Replace this div with a Next.js <Image> when the house photo is available:
                  <Image src="/images/hero-house.jpg" fill alt="" className="object-cover opacity-40" />
              */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy/80 via-transparent to-transparent" />

              {/* Assessment score card */}
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-64 p-5">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Your Score Assessment</p>
                <div className="flex items-center gap-4 mb-4">
                  {/* Score donut */}
                  <div className="relative w-20 h-20 shrink-0">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      <circle cx="50" cy="50" r="38" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                      <circle cx="50" cy="50" r="38" fill="none" stroke="#16a34a" strokeWidth="10"
                        strokeDasharray="201 239" strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-lg font-bold text-navy leading-none">84</p>
                        <p className="text-[9px] text-gray-400">/ 100</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-green-600">High Readiness</p>
                    <p className="text-xs text-gray-500 mt-0.5">Project score: 84/100</p>
                    <p className="text-xs font-semibold text-green-600 mt-2">$13,700 – $12,000</p>
                    <p className="text-[10px] text-gray-400">savings identified</p>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg px-3 py-2 text-[10px] text-green-700 font-medium text-center">
                  Excellent! Your project is well-positioned
                </div>
              </div>

              {/* Sticker badge */}
              <div className="absolute top-5 right-5 z-20 bg-amber text-navy text-[10px] font-bold px-3 py-1.5 rounded-full rotate-6 shadow-lg whitespace-nowrap">
                Get started before you lose
              </div>
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
        <section className="bg-white py-20 px-4 overflow-hidden">
          <div className="max-w-6xl mx-auto grid md:grid-cols-[1fr_1fr] gap-16 items-center">

            {/* Left: Photo */}
            <div className="relative">
              <div className="aspect-[4/5] rounded-2xl overflow-hidden bg-[#111A24] flex items-center justify-center max-w-md">
                {/*
                  ── PHOTO PLACEHOLDER ──
                  Replace this block with:
                  <Image
                    src="/images/eduardo-mendes.jpg"
                    fill
                    alt="Eduardo Mendes"
                    className="object-cover object-top"
                  />
                  Then add: import Image from "next/image";
                */}
                <div className="text-center text-white/30 p-10 select-none">
                  <div className="w-28 h-28 rounded-full bg-white/8 border border-white/10 mx-auto mb-5 flex items-center justify-center">
                    <span className="text-5xl font-bold text-amber/60">EM</span>
                  </div>
                  <p className="text-base font-semibold text-white/50">Eduardo Mendes</p>
                  <p className="text-xs text-white/25 mt-1">Owner Builder Advisor</p>
                  <p className="text-[10px] text-white/15 mt-6 italic leading-relaxed">
                    Add&nbsp;eduardo&#8209;mendes.jpg<br />to&nbsp;/public/images/
                  </p>
                </div>
              </div>
              {/* Warm accent bar */}
              <div className="absolute bottom-0 left-0 w-1.5 h-2/3 bg-warm-soil rounded-r-full" />
            </div>

            {/* Right: Text */}
            <div>
              <p className="text-warm-soil text-xs font-bold uppercase tracking-widest mb-4">Eduardo Mendes</p>
              <h2 className="text-3xl font-bold text-navy mb-5 leading-tight">
                Builders build every day.<br />
                Most homeowners build once.
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                Although the knowledge gap is real, it's easy to overpay and lose time
                and money on problems that could have been avoided.
              </p>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                With 30+ years of hands-on construction experience, Eduardo gives you
                the independent, expert perspective you need to make confident,
                cost-effective decisions at every stage of your build.
              </p>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                You're here to look at the guide from your side of the table.
              </p>
              {/* Signature */}
              <div className="mb-8 pl-4 border-l-2 border-warm-soil/30">
                <p className="text-navy text-xl italic font-semibold" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                  Eduardo Mendes
                </p>
                <p className="text-xs text-gray-400 mt-1">Independent Construction Advisor · 30+ Years Experience</p>
              </div>
              <Link href="/book-call" className={cn(buttonVariants(), "bg-navy hover:bg-navy/90 text-white border-transparent")}>
                <Calendar size={15} className="mr-2" />
                Book a Free Strategy Call
              </Link>
            </div>
          </div>
        </section>

        {/* ── How It Works ─────────────────────────────────── */}
        <section id="how-it-works" className="bg-[#F8F9FA] py-20 px-4 scroll-mt-16">
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
