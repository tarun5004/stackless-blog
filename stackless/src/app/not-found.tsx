/**
 * 404 Page — shown when a route doesn't match any page.
 *
 * Design: Friendly, helpful, on-brand. Points readers back to
 * the homepage or topics page. No dead-end.
 */

import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <p className="text-sm font-medium text-brand-600">404</p>
      <h1 className="mt-2 text-3xl font-bold text-text-primary sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-4 text-lg text-text-secondary">
        This page doesn&apos;t exist — but there&apos;s plenty to read on
        Stackless.
      </p>
      <div className="mt-8 flex justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
        >
          Go Home
        </Link>
        <Link
          href="/topics"
          className="inline-flex items-center rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-text-secondary hover:bg-surface-alt transition-colors"
        >
          Browse Topics
        </Link>
      </div>
    </div>
  );
}
