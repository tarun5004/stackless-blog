/**
 * Seed script — populates MongoDB with sample content.
 *
 * This is a standalone script. Run with:
 *   npx tsx src/db/seed.ts
 *
 * It inserts sample topics, posts, and paths if they don't already exist.
 * Safe to run multiple times (uses upsert on slug).
 */

import fs from "fs";
import path from "path";

// ---------------------------------------------------------------------------
// Load .env.local (tsx doesn't auto-load it like Next.js does)
// ---------------------------------------------------------------------------
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
import Post from "./models/Post";
import Topic from "./models/Topic";
import Path from "./models/Path";

// ---------------------------------------------------------------------------
// Sample data — edit these arrays to seed different content
// ---------------------------------------------------------------------------

const SAMPLE_TOPICS = [
  {
    slug: "system-design",
    name: "System Design",
    description: "Large scale system design concepts explained for students.",
  },
  {
    slug: "backend",
    name: "Backend Engineering",
    description: "Backend architecture, APIs, databases, and server-side patterns.",
  },
  {
    slug: "devops",
    name: "DevOps & Infrastructure",
    description: "CI/CD, containers, cloud infrastructure, and deployment.",
  },
];

const SAMPLE_POSTS = [
  {
    title: "What Happens When You Type a URL",
    slug: "what-happens-when-you-type-a-url",
    summary: "The full journey from browser to server and back, explained step by step.",
    content:
      "# What Happens When You Type a URL\n\nWhen you type a URL into your browser and press Enter, a fascinating chain of events occurs...\n\n## DNS Resolution\n\nFirst, the browser needs to find the IP address...\n\n## TCP Connection\n\nNext, a TCP connection is established...\n\n## HTTP Request\n\nThe browser sends an HTTP request...\n\n## Server Processing\n\nThe server processes the request...\n\n## Response & Rendering\n\nFinally, the browser renders the page.",
    topic: "system-design",
    sourceUrl: "https://example.com/what-happens-url",
    sourcePublisher: "ByteByteGo",
    difficulty: "beginner" as const,
    readTimeMinutes: 8,
    publishedAt: "2025-01-15",
    featured: true,
    draft: false,
    published: true,
    readNext: ["database-indexing-explained"],
    order: 1,
    ogImage: "",
  },
  {
    title: "Database Indexing Explained",
    slug: "database-indexing-explained",
    summary: "Why indexes matter, how B-trees work, and when to use them.",
    content:
      "# Database Indexing Explained\n\nIndexes are one of the most important concepts in database engineering...\n\n## What Is an Index?\n\nAn index is a data structure that speeds up queries...\n\n## B-Tree Indexes\n\nMost databases use B-tree indexes...\n\n## When to Index\n\nNot every column needs an index...",
    topic: "backend",
    sourceUrl: "https://example.com/database-indexing",
    sourcePublisher: "Hussein Nasser",
    difficulty: "intermediate" as const,
    readTimeMinutes: 12,
    publishedAt: "2025-01-20",
    featured: false,
    draft: false,
    published: true,
    readNext: [],
    order: 2,
    ogImage: "",
  },
  {
    title: "CI/CD Pipeline Fundamentals",
    slug: "ci-cd-pipeline-fundamentals",
    summary: "Building reliable deployment pipelines from scratch.",
    content:
      "# CI/CD Pipeline Fundamentals\n\nContinuous Integration and Continuous Deployment are essential practices...\n\n## Why CI/CD?\n\nManual deployments are error-prone...\n\n## Pipeline Stages\n\n1. Build\n2. Test\n3. Deploy\n\n## Tools\n\nPopular CI/CD tools include GitHub Actions, Jenkins, and GitLab CI.",
    topic: "devops",
    sourceUrl: "https://example.com/cicd-fundamentals",
    sourcePublisher: "TechWorld with Nana",
    difficulty: "beginner" as const,
    readTimeMinutes: 10,
    publishedAt: "2025-02-01",
    featured: false,
    draft: false,
    published: true,
    readNext: [],
    order: 3,
    ogImage: "",
  },
];

const SAMPLE_PATHS = [
  {
    title: "Backend Engineering Fundamentals",
    slug: "backend-fundamentals",
    description: "A structured path through core backend concepts.",
    posts: [
      "what-happens-when-you-type-a-url",
      "database-indexing-explained",
    ],
  },
];

// ---------------------------------------------------------------------------
// Seed functions
// ---------------------------------------------------------------------------

async function seedTopics() {
  console.log(`[seed] Seeding ${SAMPLE_TOPICS.length} topics...`);
  for (const t of SAMPLE_TOPICS) {
    await Topic.updateOne({ slug: t.slug }, { $set: t }, { upsert: true });
    console.log(`  ✓ Topic: ${t.name} (${t.slug})`);
  }
}

async function seedPosts() {
  console.log(`[seed] Seeding ${SAMPLE_POSTS.length} posts...`);
  for (const p of SAMPLE_POSTS) {
    await Post.updateOne({ slug: p.slug }, { $set: p }, { upsert: true });
    console.log(`  ✓ Post: ${p.title} (${p.slug})`);
  }
}

async function seedPaths() {
  console.log(`[seed] Seeding ${SAMPLE_PATHS.length} learning paths...`);
  for (const lp of SAMPLE_PATHS) {
    await Path.updateOne({ slug: lp.slug }, { $set: lp }, { upsert: true });
    console.log(`  ✓ Path: ${lp.title} (${lp.slug})`);
  }
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log("[seed] Connecting to MongoDB...\n");
  await connectDB();

  await seedTopics();
  console.log();
  await seedPosts();
  console.log();
  await seedPaths();

  const postCount = await Post.countDocuments();
  const topicCount = await Topic.countDocuments();
  const pathCount = await Path.countDocuments();

  console.log("\n[seed] Done!");
  console.log(`  Posts:  ${postCount}`);
  console.log(`  Topics: ${topicCount}`);
  console.log(`  Paths:  ${pathCount}`);

  process.exit(0);
}

main().catch((err) => {
  console.error("[seed] FAILED:", err.message);
  process.exit(1);
});
