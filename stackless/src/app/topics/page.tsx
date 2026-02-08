/**
 * Topics Index Page — lists all available topics.
 *
 * Each topic links to /topics/[slug] which shows posts in that category.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { getAllTopics } from "@/lib/topics";

export const metadata: Metadata = {
  title: "Topics",
  description:
    "Browse Stackless posts by topic — databases, distributed systems, backend architecture, and more.",
};

export default function TopicsPage() {
  const topics = getAllTopics();

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-text-primary">Topics</h1>
      <p className="mt-2 text-text-secondary">
        Browse posts by engineering topic.
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {topics.map((topic) => (
          <Link
            key={topic.slug}
            href={`/topics/${topic.slug}`}
            className="group rounded-lg border border-border p-6 hover:border-brand-600 hover:bg-brand-50 transition-all"
          >
            <h2 className="text-xl font-semibold text-text-primary group-hover:text-brand-600 transition-colors">
              {topic.name}
            </h2>
            <p className="mt-2 text-sm text-text-secondary">
              {topic.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
