import { Metadata } from "next";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  CircleDollarSign,
  ClipboardList,
  FileSearch,
  MessageCircle,
  ShieldAlert,
  Target,
  Upload,
} from "lucide-react";
import { BookConsultationLink } from "@/components/shared/BookConsultationLink";
import { ServiceConsultationCard } from "@/components/shared/ServiceConsultationCard";
import { UploadQuoteButton } from "@/components/shared/UploadQuoteButton";

export const metadata: Metadata = {
  title: "BuildCheck - Builder Quote Review",
  description:
    "Eduardo personally reviews your builder quotes to find risks, overpricing, and missing items before you sign anything.",
};

const WHY_POINTS = [
  "Identify overpriced line items before you sign",
  "Spot missing scope and risky contract clauses",
  "Compare your quote against market benchmarks",
  "Get clear written findings you can act on",
  "Protect yourself from costly surprises",
  "Make confident decisions with independent advice",
];

const PROCESS_STEPS = [
  {
    step: 1,
    icon: Upload,
    title: "Upload Documents",
    description: "Share your builder quote, contract, plans or any relevant documents.",
  },
  {
    step: 2,
    icon: MessageCircle,
    title: "Project Details",
    description: "Tell us about your project, budget and where you are in the process.",
  },
  {
    step: 3,
    icon: FileSearch,
    title: "Expert Review",
    description: "Eduardo analyses your documents line by line for risks and opportunities.",
  },
  {
    step: 4,
    icon: ClipboardList,
    title: "Written Report",
    description: "You receive clear findings, risk ratings and recommended actions.",
  },
  {
    step: 5,
    icon: Target,
    title: "Next Steps",
    description: "Book a free consultation to discuss findings and your best path forward.",
  },
];

const HELP_CARDS = [
  {
    icon: FileSearch,
    title: "Quote Review",
    description: "Line-by-line analysis against market rates and scope expectations.",
  },
  {
    icon: ShieldAlert,
    title: "Contract Analysis",
    description: "Review payment schedules, variation risks and key contract clauses.",
  },
  {
    icon: ClipboardList,
    title: "Scope Check",
    description: "Identify missing inclusions, exclusions and ambiguous items.",
  },
  {
    icon: CircleDollarSign,
    title: "Cost Benchmarking",
    description: "Flag overpriced items and potential savings opportunities.",
  },
  {
    icon: AlertTriangle,
    title: "Risk Flagging",
    description: "Highlight clauses and gaps that could cost you later.",
  },
  {
    icon: MessageCircle,
    title: "Negotiation Guidance",
    description: "Practical advice on how to respond to your builder.",
  },
];

export default function BuildCheckPage() {
  return (
    <div className="bg-white">
      <section className="relative text-white px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-[#ece8e1]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('https://rdeavyxckvkfwjvmxugs.supabase.co/storage/v1/object/public/media/BuildCheck.png')",
          }}
        />
        <div className="absolute inset-0 bg-[#111A24]/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#111A24]/90 via-[#111A24]/70 to-[#111A24]/35" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111A24]/75 via-transparent to-[#111A24]/30" />

        <div className="relative z-10 max-w-7xl mx-auto min-h-[620px] grid lg:grid-cols-2 items-center">
          <div className="py-16 md:py-20 max-w-xl">
            <p className="text-[#b67c2c] text-xs font-semibold uppercase tracking-[0.18em] mb-5">
              BuildCheck
            </p>
            <h1 className="text-5xl sm:text-6xl font-bold leading-[1.1] mb-5">
              Don&apos;t Sign Before
              <br />
              You BuildCheck.
            </h1>
            <p className="text-white/65 text-sm md:text-base max-w-md mb-8 leading-relaxed">
              Eduardo reviews your builder quotes line-by-line to find overpricing,
              missing items, and risk clauses before you&apos;re locked in.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <BookConsultationLink service="buildcheck" />
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-white/45 border-t border-white/10 pt-5">
              {[
                "Independent Advice",
                "30+ Years Experience",
                "Clear Written Findings",
              ].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <CheckCircle2 size={10} className="text-[#b67c2c]" />
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div />
        </div>
      </section>

      <section className="bg-[#071424] text-white px-4 py-8">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1.1fr_1fr] gap-8 items-center">
          <div className="pr-2 md:border-r md:border-white/20">
            <p className="text-[#b67c2c] text-xs font-semibold uppercase tracking-[0.18em] mb-3">
              Why It Matters
            </p>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
              A builder quote is a contract in waiting.
            </h2>
            <p className="text-white/70 text-sm leading-relaxed max-w-xl">
              Most homeowners sign without knowing what is missing, overpriced,
              or risky. BuildCheck gives you independent clarity before you commit.
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
            <h2 className="text-3xl md:text-4xl font-bold text-[#111A24]">How BuildCheck Works</h2>
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
            <h2 className="text-3xl md:text-4xl font-bold text-[#111A24]">What BuildCheck Covers</h2>
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

      <section className="bg-[#071424] text-white px-4 py-10">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_1.2fr] gap-8 items-center">
          <div className="space-y-3">
            <p className="text-[#b67c2c] text-xs font-semibold uppercase tracking-[0.18em]">Start With Your Quote</p>
            <h3 className="text-3xl md:text-4xl font-bold leading-tight">Upload Your Documents</h3>
            <p className="text-sm md:text-base text-white/75 leading-relaxed max-w-md">
              Upload your builder quote, contract, plans or any relevant documents.
              We will review them and guide you through your free AI assessment.
            </p>
            <p className="text-xs text-white/60">
              We accept: PDF, DOC, DOCX, XLSX. Max file size: 25 MB.
            </p>
          </div>

          <div className="border border-dashed border-white/30 rounded-2xl p-8 text-center bg-white/5">
            <Upload size={34} className="text-[#b67c2c] mx-auto mb-3" />
            <p className="text-xl font-semibold mb-1">Upload your builder quote</p>
            <p className="text-white/70 text-sm mb-5">
              Select your file to start your free AI assessment.
            </p>
            <UploadQuoteButton
              label="Choose Files To Upload"
              variant="primary"
              size="compact"
              showArrow={false}
              className="mx-auto"
            />
          </div>
        </div>
      </section>

      <section className="bg-[#0e1722]">
        <div className="relative min-h-[240px] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=2000&q=80"
            alt="Builder quote review"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071424]/95 via-[#071424]/85 to-[#071424]/30" />

          <div className="relative z-10 max-w-6xl mx-auto px-6 py-12 md:py-14 text-white">
            <p className="text-[#b67c2c] text-xs font-semibold uppercase tracking-[0.18em] mb-4">
              Independent Review. Better Decisions.
            </p>
            <blockquote className="text-xl md:text-2xl font-medium italic leading-snug max-w-2xl mb-4">
              &ldquo;BuildCheck saved us from signing a contract with major gaps. Eduardo found issues we never would have spotted.&rdquo;
            </blockquote>
            <p className="text-[#b67c2c] text-base font-semibold">Eduardo Mendes Advisory</p>
          </div>
        </div>
      </section>

      <section className="bg-white py-8 px-4 border-b border-[#e8e3da]">
        <div className="max-w-6xl mx-auto grid md:grid-cols-[1fr_auto] gap-6 items-center">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold text-[#111A24] leading-tight">
              Review Before You Sign
            </h3>
            <p className="text-[#4b5564] mt-1 text-sm md:text-base leading-relaxed">
              Book a free consultation to discuss your quote and get clear advice on your next steps.
            </p>
          </div>
          <div className="text-center md:text-right">
            <BookConsultationLink
              service="buildcheck"
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
                  "Line-by-line builder quote analysis",
                  "Contract clause and payment schedule review",
                  "Scope, inclusion and exclusion check",
                  "Cost benchmarking and overpricing flags",
                  "Risk ratings and written findings",
                  "Recommended actions and negotiation guidance",
                  "Free 15-minute consultation to discuss results",
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
                  "Homeowners who have received builder quotes",
                  "Anyone comparing multiple builder tenders",
                  "Owner builders reviewing trade quotes",
                  "Renovators before signing a fixed-price contract",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="text-navy font-bold mt-0.5 shrink-0">→</span>
                    {item}
                  </li>
                ))}
              </ul>

              <ServiceConsultationCard service="buildcheck" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
