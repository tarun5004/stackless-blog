/**
 * Admin Topics Page — manage content categories.
 *
 * Lists all topics with post counts. Topics are stored in
 * /content/topics.json and managed via Git (API editing in v2).
 */

import { getAllTopics } from "@/lib/topics";
import { getAllPosts } from "@/lib/content";

export const dynamic = "force-dynamic";

export default function AdminTopicsPage() {
  const topics = getAllTopics();
  const allPosts = getAllPosts(true);

  // Count posts per topic
  const postCounts = new Map<string, number>();
  for (const post of allPosts) {
    const count = postCounts.get(post.frontmatter.topic) ?? 0;
    postCounts.set(post.frontmatter.topic, count + 1);
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Topics</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Manage content categories. Edit topics.json in Git.
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
          No topics defined. Add entries to content/topics.json.
        </p>
      )}

      <div className="mt-6 rounded-lg border border-dashed border-border p-4 text-sm text-text-secondary">
        <p className="font-medium text-text-primary">How to manage topics</p>
        <p className="mt-1">
          Edit <code className="rounded bg-surface-alt px-1.5 py-0.5 text-xs font-mono">content/topics.json</code> in
          VS Code. Each topic needs a slug, name, and description. Commit and
          push to deploy changes. API-based CRUD coming in v2.
        </p>
      </div>
    </div>
  );
}
