/**
 * AdminPostsList — client component for interactive post management.
 *
 * Features:
 * - Filter tabs (All / Published / Drafts / Featured)
 * - Post table with status indicators
 * - Post detail side panel
 * - Edit / Delete / Toggle draft actions
 * - New Post button at top
 */

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [actionStatus, setActionStatus] = useState<string | null>(null);

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

  async function handleToggleDraft(post: PostData) {
    setActionStatus("Saving...");
    try {
      const res = await fetch("/api/posts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: post.slug, draft: !post.draft }),
      });
      if (!res.ok) throw new Error();
      setActionStatus(post.draft ? "Published!" : "Moved to drafts!");
      router.refresh();
    } catch {
      setActionStatus("Failed to update.");
    }
    setTimeout(() => setActionStatus(null), 2000);
  }

  async function handleToggleFeatured(post: PostData) {
    setActionStatus("Saving...");
    try {
      const res = await fetch("/api/posts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: post.slug, featured: !post.featured }),
      });
      if (!res.ok) throw new Error();
      setActionStatus(post.featured ? "Unfeatured" : "Featured!");
      router.refresh();
    } catch {
      setActionStatus("Failed to update.");
    }
    setTimeout(() => setActionStatus(null), 2000);
  }

  async function handleDelete(post: PostData) {
    if (!confirm(`Delete "${post.title}"? This cannot be undone.`)) return;

    setActionStatus("Deleting...");
    try {
      const res = await fetch("/api/posts", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: post.slug }),
      });
      if (!res.ok) throw new Error();
      setActionStatus("Deleted!");
      setSelectedSlug(null);
      router.refresh();
    } catch {
      setActionStatus("Failed to delete.");
    }
    setTimeout(() => setActionStatus(null), 2000);
  }

  return (
    <div className="mt-6">
      {/* Header row: filters + new post button */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1 border-b border-border">
          {(["all", "published", "drafts", "featured"] as Filter[]).map(
            (f) => (
              <button
                key={f}
                onClick={() => {
                  setFilter(f);
                  setSelectedSlug(null);
                }}
                className={`px-4 py-2 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                  filter === f
                    ? "border-text-primary text-text-primary"
                    : "border-transparent text-text-muted hover:text-text-primary"
                }`}
              >
                {f}{" "}
                <span className="text-text-muted">({counts[f]})</span>
              </button>
            )
          )}
        </div>

        <Link
          href="/admin/posts/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-text-primary px-4 py-2 text-sm font-medium text-surface hover:bg-text-secondary transition-colors"
        >
          <span aria-hidden="true">+</span>
          New Post
        </Link>
      </div>

      {/* Status toast */}
      {actionStatus && (
        <div className="mt-3 rounded-lg border border-border bg-surface-alt px-4 py-2 text-sm text-text-secondary">
          {actionStatus}
        </div>
      )}

      <div className="mt-4 flex gap-6">
        {/* Post list */}
        <div className="flex-1 min-w-0">
          {filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-surface-alt">
                <span className="text-xl text-text-muted">▤</span>
              </div>
              <p className="mt-3 text-sm font-medium text-text-primary">
                No posts found
              </p>
              <p className="mt-1 text-sm text-text-muted">
                {filter === "all"
                  ? "Create your first post to get started."
                  : `No ${filter} posts yet.`}
              </p>
              {filter === "all" && (
                <Link
                  href="/admin/posts/new"
                  className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-text-primary px-4 py-2 text-sm font-medium text-surface hover:bg-text-secondary transition-colors"
                >
                  <span aria-hidden="true">+</span>
                  New Post
                </Link>
              )}
            </div>
          ) : (
            <div className="space-y-1">
              {filtered.map((post) => (
                <button
                  key={post.slug}
                  onClick={() => setSelectedSlug(post.slug)}
                  className={`flex w-full items-center gap-4 rounded-lg px-4 py-3 text-left text-sm transition-colors ${
                    selectedSlug === post.slug
                      ? "bg-surface-alt ring-1 ring-border"
                      : "hover:bg-surface-alt"
                  }`}
                >
                  {/* Status dot */}
                  <span
                    className={`h-2 w-2 shrink-0 rounded-full ${
                      post.featured
                        ? "bg-amber-500"
                        : post.draft
                        ? "bg-gray-300"
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
                    <p className="text-xs text-text-muted mt-0.5">
                      {topicName(post.topic)} &middot;{" "}
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

        {/* Detail panel */}
        {selectedPost && (
          <div className="w-80 shrink-0 rounded-lg border border-border bg-surface p-5">
            <h3 className="font-semibold text-text-primary text-sm leading-snug">
              {selectedPost.title}
            </h3>

            <dl className="mt-4 space-y-3 text-xs">
              <DetailRow
                label="Status"
                value={
                  selectedPost.draft ? (
                    <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-gray-600">
                      Draft
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-green-50 px-2 py-0.5 text-green-700">
                      Published
                    </span>
                  )
                }
              />
              <DetailRow
                label="Featured"
                value={selectedPost.featured ? "Yes" : "No"}
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
                        { year: "numeric", month: "short", day: "numeric" }
                      )
                }
              />
              <DetailRow
                label="Source"
                value={
                  selectedPost.sourceUrl ? (
                    <a
                      href={selectedPost.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-600 hover:underline truncate block"
                    >
                      {selectedPost.sourcePublisher} ↗
                    </a>
                  ) : (
                    "—"
                  )
                }
              />
            </dl>

            {/* Actions */}
            <div className="mt-6 space-y-2">
              <Link
                href={`/admin/posts/${selectedPost.slug}`}
                className="flex w-full items-center justify-center rounded-lg bg-text-primary px-4 py-2 text-xs font-medium text-surface hover:bg-text-secondary transition-colors"
              >
                Edit Post
              </Link>
              <button
                onClick={() => handleToggleDraft(selectedPost)}
                className="flex w-full items-center justify-center rounded-lg border border-border px-4 py-2 text-xs font-medium text-text-secondary hover:bg-surface-alt transition-colors"
              >
                {selectedPost.draft ? "Publish" : "Unpublish"}
              </button>
              <button
                onClick={() => handleToggleFeatured(selectedPost)}
                className="flex w-full items-center justify-center rounded-lg border border-border px-4 py-2 text-xs font-medium text-text-secondary hover:bg-surface-alt transition-colors"
              >
                {selectedPost.featured ? "Remove Featured" : "Set Featured"}
              </button>
              <Link
                href={`/posts/${selectedPost.slug}`}
                target="_blank"
                className="flex w-full items-center justify-center rounded-lg border border-border px-4 py-2 text-xs font-medium text-text-secondary hover:bg-surface-alt transition-colors"
              >
                View Live ↗
              </Link>
              <button
                onClick={() => handleDelete(selectedPost)}
                className="flex w-full items-center justify-center rounded-lg border border-red-200 px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                Delete Post
              </button>
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
