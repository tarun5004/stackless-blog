/**
 * Admin Settings Page — site-level configuration.
 *
 * Displays the current site-config.json values.
 * In v1, editing is done via Git. API-based editing in v2.
 */

import { getSiteConfig } from "@/lib/config";

export const dynamic = "force-dynamic";

export default function AdminSettingsPage() {
  const config = getSiteConfig();

  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
      <p className="mt-1 text-sm text-text-secondary">
        Site configuration. Edit content/site-config.json to make changes.
      </p>

      <div className="mt-6 space-y-6">
        {/* Site Metadata */}
        <SettingsSection title="Site Metadata">
          <SettingsField label="Site Title" value={config.title} />
          <SettingsField label="Tagline" value={config.tagline} />
          <SettingsField label="Description" value={config.description} />
          <SettingsField label="URL" value={config.url} />
        </SettingsSection>

        {/* Author */}
        <SettingsSection title="Author">
          <SettingsField label="Name" value={config.author.name} />
          <SettingsField label="Role" value={config.author.role} />
        </SettingsSection>

        {/* Social */}
        <SettingsSection title="Social Links">
          <SettingsField
            label="GitHub"
            value={config.social.github || "Not set"}
          />
          <SettingsField
            label="Twitter"
            value={config.social.twitter || "Not set"}
          />
        </SettingsSection>

        {/* Analytics */}
        <SettingsSection title="Analytics">
          <SettingsField
            label="Plausible Domain"
            value={config.analytics.plausibleDomain || "Not set"}
          />
        </SettingsSection>
      </div>

      <div className="mt-6 rounded-lg border border-dashed border-border p-4 text-sm text-text-secondary">
        <p className="font-medium text-text-primary">How to edit settings</p>
        <p className="mt-1">
          Edit{" "}
          <code className="rounded bg-surface-alt px-1.5 py-0.5 text-xs font-mono">content/site-config.json</code> in
          VS Code. Commit and push to apply changes. In-panel editing with
          GitHub API commits is planned for v2.
        </p>
      </div>
    </div>
  );
}

function SettingsSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted">
        {title}
      </h2>
      <dl className="mt-3 space-y-3">{children}</dl>
    </div>
  );
}

function SettingsField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <dt className="text-text-secondary">{label}</dt>
      <dd className="font-medium text-text-primary text-right max-w-xs break-all">
        {value}
      </dd>
    </div>
  );
}
