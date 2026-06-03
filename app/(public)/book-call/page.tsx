import { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Book a Free Strategy Call",
  description:
    "Book a free 30-minute strategy call with Eduardo to discuss your project.",
};

export default function BookCallPage() {
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL;

  return (
    <div className="bg-white">
      <section className="bg-navy text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-warm-soil text-sm font-semibold uppercase tracking-widest mb-3">
            Free Consultation
          </p>
          <h1 className="text-4xl font-bold mb-4">Book a Free Strategy Call</h1>
          <p className="text-white/70 text-lg">
            30 minutes with Eduardo to discuss your project and how he can help.
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-8 mb-10">
            <div>
              <h2 className="text-xl font-bold text-navy mb-4">
                What to expect
              </h2>
              <ul className="space-y-3">
                {[
                  "30-minute video or phone call",
                  "Eduardo reviews your project details beforehand",
                  "Clear advice on what support you need",
                  "No sales pressure — just honest guidance",
                  "Follow-up email with key takeaways",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="text-warm-soil font-bold mt-0.5 shrink-0">✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-light-bg rounded-2xl p-6 flex flex-col gap-4">
              <div>
                <p className="text-sm font-semibold text-navy mb-1">Duration</p>
                <p className="text-muted-foreground text-sm">30 minutes</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-navy mb-1">Cost</p>
                <p className="text-2xl font-bold text-navy">Free</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-navy mb-1">Format</p>
                <p className="text-muted-foreground text-sm">
                  Video call (Google Meet or Zoom) or phone
                </p>
              </div>
            </div>
          </div>

          {/* Calendly embed placeholder */}
          <div className="bg-light-bg rounded-2xl p-8 text-center">
            {calendlyUrl ? (
              <div>
                <p className="text-sm text-muted-foreground mb-4">
                  Select a time that works for you:
                </p>
                {/* Calendly inline embed — integrated in Sprint 04 */}
                <div className="bg-white rounded-xl h-[500px] flex items-center justify-center border border-border">
                  <div className="text-center">
                    <p className="text-muted-foreground text-sm mb-4">
                      Calendly booking will appear here after Sprint 04 integration.
                    </p>
                    <a
                      href={calendlyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        buttonVariants(),
                        "bg-navy hover:bg-navy/90 text-white border-transparent"
                      )}
                    >
                      Open Calendly →
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-navy font-semibold mb-2">
                  Booking calendar coming soon
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  Complete your assessment first — Eduardo will reach out within
                  1 business day to arrange a time.
                </p>
                <Link
                  href="/assessment"
                  className={cn(
                    buttonVariants(),
                    "bg-navy hover:bg-navy/90 text-white border-transparent"
                  )}
                >
                  Complete Free Assessment First
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
