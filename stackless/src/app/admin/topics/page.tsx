/**
 * Admin Topics Page — manage content categories.
 */

import { getTopics } from "@/db/queries/topics";
import { getPosts } from "@/db/queries/posts";

export const dynamic = "force-dynamic";

export default async function AdminTopicsPage() {
  const topics = await getTopics();
  const allPosts = await getPosts({ includeDrafts: true });

  // Count posts per topic
  const postCounts = new Map<string, number>();
  for (const post of allPosts) {
    const count = postCounts.get(post.topic) ?? 0;
    postCounts.set(post.topic, count + 1);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Topics</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Manage content categories.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-2">
        {topics.map((topic) => (
          <div
            key={topic.slug}
            className="flex items-center justify-between rounded-lg border border-border bg-surface p-4"
          >
            <div>
              <h3 className="font-medium text-text-primary">{topic.name}</h3>
              <p className="mt-0.5 text-sm text-text-secondary">
                {topic.description}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="rounded-full bg-surface-alt px-3 py-1 text-xs font-medium text-text-secondary">
                {postCounts.get(topic.slug) ?? 0} post
                {(postCounts.get(topic.slug) ?? 0) !== 1 ? "s" : ""}
              </span>
              <span className="text-xs text-text-muted font-mono">
                {topic.slug}
              </span>
            </div>
          </div>
        ))}
      </div>

      {topics.length === 0 && (
        <p className="mt-8 text-center text-sm text-text-muted">
          No topics defined.
        </p>
      )}
    </div>
  );
}
