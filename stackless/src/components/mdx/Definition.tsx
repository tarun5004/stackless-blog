/**
 * Definition — inline term definition for jargon.
 *
 * Renders a visually distinct block that defines a technical term
 * the first time it appears. Students don't have to leave the page
 * or open a new tab to understand what a term means.
 *
 * Usage in MDX:
 * <Definition term="Cassandra">
 *   A distributed NoSQL database designed for high write throughput...
 * </Definition>
 */

import type { ReactNode } from "react";

interface DefinitionProps {
  term: string;
  children: ReactNode;
}

export default function Definition({ term, children }: DefinitionProps) {
  return (
    <div className="my-6 rounded-lg border border-border bg-surface-alt p-4 not-prose">
      <dt className="text-sm font-bold text-text-primary">
        📖 {term}
      </dt>
      <dd className="mt-2 text-sm leading-relaxed text-text-secondary">
        {children}
      </dd>
    </div>
  );
}
