/**
 * Paths Index Page — lists all learning paths.
 *
 * Learning paths are curated sequences of posts that teach a topic
 * from scratch. This page lists all available paths.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { getPaths } from "@/db/queries/paths";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Learning Paths",
  description:
    "Follow guided learning paths on Stackless — curated sequences of posts that take you from fundamentals to real-world engineering.",
};

export default async function PathsPage() {
  const paths = await getPaths();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-text-primary">Learning Paths</h1>
      <p className="mt-2 text-text-secondary">
        Curated sequences of posts that build your understanding step by step.
      </p>

      {paths.length === 0 ? (
        <p className="mt-10 text-text-muted">
          Learning paths are being curated. Check back soon.
        </p>
      ) : (
        <div className="mt-10 space-y-6">
          {paths.map((p) => (
            <Link
              key={p.slug}
              href={`/paths/${p.slug}`}
              className="group block rounded-lg border border-border p-6 hover:border-brand-600 hover:bg-brand-50 transition-all"
            >
              <h2 className="text-xl font-semibold text-text-primary group-hover:text-brand-600 transition-colors">
                {p.title}
              </h2>
              <p className="mt-2 text-sm text-text-secondary">
                {p.description}
              </p>
              <p className="mt-3 text-xs text-text-muted">
                {p.posts.length} post{p.posts.length !== 1 ? "s" : ""} in
                this path
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
