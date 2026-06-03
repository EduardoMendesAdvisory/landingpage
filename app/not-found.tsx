import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-light-bg px-4">
      <div className="text-center max-w-md">
        <p className="text-6xl font-bold text-navy mb-4">404</p>
        <h1 className="text-2xl font-semibold text-navy mb-3">Page Not Found</h1>
        <p className="text-muted-foreground mb-8">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/" className={cn(buttonVariants())}>
            Back to Home
          </Link>
          <Link href="/contact" className={cn(buttonVariants({ variant: "outline" }))}>
            Contact Us
          </Link>
        </div>
      </div>
    </div>
  );
}
