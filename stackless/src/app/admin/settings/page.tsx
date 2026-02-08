/**
 * Admin Settings Page — site-level configuration.
 *
 * Displays current site configuration.
 * Settings are managed through environment variables and code.
 */

export const dynamic = "force-dynamic";

export default function AdminSettingsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
      <p className="mt-1 text-sm text-text-secondary">
        Site configuration overview.
      </p>

      <div className="mt-6 space-y-6">
        {/* Site Metadata */}
        <SettingsSection title="Site Metadata">
          <SettingsField label="Site Title" value="Stackless" />
          <SettingsField
            label="Tagline"
            value="Real engineering blogs, explained for students."
          />
          <SettingsField label="URL" value="https://stackless.dev" />
        </SettingsSection>

        {/* Author */}
        <SettingsSection title="Author">
          <SettingsField label="Name" value="Varun" />
          <SettingsField label="Role" value="Author & Admin" />
        </SettingsSection>

        {/* Data */}
        <SettingsSection title="Data">
          <SettingsField label="Database" value="MongoDB Atlas" />
          <SettingsField label="Auth Provider" value="GitHub OAuth" />
        </SettingsSection>
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
