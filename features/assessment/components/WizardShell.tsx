import Link from "next/link";
import { Check, Lock, MessageCircle, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { FOOTER_BRAND_LOGO } from "@/lib/branding";

const STEPS = [
  { label: "Project Type", shortLabel: "Project" },
  { label: "Location", shortLabel: "Location" },
  { label: "Current Stage", shortLabel: "Stage" },
  { label: "Budget", shortLabel: "Budget" },
  { label: "Results", shortLabel: "Results" },
];

interface WizardShellProps {
  flowTitle: string;
  phaseLabel: string;
  displayStep?: number;
  showStepper?: boolean;
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  narrow?: boolean;
}

export function WizardShell({
  flowTitle,
  phaseLabel,
  displayStep,
  showStepper = false,
  children,
  sidebar,
  narrow = false,
}: WizardShellProps) {
  return (
    <div className="flex flex-col flex-1 bg-[#faf9f7]">
      <div className="relative bg-[#111A24] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-[center_right] sm:bg-right bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://rdeavyxckvkfwjvmxugs.supabase.co/storage/v1/object/public/media/hero%20banner%20desktop.jpg')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#111A24]/70 via-[#111A24]/25 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111A24]/40 via-transparent to-transparent" />

        <div className="relative z-10 px-6 py-5 sm:py-6">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <div className="min-w-0">
              <Link href="/">
                <img
                  src="https://rdeavyxckvkfwjvmxugs.supabase.co/storage/v1/object/public/media/logo%20EM_hor%20white.png"
                  alt="Eduardo Mendes Advisory"
                  className="h-9 w-auto"
                />
              </Link>
              <p className="text-white/70 text-xs mt-2">
                {flowTitle}{" "}
                <span className="text-white/40">|</span>{" "}
                <span className="text-[#b67c2c] font-medium">{phaseLabel}</span>
                <span className="text-white/40"> | </span>
                ~2 minutes
              </p>
            </div>

            {showStepper && displayStep !== undefined && (
              <nav className="hidden md:flex items-center gap-0" aria-label="Assessment steps">
                {STEPS.map((s, i) => {
                  const idx = i + 1;
                  const isDone = idx < displayStep;
                  const isActive = idx === displayStep;
                  return (
                    <div key={s.label} className="flex items-center">
                      <div className="flex flex-col items-center gap-1">
                        <div
                          className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all",
                            isDone && "bg-[#b67c2c] text-white",
                            isActive && "bg-[#b67c2c] text-white ring-2 ring-[#b67c2c]/30",
                            !isDone && !isActive && "border border-white/25 text-white/40"
                          )}
                        >
                          {isDone ? <Check size={14} strokeWidth={3} /> : idx}
                        </div>
                        <span
                          className={cn(
                            "text-[10px] whitespace-nowrap",
                            isActive ? "text-[#b67c2c] font-medium" : isDone ? "text-white/60" : "text-white/30"
                          )}
                        >
                          {s.shortLabel}
                        </span>
                      </div>
                      {i < STEPS.length - 1 && (
                        <div
                          className={cn("w-10 h-px mx-1 mb-4", idx < displayStep ? "bg-[#b67c2c]/60" : "bg-white/15")}
                        />
                      )}
                    </div>
                  );
                })}
              </nav>
            )}

            <div className="hidden sm:flex items-center gap-2.5 border border-white/15 rounded-xl px-4 py-2.5 shrink-0">
              <ShieldCheck size={18} className="text-[#b67c2c] shrink-0" />
              <div className="text-xs leading-tight">
                <p className="text-white font-medium">Your information is secure</p>
                <p className="text-white/40">We never share your data</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 px-4 py-8 sm:py-10">
        {narrow ? (
          <div className="max-w-3xl mx-auto">{children}</div>
        ) : (
          <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_280px] gap-6 lg:gap-8 items-start">
            {children}
            {sidebar && <div className="hidden lg:block space-y-4">{sidebar}</div>}
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-[#ece8e1] py-4 px-6">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs text-[#9ca3af]">
          <div className="flex items-center gap-2">
            <Lock size={13} />
            <span className="font-medium text-[#4b5564]">Secure SSL encryption</span>
            <span>256-bit protection</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle size={13} />
            <span>
              Need help?{" "}
              <a href="/contact" className="text-[#111A24] hover:underline">
                Chat with our team
              </a>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <img src={FOOTER_BRAND_LOGO} alt="Eduardo Mendes Advisory" className="h-6 w-auto" />
            <span>Owner Builder Advisor</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export function WizardCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-[#ece8e1] p-6 sm:p-10">
      {children}
    </div>
  );
}

export function WizardTrustSidebar() {
  return (
    <>
      <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-[#ece8e1] p-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#111A24] mb-1">Trusted advisory</p>
        <div className="w-8 h-[2px] bg-[#b67c2c] mb-4" />
        <p className="text-xs text-[#4b5564] leading-relaxed">
          Independent guidance for owner builders and homeowners across Australia.
        </p>
      </div>
    </>
  );
}
