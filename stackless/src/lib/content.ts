/**
 * Content loading utilities — reads MDX posts from the file system.
 *
 * WHY file-system based: No database, no CMS, no API. Content lives
 * in /content/posts/ as MDX files. This module reads them at BUILD TIME,
 * parses frontmatter, validates it with Zod, and returns typed data
 * that pages can use with full confidence.
 *
 * This file is only ever called during `next build` (SSG) or in dev mode.
 * It never runs in the browser.
 */

import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { PostFrontmatterSchema, type PostFrontmatter } from "./schema";

// ---------------------------------------------------------------------------
// Paths
// ---------------------------------------------------------------------------
const CONTENT_DIR = path.join(process.cwd(), "content");
const POSTS_DIR = path.join(CONTENT_DIR, "posts");

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/** A post with parsed frontmatter but raw MDX content (not yet compiled). */
export interface PostEntry {
  frontmatter: PostFrontmatter;
  content: string; // Raw MDX string
  slug: string;
}

// ---------------------------------------------------------------------------
// Core functions
// ---------------------------------------------------------------------------

/**
 * Get all published posts, sorted by publishedAt (newest first).
 * Drafts are excluded in production builds unless includeDrafts=true.
 *
 * @param includeDrafts - If true, returns drafts even in production (used by admin).
 */
export function getAllPosts(includeDrafts = false): PostEntry[] {
  if (!fs.existsSync(POSTS_DIR)) return [];

  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".mdx"));

  const posts = files
    .map((filename) => {
      const filePath = path.join(POSTS_DIR, filename);
      const raw = fs.readFileSync(filePath, "utf-8");
      const { data, content } = matter(raw);

      // Validate frontmatter — throws at build time if invalid
      const frontmatter = PostFrontmatterSchema.parse(data);

      return {
        frontmatter,
        content,
        slug: frontmatter.slug,
      };
    })
    // Exclude drafts in production (unless admin requests all)
    .filter((post) => {
      if (includeDrafts) return true;
      if (process.env.NODE_ENV === "production") {
        return !post.frontmatter.draft;
      }
      return true; // Show drafts in dev
    })
    // Sort newest first
    .sort(
      (a, b) =>
        new Date(b.frontmatter.publishedAt).getTime() -
        new Date(a.frontmatter.publishedAt).getTime()
    );

  return posts;
}

/**
 * Get a single post by slug.
 * Returns undefined if the post doesn't exist or is a draft in production.
 */
export function getPostBySlug(slug: string): PostEntry | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

/**
 * Get all post slugs — used by generateStaticParams() to pre-render pages.
 */
export function getAllPostSlugs(): string[] {
  return getAllPosts().map((p) => p.slug);
}

/**
 * Get posts filtered by topic slug.
 */
export function getPostsByTopic(topicSlug: string): PostEntry[] {
  return getAllPosts().filter((p) => p.frontmatter.topic === topicSlug);
}
