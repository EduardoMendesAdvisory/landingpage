import { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Eduardo Mendes Advisory.",
};

export default function ContactPage() {
  return (
    <div className="bg-white">
      <section className="bg-navy text-white py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Get in Touch</h1>
          <p className="text-white/70 text-lg">
            Have a question about your project? Eduardo would love to hear from you.
          </p>
        </div>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto grid sm:grid-cols-2 gap-8">
          {/* Contact options */}
          <div className="space-y-6">
            <div>
              <h2 className="text-xl font-bold text-navy mb-4">
                How to reach us
              </h2>
              <div className="space-y-4">
                <div className="bg-light-bg rounded-xl p-5">
                  <p className="text-sm font-semibold text-navy mb-1">Book a Call</p>
                  <p className="text-sm text-muted-foreground mb-3">
                    The fastest way to get advice. Book a free 30-minute strategy
                    call directly in Eduardo&apos;s calendar.
                  </p>
                  <Link
                    href="/book-call"
                    className={cn(
                      buttonVariants({ size: "sm" }),
                      "bg-navy hover:bg-navy/90 text-white border-transparent"
                    )}
                  >
                    Book Free Call
                  </Link>
                </div>

                <div className="bg-light-bg rounded-xl p-5">
                  <p className="text-sm font-semibold text-navy mb-1">
                    Start Assessment
                  </p>
                  <p className="text-sm text-muted-foreground mb-3">
                    Complete the free assessment and Eduardo will review your
                    project details before your call.
                  </p>
                  <Link
                    href="/assessment"
                    className={cn(
                      buttonVariants({ size: "sm", variant: "outline" })
                    )}
                  >
                    Free Assessment
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Business info */}
          <div className="space-y-5">
            <h2 className="text-xl font-bold text-navy">Business Details</h2>
            <div className="space-y-3 text-sm text-muted-foreground">
              <p>
                <span className="font-semibold text-navy block">Business</span>
                Eduardo Mendes Advisory
              </p>
              <p>
                <span className="font-semibold text-navy block">Service Area</span>
                Australia-wide (all states)
              </p>
              <p>
                <span className="font-semibold text-navy block">
                  Primary Contact
                </span>
                Via booking or assessment — we respond to all enquiries within 1
                business day.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
