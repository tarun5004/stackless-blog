/**
 * Blog Post Page — the core reading experience.
 *
 * Renders a full blog post with:
 * - Article header (date, time, difficulty, topic, source link)
 * - Markdown body rendered via react-markdown
 * - Learning path navigation (if the post belongs to a path)
 * - ReadNext suggestions
 * - JSON-LD structured data
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { getPosts, getPostBySlug } from "@/db/queries/posts";
import { getPathNavForPost } from "@/db/queries/paths";
import { getReadNextSuggestions } from "@/lib/readnext";
import ReadNext from "@/components/ui/ReadNext";
import PathNav from "@/components/ui/PathNav";
import Link from "next/link";

export const dynamic = "force-dynamic";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.summary,
    openGraph: {
      type: "article",
      title: `${post.title} — Stackless`,
      description: post.summary,
      publishedTime: post.publishedAt,
      authors: ["Varun"],
      images: post.ogImage ? [`/content/images/${post.ogImage}`] : ["/og-default.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} — Stackless`,
      description: post.summary,
    },
    other: {
      "article:publisher": post.sourcePublisher,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  // Resolve learning path navigation (null if post isn't in a path)
  const pathNav = await getPathNavForPost(slug);

  // Resolve Read Next suggestions
  const allPosts = await getPosts();
  const readNextSuggestions = getReadNextSuggestions(
    slug,
    allPosts,
    pathNav,
    2
  );

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      {/* Post Header */}
      <header className="mb-10">
        <div className="flex flex-wrap items-center gap-3 text-sm text-text-muted">
          <time dateTime={post.publishedAt}>
            {new Date(post.publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <span aria-hidden="true">·</span>
          <span>{post.readTimeMinutes} min read</span>
          <span aria-hidden="true">·</span>
          <span className="capitalize">{post.difficulty}</span>
        </div>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          {post.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
          <Link
            href={`/topics/${post.topic}`}
            className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-600 hover:bg-brand-100 transition-colors"
          >
            {post.topic}
          </Link>
          <a
            href={post.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-brand-600 transition-colors"
          >
            Original: {post.sourcePublisher} ↗
          </a>
        </div>
      </header>

      {/* Post Body — rendered Markdown */}
      <div className="prose prose-lg max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {post.content}
        </ReactMarkdown>
      </div>

      {/* Source attribution */}
      <div className="mt-10 rounded-lg border border-border bg-surface-alt p-4 text-sm text-text-secondary">
        <p>
          This post was inspired by{" "}
          <a
            href={post.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brand-600 hover:underline"
          >
            {post.sourcePublisher}&apos;s original article ↗
          </a>
          . Re-explained for students learning system design.
        </p>
      </div>

      {/* Learning Path Navigation */}
      {pathNav && <PathNav pathNav={pathNav} />}

      {/* Read Next Suggestions */}
      <ReadNext suggestions={readNextSuggestions} />

      {/* JSON-LD Article structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.title,
            datePublished: post.publishedAt,
            author: {
              "@type": "Person",
              name: "Varun",
            },
            publisher: {
              "@type": "Organization",
              name: "Stackless",
              url: "https://stackless.dev",
            },
            description: post.summary,
          }),
        }}
      />
    </article>
  );
}
