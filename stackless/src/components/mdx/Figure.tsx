/**
 * Figure — captioned image/diagram container.
 *
 * Wraps content (text description or image) with a numbered caption.
 * Every diagram in Stackless gets alt text and a description for
 * accessibility.
 *
 * Usage in MDX:
 * <Figure caption="Simplified view of Discord's architecture.">
 *   Description text or an <img> tag here.
 * </Figure>
 */

import type { ReactNode } from "react";

interface FigureProps {
  caption: string;
  children: ReactNode;
}

export default function Figure({ caption, children }: FigureProps) {
  return (
    <figure className="my-8 not-prose">
      <div className="rounded-lg border border-border bg-surface-alt p-5 text-sm leading-relaxed text-text-secondary">
        {children}
      </div>
      <figcaption className="mt-3 text-center text-xs text-text-muted italic">
        {caption}
      </figcaption>
    </figure>
  );
}
