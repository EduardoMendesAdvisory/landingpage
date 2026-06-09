"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { UploadQuoteButton } from "@/components/shared/UploadQuoteButton";

const navLinks = [
  { label: "How It Works", href: "/#how-it-works" },
  { label: "About",        href: "/about" },
  { label: "Contact",      href: "/contact" },
];

const serviceLinks = [
  { label: "BuildCheck",                  href: "/buildcheck" },
  { label: "Pre-Construction Advisory",   href: "/services/pre-construction-advisory" },
  { label: "Construction Advisory",       href: "/services/construction-advisory" },
  { label: "Site Visits & Inspections",   href: "/services/site-visits-inspections" },
  { label: "Owner Builder Program",       href: "/services/owner-builder-program" },
];

export function PublicNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setHasScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="bg-[#111A24] text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-white hover:opacity-90 transition-opacity"
          >
            <span className={`relative block h-10 transition-all duration-200 ${hasScrolled ? "w-10" : "w-[164px]"}`}>
              <img
                src="https://rdeavyxckvkfwjvmxugs.supabase.co/storage/v1/object/public/media/logo%20EM_hor%20white.png"
                alt="Eduardo Mendes Advisory"
                className={`absolute left-0 top-1/2 -translate-y-1/2 h-9 w-auto max-w-none transition-opacity duration-200 ${
                  hasScrolled ? "opacity-0" : "opacity-100"
                }`}
              />
              <img
                src="https://rdeavyxckvkfwjvmxugs.supabase.co/storage/v1/object/public/media/logo%20icon.png"
                alt="Eduardo Mendes icon"
                className={`absolute left-0 top-1/2 -translate-y-1/2 h-10 w-10 object-contain transition-opacity duration-200 ${
                  hasScrolled ? "opacity-100" : "opacity-0"
                }`}
              />
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                type="button"
                className="text-sm text-white/80 hover:text-white transition-colors"
                onClick={() => setServicesOpen(true)}
                aria-expanded={servicesOpen}
                aria-haspopup="menu"
              >
                Services
              </button>

              {servicesOpen && (
                <div className="absolute left-0 top-full z-50">
                  <div className="w-max rounded-xl border border-white/10 bg-[#111A24] shadow-[0_12px_30px_rgba(0,0,0,0.32)] p-4 transition-all duration-200 ease-out animate-in fade-in-0 zoom-in-95">
                    <div className="flex flex-col gap-3">
                    {serviceLinks.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block text-sm text-white/90 hover:text-[#b67c2c] transition-colors duration-200"
                        onClick={() => setServicesOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-white/80 hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login?redirect=/buildiq/dashboard"
              className="text-sm text-white/80 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <UploadQuoteButton
              label="Get Started"
              variant="nav"
              size="sm"
              showArrow={false}
            />
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden p-2 text-white/80 hover:text-white"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#111A24]">
          <nav className="flex flex-col px-4 py-4 gap-3">
            <div className="pb-3 border-b border-white/10">
              <button
                type="button"
                className="w-full text-left text-xs uppercase tracking-[0.14em] text-white/60 hover:text-white transition-colors"
                onClick={() => setMobileServicesOpen((prev) => !prev)}
                aria-expanded={mobileServicesOpen}
              >
                Services
              </button>

              {mobileServicesOpen && (
                <div className="flex flex-col gap-3 mt-3 pl-1">
                  {serviceLinks.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="text-sm text-white/80 hover:text-[#b67c2c] transition-colors duration-200 py-1"
                      onClick={() => {
                        setMobileServicesOpen(false);
                        setMobileOpen(false);
                      }}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm text-white/80 hover:text-white transition-colors py-1"
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
              <Link
                href="/login?redirect=/buildiq/dashboard"
                className="text-sm text-white/80 hover:text-white transition-colors py-1"
                onClick={() => setMobileOpen(false)}
              >
                Sign In
              </Link>
              <UploadQuoteButton
                label="Free Assessment"
                variant="nav"
                size="sm"
                showArrow={false}
                className="justify-center w-full"
              />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
