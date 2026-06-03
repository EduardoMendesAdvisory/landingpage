import { Metadata } from "next";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Unauthorized" };

export default function UnauthorizedPage() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md text-center">
        <p className="text-4xl font-bold text-navy mb-3">403</p>
        <h1 className="text-2xl font-semibold text-navy mb-3">
          Access Denied
        </h1>
        <p className="text-muted-foreground mb-8">
          You don&apos;t have permission to view this page. Please sign in with
          an account that has the required access level.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/login"
            className={cn(
              buttonVariants(),
              "bg-navy hover:bg-navy/90 text-white border-transparent"
            )}
          >
            Sign In
          </Link>
          <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
