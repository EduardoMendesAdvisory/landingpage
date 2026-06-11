"use client";

import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, Clock, ShieldCheck, Video } from "lucide-react";
import { CalendlyEmbed } from "@/components/shared/CalendlyEmbed";
import { buildCalendlyUrl, getCalendlyBaseUrl } from "@/lib/calendly";
import { PUBLIC_SERVICES } from "@/lib/services-catalog";

function StepIndicator({ activeStep }: { activeStep: 1 | 2 }) {
  const steps = [
    { num: 1, label: "Choose service" },
    { num: 2, label: "Pick a time" },
  ] as const;

  return (
    <ol className="flex items-center justify-center gap-2 sm:gap-4 mb-8">
      {steps.map((step, index) => {
        const isActive = step.num === activeStep;
        const isComplete = step.num < activeStep;

        return (
          <li key={step.num} className="flex items-center gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
              <span
                className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                  isActive
                    ? "bg-[#b67c2c] text-white"
                    : isComplete
                      ? "bg-[#b67c2c]/20 text-[#b67c2c]"
                      : "bg-gray-100 text-muted-foreground"
                }`}
              >
                {step.num}
              </span>
              <span
                className={`text-xs sm:text-sm font-medium ${
                  isActive ? "text-navy" : "text-muted-foreground"
                }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <span className="hidden sm:block w-8 h-px bg-gray-200" aria-hidden />
            )}
          </li>
        );
      })}
    </ol>
  );
}

function CalendarSidebar({ serviceName }: { serviceName?: string }) {
  return (
    <aside className="space-y-4">
      <div className="bg-[#F8F9FA] rounded-2xl p-6 border border-gray-100">
        <p className="font-bold text-navy mb-4">What to expect</p>
        <ul className="space-y-3">
          {[
            { icon: Clock, text: "15-minute video call" },
            { icon: Video, text: "Discuss your project and current stage" },
            { icon: ShieldCheck, text: "Clear advice on the best next steps" },
            { icon: Calendar, text: "No sales pressure - honest guidance only" },
          ].map((item) => (
            <li key={item.text} className="flex items-start gap-3 text-sm text-muted-foreground">
              <item.icon size={16} className="text-amber shrink-0 mt-0.5" />
              {item.text}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-[#F8F9FA] rounded-2xl p-6 border border-gray-100">
        <p className="text-sm font-semibold text-navy mb-1">Duration</p>
        <p className="text-muted-foreground text-sm mb-4">15 minutes</p>
        <p className="text-sm font-semibold text-navy mb-1">Cost</p>
        <p className="text-2xl font-bold text-navy">Free</p>
      </div>

      {serviceName && (
        <div className="bg-amber/10 border border-amber/20 rounded-2xl p-5">
          <p className="text-xs font-semibold text-amber uppercase tracking-wider mb-1">
            Selected service
          </p>
          <p className="font-bold text-navy">{serviceName}</p>
        </div>
      )}
    </aside>
  );
}

interface BookCallFlowProps {
  leadPrefill?: { email?: string; name?: string; phone?: string } | null;
  prefillParams?: Record<string, string>;
}

export default function BookCallFlow({ leadPrefill, prefillParams }: BookCallFlowProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceSlug = searchParams.get("service");
  const leadId = searchParams.get("lead");

  const service = PUBLIC_SERVICES.find((item) => item.slug === serviceSlug);
  const showCalendar = Boolean(serviceSlug || leadId);
  const activeStep = showCalendar ? 2 : 1;

  const customAnswers: Record<string, string> = {};
  if (prefillParams) {
    for (const [key, value] of Object.entries(prefillParams)) {
      if (key.startsWith("a") && value) customAnswers[key] = value;
    }
  }

  const calendlyUrl = buildCalendlyUrl(getCalendlyBaseUrl(), {
    service: serviceSlug ?? prefillParams?.utm_content,
    lead: leadId ?? prefillParams?.utm_campaign,
    email: leadPrefill?.email ?? prefillParams?.email,
    name: leadPrefill?.name ?? prefillParams?.name,
    phone: leadPrefill?.phone ?? prefillParams?.phone,
    customAnswers,
  });

  const goToCalendar = (slug: string) => {
    const params = new URLSearchParams();
    params.set("service", slug);
    if (leadId) params.set("lead", leadId);
    router.push(`/book-call?${params.toString()}`, { scroll: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const backToServices = () => {
    router.push("/book-call", { scroll: false });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="bg-white">
      <section className="bg-navy text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-amber text-xs font-semibold uppercase tracking-widest mb-3">
            Book a Call
          </p>
          <h1 className="text-4xl font-bold mb-4">
            {showCalendar ? "Pick Your Consultation Time" : "Which Service Is Right for You?"}
          </h1>
          <p className="text-white/70 text-lg leading-relaxed">
            {showCalendar
              ? service
                ? `Choose a time to speak with Eduardo about ${service.name}.`
                : leadId
                  ? "Your project details are saved. Choose a time for your free call with Eduardo."
                  : "Choose a time for your free 15-minute consultation with Eduardo."
              : "Choose the service that best matches your project stage, then pick a time for your free 15-minute consultation."}
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <StepIndicator activeStep={activeStep} />

          {!showCalendar ? (
            <>
              <div className="grid sm:grid-cols-2 gap-5">
                {PUBLIC_SERVICES.map((item) => (
                  <article
                    key={item.slug}
                    className="bg-[#F8F9FA] border border-gray-100 rounded-2xl p-6 flex flex-col"
                  >
                    <h2 className="text-xl font-bold text-navy mb-2">{item.name}</h2>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-6">
                      {item.description}
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <Link
                        href={item.href}
                        className="inline-flex items-center justify-center gap-2 border border-[#b67c2c] text-[#b67c2c] hover:bg-[#b67c2c] hover:text-white font-semibold px-5 py-3 rounded-lg text-sm uppercase tracking-[0.12em] transition-colors"
                      >
                        Learn More
                        <ArrowRight size={14} />
                      </Link>
                      <button
                        type="button"
                        onClick={() => goToCalendar(item.slug)}
                        className="inline-flex items-center justify-center gap-2 bg-[#b67c2c] hover:bg-[#9f6c27] text-white font-semibold px-5 py-3 rounded-lg text-sm uppercase tracking-[0.12em] transition-colors"
                      >
                        <Calendar size={14} />
                        Book Free 15-Min Consultation
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              <div className="mt-10 text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Not sure which service you need?
                </p>
                <Link
                  href="/assessment"
                  className="text-navy font-semibold hover:text-[#b67c2c] hover:underline text-sm"
                >
                  Start with a free preliminary AI assessment
                </Link>
              </div>
            </>
          ) : (
            <>
              {!leadId && (
                <button
                  type="button"
                  onClick={backToServices}
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-navy transition-colors mb-6"
                >
                  <ArrowLeft size={14} />
                  Change service
                </button>
              )}

              <div className="grid lg:grid-cols-[1fr_340px] gap-8 items-start">
                <CalendlyEmbed
                  key={calendlyUrl}
                  url={calendlyUrl}
                  tracking={{
                    service: serviceSlug ?? prefillParams?.utm_content ?? null,
                    leadId: leadId ?? prefillParams?.utm_campaign ?? null,
                    email: leadPrefill?.email ?? prefillParams?.email ?? null,
                    name: leadPrefill?.name ?? prefillParams?.name ?? null,
                  }}
                />
                <CalendarSidebar serviceName={service?.name} />
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
