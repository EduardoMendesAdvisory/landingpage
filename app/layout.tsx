import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { FAVICON_URL } from "@/lib/media";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Eduardo Mendes | Owner Builder Advisory",
    template: "%s | Eduardo Mendes Advisory",
  },
  description:
    "Independent construction advisory for Australian homeowners, renovators, and owner builders. Build smarter. Save more.",
  keywords: ["owner builder", "construction advisory", "buildcheck", "builder quotes", "Australia"],
  icons: {
    icon: FAVICON_URL,
    apple: FAVICON_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
