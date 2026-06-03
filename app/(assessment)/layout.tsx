import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free Project Assessment",
};

export default function AssessmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-light-bg">
      <header className="bg-navy py-4 px-6">
        <Link href="/" className="flex items-center gap-2 w-fit">
          <span className="text-warm-soil text-xl font-bold">EM</span>
          <span className="text-white text-sm">Eduardo Mendes Advisory</span>
        </Link>
      </header>
      <main className="flex-1 flex flex-col">{children}</main>
    </div>
  );
}
