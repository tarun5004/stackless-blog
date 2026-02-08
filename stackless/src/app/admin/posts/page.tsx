/**
 * Admin Posts Page — lists all posts (published + drafts).
 *
 * Features:
 * - Status indicators (live, featured, draft)
 * - Filter by status
 * - Click to open post detail (edit metadata)
 * - Toggle draft/publish
 */

import { getAllPosts } from "@/lib/content";
import { getAllTopics } from "@/lib/topics";
import AdminPostsList from "@/components/admin/AdminPostsList";

export const dynamic = "force-dynamic";

export default function AdminPostsPage() {
  const allPosts = getAllPosts(true);
  const topics = getAllTopics();

  // Serialize for client component
  const postsData = allPosts.map((p) => ({
    slug: p.slug,
    title: p.frontmatter.title,
    topic: p.frontmatter.topic,
    publishedAt: p.frontmatter.publishedAt,
    draft: p.frontmatter.draft,
    featured: p.frontmatter.featured,
    readTimeMinutes: p.frontmatter.readTimeMinutes,
    difficulty: p.frontmatter.difficulty,
    sourceUrl: p.frontmatter.sourceUrl,
    sourcePublisher: p.frontmatter.sourcePublisher,
    readNext: p.frontmatter.readNext ?? [],
  }));

  const topicsData = topics.map((t) => ({
    slug: t.slug,
    name: t.name,
  }));

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary">Posts</h1>
      <p className="mt-1 text-sm text-text-secondary">
        Manage post metadata. To edit post content, use VS Code + Git.
      </p>
      <AdminPostsList posts={postsData} topics={topicsData} />
    </div>
  );
}
