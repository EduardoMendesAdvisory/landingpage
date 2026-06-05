import { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  Calculator,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Clock3,
  FileSearch,
  ListChecks,
  MessageCircle,
  ShieldAlert,
  Target,
} from "lucide-react";
import { BookConsultationLink } from "@/components/shared/BookConsultationLink";
import { ServiceConsultationCard } from "@/components/shared/ServiceConsultationCard";

export const metadata: Metadata = {
  title: "Pre-Construction Advisory",
  description:
    "Expert guidance through design, approvals, and builder selection before you commit to anything.",
};

const WHY_POINTS = [
  "Understand the true cost of your project",
  "Choose the right builder and contract",
  "Clarify scope, inclusions and exclusions",
  "Identify risks and potential delays",
  "Set realistic budgets and timelines",
  "Start your build with confidence",
];

const PROCESS_STEPS = [
  { step: 1, icon: MessageCircle, title: "Initial Consultation", description: "We discuss your project, goals and key concerns." },
  { step: 2, icon: FileSearch, title: "Document Review", description: "We review plans, quotes, contracts and site information." },
  { step: 3, icon: AlertTriangle, title: "Risk & Opportunity Analysis", description: "We identify risks, gaps and cost saving opportunities." },
  { step: 4, icon: ClipboardList, title: "Recommendations Report", description: "You receive clear advice and practical recommendations." },
  { step: 5, icon: Target, title: "Plan With Confidence", description: "Make informed decisions and move forward with clarity." },
];

const HELP_CARDS = [
  { icon: Calculator, title: "Budget Planning", description: "Understand real costs and allowances." },
  { icon: FileSearch, title: "Contract Review", description: "Ensure terms protect your interests." },
  { icon: ListChecks, title: "Scope & Inclusions", description: "Clarify what's included and what's not." },
  { icon: ShieldAlert, title: "Builder Comparison", description: "Compare quotes like-for-like." },
  { icon: Clock3, title: "Program & Timeline", description: "Set realistic timelines and milestones." },
  { icon: AlertTriangle, title: "Risk Management", description: "Identify and reduce potential risks." },
];

export default function PreConstructionAdvisoryPage() {
  return (
    <div className="bg-white">
      <section className="bg-white overflow-hidden border-b border-[#ece8e1] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 min-h-[620px] items-center">
          <div className="py-16 md:py-20 max-w-xl">
            <p className="text-[#b67c2c] text-xs font-semibold uppercase tracking-[0.18em] mb-5">
              Pre-Construction Advisory
            </p>

            <h1 className="text-5xl sm:text-6xl font-bold leading-[1.1] text-[#111A24] mb-5">
              Plan With Confidence.
              <br />
              Build With Clarity.
            </h1>

            <p className="text-[#4b5564] text-sm md:text-base max-w-md mb-8 leading-relaxed">
              Make better decisions before you commit on site. Get independent guidance early to protect your budget and timeline.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <BookConsultationLink service="pre-construction-advisory" />
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-[#4b5564]/80 border-t border-[#ddd8cc] pt-5">
              {[
                "Independent Advice",
                "30+ Years Experience",
                "Build With Confidence",
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
              src="https://rdeavyxckvkfwjvmxugs.supabase.co/storage/v1/object/public/media/img.3.png"
              alt="Pre-construction advisory hero"
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
              src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80"
              alt="Early-stage project planning and advisory discussion"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-8 md:gap-10">
            <div className="pr-2 md:border-r md:border-white/20">
              <p className="text-[#b67c2c] text-xs font-semibold uppercase tracking-[0.18em] mb-3">Why It Matters</p>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
                The right advice upfront prevents expensive problems later.
              </h2>
              <p className="text-white/70 text-sm leading-relaxed">
                Most issues in a build come from decisions made too late. We help
                you make informed choices early, when changes are easier and cost
                far less.
              </p>
            </div>

            <div className="space-y-2.5">
              {WHY_POINTS.map((point) => (
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
            <h2 className="text-3xl md:text-4xl font-bold text-[#111A24]">Our Pre-Construction Advisory Process</h2>
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

      <section className="bg-[#f6f5f3] py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[#111A24]">What We Help You With</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {HELP_CARDS.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="bg-white border border-[#e7e1d8] rounded-xl p-4 text-center">
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

      <section className="bg-[#0e1722]">
        <div className="relative min-h-[240px] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=2000&q=80"
            alt="Pre-construction planning and project review"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071424]/95 via-[#071424]/85 to-[#071424]/30" />

          <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 md:py-14 text-white">
            <p className="text-[#b67c2c] text-xs font-semibold uppercase tracking-[0.18em] mb-4">Pre-Construction Clarity.</p>
            <blockquote className="text-xl md:text-2xl font-medium italic leading-snug max-w-2xl mb-4" style={{ fontFamily: "Georgia, serif" }}>
              &ldquo;Independent pre-construction guidance to reduce risk, protect your budget, and move into site works with confidence.&rdquo;
            </blockquote>
            <p className="text-[#b67c2c] text-base font-semibold">Eduardo Mendes Advisory</p>
          </div>
        </div>
      </section>

      <section className="bg-white py-8 px-4 border-b border-[#e8e3da]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-[1fr_auto] gap-6 items-center">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full border border-[#b67c2c] flex items-center justify-center shrink-0">
              <ShieldAlert size={28} className="text-[#b67c2c]" strokeWidth={1.7} />
            </div>
            <div>
              <h3 className="text-2xl md:text-3xl font-bold text-[#111A24] leading-tight">Start Your Project the Right Way</h3>
              <p className="text-[#4b5564] mt-1 text-sm md:text-base leading-relaxed">
                Get independent pre-construction advice and set your project up for success from day one.
              </p>
            </div>
          </div>
          <div className="text-center md:text-right">
            <BookConsultationLink
              service="pre-construction-advisory"
              className="min-w-[320px] px-6 py-3 tracking-[0.12em]"
            />
          </div>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="space-y-5">
              <h2 className="text-2xl font-bold text-navy">What&apos;s included</h2>
              <ul className="space-y-3">
                {[
                  "Design review and constructability assessment",
                  "Builder selection criteria and shortlist support",
                  "Tender document preparation and analysis",
                  "Quote comparison and scope gap analysis",
                  "Contract negotiation guidance",
                  "Risk identification and mitigation strategies",
                  "Budget validation and contingency planning",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="text-warm-soil font-bold mt-0.5 shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-5">
              <h2 className="text-2xl font-bold text-navy">Best for</h2>
              <ul className="space-y-3">
                {[
                  "New home builds in design or approval stage",
                  "Major renovations before tender",
                  "Owner builders preparing for construction",
                  "Anyone who has received builder quotes and is unsure",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="text-navy font-bold mt-0.5 shrink-0">→</span>
                    {item}
                  </li>
                ))}
              </ul>

              <ServiceConsultationCard service="pre-construction-advisory" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
