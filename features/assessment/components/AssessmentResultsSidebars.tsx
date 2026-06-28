import Link from "next/link";
import {
  Calendar,
  Check,
  Clock,
  FileText,
  LayoutDashboard,
  Lock,
  MessageCircle,
  ShieldCheck,
  Star,
} from "lucide-react";
import { getBookCallUrl } from "@/lib/services-catalog";
import { BUSINESS_EMAIL, BUSINESS_MAILTO } from "@/lib/site/contact";
import { WIZARD_SIDEBAR_BTN_CLASS } from "./wizard-ui";

export function FreeResultsSidebar({ leadId }: { leadId: string }) {
  return (
    <aside className="space-y-4">
      <div className="bg-white rounded-2xl border border-[#ece8e1] shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="bg-[#faf9f7] border-b border-[#ece8e1] px-5 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#b67c2c]">Your next step</p>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-[#111A24] leading-snug">Book your free call with Eduardo</h3>
            <p className="text-xs text-[#4b5564] mt-1.5 leading-relaxed">
              Your project details are saved. Speak with Eduardo to review your preliminary assessment and discuss the best path forward.
            </p>
          </div>

          <div className="rounded-lg border border-[#ece8e1] bg-[#faf9f7] px-4 py-3 space-y-2.5">
            <div className="flex items-start gap-2.5 text-xs text-[#4b5564]">
              <Check size={14} className="text-[#b67c2c] shrink-0 mt-0.5" />
              <span>Your information and documents are securely stored</span>
            </div>
            <div className="flex items-start gap-2.5 text-xs text-[#4b5564]">
              <Lock size={14} className="text-[#b67c2c] shrink-0 mt-0.5" />
              <span>No client portal access yet. Login credentials are provided after your consultation.</span>
            </div>
          </div>

          <div className="space-y-2.5">
            {[
              { icon: MessageCircle, label: "Discuss your project", desc: "Share your goals and specific concerns." },
              { icon: FileText, label: "Review your assessment", desc: "Walk through these preliminary findings together." },
              { icon: ShieldCheck, label: "Get expert guidance", desc: "Receive clear next steps tailored to your build." },
            ].map((item) => (
              <div key={item.label} className="flex items-start gap-3 pb-2.5 border-b border-[#ece8e1] last:border-0 last:pb-0">
                <item.icon size={15} className="text-[#b67c2c] shrink-0 mt-0.5" strokeWidth={1.8} />
                <div>
                  <p className="text-xs font-semibold text-[#111A24]">{item.label}</p>
                  <p className="text-[11px] text-[#6b7280] leading-relaxed mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <Link href={getBookCallUrl({ lead: leadId })} className={WIZARD_SIDEBAR_BTN_CLASS}>
            <Calendar size={13} strokeWidth={2} />
            Book free call
          </Link>

          <p className="text-[11px] text-[#9ca3af] text-center leading-relaxed">
            Free. No obligation. After your call, Eduardo will set up your client login.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-[#ece8e1] bg-[#faf9f7] p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck size={16} className="text-[#b67c2c] shrink-0 mt-0.5" strokeWidth={1.8} />
          <div>
            <p className="text-xs font-semibold text-[#111A24]">Trusted advisory</p>
            <p className="text-[11px] text-[#6b7280] mt-1 leading-relaxed">
              Hundreds of Queensland owner builders and homeowners trust Eduardo Mendes for independent project guidance.
            </p>
            <div className="flex items-center gap-1 mt-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  size={11}
                  className={n < 5 ? "fill-[#b67c2c] text-[#b67c2c]" : "fill-[#b67c2c]/30 text-[#b67c2c]/30"}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#ece8e1] p-5">
        <p className="text-xs font-semibold text-[#111A24] mb-1">Need help?</p>
        <a
          href={BUSINESS_MAILTO}
          className="text-sm text-[#4b5564] hover:text-[#111A24] transition-colors"
        >
          {BUSINESS_EMAIL}
        </a>
      </div>
    </aside>
  );
}

export function PaidResultsSidebar() {
  return (
    <aside className="space-y-4">
      <div className="bg-white rounded-2xl border border-[#ece8e1] shadow-[0_8px_30px_rgba(0,0,0,0.06)] p-5">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#111A24] mb-1">What happens next</p>
        <div className="w-8 h-[2px] bg-[#b67c2c] mb-4" />

        <div className="space-y-4">
          {[
            { icon: Check, done: true, active: false, label: "Information received", desc: "Your project details and documents are on file." },
            { icon: Check, done: true, active: false, label: "Project created", desc: "Your project has been added to Eduardo's review queue." },
            { icon: Clock, done: false, active: true, label: "Eduardo reviewing your project", desc: "Eduardo is reviewing your information in detail." },
            { icon: FileText, done: false, active: false, label: "Personalised report in progress", desc: "Your detailed assessment and recommendations are being prepared." },
            { icon: MessageCircle, done: false, active: false, label: "Results delivered", desc: "You will receive updates through your client dashboard." },
          ].map((step) => (
            <div key={step.label} className="flex items-start gap-3">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  step.done ? "bg-green-100" : step.active ? "bg-[#faf9f7] border border-[#b67c2c]/30" : "bg-[#faf9f7] border border-[#ece8e1]"
                }`}
              >
                <step.icon
                  size={13}
                  className={step.done ? "text-green-600" : step.active ? "text-[#b67c2c]" : "text-[#9ca3af]"}
                />
              </div>
              <div>
                <p
                  className={`text-xs font-semibold ${
                    step.active ? "text-[#111A24]" : step.done ? "text-[#4b5564]" : "text-[#9ca3af]"
                  }`}
                >
                  {step.label}
                </p>
                <p className="text-[11px] text-[#6b7280] leading-relaxed mt-0.5">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#ece8e1] shadow-[0_8px_30px_rgba(0,0,0,0.06)] overflow-hidden">
        <div className="bg-[#faf9f7] border-b border-[#ece8e1] px-5 py-3">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#b67c2c]">Client portal</p>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-[#111A24] leading-snug">Track your project</h3>
            <p className="text-xs text-[#4b5564] mt-1.5 leading-relaxed">
              Access your dashboard to follow progress, view documents, messages and updates from Eduardo throughout your build.
            </p>
          </div>

          <Link href="/dashboard" className={WIZARD_SIDEBAR_BTN_CLASS}>
            <LayoutDashboard size={13} strokeWidth={2} />
            Go to dashboard
          </Link>

          <p className="text-[11px] text-[#9ca3af] text-center leading-relaxed">
            Use the login details sent to your email to access your project workspace.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-[#ece8e1] p-5">
        <div className="flex items-center gap-3 mb-2">
          <Clock size={16} className="text-[#b67c2c] shrink-0" />
          <p className="text-xs font-semibold text-[#111A24]">Estimated turnaround</p>
        </div>
        <p className="text-2xl font-bold text-[#111A24] mb-1">48 to 72 hours</p>
        <p className="text-xs text-[#6b7280] leading-relaxed">
          You will be notified when your full assessment is ready in your dashboard.
        </p>
      </div>
    </aside>
  );
}
