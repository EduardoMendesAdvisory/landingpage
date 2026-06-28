import Link from "next/link";
import { UploadQuoteButton } from "@/components/shared/UploadQuoteButton";
import { EDUARDO_PORTRAIT_URL } from "@/lib/media";
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
  TrendingDown,
  ArrowRight,
  Star,
  ShieldCheck,
  Home,
  HardHat,
  Wrench,
  FileSearch,
  Building2,
  BarChart3,
  XCircle,
} from "lucide-react";
import { PublicNav } from "@/components/layout/PublicNav";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { HeroLeadCalculator } from "@/components/shared/HeroLeadCalculator";

// ── Data ─────────────────────────────────────────────────────

const SERVICES = [
  { icon: FileSearch, title: "BuildCheck",                   description: "Upload your quote and we plan the review.",                         href: "/buildcheck" },
  { icon: Building2,  title: "Pre-Construction Advisory",    description: "Know your project with confidence before works begin.",              href: "/services/pre-construction-advisory" },
  { icon: HardHat,    title: "Construction Advisory",        description: "Independent construction guidance from start to finish.",            href: "/services/construction-advisory" },
  { icon: Wrench,     title: "Site Visits & Inspections",    description: "Independent on-site inspections at key construction stages.",        href: "/services/site-visits-inspections" },
  { icon: Home,       title: "Owner Builder Program",        description: "End-to-end support for Owner Builders.",                            href: "/services/owner-builder-program" },
];

const HOW_IT_WORKS = [
  { step: 1, icon: Upload,      title: "Upload Your Builder Quote",  description: "Send us your quote, plans or documents securely online." },
  { step: 2, icon: FileSearch,  title: "Receive Initial Assessment", description: "We review your documents and identify key risks and opportunities." },
  { step: 3, icon: Users,       title: "Book Expert Review",         description: "Discuss the findings in detail with Eduardo and get expert advice." },
  { step: 4, icon: ShieldCheck, title: "Build With Confidence",      description: "Make informed decisions and move forward with confidence." },
];

const REVIEW_ITEMS = [
  { icon: FileText,   label: "Builder Quotes",      description: "Detailed pricing and inclusions" },
  { icon: PenLine,    label: "Contracts",           description: "Terms, conditions and clauses" },
  { icon: Map,        label: "Construction Plans",  description: "Drawings, specs and documents" },
  { icon: Layers,     label: "Variations",          description: "Change orders and potential impacts" },
  { icon: ListChecks, label: "Scope of Works",      description: "Completeness and clarity" },
  { icon: BarChart3,  label: "Cost Breakdowns",     description: "Rates, margins and allowances" },
];

const COMMON_ISSUES = [
  "Missing items or incorrect inclusions",
  "PC sums and provisional items not clearly defined",
  "Structural or site issues that raise disputes",
  "Budget timeline not aligned with construction schedule",
  "Budget finances not structured correctly",
];

const WHO_WE_HELP = [
  {
    label: "Home Builders",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Renovators",
    image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Owner Builders",
    image: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Extensions",
    image: "https://images.unsplash.com/photo-1600573472592-401b489a3cdc?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Bathroom Renovations",
    image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=80",
  },
  {
    label: "Kitchen Renovations",
    image: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=1200&q=80",
  },
];

const TYPO = {
  sectionTitle: "text-3xl md:text-4xl font-bold leading-tight",
  body: "text-sm md:text-base leading-relaxed",
  iconLabel: "text-[14px] font-semibold leading-tight",
  cardTitle: "text-base md:text-[17px] font-semibold leading-tight",
  cardBody: "text-sm text-[#3a4350] leading-snug",
} as const;

const TESTIMONIALS = [
  { quote: "Eduardo's review helped us avoid a major variation issue later in the build and gave us real confidence in our contract.", name: "James & Sarah", location: "Brisbane, QLD", stars: 5 },
  { quote: "The BuildCheck report was incredibly detailed. Eduardo found provisional sums that weren't clearly defined.", name: "Michael T.", location: "Sunshine Coast, QLD", stars: 5 },
  { quote: "As first-time owner builders we had no idea what we were getting into. Eduardo's program was invaluable.", name: "Rachel & Dan", location: "Gold Coast, QLD", stars: 5 },
];

const FAQS = [
  { q: "How much does a BuildCheck cost?", a: "BuildCheck pricing depends on project scope and complexity. Book a free consultation or contact us for a tailored quote." },
  { q: "Do you work outside of Queensland?", a: "No. Eduardo Mendes Advisory currently serves residential and owner-builder projects in Queensland only." },
  { q: "What if I don't have a builder quote yet?",  a: "That's fine — start with the free assessment to understand your project readiness before engaging a builder." },
  { q: "How quickly will I receive my review?",      a: "Most BuildCheck reviews are delivered within 3 to 5 business days after receiving complete documents." },
  { q: "What documents should I upload first?",      a: "Start with your builder quote, inclusions list, plans, and draft contract if available. We can guide you on any missing items." },
  { q: "Can I book a call after the report?",        a: "Yes. After your report is ready, you can book a follow-up advisory call to walk through findings and next decisions." },
];

const PARTNER_LOGOS = [
  "https://rdeavyxckvkfwjvmxugs.supabase.co/storage/v1/object/public/media/logos/australia.png",
  "https://rdeavyxckvkfwjvmxugs.supabase.co/storage/v1/object/public/media/logos/big.png",
  "https://rdeavyxckvkfwjvmxugs.supabase.co/storage/v1/object/public/media/logos/bretts.png",
  "https://rdeavyxckvkfwjvmxugs.supabase.co/storage/v1/object/public/media/logos/brickworks.png",
  "https://rdeavyxckvkfwjvmxugs.supabase.co/storage/v1/object/public/media/logos/Bunnings.png",
  "https://rdeavyxckvkfwjvmxugs.supabase.co/storage/v1/object/public/media/logos/hyne.png",
  "https://rdeavyxckvkfwjvmxugs.supabase.co/storage/v1/object/public/media/logos/james.png",
  "https://rdeavyxckvkfwjvmxugs.supabase.co/storage/v1/object/public/media/logos/mitre.png",
];

// ── Component ─────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      <PublicNav />
      <main className="flex-1">

        {/* ── 1. HERO ─────────────────────────────────────────── */}
        <section className="relative text-white px-4 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://rdeavyxckvkfwjvmxugs.supabase.co/storage/v1/object/public/media/hero%20banner%20desktop.jpg')",
            }}
          />
          <div className="absolute inset-0 bg-[#111A24]/55" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#111A24]/85 via-[#111A24]/55 to-[#111A24]/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111A24]/70 via-transparent to-[#111A24]/25" />

          <div className="relative z-10 max-w-6xl mx-auto min-h-[620px] grid md:grid-cols-[1fr_1fr] gap-10 items-center py-20">
            <div className="py-4 min-w-0">
              <p className="text-[#b67c2c] text-xs font-semibold uppercase tracking-[0.18em] mb-5">
                Independent Advice · Real Results
              </p>
              <h1 className="text-5xl sm:text-6xl font-bold leading-[1.1] mb-5">
                Build Smarter.
                <br />
                <span className="text-amber">Save More.</span>
              </h1>
              <p className="text-white/60 text-sm md:text-base max-w-md mb-8 leading-relaxed">
                Get an independent review of your builder quote and plans to avoid costly
                mistakes and confidently lead the savings on your build.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <a
                  href="#how-it-works"
                  className="inline-flex items-center justify-center gap-2 border border-white/25 hover:border-white/50 hover:bg-white/5 text-white font-semibold px-7 py-3.5 rounded-lg transition-colors text-sm uppercase tracking-[0.14em]"
                >
                  <Play size={13} className="fill-white" />
                  How It Works
                </a>
              </div>
              <div className="flex flex-nowrap items-center justify-start gap-x-3 lg:gap-x-5 text-[10px] sm:text-[11px] text-white/40 border-t border-white/10 pt-5">
                {[
                  "Independent Advice",
                  "30+ Years Experience",
                  "Builder Specialist",
                  "10% Off Materials",
                ].map((t) => (
                  <span key={t} className="flex items-center gap-1 shrink-0 whitespace-nowrap">
                    <Check size={10} className="text-amber shrink-0" />
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end mt-2 md:mt-0">
              <HeroLeadCalculator />
            </div>
          </div>
        </section>

        {/* ── 3. WHY HOMEOWNERS ───────────────────────────────── */}
        <section className="bg-white pt-10 pb-16 px-4">
          <div className="max-w-5xl mx-auto text-center">
            <div className="relative overflow-hidden mb-8 py-3">
              <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-white to-transparent z-10" />
              <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-white to-transparent z-10" />
              <div className="logo-marquee-track">
                {[...PARTNER_LOGOS, ...PARTNER_LOGOS].map((logo, index) => (
                  <div key={`${logo}-${index}`} className="logo-marquee-item">
                    <img src={logo} alt="Partner logo" className="h-8 sm:h-10 w-auto object-contain opacity-80" />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 max-w-3xl mx-auto rounded-2xl border border-[#e7dcc8] bg-gradient-to-br from-[#faf9f7] to-[#fff] px-6 py-6 md:px-8 md:flex md:items-center md:gap-8 text-left shadow-[0_8px_30px_rgba(17,26,36,0.06)]">
              <div className="flex-1 min-w-0">
                <p className="text-[#b67c2c] text-xs font-semibold uppercase tracking-[0.16em] mb-1.5">
                  Client benefit
                </p>
                <h3 className="text-xl md:text-2xl font-bold text-[#111A24] leading-tight mb-2">
                  Up to 10% off material purchases
                </h3>
                <p className="text-sm text-[#4b5564] leading-relaxed">
                  Eligible clients can access savings on materials through trusted supplier partners —
                  including brands shown above. Available on select advisory packages and the Owner Builder Program.
                </p>
                <p className="text-[11px] text-[#9ca3af] mt-2 leading-relaxed">
                  Discount varies by supplier and product. Terms and eligibility apply.
                </p>
              </div>
              <Link
                href="/services/owner-builder-program"
                className="inline-flex items-center justify-center gap-1.5 mt-5 md:mt-0 shrink-0 text-sm font-semibold text-[#111A24] hover:text-[#b67c2c] transition-colors"
              >
                Learn more <ArrowRight size={14} />
              </Link>
            </div>

            <p className="text-[#b67c2c] text-xs font-semibold uppercase tracking-[0.18em] mb-3 mt-14">Why Homeowners Work With Eduardo</p>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight text-[#111A24] mb-3">Because building mistakes are expensive.</h2>
            <p className="text-sm md:text-base text-gray-500 mb-10 max-w-lg mx-auto leading-relaxed">
              Most homeowners don&apos;t know what they don&apos;t know. Eduardo bridges the gap between
              you and your builder — so you protect your budget, timeline, and sanity.
            </p>
            <div className="hidden md:flex items-start justify-between">
              {([
                { icon: DollarSign, label: "Overpay" },
                { icon: AlertTriangle, label: "Miss contract risks" },
                { icon: FileText, label: "Approve unnecessary variations" },
                { icon: Layers, label: "Select the wrong materials" },
                { icon: Clock, label: "Experience delays" },
                { icon: TrendingDown, label: "Blow the budget" },
              ] as const).map((p) => (
                <div
                  key={p.label}
                  className="flex-1 px-4 border-r border-[#ddc9a8] last:border-r-0 flex flex-col items-center gap-3"
                >
                  <p.icon size={34} strokeWidth={1.8} className="text-[#b67c2c]" />
                  <p className={`${TYPO.iconLabel} text-[#111A24] text-center`}>{p.label}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 md:hidden">
              {([
                { icon: DollarSign, label: "Overpay" },
                { icon: AlertTriangle, label: "Miss contract risks" },
                { icon: FileText, label: "Approve unnecessary variations" },
                { icon: Layers, label: "Select the wrong materials" },
                { icon: Clock, label: "Experience delays" },
                { icon: TrendingDown, label: "Blow the budget" },
              ] as const).map((p) => (
                <div key={p.label} className="flex flex-col items-center gap-2">
                  <p.icon size={30} strokeWidth={1.8} className="text-[#b67c2c]" />
                  <p className="text-sm font-semibold text-[#111A24] text-center leading-tight">{p.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 4. OUR SERVICES ─────────────────────────────────── */}
        <section className="bg-[#111A24] py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-bold leading-tight text-white">Our Services</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
                    <h3 className="font-semibold text-white text-lg leading-snug mb-2 group-hover:text-amber transition-colors">{s.title}</h3>
                    <p className="text-sm text-white/50 leading-relaxed mb-4">{s.description}</p>
                    <p className="text-amber text-sm font-semibold flex items-center gap-1">
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
              <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-4">
                Although the advice gap is very real, it&apos;s easy to overpay and lose time
                and money on problems that could have been avoided with the right guidance.
              </p>
              <p className="text-gray-500 text-sm md:text-base leading-relaxed mb-8">
                You&apos;re here to look at the guide from your side of the table.
              </p>
              <div className="pl-4 border-l-2 border-[#b67c2c]/40 mb-8">
                <p className="text-[#111A24] text-xl font-semibold italic" style={{ fontFamily: "Georgia, serif" }}>
                  Eduardo Mendes
                </p>
                <p className="text-sm text-gray-400 mt-1">Independent Construction Advisor · 30+ Years Experience</p>
              </div>
            </div>

            {/* Right: Eduardo photo */}
            <div className="relative bg-[#111A24] min-h-[420px] flex items-center justify-center overflow-hidden">
              <img
                src={EDUARDO_PORTRAIT_URL}
                alt="Eduardo Mendes"
                className="absolute inset-0 w-full h-full object-cover object-top scale-[0.92]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111A24]/35 via-transparent to-[#111A24]/20" />
            </div>
          </div>
        </section>

        {/* ── 6. HOW IT WORKS ─────────────────────────────────── */}
        <section id="how-it-works" className="bg-[#F8F9FA] py-20 px-4 scroll-mt-16">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold leading-tight text-[#111A24]">How It Works</h2>
              <div className="w-12 h-[2px] bg-[#b67c2c] mx-auto mt-3" />
            </div>

            <div className="hidden md:flex items-start justify-center">
              {HOW_IT_WORKS.map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={step.step} className="flex items-start">
                    <div className="w-[210px] text-center px-3">
                      <div className="relative w-28 h-28 mx-auto mb-4 rounded-full border border-[#e7dfd2] bg-white flex items-center justify-center">
                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-[#b67c2c] text-white text-sm font-bold flex items-center justify-center">
                          {step.step}
                        </span>
                        <Icon size={38} strokeWidth={1.7} className="text-[#2b3d55]" />
                      </div>
                      <h3 className={`${TYPO.cardTitle} text-[#111A24] mb-2`}>{step.title}</h3>
                      <p className={TYPO.cardBody}>{step.description}</p>
                    </div>

                    {i < HOW_IT_WORKS.length - 1 && (
                      <div className="w-8 pt-10 text-[#b67c2c] text-4xl leading-none text-center">›</div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:hidden">
              {HOW_IT_WORKS.map((step) => {
                const Icon = step.icon;
                return (
                  <div key={step.step} className="text-center px-2">
                    <div className="relative w-24 h-24 mx-auto mb-3 rounded-full border border-[#e7dfd2] bg-white flex items-center justify-center">
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-[#b67c2c] text-white text-sm font-bold flex items-center justify-center">
                        {step.step}
                      </span>
                      <Icon size={34} strokeWidth={1.7} className="text-[#2b3d55]" />
                    </div>
                    <h3 className={`${TYPO.cardTitle} text-[#111A24] mb-1.5`}>{step.title}</h3>
                    <p className={TYPO.cardBody}>{step.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 7. WHAT WE REVIEW ───────────────────────────────── */}
        <section className="bg-[#f6f5f3] py-20 px-4">
          <div className="max-w-6xl mx-auto space-y-4">
            <div className="rounded-2xl border border-[#e8e2d9] bg-[#f8f7f4] p-6 md:p-7">
              <h2 className="text-[#111A24] text-xl md:text-2xl font-bold uppercase tracking-[0.03em] mb-5">What We Review</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {REVIEW_ITEMS.map((r) => {
                  const Icon = r.icon;
                  return (
                    <div key={r.label} className="bg-white border border-[#ece6dc] rounded-xl p-4 text-left">
                      <div className="w-10 h-10 rounded-lg bg-[#fbf8f1] border border-[#eee5d7] flex items-center justify-center mb-3">
                        <Icon size={22} className="text-[#b67c2c]" strokeWidth={1.8} />
                      </div>
                      <p className="text-[#111A24] text-[15px] font-semibold leading-tight mb-2">{r.label}</p>
                      <p className="text-xs text-gray-500 leading-relaxed">{r.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-4">
              <div className="relative rounded-2xl border border-[#e8e2d9] bg-[#f8f7f4] p-6 md:p-7 overflow-hidden min-h-[320px]">
                <h3 className="text-[#111A24] text-xl md:text-2xl font-bold uppercase tracking-[0.03em] mb-5">The Most Common Mistakes We Find</h3>
                <div className="space-y-3 mb-7 max-w-[360px] relative z-10">
                  {COMMON_ISSUES.map((issue) => (
                    <div key={issue} className="flex items-start gap-2.5">
                      <XCircle size={16} className="text-[#d93838] shrink-0 mt-0.5" />
                      <p className="text-[15px] text-[#2f3845] leading-tight">{issue}</p>
                    </div>
                  ))}
                </div>
                <UploadQuoteButton
                  size="compact"
                  label="Upload Your Builder Quote"
                  showArrow={false}
                  className="relative z-10"
                />

                <div className="hidden md:block absolute -right-10 -bottom-6 w-[270px] h-[320px] rotate-[13deg] rounded-xl border border-[#e4ddd0] bg-white shadow-md" />
                <div className="hidden md:block absolute right-4 bottom-5 w-[235px] h-[300px] rounded-xl border border-[#e4ddd0] bg-white shadow-lg overflow-hidden">
                  <img
                    src="https://rdeavyxckvkfwjvmxugs.supabase.co/storage/v1/object/public/media/img2.jpg"
                    alt="Build checklist mockup"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-[#e8e2d9] bg-[#f8f7f4] p-6 md:p-7">
                <h3 className="text-[#111A24] text-xl md:text-2xl font-bold uppercase tracking-[0.03em] mb-5">Who We Help</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {WHO_WE_HELP.map((w) => (
                    <div key={w.label} className="relative rounded-xl overflow-hidden aspect-[4/3] border border-[#e3ddd3]">
                      <img src={w.image} alt={w.label} className="absolute inset-0 w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111A24]/75 via-[#111A24]/20 to-transparent" />
                      <p className="absolute bottom-2.5 left-2.5 right-2.5 text-white text-xs md:text-sm font-semibold leading-tight">
                        {w.label}
                      </p>
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
              <p className="text-[#b67c2c] text-xs font-semibold uppercase tracking-[0.18em] mb-3">What Our Clients Say</p>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight text-[#111A24]">Trusted by Queensland homeowners</h2>
            </div>
            <div className="grid sm:grid-cols-3 gap-6">
              {TESTIMONIALS.map((t) => (
                <div key={t.name} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                  <div className="flex items-center gap-0.5 mb-4">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <Star key={i} size={13} className="fill-amber text-amber" />
                    ))}
                  </div>
                  <p className="text-sm md:text-base text-gray-600 leading-relaxed italic mb-5">&ldquo;{t.quote}&rdquo;</p>
                  <p className="text-sm font-semibold text-[#111A24]">{t.name}</p>
                  <p className="text-sm text-gray-400">{t.location}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 9. CTA STRIP ────────────────────────────────────── */}
        <section className="bg-[#b67c2c] py-14 px-4">
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-8">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight text-white mb-2">Ready to Build Smarter?</h2>
              <p className="text-white/70 text-sm md:text-base max-w-lg leading-relaxed">
                Upload your builder quote and get an independent expert assessment. No risk, no obligation.
              </p>
            </div>
            <UploadQuoteButton
              label="Let's Get Started"
              variant="cta-outline"
              size="large"
              showUploadIcon={false}
            />
          </div>
        </section>

        {/* ── 10. FAQ ─────────────────────────────────────────── */}
        <section className="bg-white py-20 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <p className="text-[#b67c2c] text-xs font-semibold uppercase tracking-[0.18em] mb-3">Frequently Asked Questions</p>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight text-[#111A24]">Common questions</h2>
            </div>
            <div className="space-y-4">
              {FAQS.map((faq) => (
                <details key={faq.q} className="group bg-[#F8F9FA] rounded-xl border border-gray-100 px-6 py-4">
                  <summary className="list-none cursor-pointer flex items-center justify-between gap-4">
                    <p className="font-semibold text-[#111A24] text-base leading-snug">{faq.q}</p>
                    <span className="text-[#b67c2c] text-xl leading-none transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="text-sm md:text-base text-gray-500 leading-relaxed mt-3">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* ── 11. FINAL CTA STRIP ──────────────────────────────── */}
        <section className="bg-[#0e1722]">
          <div className="relative min-h-[230px] overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=2000&q=80"
              alt="Modern home interior"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#071424]/95 via-[#071424]/85 to-[#071424]/30" />

            <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 md:py-14 text-white">
              <p className="text-[#b67c2c] text-xs font-semibold uppercase tracking-[0.18em] mb-4">Real Advice. Real Results.</p>
              <blockquote className="text-xl md:text-2xl font-medium italic leading-snug max-w-2xl mb-4" style={{ fontFamily: "Georgia, serif" }}>
                &ldquo;Independent guidance that helps you protect your budget and build with confidence.&rdquo;
              </blockquote>
              <p className="text-[#b67c2c] text-base font-semibold">Eduardo Mendes Advisory</p>
            </div>
          </div>

          <div className="bg-white border-t border-[#d9dee5]">
            <div className="max-w-6xl mx-auto px-6 py-9 grid md:grid-cols-[1fr_auto] gap-8 items-center">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 rounded-full border border-[#b67c2c] flex items-center justify-center shrink-0">
                  <Home size={34} strokeWidth={1.6} className="text-[#2a3a4f]" />
                </div>
                <div>
                  <p className="text-[#111A24] text-2xl md:text-[30px] leading-tight font-medium">Protect your budget.</p>
                  <p className="text-[#111A24] text-2xl md:text-[30px] leading-tight font-medium">Make better decisions.</p>
                  <p className="text-[#111A24] text-2xl md:text-[30px] leading-tight font-medium">Build with confidence.</p>
                </div>
              </div>

              <div className="md:border-l border-[#d9dee5] md:pl-9">
                <UploadQuoteButton
                  size="large"
                  label="Upload Your Builder Quote"
                  showArrow={false}
                  className="w-full sm:w-auto"
                />
                <p className="text-[#3a4350] text-base mt-3 text-center">Secure. Private. No obligation.</p>
              </div>
            </div>
          </div>
        </section>

      </main>
      <PublicFooter />
    </>
  );
}
