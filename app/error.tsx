"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-light-bg px-4">
      <div className="text-center max-w-md">
        <p className="text-6xl font-bold text-navy mb-4">500</p>
        <h1 className="text-2xl font-semibold text-navy mb-3">
          Something went wrong
        </h1>
        <p className="text-muted-foreground mb-8">
          An unexpected error occurred. Our team has been notified. Please try
          again or contact us if the problem persists.
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset}>Try Again</Button>
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
