/**
 * Post query functions — all DB reads/writes for posts.
 */

import { connectDB } from "../client";
import Post from "../models/Post";
import type { DbPost } from "../types";
import { serializeDoc, serializeDocs } from "@/lib/serialize";

/**
 * Get all posts, optionally filtered.
 * Sorted by publishedAt descending (newest first).
 */
export async function getPosts({
  publishedOnly = false,
  includeDrafts = false,
}: { publishedOnly?: boolean; includeDrafts?: boolean } = {}): Promise<
  DbPost[]
> {
  await connectDB();
  const filter: Record<string, unknown> = {};
  if (publishedOnly) filter.published = true;
  if (!includeDrafts) filter.draft = { $ne: true };
  const docs = await Post.find(filter)
    .sort({ publishedAt: -1 })
    .lean<DbPost[]>();
  return serializeDocs(docs);
}

/**
 * Get a single post by slug.
 */
export async function getPostBySlug(slug: string): Promise<DbPost | null> {
  await connectDB();
  const doc = await Post.findOne({ slug }).lean<DbPost>();
  return doc ? serializeDoc(doc) : null;
}

/**
 * Get posts filtered by topic slug.
 */
export async function getPostsByTopic(topic: string): Promise<DbPost[]> {
  await connectDB();
  const docs = await Post.find({ topic, draft: { $ne: true } })
    .sort({ publishedAt: -1 })
    .lean<DbPost[]>();
  return serializeDocs(docs);
}

/**
 * Create a new post.
 */
export async function createPost(data: {
  title: string;
  slug: string;
  summary?: string;
  content?: string;
  topic?: string;
  sourceUrl?: string;
  sourcePublisher?: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
  readTimeMinutes?: number;
  publishedAt?: string;
  featured?: boolean;
  draft?: boolean;
  published?: boolean;
  readNext?: string[];
  order?: number;
  ogImage?: string;
}) {
  await connectDB();
  return Post.create(data);
}

/**
 * Update a post by slug.
 */
export async function updatePost(
  slug: string,
  data: Partial<{
    title: string;
    summary: string;
    content: string;
    topic: string;
    sourceUrl: string;
    sourcePublisher: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    readTimeMinutes: number;
    publishedAt: string;
    featured: boolean;
    draft: boolean;
    published: boolean;
    readNext: string[];
    order: number;
    ogImage: string;
  }>
): Promise<DbPost | null> {
  await connectDB();
  const doc = await Post.findOneAndUpdate({ slug }, data, { new: true }).lean<DbPost>();
  return doc ? serializeDoc(doc) : null;
}

/**
 * Delete a post by slug.
 */
export async function deletePost(slug: string): Promise<void> {
  await connectDB();
  await Post.deleteOne({ slug });
}
