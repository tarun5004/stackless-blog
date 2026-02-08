/**
 * RSS Feed Route — generates /feed.xml at build time.
 *
 * This is a Next.js Route Handler that returns XML.
 * It runs during `next build` and produces a static XML file.
 */

import { getAllPosts } from "@/lib/content";
import { generateRssFeed } from "@/lib/rss";

export async function GET() {
  const posts = getAllPosts();
  const feed = generateRssFeed(posts);

  return new Response(feed, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
