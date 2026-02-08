/**
 * DB connection test — run with: npx tsx src/db/test-connection.ts
 *
 * 1. Connects to MongoDB
 * 2. Upserts a sample post with slug "db-connection-test"
 * 3. Reads it back via the query layer
 * 4. Logs results
 */

import { connectDB } from "./client";
import { getPostBySlug, createPost } from "./queries/posts";
import Post from "./models/Post";

async function main() {
  console.log("[test] Connecting to MongoDB...");
  await connectDB();
  console.log("[test] Connected.\n");

  const slug = "db-connection-test";

  // Check if sample post exists
  const existing = await getPostBySlug(slug);

  if (existing) {
    console.log("[test] Sample post already exists:");
  } else {
    console.log("[test] Creating sample post...");
    await createPost({
      title: "DB Connection Test",
      slug,
      summary: "This post verifies the MongoDB connection works.",
      content: "# Hello from MongoDB\n\nIf you see this, the connection works.",
      difficulty: "beginner",
      published: false,
    });
    console.log("[test] Sample post created.");
  }

  // Read it back
  const post = await getPostBySlug(slug);
  console.log("[test] Read back post:", {
    title: post?.title,
    slug: post?.slug,
    published: post?.published,
    createdAt: post?.createdAt,
  });

  // Show collection counts
  const postCount = await Post.countDocuments();
  console.log(`\n[test] Total posts in DB: ${postCount}`);
  console.log("[test] SUCCESS — MongoDB is working.\n");

  process.exit(0);
}

main().catch((err) => {
  console.error("[test] FAILED:", err.message);
  process.exit(1);
});
