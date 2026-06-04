import Link from "next/link";
import type { Metadata } from "next";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Account | Eduardo Mendes Advisory",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* ── Left panel: dark branding ─────────────────────────── */}
      <div className="hidden lg:flex lg:w-[440px] xl:w-[480px] bg-navy flex-col justify-between p-10 shrink-0 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 bg-gradient-to-br from-navy via-[#1a2535] to-[#0d1520] opacity-90" />
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-black/30 to-transparent" />

        {/* Content */}
        <div className="relative z-10">
          <Link href="/" className="w-fit block">
            <img
              src="https://rdeavyxckvkfwjvmxugs.supabase.co/storage/v1/object/public/media/logo%20EM_hor%20white.png"
              alt="Eduardo Mendes Advisory"
              className="h-9 w-auto"
            />
          </Link>
          <div className="mt-12">
            <h2 className="text-3xl font-bold text-white leading-tight">
              One step closer to<br />
              <span className="text-[#b67c2c]">building smarter.</span>
            </h2>
            <p className="text-white/60 text-sm mt-4 leading-relaxed max-w-xs">
              Get expert advice tailored to your project and protect your investment at every stage of your build.
            </p>
          </div>
        </div>

        {/* Trust badge */}
        <div className="relative z-10">
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-4 py-3">
            <ShieldCheck size={20} className="text-amber shrink-0" />
            <div className="text-xs text-white/70">
              <p className="font-medium text-white">Your data is secure</p>
              <p>We never share your information</p>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-3 gap-3">
            {[
              { label: "Expert Guidance",   sub: "Talk directly with Eduardo Mendes" },
              { label: "Save Time & Money", sub: "Avoid costly mistakes and make confident decisions" },
              { label: "100% Confidential", sub: "Your project details are always kept private" },
            ].map((item) => (
              <div key={item.label} className="text-center">
                <p className="text-white text-xs font-semibold leading-tight">{item.label}</p>
                <p className="text-white/40 text-[10px] mt-1 leading-snug">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel: form ────────────────────────────────── */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Mobile header */}
        <div className="lg:hidden bg-navy px-6 py-4">
          <Link href="/" className="block w-fit">
            <img
              src="https://rdeavyxckvkfwjvmxugs.supabase.co/storage/v1/object/public/media/logo%20EM_hor%20white.png"
              alt="Eduardo Mendes Advisory"
              className="h-9 w-auto"
            />
          </Link>
        </div>

        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            {children}
          </div>
        </main>

        <footer className="px-6 py-4 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Eduardo Mendes Advisory. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}
