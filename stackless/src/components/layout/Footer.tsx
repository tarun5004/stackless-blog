/**
 * Footer — site-wide footer.
 *
 * Appears on every page. Contains:
 * - Stackless tagline
 * - Duplicate nav links (Topics, Paths, About, RSS) for accessibility
 * - Attribution line
 *
 * Design decisions:
 * - No newsletter signup in v1 (gated to v2 per MVP.md).
 * - No social links beyond RSS in v1.
 * - Subtle, light background to visually separate from content.
 */

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface-alt">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        {/* Top section: Branding + Nav */}
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          {/* Brand */}
          <div>
            <Link
              href="/"
              className="text-lg font-bold text-text-primary hover:text-brand-600 transition-colors"
            >
              Stackless
            </Link>
            <p className="mt-1 text-sm text-text-secondary max-w-xs">
              Real engineering blogs, explained for students.
            </p>
          </div>

          {/* Footer Nav */}
          <nav
            className="flex flex-wrap gap-x-6 gap-y-2 text-sm"
            aria-label="Footer navigation"
          >
            <Link
              href="/topics"
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              Topics
            </Link>
            <Link
              href="/paths"
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              Paths
            </Link>
            <Link
              href="/about"
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              About
            </Link>
            <a
              href="/feed.xml"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-text-primary transition-colors"
            >
              RSS
            </a>
          </nav>
        </div>

        {/* Bottom section: Attribution */}
        <div className="mt-8 border-t border-border pt-6">
          <p className="text-xs text-text-muted">
            © {new Date().getFullYear()} Stackless. Built with{" "}
            <a
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-text-secondary transition-colors"
            >
              Next.js
            </a>{" "}
            and a genuine love for teaching.
          </p>
        </div>
      </div>
    </footer>
  );
}
