import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-light-bg">
      {/* Minimal header */}
      <header className="bg-navy py-4 px-6">
        <Link
          href="/"
          className="flex items-center gap-2 w-fit"
        >
          <span className="text-warm-soil text-xl font-bold">EM</span>
          <span className="text-white text-sm">Eduardo Mendes Advisory</span>
        </Link>
      </header>

      {/* Centered card */}
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        {children}
      </main>

      <footer className="py-4 text-center">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Eduardo Mendes Advisory
        </p>
      </footer>
    </div>
  );
}
