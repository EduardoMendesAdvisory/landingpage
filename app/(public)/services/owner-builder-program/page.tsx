import { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2,
  ClipboardList,
  FileCheck2,
  GraduationCap,
  ShieldCheck,
  Target,
  Wrench,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Owner Builder Program",
  description:
    "Complete end-to-end advisory support for owner builders from concept to completion.",
};

const PROMISE_POINTS = [
  "Save on builder margin and increase your budget control",
  "Make decisions with expert support",
  "Stay compliant and meet your obligations",
  "Build with confidence, not guesswork",
];

const PROGRAM_FEATURES = [
  {
    icon: GraduationCap,
    title: "Education & Training",
    description: "Understand the process, your responsibilities and how to avoid common pitfalls.",
  },
  {
    icon: ClipboardList,
    title: "Planning Support",
    description: "Get help reviewing plans, quotes, contracts and approvals before you commit.",
  },
  {
    icon: CheckCircle2,
    title: "Ongoing Advisory",
    description: "Access expert advice when you need it most throughout your build.",
  },
  {
    icon: ShieldCheck,
    title: "Compliance Guidance",
    description: "Stay on the right side of QBCC requirements and building regulations.",
  },
  {
    icon: Wrench,
    title: "Practical Resources",
    description: "Templates, checklists and tools to keep your project on track.",
  },
];

const JOURNEY_STEPS = [
  {
    step: "01",
    title: "Enrol & Get Started",
    description: "We set you up with the right information and practical resources.",
  },
  {
    step: "02",
    title: "Plan With Confidence",
    description: "Review, prepare and make informed decisions before site works.",
  },
  {
    step: "03",
    title: "Build With Support",
    description: "We answer questions, solve problems and guide key decisions.",
  },
  {
    step: "04",
    title: "Complete With Confidence",
    description: "Finish your build knowing everything is done right.",
  },
];

export default function OwnerBuilderProgramPage() {
  return (
    <div className="bg-white">
      <section className="bg-white overflow-hidden border-b border-[#ece8e1] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 min-h-[620px] items-center">
          <div className="py-16 md:py-20 max-w-xl">
            <p className="text-[#b67c2c] text-xs font-semibold uppercase tracking-[0.18em] mb-5">
              Owner Builder Program
            </p>
            <h1 className="text-5xl sm:text-6xl font-bold leading-[1.1] text-[#111A24] mb-5">
              Build Your Way.
              <br />
              We Guide You.
            </h1>
            <p className="text-[#4b5564] text-sm md:text-base max-w-md mb-8 leading-relaxed">
              The Owner Builder path can save you thousands, but it comes with real responsibility.
              Our program gives you expert guidance, tools and ongoing support from start to finish.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link
                href="/book-call"
                className="inline-flex items-center justify-center bg-[#b67c2c] hover:bg-[#9f6c27] text-white font-semibold px-7 py-3.5 rounded-lg text-sm uppercase tracking-[0.14em] transition-colors"
              >
                Explore The Program
              </Link>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-[#4b5564]/80 border-t border-[#ddd8cc] pt-5">
              {["Independent Advice", "Compliance Support", "Build With Confidence"].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 size={11} className="text-[#b67c2c] shrink-0" />
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="relative min-h-[420px] lg:min-h-[620px] w-full">
            <img
              src="https://rdeavyxckvkfwjvmxugs.supabase.co/storage/v1/object/public/media/img%20owner.png"
              alt="Owner builder program hero"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-[#111A24]/10" />
          </div>
        </div>
      </section>

      <section className="bg-[#071424] text-white px-4 py-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
          <div>
            <p className="text-[#b67c2c] text-xs font-semibold uppercase tracking-[0.18em] mb-3">Our Promise</p>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
              You&apos;re never on your own.
            </h2>
            <p className="text-white/70 text-sm leading-relaxed max-w-xl">
              From planning to practical completion, we&apos;re by your side with
              real-world advice and straightforward guidance every step of the way.
            </p>
          </div>

          <div className="border border-[#8a6a35] rounded-xl p-6 md:p-7">
            <h3 className="text-2xl font-bold mb-4">The Owner Builder Advantage</h3>
            <div className="space-y-3">
              {PROMISE_POINTS.map((point) => (
                <div key={point} className="flex items-start gap-2.5">
                  <span className="mt-2 w-5 h-[2px] bg-[#b67c2c] shrink-0" />
                  <p className="text-sm text-white/85 leading-snug">{point}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#f6f5f3] py-14 px-4 border-b border-[#e8e3da]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-[#b67c2c] text-xs font-semibold uppercase tracking-[0.18em] mb-2">What&apos;s Included</p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#111A24]">A Complete Program. Real Support.</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {PROGRAM_FEATURES.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="bg-white border border-[#e7e1d8] rounded-xl p-5 text-center">
                  <div className="w-11 h-11 rounded-lg border border-[#ebe2d6] bg-[#fbf8f1] mx-auto flex items-center justify-center mb-3">
                    <Icon size={22} className="text-[#b67c2c]" strokeWidth={1.8} />
                  </div>
                  <p className="text-[15px] font-semibold text-[#111A24] leading-tight mb-2">{item.title}</p>
                  <p className="text-xs text-[#4b5564] leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-white border-b border-[#e8e3da]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 items-stretch">
          <div className="relative min-h-[260px]">
            <img
              src="https://images.unsplash.com/photo-1600566752355-35792bedcfea?auto=format&fit=crop&w=1600&q=80"
              alt="Owner builder house project"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
          <div className="px-6 py-8 md:py-10">
            <p className="text-[#b67c2c] text-xs font-semibold uppercase tracking-[0.18em] mb-3">Your Journey</p>
            <h3 className="text-3xl md:text-4xl font-bold leading-tight text-[#111A24] mb-6">From Start to Finish</h3>
            <div className="space-y-4">
              {JOURNEY_STEPS.map((item) => (
                <div key={item.step} className="grid grid-cols-[44px_1fr] gap-3">
                  <p className="text-[#b67c2c] text-2xl font-bold leading-none">{item.step}</p>
                  <div>
                    <p className="text-base font-semibold text-[#111A24] leading-tight">{item.title}</p>
                    <p className="text-sm text-[#4b5564] leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0e1722]">
        <div className="relative min-h-[220px] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1600210492493-0946911123ea?auto=format&fit=crop&w=2000&q=80"
            alt="Finished owner builder home interior"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071424]/95 via-[#071424]/85 to-[#071424]/30" />

          <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 md:py-14 text-white">
            <blockquote className="text-xl md:text-2xl font-medium italic leading-snug max-w-2xl mb-4">
              &ldquo;Eduardo&apos;s guidance was crucial to our owner-builder journey. He helped us save money, solve problems early and build with confidence.&rdquo;
            </blockquote>
            <p className="text-[#b67c2c] text-base font-semibold">Chris &amp; Mel, Sunshine Coast</p>
          </div>
        </div>
      </section>

      <section className="bg-white py-8 px-4 border-b border-[#e8e3da]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-[#111A24] leading-tight">Ready to Build Your Way?</h3>
            <p className="text-[#4b5564] mt-1 text-sm md:text-base leading-relaxed">
              Join the Owner Builder Program and get the support you need to build smarter and save more.
            </p>
          </div>
          <div className="text-center md:text-right">
            <Link
              href="/book-call"
              className="inline-flex items-center justify-center gap-2 bg-[#b67c2c] hover:bg-[#9f6c27] text-white font-semibold px-6 py-3 rounded-lg text-sm uppercase tracking-[0.12em] transition-colors min-w-[320px]"
            >
              Explore The Program
            </Link>
            <p className="text-[#4b5564] text-sm mt-2">or call 0419 112 555</p>
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="grid sm:grid-cols-2 gap-8">
            <div>
              <h2 className="text-2xl font-bold text-navy mb-5">
                What&apos;s covered
              </h2>
              <ul className="space-y-3">
                {[
                  "Owner builder permit guidance and requirements",
                  "Subcontractor selection and management",
                  "Builder quote and contract review for all trades",
                  "Project scheduling and sequencing",
                  "Regular site visits and milestone inspections",
                  "Progress claim review and payment management",
                  "Cost control and variation tracking",
                  "Defect management and rectification",
                  "Handover checklist and final inspection",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="text-warm-soil font-bold mt-0.5 shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-5">
              <div className="bg-light-bg rounded-2xl p-6">
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                  Program investment
                </p>
                <p className="text-3xl font-bold text-navy">From $350</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Includes a free 15-minute intro call
                </p>
                <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
                  Most owner builder clients save significantly through better
                  planning, trade decisions and independent oversight.
                </p>
                <Link
                  href="/assessment"
                  className={cn(
                    buttonVariants(),
                    "mt-4 bg-navy hover:bg-navy/90 text-white border-transparent"
                  )}
                >
                  Start With Free Assessment
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
