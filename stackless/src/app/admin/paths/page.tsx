/**
 * Admin Paths Page — manage learning paths.
 *
 * Lists all learning paths with post counts. Paths are stored as
 * JSON files in /content/paths/ and managed via Git (API editing in v2).
 */

import { getAllPaths } from "@/lib/paths";
import { getPostBySlug } from "@/lib/content";

export const dynamic = "force-dynamic";

export default function AdminPathsPage() {
  const paths = getAllPaths();

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Learning Paths
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Manage curated post sequences. Edit path JSON files in Git.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {paths.map((lp) => {
          const postsWithTitles = lp.posts.map((slug, i) => {
            const post = getPostBySlug(slug);
            return {
              slug,
              title: post?.frontmatter.title ?? slug,
              exists: !!post,
              position: i + 1,
            };
          });

          return (
            <div
              key={lp.slug}
              className="rounded-lg border border-border bg-surface p-5"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-text-primary">
                    {lp.title}
                  </h3>
                  <p className="mt-1 text-sm text-text-secondary">
                    {lp.description}
                  </p>
                </div>
                <span className="rounded-full bg-surface-alt px-3 py-1 text-xs font-medium text-text-secondary">
                  {lp.posts.length} post{lp.posts.length !== 1 ? "s" : ""}
                </span>
              </div>

              {/* Post order */}
              <ol className="mt-4 space-y-1">
                {postsWithTitles.map((p) => (
                  <li
                    key={p.slug}
                    className={`flex items-center gap-3 rounded px-3 py-1.5 text-sm ${
                      p.exists
                        ? "text-text-primary"
                        : "text-text-muted line-through"
                    }`}
                  >
                    <span className="w-5 text-right text-xs text-text-muted">
                      {p.position}.
                    </span>
                    <span>{p.title}</span>
                    {!p.exists && (
                      <span className="text-xs text-amber-600">
                        (post not found)
                      </span>
                    )}
                  </li>
                ))}
              </ol>
            </div>
          );
        })}
      </div>

      {paths.length === 0 && (
        <p className="mt-8 text-center text-sm text-text-muted">
          No learning paths defined. Add JSON files to content/paths/.
        </p>
      )}

      <div className="mt-6 rounded-lg border border-dashed border-border p-4 text-sm text-text-secondary">
        <p className="font-medium text-text-primary">How to manage paths</p>
        <p className="mt-1">
          Create JSON files in{" "}
          <code className="rounded bg-surface-alt px-1.5 py-0.5 text-xs font-mono">content/paths/</code>.
          Each file defines a slug, title, description, and an ordered array of
          post slugs. Commit and push to deploy. API-based management in v2.
        </p>
      </div>
    </div>
  );
}
