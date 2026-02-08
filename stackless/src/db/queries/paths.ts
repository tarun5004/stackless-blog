/**
 * Path query functions — all DB reads/writes for learning paths.
 */

import { connectDB } from "../client";
import Path from "../models/Path";

export async function getPaths() {
  await connectDB();
  return Path.find().sort({ name: 1 }).lean();
}

export async function createPath(data: {
  name: string;
  slug: string;
  postIds?: string[];
}) {
  await connectDB();
  return Path.create(data);
}
