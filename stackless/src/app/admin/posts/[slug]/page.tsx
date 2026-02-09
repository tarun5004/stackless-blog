/**
 * Admin — Edit Post
 *
 * Loads the existing post and passes it to PostEditor with PUT method.
 */

import { notFound } from "next/navigation";
import { getPostBySlug } from "@/db/queries/posts";
import { getTopics } from "@/db/queries/topics";
import PostEditor from "@/components/admin/PostEditor";

export const dynamic = "force-dynamic";

interface EditPostPageProps {
  params: Promise<{ slug: string }>;
}

export default async function AdminEditPostPage({ params }: EditPostPageProps) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const topics = await getTopics();
  const topicOptions = topics.map((t) => ({
    slug: t.slug,
    name: t.name,
  }));

  const initialData = {
    title: post.title,
    slug: post.slug,
    summary: post.summary,
    content: post.content,
    topic: post.topic,
    sourceUrl: post.sourceUrl,
    sourcePublisher: post.sourcePublisher,
    difficulty: post.difficulty,
    readTimeMinutes: post.readTimeMinutes,
    publishedAt: post.publishedAt,
    featured: post.featured,
    draft: post.draft,
    ogImage: post.ogImage,
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">Edit Post</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Editing &ldquo;{post.title}&rdquo;
        </p>
      </div>
      <PostEditor
        initialData={initialData}
        topics={topicOptions}
        endpoint="/api/posts"
        method="PUT"
      />
    </div>
  );
}
