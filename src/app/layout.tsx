import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Compound Design",
    template: "%s — Compound Design",
  },
  description:
    "A living framework for Design Engineers building web applications with humans and AI agents. Build the application. Improve the system that builds the next one.",
  applicationName: "Compound Design",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
  // Deliberately kept while the product experience is in preview. Search indexing is a separate,
  // later decision (docs/frames/2026-09-09-product-experience.md, "Non-goals").
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#0b0c0b",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <a className="skip" href="#content">
          Skip to content
        </a>
        <SiteHeader />
        <main id="content" tabIndex={-1}>
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
