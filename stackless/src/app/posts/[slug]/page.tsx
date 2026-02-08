/**
 * Blog Post Page — the core reading experience.
 *
 * Renders a full MDX blog post with:
 * - Article header (date, time, difficulty, topic, source link)
 * - MDX body with custom components (Callout, Definition, Figure, Takeaways)
 * - Syntax-highlighted code blocks via rehype-pretty-code
 * - Learning path navigation (if the post belongs to a path)
 * - ReadNext suggestions
 * - JSON-LD structured data
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";

import { getAllPosts, getAllPostSlugs, getPostBySlug } from "@/lib/content";
import { getMDXComponents } from "@/lib/mdx";
import { getPathNavForPost } from "@/lib/paths";
import { getReadNextSuggestions } from "@/lib/readnext";
import ReadNext from "@/components/post/ReadNext";
import PathNav from "@/components/post/PathNav";
import Link from "next/link";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  const { title, summary, sourcePublisher, publishedAt, ogImage } =
    post.frontmatter;

  return {
    title,
    description: summary,
    openGraph: {
      type: "article",
      title: `${title} — Stackless`,
      description: summary,
      publishedTime: publishedAt,
      authors: ["Varun"],
      images: ogImage ? [`/content/images/${ogImage}`] : ["/og-default.png"],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — Stackless`,
      description: summary,
    },
    other: {
      "article:publisher": sourcePublisher,
    },
  };
}

export default async function PostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const {
    title,
    publishedAt,
    readTimeMinutes,
    sourceUrl,
    sourcePublisher,
    difficulty,
    topic,
  } = post.frontmatter;

  // Compile MDX with custom components and remark/rehype plugins
  const { content: mdxContent } = await compileMDX({
    source: post.content,
    components: getMDXComponents(),
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug],
      },
    },
  });

  // Resolve learning path navigation (null if post isn't in a path)
  const pathNav = getPathNavForPost(slug);

  // Resolve Read Next suggestions
  const allPosts = getAllPosts();
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
          <time dateTime={publishedAt}>
            {new Date(publishedAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <span aria-hidden="true">·</span>
          <span>{readTimeMinutes} min read</span>
          <span aria-hidden="true">·</span>
          <span className="capitalize">{difficulty}</span>
        </div>

        <h1 className="mt-4 text-3xl font-bold tracking-tight text-text-primary sm:text-4xl">
          {title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
          <Link
            href={`/topics/${topic}`}
            className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-600 hover:bg-brand-100 transition-colors"
          >
            {topic}
          </Link>
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-text-secondary hover:text-brand-600 transition-colors"
          >
            Original: {sourcePublisher} ↗
          </a>
        </div>
      </header>

      {/* Post Body — rendered MDX */}
      <div className="prose prose-lg max-w-none">{mdxContent}</div>

      {/* Source attribution */}
      <div className="mt-10 rounded-lg border border-border bg-surface-alt p-4 text-sm text-text-secondary">
        <p>
          This post was inspired by{" "}
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium text-brand-600 hover:underline"
          >
            {sourcePublisher}&apos;s original article ↗
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
            headline: title,
            datePublished: publishedAt,
            author: {
              "@type": "Person",
              name: "Varun",
            },
            publisher: {
              "@type": "Organization",
              name: "Stackless",
              url: "https://stackless.dev",
            },
            description: post.frontmatter.summary,
          }),
        }}
      />
    </article>
  );
}
