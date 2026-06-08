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
    icon: [
      { url: FAVICON_URL, type: "image/png" },
      { url: "/favicon.png", type: "image/png", sizes: "580x595" },
      { url: "/favicon-48.png", type: "image/png", sizes: "48x48" },
    ],
    apple: [{ url: FAVICON_URL, type: "image/png" }, { url: "/favicon.png", type: "image/png" }],
    shortcut: FAVICON_URL,
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
