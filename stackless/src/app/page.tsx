/**
 * Homepage — the front door of Stackless.
 *
 * Structure (from INFORMATION-ARCHITECTURE.md):
 * 1. Hero section — tagline + value proposition
 * 2. Featured Post — manually curated highlight
 * 3. Latest Posts — reverse-chronological list
 * 4. Topic links — discover by category
 */

import Link from "next/link";
import { getPosts } from "@/db/queries/posts";
import { getTopics } from "@/db/queries/topics";
import PostCard from "@/components/ui/PostCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const posts = await getPosts();
  const topics = await getTopics();
  const featuredPost = posts.find((p) => p.featured);
  const latestPosts = posts.filter((p) => !p.featured);

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6">
      {/* ---------------------------------------------------------------- */}
      {/* Hero Section                                                      */}
      {/* ---------------------------------------------------------------- */}
      <section className="py-16 sm:py-24">
        <h1 className="text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
          Real engineering blogs,
          <br />
          <span className="text-brand-600">explained for students.</span>
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-text-secondary leading-relaxed">
          Companies like Discord, Netflix, and Uber publish incredible
          engineering blogs — but they&apos;re written for senior engineers.
          Stackless re-explains them so you can actually understand what&apos;s
          being built and why.
        </p>
        <div className="mt-8 flex gap-4">
          <Link
            href="/topics"
            className="inline-flex items-center rounded-lg bg-brand-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-700 transition-colors"
          >
            Browse Topics
          </Link>
          <Link
            href="/about"
            className="inline-flex items-center rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-text-secondary hover:bg-surface-alt transition-colors"
          >
            Learn More
          </Link>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Featured Post (if one is flagged)                                 */}
      {/* ---------------------------------------------------------------- */}
      {featuredPost && (
        <section className="border-t border-border py-12">
          <p className="text-xs font-semibold uppercase tracking-wider text-brand-600">
            Featured
          </p>
          <Link
            href={`/posts/${featuredPost.slug}`}
            className="group mt-3 block"
          >
            <h2 className="text-2xl font-bold text-text-primary group-hover:text-brand-600 transition-colors sm:text-3xl">
              {featuredPost.title}
            </h2>
            <p className="mt-3 text-text-secondary leading-relaxed">
              {featuredPost.summary}
            </p>
            <div className="mt-3 flex items-center gap-3 text-sm text-text-muted">
              <span className="capitalize">{featuredPost.topic}</span>
              <span aria-hidden="true">·</span>
              <span>{featuredPost.readTimeMinutes} min read</span>
              <span aria-hidden="true">·</span>
              <time dateTime={featuredPost.publishedAt}>
                {new Date(featuredPost.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </time>
            </div>
          </Link>
        </section>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* Latest Posts                                                      */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-t border-border py-12">
        <h2 className="text-2xl font-bold text-text-primary">Latest Posts</h2>
        {latestPosts.length === 0 ? (
          <p className="mt-4 text-text-secondary">
            Posts are coming soon. Check back shortly.
          </p>
        ) : (
          <div className="mt-6 space-y-4">
            {latestPosts.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* Browse by Topic                                                   */}
      {/* ---------------------------------------------------------------- */}
      <section className="border-t border-border py-12">
        <h2 className="text-2xl font-bold text-text-primary">
          Explore by Topic
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => (
            <Link
              key={topic.slug}
              href={`/topics/${topic.slug}`}
              className="group rounded-lg border border-border p-5 hover:border-brand-600 hover:bg-brand-50 transition-all"
            >
              <h3 className="font-semibold text-text-primary group-hover:text-brand-600 transition-colors">
                {topic.name}
              </h3>
              <p className="mt-1 text-sm text-text-secondary">
                {topic.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
