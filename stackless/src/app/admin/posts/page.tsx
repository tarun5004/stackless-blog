/**
 * Admin Posts Page — lists all posts (published + drafts).
 */

import { getPosts } from "@/db/queries/posts";
import { getTopics } from "@/db/queries/topics";
import AdminPostsList from "@/components/admin/AdminPostsList";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  const allPosts = await getPosts({ includeDrafts: true });
  const topics = await getTopics();

  // Serialize for client component
  const postsData = allPosts.map((p) => ({
    slug: p.slug,
    title: p.title,
    topic: p.topic,
    publishedAt: p.publishedAt,
    draft: p.draft,
    featured: p.featured,
    readTimeMinutes: p.readTimeMinutes,
    difficulty: p.difficulty,
    sourceUrl: p.sourceUrl,
    sourcePublisher: p.sourcePublisher,
    readNext: p.readNext ?? [],
  }));

  const topicsData = topics.map((t) => ({
    slug: t.slug,
    name: t.name,
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary">Posts</h1>
      <p className="mt-1 text-sm text-text-secondary">
        Manage post metadata.
      </p>
      <AdminPostsList posts={postsData} topics={topicsData} />
    </div>
  );
}
