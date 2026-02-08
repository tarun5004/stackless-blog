/**
 * Callout — styled aside for key information, tips, warnings.
 *
 * Types: info (blue), tip (green), warning (amber)
 * Used in MDX posts: <Callout type="info">Important context here</Callout>
 */

import type { ReactNode } from "react";

interface CalloutProps {
  type?: "info" | "tip" | "warning";
  children: ReactNode;
}

const styles = {
  info: {
    container: "border-brand-600 bg-brand-50",
    icon: "ℹ️",
    label: "Note",
  },
  tip: {
    container: "border-emerald-500 bg-emerald-50",
    icon: "💡",
    label: "Tip",
  },
  warning: {
    container: "border-amber-500 bg-amber-50",
    icon: "⚠️",
    label: "Warning",
  },
};

export default function Callout({ type = "info", children }: CalloutProps) {
  const s = styles[type];

  return (
    <aside
      className={`my-6 rounded-lg border-l-4 p-4 ${s.container} not-prose`}
      role="note"
    >
      <div className="flex items-start gap-3">
        <span className="text-lg leading-none" aria-hidden="true">
          {s.icon}
        </span>
        <div className="text-sm leading-relaxed text-text-primary [&>p]:m-0">
          {children}
        </div>
      </div>
    </aside>
  );
}
