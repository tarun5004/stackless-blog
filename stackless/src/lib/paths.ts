/**
 * Learning Path utilities — reads path JSON files and resolves navigation.
 *
 * Learning paths are JSON files in /content/paths/ that define an ordered
 * sequence of posts. This module handles loading them and computing
 * previous/next navigation for any given post.
 */

import fs from "fs";
import path from "path";
import { LearningPathSchema, type LearningPath } from "./schema";
import { getPostBySlug } from "./content";

const PATHS_DIR = path.join(process.cwd(), "content", "paths");

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** Navigation context injected into a post page when the post belongs to a path. */
export interface PathNavData {
  pathTitle: string;
  pathSlug: string;
  previous: { title: string; slug: string } | null;
  next: { title: string; slug: string } | null;
  currentIndex: number;
  totalPosts: number;
}

// ---------------------------------------------------------------------------
// Core functions
// ---------------------------------------------------------------------------

/**
 * Get all learning paths, validated against the schema.
 */
export function getAllPaths(): LearningPath[] {
  if (!fs.existsSync(PATHS_DIR)) return [];

  const files = fs.readdirSync(PATHS_DIR).filter((f) => f.endsWith(".json"));

  return files.map((filename) => {
    const filePath = path.join(PATHS_DIR, filename);
    const raw = fs.readFileSync(filePath, "utf-8");
    const data = JSON.parse(raw);
    return LearningPathSchema.parse(data);
  });
}

/**
 * Get a single learning path by slug.
 */
export function getPathBySlug(slug: string): LearningPath | undefined {
  return getAllPaths().find((p) => p.slug === slug);
}

/**
 * Get all path slugs — used by generateStaticParams().
 */
export function getAllPathSlugs(): string[] {
  return getAllPaths().map((p) => p.slug);
}

/**
 * Given a post slug, find if it belongs to any learning path and return
 * the navigation data (previous/next posts in the path).
 *
 * Returns null if the post is not in any learning path.
 *
 * NOTE: If a post appears in multiple paths, we use the first match.
 * The data model intentionally keeps posts in at most one path.
 */
export function getPathNavForPost(
  postSlug: string
): PathNavData | null {
  const allPaths = getAllPaths();

  for (const lp of allPaths) {
    const index = lp.posts.indexOf(postSlug);
    if (index === -1) continue;

    // Resolve actual post titles from slugs (fallback to slug if post missing)
    const resolveTitleSlug = (slug: string) => {
      const post = getPostBySlug(slug);
      return { title: post?.frontmatter.title ?? slug, slug };
    };

    return {
      pathTitle: lp.title,
      pathSlug: lp.slug,
      previous: index > 0 ? resolveTitleSlug(lp.posts[index - 1]) : null,
      next:
        index < lp.posts.length - 1
          ? resolveTitleSlug(lp.posts[index + 1])
          : null,
      currentIndex: index,
      totalPosts: lp.posts.length,
    };
  }

  return null;
}
