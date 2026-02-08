/**
 * DB connection test — run with: npx tsx src/db/test-connection.ts
 *
 * 1. Connects to MongoDB
 * 2. Upserts a sample post with slug "db-connection-test"
 * 3. Reads it back via the query layer
 * 4. Logs results
 */

// Load .env.local before anything else (Next.js does this automatically,
// but plain tsx doesn't).
import fs from "fs";
import path from "path";
const envPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, "utf-8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;
    const key = trimmed.slice(0, idx).trim();
    const val = trimmed.slice(idx + 1).trim();
    if (!process.env[key]) process.env[key] = val;
  }
}

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
