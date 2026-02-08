/**
 * Search Page — client-side post search.
 *
 * Loads all post metadata from DB, filters client-side.
 */

import { getPosts } from "@/db/queries/posts";
import { getTopics } from "@/db/queries/topics";
import SearchView from "@/components/ui/SearchView";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Search — Stackless",
  description: "Search all Stackless engineering blog posts.",
};

export default async function SearchPage() {
  const posts = await getPosts();
  const topics = await getTopics();

  // Pass only the data the client needs (no raw content)
  const postData = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    summary: p.summary,
    topic: p.topic,
    publishedAt: p.publishedAt,
    sourcePublisher: p.sourcePublisher,
    difficulty: p.difficulty,
    readTimeMinutes: p.readTimeMinutes,
  }));

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-text-primary">Search</h1>
      <p className="mt-1 text-sm text-text-secondary">
        Find posts by title, topic, publisher, or keyword.
      </p>
      <SearchView posts={postData} topics={topics.map((t) => ({ slug: t.slug, name: t.name }))} />
    </div>
  );
}
