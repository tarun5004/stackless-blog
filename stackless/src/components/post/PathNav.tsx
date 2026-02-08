/**
 * PathNav — learning path navigation shown when a post is part of a path.
 *
 * Displays: path name, previous post, next post, progress indicator.
 * Only rendered when the current post belongs to a learning path.
 */

import Link from "next/link";
import type { PathNavData } from "@/lib/paths";

interface PathNavProps {
  pathNav: PathNavData;
}

export default function PathNav({ pathNav }: PathNavProps) {
  return (
    <section className="mt-12 rounded-lg border border-brand-600 bg-brand-50 p-6">
      <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
        Learning Path
      </p>
      <Link
        href={`/paths/${pathNav.pathSlug}`}
        className="mt-1 block text-lg font-bold text-text-primary hover:text-brand-600 transition-colors"
      >
        {pathNav.pathTitle}
      </Link>
      <p className="mt-1 text-xs text-text-muted">
        Post {pathNav.currentIndex + 1} of {pathNav.totalPosts}
      </p>

      {/* Previous / Next navigation */}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-between">
        {pathNav.previous ? (
          <Link
            href={`/posts/${pathNav.previous.slug}`}
            className="group flex items-center gap-2 text-sm text-text-secondary hover:text-brand-600 transition-colors"
          >
            <span aria-hidden="true">←</span>
            <span>
              <span className="block text-xs text-text-muted">Previous</span>
              <span className="font-medium group-hover:underline">
                {pathNav.previous.title}
              </span>
            </span>
          </Link>
        ) : (
          <div />
        )}

        {pathNav.next ? (
          <Link
            href={`/posts/${pathNav.next.slug}`}
            className="group flex items-center gap-2 text-sm text-text-secondary hover:text-brand-600 transition-colors sm:text-right"
          >
            <span>
              <span className="block text-xs text-text-muted">Next</span>
              <span className="font-medium group-hover:underline">
                {pathNav.next.title}
              </span>
            </span>
            <span aria-hidden="true">→</span>
          </Link>
        ) : (
          <Link
            href="/paths"
            className="text-sm font-medium text-brand-600 hover:underline sm:text-right"
          >
            You&apos;ve completed this path! → View all paths
          </Link>
        )}
      </div>
    </section>
  );
}
