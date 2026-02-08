/**
 * Root Layout — wraps every page on the site.
 *
 * Responsibilities:
 * 1. Global metadata (title template, description, OG tags, Twitter card)
 * 2. Skip-to-content link for accessibility
 * 3. Navbar (sticky top)
 * 4. Main content area
 * 5. Footer
 * 6. JSON-LD structured data (WebSite schema on every page)
 *
 * SEO strategy:
 * - Title template: "{Page Title} — Stackless" (pages override the page part)
 * - Default OG image: /og-default.png (1200×630, generated once)
 * - Canonical URL set per-page via generateMetadata() in each route
 * - JSON-LD WebSite schema on all pages; Article schema added per-post
 */

import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import "./globals.css";

// ---------------------------------------------------------------------------
// Fonts — loaded via next/font for zero layout shift
// ---------------------------------------------------------------------------
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

// ---------------------------------------------------------------------------
// Global Metadata
// ---------------------------------------------------------------------------
const SITE_URL = "https://stackless.dev";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Stackless — Real engineering blogs, explained for students",
    template: "%s — Stackless",
  },
  description:
    "Stackless takes ideas from real company engineering blogs — Discord, Netflix, Uber, Stripe — and re-explains them so students can genuinely understand.",
  keywords: [
    "engineering blog",
    "system design",
    "students",
    "distributed systems",
    "software engineering",
    "Discord",
    "Netflix",
    "Uber",
    "Stripe",
    "explained",
  ],
  authors: [{ name: "Varun" }],
  creator: "Varun",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Stackless",
    title: "Stackless — Real engineering blogs, explained for students",
    description:
      "Stackless takes ideas from real company engineering blogs and re-explains them so students can genuinely understand.",
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "Stackless — Real engineering blogs, explained for students",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Stackless — Real engineering blogs, explained for students",
    description:
      "Stackless takes ideas from real company engineering blogs and re-explains them so students can genuinely understand.",
    images: ["/og-default.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    types: {
      "application/rss+xml": "/feed.xml",
    },
  },
};

// ---------------------------------------------------------------------------
// Layout Component
// ---------------------------------------------------------------------------
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        {/* JSON-LD: WebSite schema — helps search engines understand the site */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Stackless",
              url: SITE_URL,
              description:
                "Real engineering blogs, explained for students.",
              author: {
                "@type": "Person",
                name: "Varun",
              },
            }),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-surface text-text-primary font-sans antialiased">
        {/* Skip link — keyboard/screen-reader users jump past nav */}
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>

        <Navbar />

        <main id="main-content" className="flex-1">
          {children}
        </main>

        <Footer />
      </body>
    </html>
  );
}
