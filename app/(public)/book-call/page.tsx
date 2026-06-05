import { Suspense } from "react";
import { Metadata } from "next";
import BookCallFlow from "./BookCallFlow";

export const metadata: Metadata = {
  title: "Book a Call | Choose Your Service",
  description:
    "Explore Eduardo Mendes advisory services, choose the support that fits your project, and book a free 15-minute consultation.",
};

export default function BookCallPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center bg-white text-muted-foreground">
          Loading...
        </div>
      }
    >
      <BookCallFlow />
    </Suspense>
  );
}
