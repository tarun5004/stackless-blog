/**
 * PostCard — reusable post list item used on topic pages, homepage, etc.
 *
 * Shows: title, summary, topic tag, date, read time.
 * Links to the full post page.
 */

import Link from "next/link";
import type { PostEntry } from "@/lib/content";

interface PostCardProps {
  post: PostEntry;
}

export default function PostCard({ post }: PostCardProps) {
  const { title, summary, publishedAt, readTimeMinutes, topic, difficulty } =
    post.frontmatter;

  return (
    <Link
      href={`/posts/${post.slug}`}
      className="group block rounded-lg border border-border p-6 hover:border-brand-600 hover:bg-brand-50 transition-all"
    >
      {/* Meta row */}
      <div className="flex items-center gap-3 text-xs text-text-muted">
        <time dateTime={publishedAt}>
          {new Date(publishedAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </time>
        <span aria-hidden="true">·</span>
        <span>{readTimeMinutes} min read</span>
        <span aria-hidden="true">·</span>
        <span className="capitalize">{difficulty}</span>
      </div>

      {/* Title */}
      <h3 className="mt-2 text-lg font-semibold text-text-primary group-hover:text-brand-600 transition-colors">
        {title}
      </h3>

      {/* Summary */}
      <p className="mt-2 text-sm text-text-secondary line-clamp-2">
        {summary}
      </p>

      {/* Topic tag */}
      <div className="mt-4">
        <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-600">
          {topic}
        </span>
      </div>
    </Link>
  );
}
