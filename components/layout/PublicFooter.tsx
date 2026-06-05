import Link from "next/link";

const FOOTER_LINK_CLASS =
  "text-xs text-white/50 hover:text-[#b67c2c] transition-colors duration-200 block py-0.5";

export function PublicFooter() {
  return (
    <footer className="bg-[#111A24] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-10 sm:gap-10">

          {/* Col 1: Brand */}
          <div>
            <div className="mb-4">
              <img
                src="https://rdeavyxckvkfwjvmxugs.supabase.co/storage/v1/object/public/media/logo%20EM_hor%20white.png"
                alt="Eduardo Mendes Advisory"
                className="h-10 w-auto"
              />
            </div>
            <p className="text-white/50 text-xs leading-relaxed mb-3">
              Independent construction advice for homeowners, renovators, and
              owner builders across Australia.
            </p>
            <p className="text-[#b67c2c] text-xs font-semibold uppercase tracking-wider">
              Independent Advice. Real Results.
            </p>
          </div>

          {/* Col 2: Services */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Services</h3>
            <ul className="space-y-2.5">
              {[
                { label: "BuildCheck",                    href: "/buildcheck" },
                { label: "Pre-Construction Advisory",     href: "/services/pre-construction-advisory" },
                { label: "Construction Advisory",         href: "/services/construction-advisory" },
                { label: "Owner Builder Program",         href: "/services/owner-builder-program" },
                { label: "Site Visits & Inspections",     href: "/services/site-visits-inspections" },
                { label: "Free AI Assessment", href: "/assessment" },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className={FOOTER_LINK_CLASS}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Quick Links */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Quick Links</h3>
            <ul className="space-y-2.5">
              {[
                { label: "How It Works",    href: "/#how-it-works" },
                { label: "About Eduardo",   href: "/about" },
                { label: "Terms of Service",href: "/terms-of-service" },
                { label: "Book a Call",     href: "/book-call" },
                { label: "Client Portal",   href: "/buildiq/dashboard" },
                { label: "Contact",         href: "/contact" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={FOOTER_LINK_CLASS}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h3 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Contact</h3>
            <div className="space-y-2.5 text-xs text-white/50">
              <p>Queensland, Australia</p>
              <p>Australia-Wide Advisory</p>
              <a href="mailto:contact@eduardomendes.com.au" className={FOOTER_LINK_CLASS}>
                contact@eduardomendes.com.au
              </a>
            </div>
            <Link
              href="/book-call"
              className="inline-flex items-center gap-1.5 mt-5 bg-[#b67c2c] hover:bg-[#9f6c27] text-white text-xs font-bold px-4 py-2 rounded-lg uppercase tracking-wider transition-colors"
            >
              Book a Call
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} Eduardo Mendes Owner Builder Advisory.
          </p>
          <p className="text-white/30 text-xs">ABN: 12 345 678 901</p>
        </div>

        <div className="mt-4 px-1">
          <p className="text-[11px] text-white/55 leading-relaxed sm:text-justify">
            Independent construction advisory services. AI-assisted analysis, benchmarking, and reporting tools may be used and are reviewed by Eduardo Mendes before final delivery. Information provided is general in nature and is intended for educational and informational purposes only.
          </p>
          <p className="text-[11px] text-white/55 leading-relaxed sm:text-justify mt-2">
            Services do not constitute legal, financial, engineering, structural, building certification, surveying, quantity surveying, insurance, or other regulated professional advice. Cost comparisons, savings estimates, benchmarks, and project insights are indicative only and should not be relied upon as guarantees of future outcomes, project costs, approvals, contractor performance, or financial savings.
          </p>
          <p className="text-[11px] text-white/55 leading-relaxed sm:text-justify mt-2">
            Clients remain responsible for obtaining independent advice from appropriately qualified professionals where required and for all decisions made in relation to their project.
          </p>
          <p className="text-[11px] text-white/40 text-center mt-3">
            Digital Strategy, UX &amp; AI Solutions by{" "}
            <a
              href="https://www.heliowoi.com"
              target="_blank"
              rel="noreferrer"
              className="text-white/60 hover:text-[#b67c2c] underline underline-offset-2 transition-colors duration-200"
            >
              Helio Woi
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
