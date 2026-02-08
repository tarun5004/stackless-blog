/**
 * Admin Paths Page — manage learning paths.
 */

import { getPaths } from "@/db/queries/paths";
import { getPostBySlug } from "@/db/queries/posts";

export const dynamic = "force-dynamic";

export default async function AdminPathsPage() {
  const paths = await getPaths();

  // Resolve post titles for each path
  const pathsWithPosts = await Promise.all(
    paths.map(async (lp) => {
      const postsWithTitles = await Promise.all(
        lp.posts.map(async (slug, i) => {
          const post = await getPostBySlug(slug);
          return {
            slug,
            title: post?.title ?? slug,
            exists: !!post,
            position: i + 1,
          };
        })
      );
      return { ...lp, postsWithTitles };
    })
  );

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">
            Learning Paths
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Manage curated post sequences.
          </p>
        </div>
      </div>

      <div className="mt-6 space-y-4">
        {pathsWithPosts.map((lp) => (
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
              {lp.postsWithTitles.map((p) => (
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
        ))}
      </div>

      {paths.length === 0 && (
        <p className="mt-8 text-center text-sm text-text-muted">
          No learning paths defined.
        </p>
      )}
    </div>
  );
}
