/**
 * Zod schemas for validating content frontmatter and data structures.
 *
 * WHY: Build-time validation catches broken frontmatter before it ships.
 * Every MDX file's frontmatter is validated against these schemas during
 * the content loading step, so a missing required field or wrong type
 * fails the build — not the reader's experience.
 */

import { z } from "zod/v4";

// ---------------------------------------------------------------------------
// Post frontmatter — the metadata block at the top of every .mdx file
// ---------------------------------------------------------------------------
export const PostFrontmatterSchema = z.object({
  title: z.string().min(1, "Post title is required"),
  slug: z.string().min(1, "Post slug is required"),
  summary: z
    .string()
    .max(160, "Summary should be ≤160 chars for SEO meta descriptions"),
  publishedAt: z.iso.date(), // ISO 8601 date string, e.g. "2025-03-15"
  updatedAt: z.iso.date().optional(),
  topic: z.string().min(1, "Topic slug is required"),
  sourceUrl: z.url(), // Link to the original company blog post
  sourcePublisher: z.string().min(1), // e.g. "Discord Engineering"
  difficulty: z.enum(["beginner", "intermediate", "advanced"]),
  readTimeMinutes: z.number().int().positive(),
  ogImage: z.string().optional(), // Path relative to /content/images/
  draft: z.boolean().default(false),
  featured: z.boolean().default(false), // Homepage spotlight (max 1)
  readNext: z.array(z.string()).max(2).default([]), // Curated post slugs
  order: z.number().int().optional(), // Display order within topic
});

export type PostFrontmatter = z.infer<typeof PostFrontmatterSchema>;

// ---------------------------------------------------------------------------
// Topic — a category entry in topics.json
// ---------------------------------------------------------------------------
export const TopicSchema = z.object({
  slug: z.string().min(1),
  name: z.string().min(1),
  description: z.string(),
  icon: z.string().optional(),
});

export type Topic = z.infer<typeof TopicSchema>;

// ---------------------------------------------------------------------------
// Learning Path — a JSON file in /content/paths/
// ---------------------------------------------------------------------------
export const LearningPathSchema = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  description: z.string(),
  posts: z.array(z.string()).min(1, "A learning path needs at least one post"),
});

export type LearningPath = z.infer<typeof LearningPathSchema>;

// ---------------------------------------------------------------------------
// Site Config — singleton in /content/site-config.json
// ---------------------------------------------------------------------------
export const SiteConfigSchema = z.object({
  title: z.string(),
  tagline: z.string(),
  description: z.string(),
  url: z.url(),
  author: z.object({
    name: z.string(),
    role: z.string(),
  }),
  social: z.object({
    github: z.string().optional(),
    twitter: z.string().optional(),
  }),
  analytics: z.object({
    plausibleDomain: z.string().optional(),
  }),
});

export type SiteConfig = z.infer<typeof SiteConfigSchema>;
