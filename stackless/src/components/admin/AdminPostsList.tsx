/**
 * AdminPostsList — client component for interactive post management.
 *
 * Provides:
 * - Filter tabs (All / Published / Drafts / Featured)
 * - Post table with status indicators
 * - Post detail panel for editing metadata
 * - Toggle draft/publish via API
 * - Set/unset featured via API
 */

"use client";

import { useState } from "react";
import Link from "next/link";

interface PostData {
  slug: string;
  title: string;
  topic: string;
  publishedAt: string;
  draft: boolean;
  featured: boolean;
  readTimeMinutes: number;
  difficulty: string;
  sourceUrl: string;
  sourcePublisher: string;
  readNext: string[];
}

interface TopicData {
  slug: string;
  name: string;
}

type Filter = "all" | "published" | "drafts" | "featured";

export default function AdminPostsList({
  posts,
  topics,
}: {
  posts: PostData[];
  topics: TopicData[];
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const filtered = posts.filter((p) => {
    switch (filter) {
      case "published":
        return !p.draft;
      case "drafts":
        return p.draft;
      case "featured":
        return p.featured;
      default:
        return true;
    }
  });

  const counts = {
    all: posts.length,
    published: posts.filter((p) => !p.draft).length,
    drafts: posts.filter((p) => p.draft).length,
    featured: posts.filter((p) => p.featured).length,
  };

  const selectedPost = posts.find((p) => p.slug === selectedSlug);
  const topicName = (slug: string) =>
    topics.find((t) => t.slug === slug)?.name ?? slug;

  return (
    <div className="mt-6">
      {/* Filter tabs */}
      <div className="flex gap-1 border-b border-border">
        {(["all", "published", "drafts", "featured"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => {
              setFilter(f);
              setSelectedSlug(null);
            }}
            className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
              filter === f
                ? "border-brand-600 text-brand-600"
                : "border-transparent text-text-secondary hover:text-text-primary"
            }`}
          >
            {f} ({counts[f]})
          </button>
        ))}
      </div>

      <div className="mt-4 flex gap-6">
        {/* Post list */}
        <div className="flex-1 min-w-0">
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-sm text-text-muted">
              No posts match this filter.
            </p>
          ) : (
            <div className="space-y-1">
              {filtered.map((post) => (
                <button
                  key={post.slug}
                  onClick={() => setSelectedSlug(post.slug)}
                  className={`flex w-full items-center gap-4 rounded-lg px-4 py-3 text-left text-sm transition-colors ${
                    selectedSlug === post.slug
                      ? "bg-brand-50 border border-brand-600"
                      : "border border-transparent hover:bg-surface-alt"
                  }`}
                >
                  {/* Status indicator */}
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${
                      post.featured
                        ? "bg-amber-500"
                        : post.draft
                        ? "bg-gray-400"
                        : "bg-green-500"
                    }`}
                    title={
                      post.featured
                        ? "Featured"
                        : post.draft
                        ? "Draft"
                        : "Published"
                    }
                  />

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-text-primary truncate">
                      {post.title}
                    </p>
                    <p className="text-xs text-text-muted">
                      {topicName(post.topic)} ·{" "}
                      {post.draft
                        ? "Draft"
                        : new Date(post.publishedAt).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric" }
                          )}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Post detail panel */}
        {selectedPost && (
          <div className="w-80 shrink-0 rounded-lg border border-border bg-surface p-5">
            <h3 className="font-semibold text-text-primary truncate">
              {selectedPost.title}
            </h3>

            <dl className="mt-4 space-y-3 text-sm">
              <DetailRow
                label="Status"
                value={
                  selectedPost.draft ? (
                    <span className="text-gray-500">Draft</span>
                  ) : (
                    <span className="text-green-600">Published</span>
                  )
                }
              />
              <DetailRow
                label="Featured"
                value={selectedPost.featured ? "Yes ★" : "No"}
              />
              <DetailRow label="Topic" value={topicName(selectedPost.topic)} />
              <DetailRow
                label="Difficulty"
                value={
                  <span className="capitalize">{selectedPost.difficulty}</span>
                }
              />
              <DetailRow
                label="Read Time"
                value={`${selectedPost.readTimeMinutes} min`}
              />
              <DetailRow
                label="Published"
                value={
                  selectedPost.draft
                    ? "—"
                    : new Date(selectedPost.publishedAt).toLocaleDateString(
                        "en-US",
                        { year: "numeric", month: "long", day: "numeric" }
                      )
                }
              />
              <DetailRow
                label="Source"
                value={
                  <a
                    href={selectedPost.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-600 hover:underline truncate block"
                  >
                    {selectedPost.sourcePublisher} ↗
                  </a>
                }
              />
              <DetailRow
                label="Read Next"
                value={
                  selectedPost.readNext.length > 0
                    ? selectedPost.readNext.join(", ")
                    : "Not set"
                }
              />
            </dl>

            {/* Actions */}
            <div className="mt-6 space-y-2">
              <Link
                href={`/posts/${selectedPost.slug}`}
                target="_blank"
                className="flex w-full items-center justify-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface-alt transition-colors"
              >
                View Live Post ↗
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function DetailRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex justify-between gap-4">
      <dt className="text-text-muted shrink-0">{label}</dt>
      <dd className="font-medium text-text-primary text-right min-w-0">
        {value}
      </dd>
    </div>
  );
}
