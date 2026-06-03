"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

const navLinks = [
  { label: "Services",     href: "/services/pre-construction-advisory" },
  { label: "How It Works", href: "/#how-it-works" },
  { label: "About",        href: "/about" },
  { label: "Pricing",      href: "/assessment" },
  { label: "Contact",      href: "/contact" },
];

export function PublicNav() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="bg-navy text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold text-white hover:opacity-90 transition-opacity"
          >
            <span className="text-warm-soil text-xl font-bold">EM</span>
            <span className="text-sm leading-tight hidden sm:block">
              Eduardo Mendes
              <br />
              <span className="font-normal text-white/70 text-xs">
                Owner Builder Advisory
              </span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
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
              href="/login"
              className="text-sm text-white/80 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/assessment"
              className={cn(
                buttonVariants({ size: "sm" }),
                "bg-warm-soil hover:bg-warm-soil/90 text-white border-transparent font-bold uppercase tracking-wider"
              )}
            >
              Get Started
            </Link>
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
        <div className="md:hidden border-t border-white/10 bg-navy">
          <nav className="flex flex-col px-4 py-4 gap-3">
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
                href="/login"
                className="text-sm text-white/80 hover:text-white transition-colors py-1"
                onClick={() => setMobileOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/assessment"
                className={cn(
                  buttonVariants({ size: "sm" }),
                  "bg-warm-soil hover:bg-warm-soil/90 text-white border-transparent justify-center"
                )}
                onClick={() => setMobileOpen(false)}
              >
                Free Assessment
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
