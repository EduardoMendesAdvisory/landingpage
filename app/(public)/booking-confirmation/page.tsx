import { Metadata } from "next";
import Link from "next/link";
import { UploadQuoteButton } from "@/components/shared/UploadQuoteButton";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Booking Confirmed" };

export default function BookingConfirmationPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md text-center">
        <div className="text-5xl mb-6">✅</div>
        <h1 className="text-2xl font-bold text-navy mb-3">
          Your call is confirmed!
        </h1>
        <p className="text-muted-foreground mb-6">
          Eduardo is looking forward to speaking with you. You&apos;ll receive a
          calendar invitation and reminder email shortly.
        </p>
        <p className="text-sm text-muted-foreground mb-8">
          To get the most from your call, complete the free assessment so
          Eduardo can review your project before you speak.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <UploadQuoteButton
            label="Complete Assessment"
            variant="primary"
            size="compact"
            showArrow={false}
            className="justify-center"
          />
          <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
