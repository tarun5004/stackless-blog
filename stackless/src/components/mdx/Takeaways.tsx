/**
 * Takeaways — "What You Should Remember" section at end of every post.
 *
 * Renders a visually distinct bulleted summary. The reader should
 * recognize this as the conclusion even while scrolling fast.
 *
 * Usage in MDX:
 * <Takeaways>
 * - Key point one
 * - Key point two
 * - Key point three
 * </Takeaways>
 */

import type { ReactNode } from "react";

interface TakeawaysProps {
  children: ReactNode;
}

export default function Takeaways({ children }: TakeawaysProps) {
  return (
    <section className="my-10 rounded-lg border-t-4 border-brand-600 bg-brand-50 p-6 not-prose">
      <h2 className="mb-4 text-lg font-bold text-text-primary">
        🎯 What You Should Remember
      </h2>
      <div className="text-sm leading-relaxed text-text-primary prose prose-sm max-w-none [&>ul]:list-disc [&>ul]:pl-5 [&>ul>li]:mb-2">
        {children}
      </div>
    </section>
  );
}
