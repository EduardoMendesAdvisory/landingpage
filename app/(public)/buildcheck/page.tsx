import { Metadata } from "next";
import Link from "next/link";
import {
  AlertTriangle,
  CheckCircle2,
  CircleDollarSign,
  FileSearch,
  Home,
  ShieldAlert,
  SlidersHorizontal,
  Upload,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "BuildCheck — Builder Quote Review",
  description:
    "Eduardo personally reviews your builder quotes to find risks, overpricing, and missing items before you sign anything.",
};

export default function BuildCheckPage() {
  return (
    <div className="bg-white">
      {/* Hero */}
      <section className="relative text-white px-4 sm:px-6 lg:px-8 overflow-hidden">
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
            Don&apos;t sign a builder&apos;s contract before reading this.
          </h1>
            <p className="text-white/65 text-sm md:text-base max-w-md mb-8 leading-relaxed">
            Eduardo reviews your builder quotes line-by-line to find overpricing,
            missing items, and risk clauses — before you&apos;re locked in.
          </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Link
                href="/assessment"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-[#b67c2c] hover:bg-[#9f6c27] text-white border-transparent uppercase tracking-[0.12em]"
                )}
              >
                Get My Free Assessment
              </Link>
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

      {/* What is BuildCheck */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-navy mb-8 text-center leading-tight">
            What is BuildCheck?
          </h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                title: "Quote Review",
                body: "Eduardo analyses your builder quote against market rates, identifies overpriced line items, and flags missing scope.",
              },
              {
                title: "Contract Analysis",
                body: "We review key contract clauses, payment schedules, and variation risks to protect you before you sign.",
              },
              {
                title: "Written Report",
                body: "You receive a clear written report with specific findings, risk ratings, and recommended actions.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-light-bg rounded-2xl p-6 shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
              >
                <h3 className="font-semibold text-navy mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f6f5f3] border-y border-[#e8e3da]">
        <div className="bg-[#071424] text-white px-4 py-10">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_1.2fr] gap-8 items-center">
            <div className="space-y-3">
              <p className="text-[#b67c2c] text-xs font-semibold uppercase tracking-[0.18em]">Step 1 of 5</p>
              <h3 className="text-3xl md:text-4xl font-bold leading-tight">Upload Your Documents</h3>
              <p className="text-sm md:text-base text-white/75 leading-relaxed max-w-md">
                Start by uploading your builder quote, contract, plans or any
                relevant documents. We&apos;ll review them and let you know what we find.
              </p>
              <p className="text-xs text-white/60">
                We accept: PDF, DOC, DOCX, XLSX · Max file size: 50MB per file
              </p>
            </div>

            <div className="border border-dashed border-white/30 rounded-2xl p-8 text-center bg-white/5">
              <Upload size={34} className="text-[#b67c2c] mx-auto mb-3" />
              <p className="text-xl font-semibold mb-1">Drag &amp; drop your files here</p>
              <p className="text-white/70 text-sm mb-5">or</p>
              <button
                type="button"
                className="inline-flex items-center justify-center bg-[#b67c2c] hover:bg-[#9f6c27] text-white font-semibold px-7 py-3 rounded-lg text-sm uppercase tracking-[0.1em] transition-colors"
              >
                Choose Files To Upload
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white px-4 py-8 border-t border-[#e8e3da] border-b border-[#e8e3da]">
          <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-6">
            {([
              { icon: Upload, title: "Upload Documents", subtitle: "You are here" },
              { icon: Home, title: "Project Details", subtitle: "Tell us about your project" },
              { icon: CircleDollarSign, title: "Project Value", subtitle: "Provide project value" },
              { icon: SlidersHorizontal, title: "Project Stage", subtitle: "Where are you up to?" },
              { icon: CheckCircle2, title: "Review & Submit", subtitle: "Confirm and submit" },
            ] as const).map((step, index) => (
              <div key={step.title} className="text-center relative">
                <div className="w-11 h-11 rounded-full border border-[#d8d2c8] flex items-center justify-center mx-auto mb-3">
                  <step.icon size={20} className="text-[#4b5564]" strokeWidth={1.7} />
                </div>
                <p className="text-sm font-semibold text-[#111A24] leading-tight">{step.title}</p>
                <p className="text-xs text-[#4b5564] mt-1">{step.subtitle}</p>
                {index === 0 && <p className="text-xs text-[#b67c2c] mt-1.5 font-semibold">You are here</p>}
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 py-10 bg-[#f8f7f4]">
          <div className="max-w-6xl mx-auto">
            <h3 className="text-3xl md:text-4xl font-bold text-[#111A24] text-center leading-tight mb-8">What You Can Expect</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {([
                {
                  icon: FileSearch,
                  title: "Detailed Review",
                  body: "We analyse your documents line by line to identify risks, missing items and opportunities.",
                },
                {
                  icon: AlertTriangle,
                  title: "Clear Findings",
                  body: "You&apos;ll receive a clear report highlighting key issues and recommendations.",
                },
                {
                  icon: CircleDollarSign,
                  title: "Potential Savings",
                  body: "We identify cost saving opportunities so you keep more in your pocket.",
                },
                {
                  icon: ShieldAlert,
                  title: "Expert Advice",
                  body: "Get practical advice from a licensed building professional with 30+ years experience.",
                },
              ] as const).map((item) => (
                <div key={item.title} className="bg-white border border-[#e6e0d5] rounded-xl p-6 text-center">
                  <item.icon size={28} className="text-[#b67c2c] mx-auto mb-3" strokeWidth={1.7} />
                  <p className="text-base font-semibold text-[#111A24] leading-tight mb-2">{item.title}</p>
                  <p className="text-sm text-[#4b5564] leading-relaxed">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
