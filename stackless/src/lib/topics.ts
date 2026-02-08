/**
 * Topics utilities — reads and resolves topic definitions.
 *
 * Topics are defined in /content/topics.json as a simple array.
 * This module loads, validates, and provides lookup functions.
 */

import fs from "fs";
import path from "path";
import { TopicSchema, type Topic } from "./schema";

const TOPICS_FILE = path.join(process.cwd(), "content", "topics.json");

/**
 * Get all topics from topics.json, validated against the schema.
 */
export function getAllTopics(): Topic[] {
  if (!fs.existsSync(TOPICS_FILE)) return [];

  const raw = fs.readFileSync(TOPICS_FILE, "utf-8");
  const data = JSON.parse(raw);

  if (!Array.isArray(data)) {
    throw new Error("topics.json must be an array of topic objects");
  }

  return data.map((entry: unknown) => TopicSchema.parse(entry));
}

/**
 * Get a single topic by slug.
 */
export function getTopicBySlug(slug: string): Topic | undefined {
  return getAllTopics().find((t) => t.slug === slug);
}

/**
 * Get all topic slugs — used by generateStaticParams().
 */
export function getAllTopicSlugs(): string[] {
  return getAllTopics().map((t) => t.slug);
}
