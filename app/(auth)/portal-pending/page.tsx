import Link from "next/link";
import { Metadata } from "next";
import { Clock, CalendarDays } from "lucide-react";

export const metadata: Metadata = { title: "Portal Access Pending" };

export default function PortalPendingPage() {
  return (
    <div className="w-full max-w-md mx-auto text-center">
      <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-warm-soil/10 text-warm-soil mb-6">
        <Clock size={28} />
      </div>

      <h1 className="text-2xl font-bold text-navy mb-3">Portal access pending</h1>
      <p className="text-sm text-muted-foreground leading-relaxed mb-6">
        Your account is registered, but Eduardo has not activated your client portal yet.
        After your consultation or once your onboarding is approved, you will receive access
        to your project dashboard, documents, and messages.
      </p>

      <div className="bg-gray-50 border border-gray-100 rounded-xl p-5 text-left space-y-3 mb-6">
        <p className="text-xs font-semibold text-navy uppercase tracking-wide">
          What you can do now
        </p>
        <ul className="text-sm text-muted-foreground space-y-2">
          <li className="flex items-start gap-2">
            <CalendarDays size={15} className="text-warm-soil shrink-0 mt-0.5" />
            Book a free consultation with Eduardo
          </li>
          <li>Complete or continue your project assessment</li>
          <li>Check your email for updates from Eduardo</li>
        </ul>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/book-call"
          className="inline-flex items-center justify-center gap-2 bg-navy hover:bg-navy/90 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
        >
          <CalendarDays size={15} />
          Book a Call
        </Link>
        <Link
          href="/assessment"
          className="inline-flex items-center justify-center border border-border text-navy hover:bg-gray-50 text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors"
        >
          Continue Assessment
        </Link>
      </div>

      <p className="text-xs text-muted-foreground mt-6">
        Already activated?{" "}
        <Link href="/login?redirect=/buildiq/dashboard" className="text-warm-soil hover:underline">
          Sign in again
        </Link>
      </p>
    </div>
  );
}
