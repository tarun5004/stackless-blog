/**
 * Read Next resolution — selects related posts to suggest at the bottom
 * of a blog post page.
 *
 * Algorithm (from INFORMATION-ARCHITECTURE.md):
 * 1. Same-topic posts (excluding current), newest first — take up to 2
 * 2. If < 2: fill from other topics, newest first
 * 3. If the current post is in a learning path, the path's "next" post
 *    is removed from Read Next (it gets its own PathNav section)
 *
 * Returns exactly 2 suggestions (or fewer if there aren't enough posts).
 */

import type { PostEntry } from "./content";
import type { PathNavData } from "./paths";

export interface ReadNextSuggestion {
  slug: string;
  title: string;
  summary: string;
  topic: string;
}

/**
 * Resolve Read Next suggestions for a given post.
 *
 * @param currentSlug - The slug of the current post (excluded from results)
 * @param allPosts    - All published posts (pre-sorted newest first)
 * @param pathNav     - Path navigation data if the post is in a learning path
 * @param maxResults  - Maximum number of suggestions to return (default: 2)
 */
export function getReadNextSuggestions(
  currentSlug: string,
  allPosts: PostEntry[],
  pathNav: PathNavData | null,
  maxResults = 2
): ReadNextSuggestion[] {
  const currentPost = allPosts.find((p) => p.slug === currentSlug);
  if (!currentPost) return [];

  const currentTopic = currentPost.frontmatter.topic;

  // Slugs to exclude: current post + the path's next post (if any)
  const excludeSlugs = new Set([currentSlug]);
  if (pathNav?.next) {
    excludeSlugs.add(pathNav.next.slug);
  }

  // Step 1: Same-topic posts
  const sameTopic = allPosts.filter(
    (p) => p.frontmatter.topic === currentTopic && !excludeSlugs.has(p.slug)
  );

  // Step 2: Other-topic posts (fallback filler)
  const otherTopic = allPosts.filter(
    (p) => p.frontmatter.topic !== currentTopic && !excludeSlugs.has(p.slug)
  );

  // Combine: same topic first, then others
  const candidates = [...sameTopic, ...otherTopic];

  return candidates.slice(0, maxResults).map((p) => ({
    slug: p.slug,
    title: p.frontmatter.title,
    summary: p.frontmatter.summary,
    topic: p.frontmatter.topic,
  }));
}
