/**
 * Admin Overview — dashboard home page.
 *
 * Shows at-a-glance stats: published/draft counts, topics, paths,
 * and content health warnings.
 */

import { getAllPosts } from "@/lib/content";
import { getAllTopics } from "@/lib/topics";
import { getAllPaths } from "@/lib/paths";

export const dynamic = "force-dynamic"; // Admin pages always render fresh

export default function AdminOverviewPage() {
  const allPosts = getAllPosts(true); // includeDrafts=true for admin
  const topics = getAllTopics();
  const paths = getAllPaths();

  const published = allPosts.filter((p) => !p.frontmatter.draft);
  const drafts = allPosts.filter((p) => p.frontmatter.draft);
  const featured = allPosts.filter((p) => p.frontmatter.featured);

  // Content health checks
  const warnings: string[] = [];

  const postsWithoutReadNext = published.filter(
    (p) => !p.frontmatter.readNext || p.frontmatter.readNext.length === 0
  );
  if (postsWithoutReadNext.length > 0) {
    warnings.push(
      `${postsWithoutReadNext.length} post(s) have no "Read Next" suggestions`
    );
  }

  const allSlugs = new Set(published.map((p) => p.slug));
  for (const post of published) {
    for (const rnSlug of post.frontmatter.readNext ?? []) {
      if (!allSlugs.has(rnSlug)) {
        warnings.push(
          `"${post.frontmatter.title}" has readNext slug "${rnSlug}" that doesn't match any published post`
        );
      }
    }
  }

  const topicSlugs = new Set(topics.map((t) => t.slug));
  for (const post of published) {
    if (!topicSlugs.has(post.frontmatter.topic)) {
      warnings.push(
        `"${post.frontmatter.title}" has topic "${post.frontmatter.topic}" which doesn't exist`
      );
    }
  }

  if (featured.length > 1) {
    warnings.push(
      `${featured.length} posts are marked as featured. Only one should be.`
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary">Overview</h1>

      {/* Stat cards */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Published" value={published.length} />
        <StatCard label="Drafts" value={drafts.length} />
        <StatCard label="Paths" value={paths.length} />
        <StatCard label="Topics" value={topics.length} />
      </div>

      {/* Content health */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-text-primary">
          Content Health
        </h2>
        <div className="mt-3 space-y-2">
          {warnings.length === 0 ? (
            <p className="flex items-center gap-2 text-sm text-green-700">
              <span>✓</span> All content checks passing
            </p>
          ) : (
            warnings.map((warning, i) => (
              <p
                key={i}
                className="flex items-start gap-2 text-sm text-amber-700"
              >
                <span className="mt-0.5">⚠</span> {warning}
              </p>
            ))
          )}
        </div>
      </div>

      {/* Quick info */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold text-text-primary">Quick Info</h2>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex gap-2">
            <dt className="text-text-secondary">Featured post:</dt>
            <dd className="font-medium text-text-primary">
              {featured.length > 0
                ? featured[0].frontmatter.title
                : "None set"}
            </dd>
          </div>
          <div className="flex gap-2">
            <dt className="text-text-secondary">Total posts (incl. drafts):</dt>
            <dd className="font-medium text-text-primary">{allPosts.length}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <p className="text-3xl font-bold text-text-primary">{value}</p>
      <p className="mt-1 text-sm text-text-secondary">{label}</p>
    </div>
  );
}
