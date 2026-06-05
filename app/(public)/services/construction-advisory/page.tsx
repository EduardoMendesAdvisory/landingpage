import { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  HardHat,
  MessageCircle,
  ShieldAlert,
  Target,
  Wrench,
} from "lucide-react";
import { BookConsultationLink } from "@/components/shared/BookConsultationLink";
import { ServiceConsultationCard } from "@/components/shared/ServiceConsultationCard";

export const metadata: Metadata = {
  title: "Construction Advisory",
  description: "Ongoing expert advisory support throughout your entire construction phase.",
};

const WHY_POINTS = [
  "Independent support when issues arise",
  "Review variations and assess costs",
  "Monitor progress and quality",
  "Help resolve builder or subcontractor disputes",
  "Ensure the work aligns with plans and contract",
  "Protect your budget and timeline",
];

const PROCESS_STEPS = [
  { step: 1, icon: MessageCircle, title: "Initial Consultation", description: "We understand where your project is up to and what support you need." },
  { step: 2, icon: ClipboardList, title: "Project Review", description: "We review contracts, plans, scope and current project status." },
  { step: 3, icon: HardHat, title: "Site Visits & Inspections", description: "We assess progress and identify risks before they become costly." },
  { step: 4, icon: Wrench, title: "Advice & Recommendations", description: "Practical next steps and negotiation guidance for current issues." },
  { step: 5, icon: ShieldAlert, title: "Issue Resolution Support", description: "Support to communicate, negotiate and resolve problems quickly." },
  { step: 6, icon: Target, title: "Project Success", description: "Stay on track, on budget and focused on the best possible outcome." },
];

const HELP_CARDS = [
  { icon: ClipboardList, title: "Variations Assessment", description: "Review and assess variation requests and costs." },
  { icon: HardHat, title: "Site Inspections", description: "Independent inspections and progress reports." },
  { icon: CheckCircle2, title: "Quality Assurance", description: "Ensure work meets required standards and specifications." },
  { icon: MessageCircle, title: "Dispute Support", description: "Advice and support to resolve builder and subcontractor issues." },
  { icon: Target, title: "Program Monitoring", description: "Track progress and identify potential delays early." },
  { icon: AlertTriangle, title: "Budget Protection", description: "Identify cost risks and avoid budget blowouts." },
];

export default function ConstructionAdvisoryPage() {
  return (
    <div className="bg-white">
      <section className="bg-white overflow-hidden border-b border-[#ece8e1] px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 min-h-[620px] items-center">
          <div className="py-16 md:py-20 max-w-xl">
            <p className="text-[#b67c2c] text-xs font-semibold uppercase tracking-[0.18em] mb-5">
              Construction Advisory
            </p>
            <h1 className="text-5xl sm:text-6xl font-bold leading-[1.1] text-[#111A24] mb-5">
              Expert Guidance.
              <br />
              Better Decisions.
            </h1>
            <p className="text-[#4b5564] text-sm md:text-base max-w-md mb-8 leading-relaxed">
              Professional support throughout construction to protect your investment,
              manage risks and keep your project on track.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <BookConsultationLink service="construction-advisory" />
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-[#4b5564]/80 border-t border-[#ddd8cc] pt-5">
              {["Protect Your Investment", "Independent Advice", "Keep Projects On Track"].map((t) => (
                <span key={t} className="flex items-center gap-1.5">
                  <CheckCircle2 size={11} className="text-[#b67c2c] shrink-0" />
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="relative min-h-[420px] lg:min-h-[620px] w-full">
            <img
              src="https://rdeavyxckvkfwjvmxugs.supabase.co/storage/v1/object/public/media/Construction.png"
              alt="Construction advisory hero"
              className="absolute inset-0 w-full h-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-[#111A24]/10" />
          </div>
        </div>
      </section>

      <section className="bg-[#071424] text-white px-4 py-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.1fr_1fr] gap-8 items-center">
          <div className="pr-2 md:border-r md:border-white/20">
            <p className="text-[#b67c2c] text-xs font-semibold uppercase tracking-[0.18em] mb-3">Why It Matters</p>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
              Construction is where good plans meet real challenges.
            </h2>
            <p className="text-white/70 text-sm leading-relaxed max-w-xl">
              Issues, variations and delays can happen on any build. Having an
              experienced advisor on your side helps you respond quickly,
              make informed decisions and avoid costly mistakes.
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
      </section>

      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-[#111A24]">Our Construction Advisory Process</h2>
            <div className="w-14 h-[2px] bg-[#b67c2c] mx-auto mt-3" />
          </div>

          <div className="hidden md:flex items-start justify-between">
            {PROCESS_STEPS.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="flex items-start">
                  <div className="w-[180px] text-center px-2">
                    <div className="relative w-20 h-20 mx-auto mb-4 rounded-full border border-[#ddd8cc] bg-white flex items-center justify-center">
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-[#b67c2c] text-white text-sm font-bold flex items-center justify-center">
                        {item.step}
                      </span>
                      <Icon size={30} className="text-[#4a5565]" strokeWidth={1.8} />
                    </div>
                    <p className="text-base font-semibold text-[#111A24] mb-2 leading-tight">{item.title}</p>
                    <p className="text-sm text-[#4b5564] leading-snug">{item.description}</p>
                  </div>
                  {index < PROCESS_STEPS.length - 1 && (
                    <div className="w-7 pt-8 text-[#b67c2c] flex justify-center">
                      <ChevronRight size={20} />
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
                    <Icon size={30} className="text-[#4a5565]" strokeWidth={1.8} />
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
            <h2 className="text-3xl md:text-4xl font-bold text-[#111A24]">How We Can Help During Construction</h2>
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
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80"
            alt="Construction project completion"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071424]/95 via-[#071424]/85 to-[#071424]/30" />

          <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 md:py-14 text-white">
            <p className="text-[#b67c2c] text-xs font-semibold uppercase tracking-[0.18em] mb-4">On-Site Support. Better Outcomes.</p>
            <blockquote className="text-xl md:text-2xl font-medium italic leading-snug max-w-2xl mb-4">
              &ldquo;Having Eduardo on site and in our corner made all the difference. We resolved issues quickly and saved thousands.&rdquo;
            </blockquote>
            <p className="text-[#b67c2c] text-base font-semibold">Eduardo Mendes Advisory</p>
          </div>
        </div>
      </section>

      <section className="bg-white py-8 px-4 border-b border-[#e8e3da]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-[#111A24] leading-tight">Build With Confidence</h3>
            <p className="text-[#4b5564] mt-1 text-sm md:text-base leading-relaxed">
              Get expert support throughout construction and protect your investment every step of the way.
            </p>
          </div>
          <div className="text-center md:text-right">
            <BookConsultationLink
              service="construction-advisory"
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
                  "Regular site visit reports at key milestones",
                  "Progress claim review and approval guidance",
                  "Variation management and cost control",
                  "Quality and compliance monitoring",
                  "Builder communication support",
                  "Issue resolution and dispute guidance",
                  "Defect identification and documentation",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="text-warm-soil font-bold mt-0.5 shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="space-y-5">
              <ServiceConsultationCard service="construction-advisory" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
