/**
 * ReadNext — suggests 1-2 related posts at the bottom of a blog post.
 *
 * Shows curated or algorithmic suggestions for what to read next.
 * Each suggestion shows title, topic, and read time.
 */

import Link from "next/link";
import type { ReadNextSuggestion } from "@/lib/readnext";

interface ReadNextProps {
  suggestions: ReadNextSuggestion[];
}

export default function ReadNext({ suggestions }: ReadNextProps) {
  if (suggestions.length === 0) return null;

  return (
    <section className="mt-12 border-t border-border pt-8">
      <h2 className="text-lg font-bold text-text-primary">Read Next</h2>
      <div className="mt-4 space-y-3">
        {suggestions.map((s) => (
          <Link
            key={s.slug}
            href={`/posts/${s.slug}`}
            className="group flex items-start gap-3 rounded-lg border border-border p-4 hover:border-brand-600 hover:bg-brand-50 transition-all"
          >
            <span className="mt-0.5 text-brand-600" aria-hidden="true">
              →
            </span>
            <div>
              <h3 className="font-medium text-text-primary group-hover:text-brand-600 transition-colors">
                {s.title}
              </h3>
              <p className="mt-1 text-xs text-text-muted">
                {s.topic} · {s.summary.substring(0, 80)}
                {s.summary.length > 80 ? "…" : ""}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
