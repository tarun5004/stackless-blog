/**
 * Post query functions — all DB reads/writes for posts.
 */

import { connectDB } from "../client";
import Post from "../models/Post";

export async function getPosts({
  publishedOnly = false,
}: { publishedOnly?: boolean } = {}) {
  await connectDB();
  const filter = publishedOnly ? { published: true } : {};
  return Post.find(filter).sort({ createdAt: -1 }).lean();
}

export async function getPostBySlug(slug: string) {
  await connectDB();
  return Post.findOne({ slug }).lean();
}

export async function createPost(data: {
  title: string;
  slug: string;
  summary?: string;
  content?: string;
  topics?: string[];
  difficulty?: "beginner" | "intermediate";
  published?: boolean;
}) {
  await connectDB();
  return Post.create(data);
}

export async function updatePost(
  slug: string,
  data: Partial<{
    title: string;
    summary: string;
    content: string;
    topics: string[];
    difficulty: "beginner" | "intermediate";
    published: boolean;
  }>
) {
  await connectDB();
  return Post.findOneAndUpdate({ slug }, data, { new: true }).lean();
}
