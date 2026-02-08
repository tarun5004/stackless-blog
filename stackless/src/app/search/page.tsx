/**
 * Search Page — client-side post search.
 *
 * Lightweight v1 implementation: loads all post metadata at build time,
 * filters client-side by title, summary, topic, and publisher.
 * Will be replaced by Pagefind in v2 when content exceeds ~30 posts.
 */

import { getAllPosts } from "@/lib/content";
import { getAllTopics } from "@/lib/topics";
import SearchView from "@/components/search/SearchView";

export const metadata = {
  title: "Search — Stackless",
  description: "Search all Stackless engineering blog posts.",
};

export default function SearchPage() {
  const posts = getAllPosts();
  const topics = getAllTopics();

  // Pass only the data the client needs (no raw MDX content)
  const postData = posts.map((p) => ({
    slug: p.slug,
    title: p.frontmatter.title,
    summary: p.frontmatter.summary,
    topic: p.frontmatter.topic,
    publishedAt: p.frontmatter.publishedAt,
    sourcePublisher: p.frontmatter.sourcePublisher,
    difficulty: p.frontmatter.difficulty,
    readTimeMinutes: p.frontmatter.readTimeMinutes,
  }));

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-text-primary">Search</h1>
      <p className="mt-1 text-sm text-text-secondary">
        Find posts by title, topic, publisher, or keyword.
      </p>
      <SearchView posts={postData} topics={topics} />
    </div>
  );
}
