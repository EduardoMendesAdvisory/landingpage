import { Metadata } from "next";
import Link from "next/link";
import { Clock, FileText, MessageCircle, Phone, ShieldCheck, Star } from "lucide-react";

export const metadata: Metadata = {
  title: "My Dashboard | Eduardo Mendes Advisory",
  description: "Your project dashboard -- track progress and review updates from Eduardo.",
};

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-navy px-6 py-5 border-b border-white/10">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <Link href="/">
            <img
              src="https://rdeavyxckvkfwjvmxugs.supabase.co/storage/v1/object/public/media/logo%20EM_hor%20white.png"
              alt="Eduardo Mendes Advisory"
              className="h-9 w-auto"
            />
          </Link>
          <div className="hidden sm:flex items-center gap-2.5 border border-white/15 rounded-xl px-4 py-2.5">
            <ShieldCheck size={18} className="text-amber shrink-0" />
            <div className="text-xs leading-tight">
              <p className="text-white font-medium">Your information is secure</p>
              <p className="text-white/40">We never share your data</p>
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <main className="px-4 py-12">
        <div className="max-w-5xl mx-auto">

          {/* Welcome */}
          <div className="text-center mb-10">
            <div className="w-16 h-16 rounded-full bg-amber/10 flex items-center justify-center mx-auto mb-4">
              <Star size={28} className="text-amber" />
            </div>
            <h1 className="text-3xl font-bold text-navy mb-2">Your Project Dashboard</h1>
            <p className="text-gray-500 text-base max-w-md mx-auto leading-relaxed">
              Eduardo is reviewing your project. You&apos;ll be notified as soon as your personalised report is ready.
            </p>
          </div>

          {/* Status card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 mb-6 text-center max-w-lg mx-auto">
            <div className="flex items-center justify-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-full bg-amber/10 flex items-center justify-center">
                <Clock size={20} className="text-amber" />
              </div>
              <div className="text-left">
                <p className="font-bold text-navy">Review In Progress</p>
                <p className="text-xs text-gray-500">Eduardo is working on your report</p>
              </div>
            </div>

            <div className="space-y-3 text-left mb-6">
              {[
                { label: "Project information received", done: true },
                { label: "Eduardo reviewing your details", done: true },
                { label: "Personalised report in preparation", done: false },
                { label: "Full assessment delivered to you", done: false },
              ].map((step) => (
                <div key={step.label} className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${step.done ? "bg-green-100" : "bg-gray-100"}`}>
                    {step.done ? (
                      <svg className="w-3 h-3 text-green-600" fill="none" viewBox="0 0 12 12"><path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
                    ) : (
                      <div className="w-2 h-2 rounded-full bg-gray-300" />
                    )}
                  </div>
                  <p className={`text-sm ${step.done ? "text-gray-700" : "text-gray-400"}`}>{step.label}</p>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 rounded-xl px-4 py-3">
              <p className="text-xs text-gray-500">Estimated delivery: <span className="font-semibold text-navy">48 - 72 hours</span></p>
            </div>
          </div>

          {/* Contact + trust */}
          <div className="grid sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
              <FileText size={20} className="text-amber mx-auto mb-2" />
              <p className="text-xs font-semibold text-navy mb-1">Full Assessment</p>
              <p className="text-[11px] text-gray-500 leading-relaxed">Your detailed report will appear here when ready.</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
              <MessageCircle size={20} className="text-amber mx-auto mb-2" />
              <p className="text-xs font-semibold text-navy mb-1">Questions?</p>
              <p className="text-[11px] text-gray-500 leading-relaxed">Email us any time and we&apos;ll get back to you promptly.</p>
            </div>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
              <Phone size={20} className="text-amber mx-auto mb-2" />
              <p className="text-xs font-semibold text-navy mb-1">Call Eduardo</p>
              <a href="tel:0419112555" className="text-sm font-semibold text-navy hover:underline">0419 112 555</a>
            </div>
          </div>

          <p className="text-center text-xs text-gray-400 mt-8">
            Full client dashboard coming soon -- you&apos;ll be notified when it&apos;s available.
          </p>
        </div>
      </main>
    </div>
  );
}
