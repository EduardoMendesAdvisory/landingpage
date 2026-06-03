import Link from "next/link";

export function PublicFooter() {
  return (
    <footer className="bg-[#111A24] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Col 1: Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[#8E682F] text-3xl font-bold leading-none">EM</span>
              <div>
                <p className="text-white font-bold text-sm leading-tight tracking-wide">EDUARDO MENDES</p>
                <p className="text-white/40 text-[10px] tracking-widest uppercase">Owner Builder Advisory</p>
              </div>
            </div>
            <p className="text-white/50 text-xs leading-relaxed mb-3">
              Independent construction advice for homeowners, renovators, and
              owner builders across Australia.
            </p>
            <p className="text-[#8E682F] text-xs font-semibold uppercase tracking-wider">
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
                { label: "Free Assessment",               href: "/assessment" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-xs text-white/50 hover:text-white transition-colors">
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
                { label: "Testimonials",    href: "/#testimonials" },
                { label: "Book a Call",     href: "/book-call" },
                { label: "Client Portal",   href: "/buildiq/dashboard" },
                { label: "Contact",         href: "/contact" },
              ].map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-xs text-white/50 hover:text-white transition-colors">
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
              <a href="mailto:hello@eduardomendaes.com.au" className="block hover:text-white transition-colors">
                hello@eduardomendes.com.au
              </a>
            </div>
            <Link
              href="/book-call"
              className="inline-flex items-center gap-1.5 mt-5 bg-[#8E682F] hover:bg-[#7a5a28] text-white text-xs font-bold px-4 py-2 rounded-lg uppercase tracking-wider transition-colors"
            >
              Book a Free Call
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} Eduardo Mendes Builder Advisor. All rights reserved.
          </p>
          <p className="text-white/30 text-xs">ABN: XX XXX XXX XXX</p>
        </div>
      </div>
    </footer>
  );
}
