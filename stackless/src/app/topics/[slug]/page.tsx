/**
 * Topic Detail Page — shows all posts in a given topic.
 *
 * Uses generateStaticParams() to pre-render a page for each topic
 * defined in topics.json.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllTopicSlugs, getTopicBySlug } from "@/lib/topics";
import { getPostsByTopic } from "@/lib/content";
import PostCard from "@/components/shared/PostCard";

interface TopicPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllTopicSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: TopicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);
  if (!topic) return {};

  return {
    title: topic.name,
    description: topic.description,
  };
}

export default async function TopicPage({ params }: TopicPageProps) {
  const { slug } = await params;
  const topic = getTopicBySlug(slug);
  if (!topic) notFound();

  const posts = getPostsByTopic(slug);

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-text-primary">{topic.name}</h1>
      <p className="mt-2 text-text-secondary">{topic.description}</p>

      {posts.length === 0 ? (
        <p className="mt-10 text-text-muted">
          No posts in this topic yet. Check back soon.
        </p>
      ) : (
        <div className="mt-10 space-y-6">
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
