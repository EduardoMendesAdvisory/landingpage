import Link from "next/link";

const footerLinks = {
  Services: [
    { label: "Pre-Construction Advisory", href: "/services/pre-construction-advisory" },
    { label: "Construction Advisory", href: "/services/construction-advisory" },
    { label: "Site Visits & Inspections", href: "/services/site-visits-inspections" },
    { label: "Owner Builder Program", href: "/services/owner-builder-program" },
  ],
  Platform: [
    { label: "BuildCheck", href: "/buildcheck" },
    { label: "Free Assessment", href: "/assessment" },
    { label: "Book a Call", href: "/book-call" },
  ],
  Company: [
    { label: "About Eduardo", href: "/about" },
    { label: "Contact", href: "/contact" },
    { label: "Client Portal", href: "/buildiq/dashboard" },
  ],
};

export function PublicFooter() {
  return (
    <footer className="bg-navy text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-warm-soil text-2xl font-bold">EM</span>
              <span className="text-sm leading-tight">
                Eduardo Mendes
                <br />
                <span className="text-white/60 text-xs font-normal">
                  Owner Builder Advisory
                </span>
              </span>
            </div>
            <p className="text-white/60 text-sm leading-relaxed">
              Independent construction advice for homeowners, renovators, and
              owner builders across Australia.
            </p>
            <p className="text-warm-soil text-sm font-semibold mt-4">
              Build Smarter. Save More.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h3 className="text-sm font-semibold text-white mb-3 uppercase tracking-wide">
                {group}
              </h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/40 text-xs">
            © {new Date().getFullYear()} Eduardo Mendes Advisory. All rights reserved.
          </p>
          <p className="text-white/40 text-xs">ABN: XX XXX XXX XXX</p>
        </div>
      </div>
    </footer>
  );
}
