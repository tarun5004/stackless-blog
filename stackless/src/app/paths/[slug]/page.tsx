/**
 * Learning Path Detail Page — shows the ordered list of posts in a path.
 *
 * Pre-rendered at build time for each path JSON file.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getAllPathSlugs, getPathBySlug } from "@/lib/paths";
import { getPostBySlug } from "@/lib/content";

interface PathPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPathSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PathPageProps): Promise<Metadata> {
  const { slug } = await params;
  const path = getPathBySlug(slug);
  if (!path) return {};

  return {
    title: path.title,
    description: path.description,
  };
}

export default async function PathPage({ params }: PathPageProps) {
  const { slug } = await params;
  const path = getPathBySlug(slug);
  if (!path) notFound();

  // Resolve post titles for each slug in the path
  const postsWithTitles = path.posts.map((postSlug, index) => {
    const post = getPostBySlug(postSlug);
    return {
      slug: postSlug,
      title: post?.frontmatter.title ?? postSlug,
      summary: post?.frontmatter.summary ?? "",
      exists: !!post,
      position: index + 1,
    };
  });

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="text-sm font-medium text-brand-600">Learning Path</p>
      <h1 className="mt-2 text-3xl font-bold text-text-primary">
        {path.title}
      </h1>
      <p className="mt-3 text-text-secondary">{path.description}</p>

      {/* Post sequence */}
      <ol className="mt-10 space-y-4">
        {postsWithTitles.map((post) => (
          <li key={post.slug}>
            {post.exists ? (
              <Link
                href={`/posts/${post.slug}`}
                className="group flex items-start gap-4 rounded-lg border border-border p-5 hover:border-brand-600 hover:bg-brand-50 transition-all"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-600 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                  {post.position}
                </span>
                <div>
                  <h3 className="font-medium text-text-primary group-hover:text-brand-600 transition-colors">
                    {post.title}
                  </h3>
                  {post.summary && (
                    <p className="mt-1 text-sm text-text-secondary">
                      {post.summary}
                    </p>
                  )}
                </div>
              </Link>
            ) : (
              <div className="flex items-start gap-4 rounded-lg border border-border border-dashed p-5 opacity-60">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-alt text-sm font-semibold text-text-muted">
                  {post.position}
                </span>
                <div>
                  <h3 className="font-medium text-text-muted">
                    {post.title}
                  </h3>
                  <p className="mt-1 text-xs text-text-muted">Coming soon</p>
                </div>
              </div>
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
