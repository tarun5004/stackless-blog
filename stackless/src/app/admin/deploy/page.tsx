/**
 * Admin Deploy Page — manual deployment controls.
 *
 * Features:
 * - Trigger a Vercel rebuild via deploy hook
 * - Link to Vercel dashboard
 *
 * The deploy hook URL is stored in VERCEL_DEPLOY_HOOK_URL env var.
 */

import DeployActions from "@/components/admin/DeployActions";

export const dynamic = "force-dynamic";

export default function AdminDeployPage() {
  const hasHook = !!process.env.VERCEL_DEPLOY_HOOK_URL;

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary">Deploy</h1>
      <p className="mt-1 text-sm text-text-secondary">
        Trigger rebuilds and monitor deployment status.
      </p>

      <div className="mt-6 space-y-6">
        {/* Deploy action */}
        <div className="rounded-lg border border-border bg-surface p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
            Trigger Rebuild
          </h2>
          <p className="mt-2 text-sm text-text-secondary">
            Rebuilds the site from the latest commit on main. Use when a build
            failed due to a transient error, or after making changes via Git.
          </p>

          {hasHook ? (
            <DeployActions />
          ) : (
            <div className="mt-4 rounded-lg border border-dashed border-amber-300 bg-amber-50 p-3 text-sm text-amber-700">
              Deploy hook not configured. Set{" "}
              <code className="rounded bg-amber-100 px-1.5 py-0.5 text-xs font-mono">
                VERCEL_DEPLOY_HOOK_URL
              </code>{" "}
              in your .env.local file.
            </div>
          )}
        </div>

        {/* External links */}
        <div className="rounded-lg border border-border bg-surface p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
            External Dashboards
          </h2>
          <div className="mt-3 flex flex-wrap gap-3">
            <a
              href="https://vercel.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface-alt transition-colors"
            >
              Vercel Dashboard ↗
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface-alt transition-colors"
            >
              GitHub Repo ↗
            </a>
          </div>
        </div>

        {/* Info */}
        <div className="rounded-lg border border-dashed border-border p-4 text-sm text-text-secondary">
          <p className="font-medium text-text-primary">How deploys work</p>
          <p className="mt-1">
            Every push to the <code className="rounded bg-surface-alt px-1.5 py-0.5 text-xs font-mono">main</code> branch
            automatically triggers a Vercel build. The &quot;Trigger Rebuild&quot; button
            re-runs the build without a new commit — useful for transient
            failures. For rollbacks, use{" "}
            <code className="rounded bg-surface-alt px-1.5 py-0.5 text-xs font-mono">git revert</code> or the Vercel
            dashboard.
          </p>
        </div>
      </div>
    </div>
  );
}
