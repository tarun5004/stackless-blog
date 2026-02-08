/**
 * Navbar — top-level site navigation.
 *
 * Renders on every page. Keeps the reader oriented with:
 * - Stackless logo/wordmark (links to home)
 * - Primary nav links: Topics, Paths, About
 * - RSS feed icon (always visible — respects the "subscribe via RSS" model)
 *
 * Design decisions:
 * - No hamburger menu in v1. The nav has only 3–4 links; they fit on mobile.
 * - No search in v1 (gated to v2 per MVP.md, triggered when >30 posts).
 * - Sticky top bar for easy access while reading long posts.
 */

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur-sm">
      <nav
        className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 sm:px-6"
        aria-label="Main navigation"
      >
        {/* Logo / Wordmark */}
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-text-primary hover:text-brand-600 transition-colors"
        >
          Stackless
        </Link>

        {/* Nav Links */}
        <div className="flex items-center gap-6">
          <Link
            href="/topics"
            className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            Topics
          </Link>
          <Link
            href="/paths"
            className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            Paths
          </Link>
          <Link
            href="/about"
            className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors"
          >
            About
          </Link>

          {/* Search */}
          <Link
            href="/search"
            className="text-text-muted hover:text-brand-600 transition-colors"
            aria-label="Search posts"
            title="Search"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </Link>

          {/* RSS Feed Link */}
          <a
            href="/feed.xml"
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-muted hover:text-brand-600 transition-colors"
            aria-label="RSS Feed"
            title="Subscribe via RSS"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="h-5 w-5"
              aria-hidden="true"
            >
              <circle cx="6.18" cy="17.82" r="2.18" />
              <path d="M4 4.44v2.83c7.03 0 12.73 5.7 12.73 12.73h2.83c0-8.59-6.97-15.56-15.56-15.56zm0 5.66v2.83c3.9 0 7.07 3.17 7.07 7.07h2.83c0-5.47-4.43-9.9-9.9-9.9z" />
            </svg>
          </a>
        </div>
      </nav>
    </header>
  );
}
