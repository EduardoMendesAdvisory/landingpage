import Link from "next/link";
import {
  Upload,
  Play,
  Check,
  FileText,
  PenLine,
  Map,
  Layers,
  ListChecks,
  Users,
  DollarSign,
  AlertTriangle,
  Clock,
  BookOpen,
  TrendingDown,
  ArrowRight,
  Star,
  ShieldCheck,
  Calendar,
  Home,
  HardHat,
  Wrench,
  FileSearch,
  Building2,
} from "lucide-react";
import { PublicNav } from "@/components/layout/PublicNav";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { cn } from "@/lib/utils";

// ── Data ─────────────────────────────────────────────────────

const SERVICES = [
  { icon: FileSearch, title: "BuildCheck",                   description: "Upload your quote and we plan the review.",                         href: "/buildcheck" },
  { icon: Building2,  title: "Pre-Construction Advisory",    description: "Know your project with confidence before works begin.",              href: "/services/pre-construction-advisory" },
  { icon: HardHat,    title: "Site Works Advisory",          description: "Independent site inspections and practical advice.",                 href: "/services/construction-advisory" },
  { icon: Home,       title: "Owner Builder Program",        description: "End-to-end support for Owner Builders.",                            href: "/services/owner-builder-program" },
];

const HOW_IT_WORKS = [
  { step: 1, icon: Upload,      title: "Upload Your Documents",    description: "Share your builder quote, plans, or contracts securely through the platform." },
  { step: 2, icon: FileSearch,  title: "Receive Initial Assessment", description: "Eduardo reviews your documents and identifies the key risks and opportunities." },
  { step: 3, icon: Calendar,    title: "Book Expert Advice",       description: "Choose the advisory package that fits your needs and stage of project." },
  { step: 4, icon: ShieldCheck, title: "Build With Confidence",    description: "Make informed decisions at every stage with Eduardo in your corner." },
];

const REVIEW_ITEMS = [
  { icon: FileText,   label: "Builder Quotes" },
  { icon: PenLine,    label: "Contracts" },
  { icon: Map,        label: "Construction Plans" },
  { icon: Layers,     label: "Variations" },
  { icon: ListChecks, label: "Scope of Works" },
  { icon: Users,      label: "Subcontractors" },
];

const COMMON_ISSUES = [
  "Missing items or incorrect inclusions",
  "PC sums and provisional items not clearly defined",
  "Structural or site issues that raise disputes",
  "Budget timeline not aligned with construction schedule",
  "Budget finances not structured correctly",
];

const WHO_WE_HELP = [
  { label: "New Home Build", gradient: "from-[#1e3a5f] to-[#0d2035]" },
  { label: "Renovation",     gradient: "from-[#3a2a1e] to-[#1f1510]" },
  { label: "Owner Builder",  gradient: "from-[#1e3320] to-[#0d1a10]" },
];

const TESTIMONIALS = [
  { quote: "Eduardo's review saved us over $22,000 and helped us avoid a major variation issue later in the build.",      name: "James & Sarah", location: "Brisbane, QLD", stars: 5 },
  { quote: "The BuildCheck report was incredibly detailed. Eduardo found 4 provisional sums that weren't clearly defined.", name: "Michael T.",    location: "Sydney, NSW",   stars: 5 },
  { quote: "As first-time owner builders we had no idea what we were getting into. Eduardo's program was invaluable.",     name: "Rachel & Dan",  location: "Melbourne, VIC", stars: 5 },
];

const FAQS = [
  { q: "How much does a BuildCheck cost?",           a: "BuildCheck starts from $1,500 for a standard residential quote review. Complex projects may vary." },
  { q: "Do you work outside of Queensland?",         a: "Yes. Eduardo provides advisory services across all Australian states and territories." },
  { q: "What if I don't have a builder quote yet?",  a: "That's fine — start with the free assessment to understand your project readiness before engaging a builder." },
];

// ── Component ─────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      <PublicNav />
      <main className="flex-1">

        {/* ── 1. HERO ─────────────────────────────────────────── */}
        <section className="bg-[#111A24] text-white py-20 px-4 overflow-hidden">
          <div className="max-w-6xl mx-auto grid md:grid-cols-[1fr_1fr] gap-12 items-center min-h-[460px]">

            {/* Left */}
            <div className="py-4">
              <p className="text-[#8E682F] text-[11px] font-bold uppercase tracking-widest mb-5">
                Independent Advice · Real Results
              </p>
              <h1 className="text-5xl sm:text-6xl font-bold leading-[1.1] mb-5">
                Build Smarter.
                <br />
                <span className="text-amber">Save More.</span>
              </h1>
              <p className="text-white/60 text-base max-w-md mb-8 leading-relaxed">
                Get an independent review of your builder quote and plans to avoid costly
                mistakes and confidently lead the savings on your build.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <Link
                  href="/assessment"
                  className="inline-flex items-center justify-center gap-2 bg-[#8E682F] hover:bg-[#7a5a28] text-white font-bold px-7 py-3.5 rounded-lg transition-colors text-sm uppercase tracking-wider"
                >
                  <Upload size={15} />
                  Upload Your Quote
                </Link>
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 border border-white/25 hover:border-white/50 hover:bg-white/5 text-white font-semibold px-7 py-3.5 rounded-lg transition-colors text-sm uppercase tracking-wider"
                >
                  <Play size={13} className="fill-white" />
                  How It Works
                </a>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-white/40 border-t border-white/10 pt-5">
                {["Independent Advice", "30+ Years Experience", "500+ Trusted", "Honest Builder Specialist"].map((t) => (
                  <span key={t} className="flex items-center gap-1.5">
                    <Check size={10} className="text-amber shrink-0" />{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: assessment mockup */}
            <div className="hidden md:flex relative rounded-2xl overflow-hidden min-h-[460px] items-center justify-center bg-gradient-to-br from-[#1c2d42] via-[#14263a] to-[#0d1c2c]">
              {/*
                ── HOUSE PHOTO PLACEHOLDER ──
                Replace this comment with:
                <Image src="/images/hero-house.jpg" fill alt="" className="object-cover opacity-40" />
                and add: import Image from "next/image";
              */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#111A24]/70 via-transparent to-transparent" />

              {/* Assessment score card */}
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-72 p-5 mx-6">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Your Score Assessment</p>
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-20 h-20 shrink-0">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                      <circle cx="50" cy="50" r="38" fill="none" stroke="#e5e7eb" strokeWidth="10" />
                      <circle cx="50" cy="50" r="38" fill="none" stroke="#16a34a" strokeWidth="10"
                        strokeDasharray="201 239" strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <p className="text-lg font-bold text-[#111A24] leading-none">84</p>
                        <p className="text-[9px] text-gray-400">/ 100</p>
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-green-600">High Readiness</p>
                    <p className="text-xs text-gray-500 mt-0.5">Project Score: 84/100</p>
                    <p className="text-xs font-semibold text-green-600 mt-2">$13,700 – $12,000</p>
                    <p className="text-[10px] text-gray-400">savings identified</p>
                  </div>
                </div>
                <div className="bg-green-50 rounded-lg px-3 py-2 text-[10px] text-green-700 font-medium text-center">
                  Excellent! Your project is well-positioned
                </div>
              </div>

              {/* Sticker */}
              <div className="absolute top-5 right-5 z-20 bg-amber text-[#111A24] text-[10px] font-bold px-3 py-1.5 rounded-full rotate-6 shadow-lg whitespace-nowrap">
                Get started before you lose
              </div>
            </div>
          </div>
        </section>

        {/* ── 2. UPLOAD YOUR DOCUMENTS ────────────────────────── */}
        <section className="bg-[#0d1520] text-white py-14 px-4">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl font-bold mb-3">Upload Your Documents</h2>
              <p className="text-white/55 text-sm leading-relaxed mb-6">
                Run by the assessment to get your builder quote and plans to avoid costly
                mistakes and find the savings on your build.
              </p>
              <div className="grid grid-cols-2 gap-3 mb-6">
                {[
                  { icon: ShieldCheck, label: "No risk" },
                  { icon: Clock,       label: "2 min assessment" },
                  { icon: FileText,    label: "Secure document handling" },
                  { icon: Check,       label: "100% confidential" },
                ].map((t) => (
                  <div key={t.label} className="flex items-center gap-2">
                    <t.icon size={14} className="text-amber shrink-0" />
                    <span className="text-xs text-white/55">{t.label}</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-white/25 leading-relaxed">
                No file size limit · All formats accepted · Reviewed by Eduardo personally
              </p>
            </div>
            <div>
              <div className="border-2 border-dashed border-white/15 rounded-xl p-8 text-center hover:border-amber/40 transition-colors">
                <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                  <Upload size={24} className="text-amber" />
                </div>
                <p className="text-sm font-semibold mb-1">Drag &amp; drop your files here</p>
                <p className="text-xs text-white/35 mb-5">PDF, DOCX, XLS — Max 25MB each</p>
                <Link
                  href="/assessment"
                  className="inline-flex items-center gap-2 bg-amber text-[#111A24] font-bold px-6 py-3 rounded-lg text-sm uppercase tracking-wider hover:bg-amber/90 transition-colors"
                >
                  Choose File to Upload
                </Link>
              </div>
              <p className="text-[10px] text-white/25 text-center mt-2">No file selected</p>
            </div>
          </div>
        </section>

        {/* ── 3. WHY HOMEOWNERS ───────────────────────────────── */}
        <section className="bg-white py-16 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <p className="text-[#8E682F] text-[11px] font-bold uppercase tracking-widest mb-3">Why Homeowners Work With Eduardo</p>
            <h2 className="text-2xl font-bold text-[#111A24] mb-2">Because building mistakes are expensive.</h2>
            <p className="text-sm text-gray-500 mb-10 max-w-lg mx-auto leading-relaxed">
              Most homeowners don&apos;t know what they don&apos;t know. Eduardo bridges the gap between
              you and your builder — so you protect your budget, timeline, and sanity.
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-6">
              {([
                { icon: DollarSign,   label: "Overpay" },
                { icon: AlertTriangle, label: "Miscalculated risks" },
                { icon: FileText,     label: "Approve unknowingly" },
                { icon: BookOpen,     label: "Reduce learning resources" },
                { icon: Clock,        label: "Experience delays" },
                { icon: TrendingDown, label: "Blow the budget" },
              ] as const).map((p) => (
                <div key={p.label} className="flex flex-col items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-[#f5f0e8] flex items-center justify-center">
                    <p.icon size={22} className="text-[#8E682F]" />
                  </div>
                  <p className="text-xs font-medium text-gray-600 text-center leading-tight">{p.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4. OUR SERVICES ─────────────────────────────────── */}
        <section className="bg-[#111A24] py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-[#8E682F] text-[11px] font-bold uppercase tracking-widest mb-2">Our Services</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {SERVICES.map((s) => {
                const Icon = s.icon;
                return (
                  <Link
                    key={s.href}
                    href={s.href}
                    className="group bg-white/5 hover:bg-white/8 border border-white/10 hover:border-amber/30 rounded-xl p-6 transition-all"
                  >
                    <div className="w-12 h-12 rounded-xl bg-amber/10 flex items-center justify-center mb-4">
                      <Icon size={22} className="text-amber" />
                    </div>
                    <h3 className="font-bold text-white text-sm mb-2 group-hover:text-amber transition-colors">{s.title}</h3>
                    <p className="text-xs text-white/50 leading-relaxed mb-4">{s.description}</p>
                    <p className="text-amber text-xs font-medium flex items-center gap-1">
                      Learn more <ArrowRight size={11} />
                    </p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 5. EDUARDO ──────────────────────────────────────── */}
        <section className="bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 items-stretch">

            {/* Left: Text */}
            <div className="px-8 lg:px-16 py-20 flex flex-col justify-center">
              <h2 className="text-3xl sm:text-4xl font-bold text-[#111A24] leading-tight mb-6">
                Builders build every day.<br />
                Most homeowners build once.
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-4">
                Although the advice gap is very real, it&apos;s easy to overpay and lose time
                and money on problems that could have been avoided with the right guidance.
              </p>
              <p className="text-gray-500 text-sm leading-relaxed mb-8">
                You&apos;re here to look at the guide from your side of the table.
              </p>
              <div className="pl-4 border-l-2 border-[#8E682F]/40 mb-8">
                <p className="text-[#111A24] text-xl font-semibold italic" style={{ fontFamily: "Georgia, serif" }}>
                  Eduardo Mendes
                </p>
                <p className="text-xs text-gray-400 mt-1">Independent Construction Advisor · 30+ Years Experience</p>
              </div>
            </div>

            {/* Right: Photo placeholder */}
            <div className="relative bg-[#111A24] min-h-[420px] flex items-center justify-center overflow-hidden">
              {/*
                ── PHOTO PLACEHOLDER ──
                Replace with:
                <Image src="/images/eduardo-mendes.jpg" fill alt="Eduardo Mendes" className="object-cover object-center" />
                Add: import Image from "next/image";
              */}
              <div className="relative z-10 text-center text-white/20 p-10 select-none">
                <div className="w-36 h-36 rounded-full bg-white/5 border border-white/8 mx-auto mb-5 flex items-center justify-center">
                  <span className="text-6xl font-bold text-amber/40">EM</span>
                </div>
                <p className="text-sm font-semibold text-white/30">Eduardo Mendes</p>
                <p className="text-xs text-white/15 mt-1">Owner Builder Advisor</p>
                <p className="text-[10px] text-white/10 mt-5 italic leading-relaxed">
                  Add eduardo-mendes.jpg<br />to /public/images/
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── 6. HOW IT WORKS ─────────────────────────────────── */}
        <section id="how-it-works" className="bg-[#F8F9FA] py-20 px-4 scroll-mt-16">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-[#8E682F] text-[11px] font-bold uppercase tracking-widest mb-3">How It Works</p>
            </div>
            <div className="flex flex-col sm:flex-row items-start">
              {HOW_IT_WORKS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={step.step} className="flex flex-1 flex-row sm:flex-col items-start sm:items-center gap-4 sm:gap-0 sm:text-center">
                    <div className="flex sm:flex-col items-center sm:items-center gap-2 sm:gap-0">
                      {/* Step number + icon */}
                      <div className="relative shrink-0">
                        <div className="w-16 h-16 rounded-full bg-amber/15 border-2 border-amber/20 flex items-center justify-center">
                          <Icon size={26} className="text-amber" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-amber text-[#111A24] text-xs font-bold flex items-center justify-center">
                          {step.step}
                        </div>
                      </div>
                      {/* Arrow (desktop) */}
                      {i < HOW_IT_WORKS.length - 1 && (
                        <div className="hidden sm:flex items-center justify-center w-full my-5 text-gray-300">
                          <ArrowRight size={20} />
                        </div>
                      )}
                    </div>
                    <div className="sm:mt-4 sm:px-3 pb-6 sm:pb-0">
                      <h3 className="font-bold text-[#111A24] text-sm mb-1.5">{step.title}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed">{step.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 7. WHAT WE REVIEW ───────────────────────────────── */}
        <section className="bg-[#111A24] text-white py-20 px-4">
          <div className="max-w-6xl mx-auto">

            <div className="text-center mb-12">
              <p className="text-[#8E682F] text-[11px] font-bold uppercase tracking-widest mb-2">What We Review</p>
            </div>

            {/* 6 review icons */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-6 mb-16">
              {REVIEW_ITEMS.map((r) => {
                const Icon = r.icon;
                return (
                  <div key={r.label} className="flex flex-col items-center gap-3 text-center">
                    <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                      <Icon size={22} className="text-amber" />
                    </div>
                    <p className="text-xs text-white/65 font-medium leading-tight">{r.label}</p>
                  </div>
                );
              })}
            </div>

            {/* 2-col: issues + who we help */}
            <div className="grid md:grid-cols-2 gap-12">

              {/* Common Issues */}
              <div>
                <p className="text-[#8E682F] text-[11px] font-bold uppercase tracking-widest mb-5">
                  The Most Common Issues We Find
                </p>
                <div className="space-y-3 mb-8">
                  {COMMON_ISSUES.map((issue) => (
                    <div key={issue} className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center shrink-0 mt-0.5">
                        <span className="text-red-400 text-[10px] font-bold">!</span>
                      </div>
                      <p className="text-sm text-white/60 leading-tight">{issue}</p>
                    </div>
                  ))}
                </div>
                <Link
                  href="/assessment"
                  className="inline-flex items-center gap-2 bg-[#8E682F] hover:bg-[#7a5a28] text-white font-bold px-6 py-3 rounded-lg text-sm uppercase tracking-wider transition-colors"
                >
                  Get Your Report <ArrowRight size={14} />
                </Link>
              </div>

              {/* Who We Help */}
              <div>
                <p className="text-[#8E682F] text-[11px] font-bold uppercase tracking-widest mb-5">
                  Who We Help
                </p>
                <div className="grid grid-cols-3 gap-3">
                  {WHO_WE_HELP.map((w) => (
                    <div
                      key={w.label}
                      className={cn(
                        "rounded-xl overflow-hidden aspect-square relative bg-gradient-to-br",
                        w.gradient
                      )}
                    >
                      {/*
                        Replace with <Image> when photos available:
                        e.g. <Image src="/images/who-new-home.jpg" fill alt={w.label} className="object-cover opacity-60" />
                      */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-2.5">
                        <p className="text-white text-[11px] font-bold leading-tight">{w.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── 8. TESTIMONIALS ─────────────────────────────────── */}
        <section className="bg-[#F8F9FA] py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <p className="text-[#8E682F] text-[11px] font-bold uppercase tracking-widest mb-3">What Our Clients Say</p>
              <h2 className="text-2xl font-bold text-[#111A24]">Trusted by Australian homeowners</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t) => (
                <div key={t.name} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-0.5 mb-4">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <Star key={i} size={13} className="fill-amber text-amber" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 leading-relaxed italic mb-5">&ldquo;{t.quote}&rdquo;</p>
                  <p className="text-sm font-semibold text-[#111A24]">{t.name}</p>
                  <p className="text-xs text-gray-400">{t.location}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 9. CTA STRIP ────────────────────────────────────── */}
        <section className="bg-[#8E682F] py-14 px-4">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Ready to Build Smarter?</h2>
              <p className="text-white/70 text-sm max-w-lg leading-relaxed">
                Upload your builder quote and get an independent expert assessment. No risk, no obligation.
              </p>
            </div>
            <Link
              href="/assessment"
              className="inline-flex items-center gap-2 border-2 border-white text-white hover:bg-white hover:text-[#8E682F] font-bold px-8 py-3.5 rounded-lg text-sm uppercase tracking-wider transition-all whitespace-nowrap shrink-0"
            >
              Let&apos;s Get Started <ArrowRight size={15} />
            </Link>
          </div>
        </section>

        {/* ── 10. FAQ ─────────────────────────────────────────── */}
        <section className="bg-white py-20 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-[#8E682F] text-[11px] font-bold uppercase tracking-widest mb-3">Frequently Asked Questions</p>
              <h2 className="text-2xl font-bold text-[#111A24]">Common questions</h2>
            </div>
            <div className="space-y-4">
              {FAQS.map((faq) => (
                <div key={faq.q} className="bg-[#F8F9FA] rounded-xl border border-gray-100 p-6">
                  <p className="font-bold text-[#111A24] text-sm mb-2">{faq.q}</p>
                  <p className="text-sm text-gray-500 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 11. REAL BUILD RESULTS ──────────────────────────── */}
        <section className="bg-[#111A24] text-white py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-3">
              <p className="text-[#8E682F] text-[11px] font-bold uppercase tracking-widest">Real Build Results</p>
            </div>
            <div className="grid md:grid-cols-2 gap-12 items-center mt-8">
              {/* Quote */}
              <div>
                <div className="flex items-center gap-0.5 mb-5">
                  {[1,2,3,4,5].map((n) => <Star key={n} size={14} className="fill-amber text-amber" />)}
                </div>
                <blockquote className="text-xl sm:text-2xl font-semibold leading-snug text-white mb-6">
                  &ldquo;Eduardo&apos;s review saved us over $22,000 and helped us avoid a major variation later in the build.&rdquo;
                </blockquote>
                <p className="text-sm font-semibold text-amber">James &amp; Sarah</p>
                <p className="text-xs text-white/40 mt-1">Brisbane, QLD</p>
              </div>

              {/* CTA card */}
              <div className="bg-[#0d1520] rounded-2xl p-8 relative overflow-hidden min-h-[260px] flex flex-col justify-center">
                {/*
                  ── HOUSE PHOTO PLACEHOLDER ──
                  Add:
                  <Image src="/images/build-result.jpg" fill alt="" className="object-cover opacity-15" />
                */}
                <p className="text-xl font-bold text-white mb-1">Protect your budget.</p>
                <p className="text-xl font-bold text-white mb-1">Make better decisions.</p>
                <p className="text-xl font-bold text-amber mb-6">Build with confidence.</p>
                <Link
                  href="/assessment"
                  className="inline-flex items-center gap-2 bg-amber text-[#111A24] font-bold px-6 py-3 rounded-lg text-sm uppercase tracking-wider hover:bg-amber/90 transition-colors self-start"
                >
                  <Upload size={15} />
                  Upload Your Builder Quote
                </Link>
                <p className="text-[10px] text-white/25 mt-3">Secure. Private. No obligation.</p>
              </div>
            </div>
          </div>
        </section>

      </main>
      <PublicFooter />
    </>
  );
}
