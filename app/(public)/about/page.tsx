import { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  FileSearch,
  HardHat,
  Home,
  ShieldCheck,
  Star,
  Upload,
  Users,
  Wrench,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About Eduardo Mendes",
  description:
    "Independent construction advisor with 30+ years of experience helping Australian homeowners build smarter and save more.",
};

const TRUST_BADGES = [
  "Independent Advice",
  "30+ Years Experience",
  "Australia-Wide Advisory",
];

const WHY_INDEPENDENT = [
  "No referral fees, kickbacks, or builder commissions",
  "Advice that protects your budget — not someone else's margin",
  "Plain-English guidance you can act on with confidence",
  "Honest assessment — even when the answer is hard to hear",
];

const BRINGS_TO_PROJECT = [
  "Deep understanding of Australian construction contracts and builder practices",
  "Ability to identify hidden risks, overpriced quotes, and missing scope items",
  "Practical, plain-English advice that empowers confident decisions",
  "Experience across new builds, renovations, extensions, and owner builder projects",
];

const TRUST_GRID = [
  "Independent advice you can trust",
  "Straight answers and honest feedback",
  "Clear guidance at every stage",
  "Protect your budget and avoid costly mistakes",
  "Over 30 years of hands-on construction experience",
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

const HOW_IT_WORKS = [
  { step: 1, icon: Upload, title: "Upload Your Builder Quote", description: "Send your quote, plans or documents securely online." },
  { step: 2, icon: FileSearch, title: "Receive Initial Assessment", description: "We review documents and identify key risks and opportunities." },
  { step: 3, icon: Users, title: "Book Expert Review", description: "Discuss findings in detail with Eduardo and get expert advice." },
  { step: 4, icon: ShieldCheck, title: "Build With Confidence", description: "Make informed decisions and move forward with clarity." },
];

const SERVICES = [
  { icon: FileSearch, title: "BuildCheck", href: "/buildcheck" },
  { icon: Building2, title: "Pre-Construction Advisory", href: "/services/pre-construction-advisory" },
  { icon: HardHat, title: "Construction Advisory", href: "/services/construction-advisory" },
  { icon: Wrench, title: "Site Visits & Inspections", href: "/services/site-visits-inspections" },
  { icon: Home, title: "Owner Builder Program", href: "/services/owner-builder-program" },
];

const TESTIMONIALS = [
  {
    quote: "Eduardo's review saved us over $22,000 and helped us avoid a major variation issue later in the build.",
    name: "James & Sarah",
    location: "Brisbane, QLD",
  },
  {
    quote: "The BuildCheck report was incredibly detailed. Eduardo found 4 provisional sums that weren't clearly defined.",
    name: "Michael T.",
    location: "Sydney, NSW",
  },
];

const EDUARDO_HERO =
  "https://rdeavyxckvkfwjvmxugs.supabase.co/storage/v1/object/public/media/eduardo3.png";
const EDUARDO_QUOTE =
  "https://rdeavyxckvkfwjvmxugs.supabase.co/storage/v1/object/public/media/edu%203.png";

export default function AboutPage() {
  return (
    <div className="bg-[#f5f4f1]">
      {/* Hero */}
      <section className="bg-white overflow-hidden border-b border-[#ece8e1] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 min-h-[620px] items-center">
          <div className="py-16 md:py-20 max-w-xl">
            <p className="text-[#b67c2c] text-xs font-semibold uppercase tracking-[0.18em] mb-5">
              About Eduardo
            </p>

            <h1 className="text-5xl sm:text-6xl font-bold leading-[1.1] text-[#111A24] mb-5">
              Independent Advice
              <br />
              You Can Trust.
            </h1>

            <p className="text-[#4b5564] text-sm md:text-base max-w-md mb-8 leading-relaxed">
              Eduardo Mendes is an independent construction advisor with 30+ years of
              experience helping Australian homeowners navigate building, renovating,
              and owner builder projects — with no conflicts of interest.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link
                href="/assessment"
                className="inline-flex items-center justify-center bg-[#b67c2c] hover:bg-[#9f6c27] text-white font-semibold px-7 py-3.5 rounded-lg text-sm uppercase tracking-[0.14em] transition-colors"
              >
                Upload Your Quote
              </Link>
              <Link
                href="/book-call"
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "h-auto px-7 py-3.5 border-[#b67c2c] text-[#b67c2c] hover:bg-[#b67c2c] hover:text-white text-sm uppercase tracking-[0.14em]"
                )}
              >
                Book a Free Call
              </Link>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-[#4b5564]/80 border-t border-[#ddd8cc] pt-5">
              {TRUST_BADGES.map((badge) => (
                <span key={badge} className="flex items-center gap-1.5">
                  <CheckCircle2 size={11} className="text-[#b67c2c] shrink-0" />
                  {badge}
                </span>
              ))}
            </div>
          </div>

          <div className="relative min-h-[420px] lg:min-h-[620px] w-full bg-[#111A24]">
            <img
              src={EDUARDO_HERO}
              alt="Eduardo Mendes — Independent Construction Advisor"
              className="absolute inset-0 w-full h-full object-cover object-top scale-[0.92]"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-[#111A24]/25" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#111A24]/40 via-transparent to-[#111A24]/15" />
          </div>
        </div>
      </section>

      {/* Why independent — dark band */}
      <section className="bg-[#071424] text-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 md:gap-10">
            <div className="pr-2 md:border-r md:border-white/20">
              <p className="text-[#b67c2c] text-xs font-semibold uppercase tracking-[0.18em] mb-3">
                Why It Matters
              </p>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
                Why independent advice matters
              </h2>
              <p className="text-white/70 text-sm leading-relaxed">
                Builders, architects, and real estate agents each have their own
                commercial interests. Eduardo works exclusively for you — the
                homeowner — with no referral fees, kickbacks, or conflicts of interest.
              </p>
            </div>

            <div className="space-y-2.5">
              {WHY_INDEPENDENT.map((point) => (
                <div key={point} className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-[#b67c2c] mt-0.5 shrink-0" />
                  <p className="text-sm text-white/85 leading-snug">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Story + what Eduardo brings */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div>
            <p className="text-[#b67c2c] text-xs font-semibold uppercase tracking-[0.18em] mb-3">
              The Advice Gap
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#111A24] leading-tight mb-5">
              Builders build every day.
              <br />
              Most homeowners build once.
            </h2>
            <p className="text-[#4b5564] text-sm md:text-base leading-relaxed mb-4">
              Although the advice gap is very real, it&apos;s easy to overpay and lose time
              and money on problems that could have been avoided with the right guidance.
            </p>
            <p className="text-[#4b5564] text-sm md:text-base leading-relaxed mb-8">
              Eduardo&apos;s role is simple: to make sure every homeowner has the same level
              of knowledge as the builder sitting across the table from them.
            </p>
            <div className="pl-4 border-l-2 border-[#b67c2c]/40">
              <p
                className="text-[#111A24] text-xl font-semibold italic"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Eduardo Mendes
              </p>
              <p className="text-sm text-[#8a8f98] mt-1">
                Independent Construction Advisor · 30+ Years Experience
              </p>
            </div>
          </div>

          <div>
            <div className="mb-8">
              <h2 className="text-2xl md:text-3xl font-bold text-[#111A24] mb-3">
                What Eduardo brings to your project
              </h2>
              <div className="w-14 h-[2px] bg-[#b67c2c] mb-6" />
              <div className="space-y-3">
                {BRINGS_TO_PROJECT.map((item) => (
                  <div key={item} className="flex items-start gap-2.5">
                    <CheckCircle2 size={16} className="text-[#b67c2c] mt-0.5 shrink-0" />
                    <p className="text-sm text-[#4b5564] leading-relaxed">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {SERVICES.map(({ icon: Icon, title, href }) => (
                <Link
                  key={title}
                  href={href}
                  className="group flex items-center gap-3 border border-[#e7e1d8] rounded-lg px-4 py-3.5 bg-[#faf9f7] hover:border-[#b67c2c]/40 hover:bg-white transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-white border border-[#eee5d7] flex items-center justify-center shrink-0">
                    <Icon size={18} className="text-[#b67c2c]" strokeWidth={1.8} />
                  </div>
                  <span className="text-xs font-semibold text-[#111A24] leading-tight group-hover:text-[#b67c2c] transition-colors">
                    {title}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust grid */}
      <section className="bg-white py-10 px-4 border-y border-[#ece8e1]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[#111A24] mb-3">
              Why Homeowners Work With Eduardo
            </h2>
            <div className="w-14 h-[2px] bg-[#b67c2c] mx-auto" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 text-center">
            {TRUST_GRID.map((item) => (
              <div
                key={item}
                className="border border-[#e7e1d8] rounded-lg px-4 py-4 text-sm text-[#111A24] font-semibold leading-snug bg-[#faf9f7]"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Who we help */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-[#f6f5f3]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[#b67c2c] text-xs font-semibold uppercase tracking-[0.18em] mb-3">
              Who We Help
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#111A24]">
              Homeowners across Australia
            </h2>
            <div className="w-14 h-[2px] bg-[#b67c2c] mx-auto mt-3" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {WHO_WE_HELP.map((item) => (
              <div
                key={item.label}
                className="relative rounded-xl overflow-hidden aspect-[4/3] border border-[#e3ddd3]"
              >
                <img
                  src={item.image}
                  alt={item.label}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111A24]/75 via-[#111A24]/20 to-transparent" />
                <p className="absolute bottom-2.5 left-2.5 right-2.5 text-white text-xs md:text-sm font-semibold leading-tight">
                  {item.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-[#F8F9FA] py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold leading-tight text-[#111A24]">
              How It Works
            </h2>
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
                    <h3 className="text-base font-semibold text-[#111A24] mb-2 leading-tight">
                      {step.title}
                    </h3>
                    <p className="text-sm text-[#3a4350] leading-snug">{step.description}</p>
                  </div>
                  {i < HOW_IT_WORKS.length - 1 && (
                    <div className="w-8 pt-10 text-[#b67c2c] text-4xl leading-none text-center">
                      ›
                    </div>
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
                  <h3 className="text-base font-semibold text-[#111A24] mb-1.5">{step.title}</h3>
                  <p className="text-sm text-[#3a4350] leading-snug">{step.description}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-10">
            <Link
              href="/#how-it-works"
              className="text-sm font-semibold text-[#b67c2c] hover:text-[#9f6c27] inline-flex items-center gap-1.5 transition-colors"
            >
              See full process on homepage
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[#b67c2c] text-xs font-semibold uppercase tracking-[0.18em] mb-3">
              What Our Clients Say
            </p>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight text-[#111A24]">
              Trusted by Australian homeowners
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                className="bg-[#faf9f7] rounded-2xl p-6 border border-[#ece8e1]"
              >
                <div className="flex items-center gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={13} className="fill-amber text-amber" />
                  ))}
                </div>
                <p className="text-sm md:text-base text-[#4b5564] leading-relaxed italic mb-5">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p className="text-sm font-semibold text-[#111A24]">{t.name}</p>
                <p className="text-sm text-[#8a8f98]">{t.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote band */}
      <section className="bg-[#0e1722] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto rounded-xl overflow-hidden grid lg:grid-cols-[300px_1fr]">
          <div className="relative min-h-[220px]">
            <img
              src={EDUARDO_QUOTE}
              alt="Eduardo Mendes"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          <div className="relative px-6 md:px-10 py-10 text-white bg-[#071424]">
            <p className="text-[#b67c2c] text-4xl leading-none mb-4">&ldquo;</p>
            <p className="text-2xl md:text-3xl leading-tight font-medium max-w-2xl mb-6">
              My goal is simple: to make sure every homeowner has the same level of
              knowledge as the builder sitting across the table from them.
            </p>
            <p
              className="text-[#b67c2c] text-3xl leading-none"
              style={{ fontFamily: "cursive" }}
            >
              Eduardo Mendes
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#b67c2c] py-14 px-4 sm:px-6 lg:px-8 mb-8">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight text-white mb-2">
              Ready to Build Smarter?
            </h2>
            <p className="text-white/80 text-sm md:text-base max-w-lg leading-relaxed">
              Upload your builder quote for an independent assessment, or book a free
              strategy call to discuss your project.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href="/assessment"
              className="inline-flex items-center justify-center gap-2 border-2 border-white text-white hover:bg-white hover:text-[#b67c2c] font-semibold px-8 py-3.5 rounded-lg text-sm uppercase tracking-[0.14em] transition-all whitespace-nowrap"
            >
              Upload Your Quote
              <ArrowRight size={15} />
            </Link>
            <Link
              href="/book-call"
              className="inline-flex items-center justify-center bg-[#111A24] hover:bg-[#111A24]/90 text-white font-semibold px-8 py-3.5 rounded-lg text-sm uppercase tracking-[0.14em] transition-colors whitespace-nowrap"
            >
              Book a Free Call
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
