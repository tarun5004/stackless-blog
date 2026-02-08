/**
 * Path query functions — all DB reads/writes for learning paths.
 */

import { connectDB } from "../client";
import Path from "../models/Path";
import type { DbPath, PathNavData } from "../types";
import { getPostBySlug } from "./posts";
import { serializeDoc, serializeDocs } from "@/lib/serialize";

/**
 * Get all learning paths, sorted alphabetically by title.
 */
export async function getPaths(): Promise<DbPath[]> {
  await connectDB();
  const docs = await Path.find().sort({ title: 1 }).lean<DbPath[]>();
  return serializeDocs(docs);
}

/**
 * Get a single path by slug.
 */
export async function getPathBySlug(slug: string): Promise<DbPath | null> {
  await connectDB();
  const doc = await Path.findOne({ slug }).lean<DbPath>();
  return doc ? serializeDoc(doc) : null;
}

/**
 * Given a post slug, find if it belongs to any learning path
 * and return the navigation data (previous/next posts in the path).
 *
 * Returns null if the post is not in any learning path.
 */
export async function getPathNavForPost(
  postSlug: string
): Promise<PathNavData | null> {
  const allPaths = await getPaths();

  for (const lp of allPaths) {
    const index = lp.posts.indexOf(postSlug);
    if (index === -1) continue;

    const resolveTitleSlug = async (slug: string) => {
      const post = await getPostBySlug(slug);
      return { title: post?.title ?? slug, slug };
    };

    return {
      pathTitle: lp.title,
      pathSlug: lp.slug,
      previous: index > 0 ? await resolveTitleSlug(lp.posts[index - 1]) : null,
      next:
        index < lp.posts.length - 1
          ? await resolveTitleSlug(lp.posts[index + 1])
          : null,
      currentIndex: index,
      totalPosts: lp.posts.length,
    };
  }

  return null;
}

/**
 * Create a new learning path.
 */
export async function createPath(data: {
  title: string;
  slug: string;
  description?: string;
  posts?: string[];
}) {
  await connectDB();
  return Path.create(data);
}
