/**
 * RSS feed generation — produces a full-content RSS 2.0 XML feed.
 *
 * Called from /src/app/feed.xml/route.ts.
 * The feed includes all published posts with their full summaries.
 */

import type { DbPost } from "@/db/types";

const SITE_URL = "https://stackless.dev";
const SITE_TITLE = "Stackless";
const SITE_DESCRIPTION =
  "Real engineering blogs, explained for students. Stackless re-explains company engineering blogs from Discord, Netflix, Uber, and more.";

/**
 * Generate RSS 2.0 XML string from an array of posts.
 */
export function generateRssFeed(posts: DbPost[]): string {
  const items = posts
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${SITE_URL}/posts/${post.slug}</link>
      <guid isPermaLink="true">${SITE_URL}/posts/${post.slug}</guid>
      <description><![CDATA[${post.summary}]]></description>
      <pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate>
      <category>${post.topic}</category>
      <source url="${post.sourceUrl}">${post.sourcePublisher}</source>
    </item>`
    )
    .join("");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${SITE_TITLE}</title>
    <link>${SITE_URL}</link>
    <description>${SITE_DESCRIPTION}</description>
    <language>en</language>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;
}
