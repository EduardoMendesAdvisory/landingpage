import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms of Service and independent construction advisory disclaimer for Eduardo Mendes Advisory.",
};

export default function TermsOfServicePage() {
  return (
    <div className="bg-white">
      <section className="bg-[#111A24] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <p className="text-[#b67c2c] text-xs font-semibold uppercase tracking-[0.18em] mb-3">
            Legal
          </p>
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-white/70 text-base md:text-lg leading-relaxed">
            Please read this page carefully before relying on any guidance, report,
            benchmark, or recommendation provided through this website and related
            advisory services.
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#111A24]">
            Independent Construction Advisory Disclaimer
          </h2>

          <p className="text-[#3a4350] leading-relaxed">
            Eduardo Mendes provides independent construction advisory services to
            assist Owner Builders in understanding project documentation, builder
            quotations, contracts, budgets, and construction-related decisions.
          </p>

          <p className="text-[#3a4350] leading-relaxed">
            Some assessments, reports, benchmarks, and recommendations may be
            generated or supported by artificial intelligence and data analysis
            tools. All final recommendations and advisory outcomes are reviewed and
            validated by Eduardo Mendes before being provided to clients.
          </p>

          <p className="text-[#3a4350] leading-relaxed">
            Information provided through this website, BuildCheck™, reports,
            consultations, or related services is general in nature and is intended
            for informational and educational purposes only.
          </p>

          <p className="text-[#3a4350] leading-relaxed">
            The information provided does not constitute legal advice, financial
            advice, engineering advice, structural advice, building certification
            advice, surveying advice, or any other regulated professional service.
          </p>

          <p className="text-[#3a4350] leading-relaxed">
            Clients should seek independent advice from appropriately qualified
            professionals, including solicitors, engineers, certifiers,
            accountants, surveyors, or other specialists where required.
          </p>

          <p className="text-[#3a4350] leading-relaxed">
            While every effort is made to provide accurate and useful information,
            no guarantee is given regarding completeness, accuracy, future
            outcomes, construction costs, project savings, approval outcomes,
            contractor performance, or project results.
          </p>

          <p className="text-[#3a4350] leading-relaxed font-medium">
            Any decisions made based on information provided by Eduardo Mendes
            remain the sole responsibility of the client.
          </p>
        </div>
      </section>
    </div>
  );
}
