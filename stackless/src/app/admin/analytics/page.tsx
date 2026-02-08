/**
 * Admin Analytics Page — embedded analytics view.
 *
 * In v1, this shows a link to the external Plausible dashboard.
 * Direct API integration for inline stats is planned for v2.
 */

export const dynamic = "force-dynamic";

export default function AdminAnalyticsPage() {
  const plausibleDomain = process.env.PLAUSIBLE_SITE_ID ?? "stackless.dev";

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary">Analytics</h1>
      <p className="mt-1 text-sm text-text-secondary">
        Site traffic, engagement, and content performance.
      </p>

      {/* Plausible embed */}
      <div className="mt-6 rounded-lg border border-border bg-surface overflow-hidden">
        <iframe
          plausible-embed="true"
          src={`https://plausible.io/share/${plausibleDomain}?auth=SHARED_LINK_AUTH&embed=true&theme=light`}
          loading="lazy"
          className="w-full border-0"
          style={{ height: "1600px" }}
          title="Plausible Analytics"
        />
      </div>

      <div className="mt-6 flex gap-4">
        <a
          href={`https://plausible.io/${plausibleDomain}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-secondary hover:bg-surface-alt transition-colors"
        >
          Open in Plausible ↗
        </a>
      </div>

      <div className="mt-6 rounded-lg border border-dashed border-border p-4 text-sm text-text-secondary">
        <p className="font-medium text-text-primary">Setup Required</p>
        <p className="mt-1">
          To see analytics inline, create a shared link in your Plausible
          dashboard (Site Settings → Visibility → Shared Links) and update the
          embed URL above with your auth token. Alternatively, set{" "}
          <code className="rounded bg-surface-alt px-1.5 py-0.5 text-xs font-mono">PLAUSIBLE_API_KEY</code> in
          .env.local for API-based stats (v2).
        </p>
      </div>
    </div>
  );
}
