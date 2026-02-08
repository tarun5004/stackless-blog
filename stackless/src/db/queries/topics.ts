/**
 * Topic query functions — all DB reads/writes for topics.
 */

import { connectDB } from "../client";
import Topic from "../models/Topic";
import type { DbTopic } from "../types";
import { serializeDoc, serializeDocs } from "@/lib/serialize";

/**
 * Get all topics, sorted alphabetically by name.
 */
export async function getTopics(): Promise<DbTopic[]> {
  await connectDB();
  const docs = await Topic.find().sort({ name: 1 }).lean<DbTopic[]>();
  return serializeDocs(docs);
}

/**
 * Get a single topic by slug.
 */
export async function getTopicBySlug(slug: string): Promise<DbTopic | null> {
  await connectDB();
  const doc = await Topic.findOne({ slug }).lean<DbTopic>();
  return doc ? serializeDoc(doc) : null;
}

/**
 * Create a new topic.
 */
export async function createTopic(data: {
  name: string;
  slug: string;
  description?: string;
}) {
  await connectDB();
  return Topic.create(data);
}
