/**
 * RSS Feed Route — generates /feed.xml dynamically.
 */

import { getPosts } from "@/db/queries/posts";
import { generateRssFeed } from "@/lib/rss";

export const dynamic = "force-dynamic";

export async function GET() {
  const posts = await getPosts();
  const feed = generateRssFeed(posts);

  return new Response(feed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
