"use client";

import { useState, useMemo } from "react";
import Link from "next/link";

interface PostData {
  slug: string;
  title: string;
  summary: string;
  topic: string;
  publishedAt: string;
  sourcePublisher: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  readTimeMinutes: number;
}

interface Topic {
  slug: string;
  name: string;
  description: string;
}

interface SearchViewProps {
  posts: PostData[];
  topics: Topic[];
}

export default function SearchView({ posts, topics }: SearchViewProps) {
  const [query, setQuery] = useState("");
  const [topicFilter, setTopicFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");

  const results = useMemo(() => {
    let filtered = posts;

    // Topic filter
    if (topicFilter !== "all") {
      filtered = filtered.filter((p) => p.topic === topicFilter);
    }

    // Difficulty filter
    if (difficultyFilter !== "all") {
      filtered = filtered.filter((p) => p.difficulty === difficultyFilter);
    }

    // Text search
    if (query.trim()) {
      const q = query.toLowerCase().trim();
      const terms = q.split(/\s+/);

      filtered = filtered.filter((p) => {
        const searchable = [
          p.title,
          p.summary,
          p.topic,
          p.sourcePublisher,
        ]
          .join(" ")
          .toLowerCase();

        return terms.every((term) => searchable.includes(term));
      });
    }

    return filtered;
  }, [posts, query, topicFilter, difficultyFilter]);

  return (
    <div className="mt-6">
      {/* Search input */}
      <div className="relative">
        <svg
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
          />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search posts…"
          className="w-full rounded-lg border border-border bg-surface py-2.5 pl-10 pr-4 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-600 focus:outline-none focus:ring-1 focus:ring-brand-600"
          autoFocus
        />
      </div>

      {/* Filters */}
      <div className="mt-4 flex flex-wrap gap-3">
        <select
          value={topicFilter}
          onChange={(e) => setTopicFilter(e.target.value)}
          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-text-secondary focus:border-brand-600 focus:outline-none"
        >
          <option value="all">All Topics</option>
          {topics.map((t) => (
            <option key={t.slug} value={t.slug}>
              {t.name}
            </option>
          ))}
        </select>

        <select
          value={difficultyFilter}
          onChange={(e) => setDifficultyFilter(e.target.value)}
          className="rounded-lg border border-border bg-surface px-3 py-1.5 text-sm text-text-secondary focus:border-brand-600 focus:outline-none"
        >
          <option value="all">All Levels</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>

        {(query || topicFilter !== "all" || difficultyFilter !== "all") && (
          <button
            onClick={() => {
              setQuery("");
              setTopicFilter("all");
              setDifficultyFilter("all");
            }}
            className="text-xs text-text-muted hover:text-text-secondary transition-colors"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Results count */}
      <p className="mt-4 text-sm text-text-muted">
        {results.length} post{results.length !== 1 ? "s" : ""}{" "}
        {query.trim() ? `matching "${query.trim()}"` : ""}
      </p>

      {/* Results */}
      <div className="mt-4 space-y-3">
        {results.map((post) => (
          <Link
            key={post.slug}
            href={`/posts/${post.slug}`}
            className="block rounded-lg border border-border bg-surface p-4 hover:border-brand-600/30 hover:bg-brand-50/30 transition-colors"
          >
            <h2 className="font-medium text-text-primary">{post.title}</h2>
            <p className="mt-1 text-sm text-text-secondary line-clamp-2">
              {post.summary}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-text-muted">
              <span className="capitalize">{post.topic.replace("-", " ")}</span>
              <span aria-hidden="true">·</span>
              <span>{post.sourcePublisher}</span>
              <span aria-hidden="true">·</span>
              <span className="capitalize">{post.difficulty}</span>
              <span aria-hidden="true">·</span>
              <span>{post.readTimeMinutes} min</span>
              <span aria-hidden="true">·</span>
              <time dateTime={post.publishedAt}>
                {new Date(post.publishedAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </time>
            </div>
          </Link>
        ))}
      </div>

      {results.length === 0 && (
        <div className="mt-8 text-center text-sm text-text-muted">
          <p>No posts found. Try a different search term or filter.</p>
        </div>
      )}
    </div>
  );
}
