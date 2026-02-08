/**
 * Topic query functions — all DB reads/writes for topics.
 */

import { connectDB } from "../client";
import Topic from "../models/Topic";

export async function getTopics() {
  await connectDB();
  return Topic.find().sort({ name: 1 }).lean();
}

export async function createTopic(data: { name: string; slug: string }) {
  await connectDB();
  return Topic.create(data);
}
