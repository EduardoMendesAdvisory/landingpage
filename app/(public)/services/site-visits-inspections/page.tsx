import { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  CalendarCheck2,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  FileSearch,
  MessageCircle,
  Target,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Site Visits & Inspections",
  description: "Professional site inspections at critical construction milestones.",
};

const INSPECTION_TOPICS = [
  {
    stage: "Slab / Footing",
    body: "Verify footings, reinforcement, and concrete work before slab is poured.",
  },
  {
    stage: "Frame Inspection",
    body: "Check structural framing, bracing, tie-downs, and compliance with approved plans.",
  },
  {
    stage: "Lock-up / Pre-Lock-up",
    body: "Review external cladding, windows, doors, and weatherproofing.",
  },
  {
    stage: "Fit-out / Fix",
    body: "Inspect internal fit-out, fixtures, joinery, and finishes quality.",
  },
  {
    stage: "Pre-Handover",
    body: "Comprehensive defect inspection before you accept the keys.",
  },
  {
    stage: "Progress Claim",
    body: "Verify work claimed in builder progress invoices is actually complete.",
  },
];

const PROCESS_STEPS = [
  {
    step: 1,
    icon: MessageCircle,
    title: "Book Your Visit",
    description: "Choose your stage and preferred date for inspection.",
  },
  {
    step: 2,
    icon: FileSearch,
    title: "On-Site Inspection",
    description: "We inspect workmanship, compliance, and progress on site.",
  },
  {
    step: 3,
    icon: ClipboardList,
    title: "Photo Report",
    description: "You receive clear findings with annotated photos.",
  },
  {
    step: 4,
    icon: AlertTriangle,
    title: "Advice & Next Steps",
    description: "We explain risks and practical actions to stay in control.",
  },
  {
    step: 5,
    icon: Target,
    title: "Build With Confidence",
    description: "Make informed decisions before issues become costly.",
  },
];

export default function SiteVisitsPage() {
  return (
    <div className="bg-white">
      <section className="bg-white overflow-hidden border-b border-[#ece8e1] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 min-h-[620px] items-center">
          <div className="py-16 md:py-20 max-w-xl">
            <p className="text-[#b67c2c] text-xs font-semibold uppercase tracking-[0.18em] mb-5">
              Site Visits & Inspections
            </p>

            <h1 className="text-5xl sm:text-6xl font-bold leading-[1.1] text-[#111A24] mb-5">
              Be On Site.
              <br />
              Not Just On Paper.
            </h1>

            <p className="text-[#4b5564] text-sm md:text-base max-w-md mb-8 leading-relaxed">
              Regular site visits and inspections help catch issues early before they become expensive problems.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link
                href="/book-call"
                className="inline-flex items-center justify-center bg-[#b67c2c] hover:bg-[#9f6c27] text-white font-semibold px-7 py-3.5 rounded-lg text-sm uppercase tracking-[0.14em] transition-colors"
              >
                Book a Site Visit
              </Link>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-[#4b5564]/80 border-t border-[#ddd8cc] pt-5">
              {[
                "Independent Eyes On Site",
                "Detailed Reports & Photos",
                "Protect Your Time & Budget",
              ].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 size={11} className="text-[#b67c2c] shrink-0" />
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="relative min-h-[420px] lg:min-h-[620px] w-full">
            <img
              src="https://rdeavyxckvkfwjvmxugs.supabase.co/storage/v1/object/public/media/img%20site.png"
              alt="Site inspection at active construction project"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-[#111A24]/10" />
          </div>
        </div>
      </section>

      <section className="bg-[#071424] text-white px-4 py-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[280px_1fr] gap-8 items-center">
          <div className="relative rounded-xl overflow-hidden border border-white/10 min-h-[240px]">
            <img
              src="https://rdeavyxckvkfwjvmxugs.supabase.co/storage/v1/object/public/media/Construction.png"
              alt="Independent construction inspection in progress"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-10">
            <div className="pr-2 md:border-r md:border-white/20">
              <p className="text-[#b67c2c] text-xs font-semibold uppercase tracking-[0.18em] mb-3">Why Site Visits Matter</p>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
                You can&apos;t manage what you don&apos;t see.
              </h2>
              <p className="text-white/70 text-sm leading-relaxed">
                Builders are focused on delivery. We work for you, giving independent visibility so you can make confident decisions at every stage.
              </p>
            </div>

            <div className="space-y-2.5">
              {[
                "Independent eyes on your project",
                "Ensure work is on track and up to standard",
                "Identify defects and non-compliance early",
                "Check workmanship and materials",
                "Monitor progress claims and site progress",
                "Give you confidence at every stage",
              ].map((point) => (
                <div key={point} className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-[#b67c2c] mt-0.5 shrink-0" />
                  <p className="text-sm text-white/85 leading-snug">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-[#111A24]">What We Inspect</h2>
            <div className="w-14 h-[2px] bg-[#b67c2c] mx-auto mt-3" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {INSPECTION_TOPICS.map((item) => (
              <div key={item.stage} className="bg-white border border-[#e7e1d8] rounded-xl p-5">
                <p className="text-sm font-semibold text-[#111A24] mb-2">{item.stage}</p>
                <p className="text-sm text-[#4b5564] leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 px-4 bg-[#f6f5f3]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-[#111A24]">Our Inspection Process</h2>
            <div className="w-14 h-[2px] bg-[#b67c2c] mx-auto mt-3" />
          </div>

          <div className="hidden md:flex items-start justify-between">
            {PROCESS_STEPS.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="flex items-start">
                  <div className="w-[190px] text-center px-2">
                    <div className="relative w-20 h-20 mx-auto mb-4 rounded-full border border-[#ddd8cc] bg-white flex items-center justify-center">
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-[#b67c2c] text-white text-sm font-bold flex items-center justify-center">
                        {item.step}
                      </span>
                      <Icon size={32} className="text-[#4a5565]" strokeWidth={1.8} />
                    </div>
                    <p className="text-base font-semibold text-[#111A24] mb-2 leading-tight">{item.title}</p>
                    <p className="text-sm text-[#4b5564] leading-snug">{item.description}</p>
                  </div>
                  {index < PROCESS_STEPS.length - 1 && (
                    <div className="w-8 pt-8 text-[#b67c2c] flex justify-center">
                      <ChevronRight size={22} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:hidden">
            {PROCESS_STEPS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="text-center">
                  <div className="relative w-20 h-20 mx-auto mb-4 rounded-full border border-[#ddd8cc] bg-white flex items-center justify-center">
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-[#b67c2c] text-white text-sm font-bold flex items-center justify-center">
                      {item.step}
                    </span>
                    <Icon size={32} className="text-[#4a5565]" strokeWidth={1.8} />
                  </div>
                  <p className="text-base font-semibold text-[#111A24] mb-2 leading-tight">{item.title}</p>
                  <p className="text-sm text-[#4b5564] leading-snug">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#0e1722]">
        <div className="relative min-h-[240px] overflow-hidden">
          <img
            src="https://rdeavyxckvkfwjvmxugs.supabase.co/storage/v1/object/public/media/img%20site.png"
            alt="Construction site monitored with independent inspections"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071424]/95 via-[#071424]/85 to-[#071424]/30" />

          <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 md:py-14 text-white">
            <p className="text-[#b67c2c] text-xs font-semibold uppercase tracking-[0.18em] mb-4">Peace Of Mind On Site.</p>
            <blockquote className="text-xl md:text-2xl font-medium italic leading-snug max-w-2xl mb-4" style={{ fontFamily: "Georgia, serif" }}>
              &ldquo;Regular inspections today prevent costly problems tomorrow. Stay informed, stay in control, and build with confidence.&rdquo;
            </blockquote>
            <p className="text-[#b67c2c] text-base font-semibold">Eduardo Mendes Advisory</p>
          </div>
        </div>
      </section>

      <section className="bg-white py-8 px-4 border-b border-[#e8e3da]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-[1fr_auto] gap-6 items-center">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full border border-[#b67c2c] flex items-center justify-center shrink-0">
              <CalendarCheck2 size={28} className="text-[#b67c2c]" strokeWidth={1.7} />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-[#111A24] leading-tight">Book Independent Site Oversight</h3>
              <p className="text-[#4b5564] mt-1 text-sm md:text-base leading-relaxed">
                Get practical, stage-by-stage inspection support to protect your quality, timeline, and budget.
              </p>
            </div>
          </div>
          <div className="text-center md:text-right">
            <Link
              href="/book-call"
              className="inline-flex items-center justify-center gap-2 bg-[#b67c2c] hover:bg-[#9f6c27] text-white font-semibold px-6 py-3 rounded-lg text-sm uppercase tracking-[0.12em] transition-colors min-w-[320px]"
            >
              Book a Site Visit
            </Link>
            <p className="text-[#4b5564] text-sm mt-2">or call 0419 112 555</p>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="space-y-5">
              <h2 className="text-2xl font-bold text-navy">What&apos;s included</h2>
              <ul className="space-y-3">
                {INSPECTION_TOPICS.map((item) => (
                  <li key={item.stage} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="text-warm-soil font-bold mt-0.5 shrink-0">✓</span>
                    {item.stage}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-5">
              <h2 className="text-2xl font-bold text-navy">Best for</h2>
              <ul className="space-y-3">
                {[
                  "Homeowners building a new house",
                  "Renovations with milestone progress payments",
                  "Owner builders wanting independent quality checks",
                  "Anyone needing trusted inspection reports before handover",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="text-navy font-bold mt-0.5 shrink-0">→</span>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="bg-light-bg rounded-2xl p-6 mt-4">
                <p className="text-sm font-semibold text-navy mb-1">Starting from</p>
                <p className="text-3xl font-bold text-navy">$350</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Includes a free 15-minute intro call
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
