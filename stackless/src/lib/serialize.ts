/**
 * Serialization utilities for Mongoose → Client Component boundary.
 *
 * Mongoose `.lean()` returns plain-ish objects, but `_id` is still an
 * ObjectId instance and `createdAt`/`updatedAt` are Date objects.
 * These are not serializable across the Server → Client boundary in
 * Next.js App Router.
 *
 * Usage:
 *   const post = serializeDoc(await Post.findOne({ slug }).lean());
 *   const posts = serializeDocs(await Post.find().lean());
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Serialize a single Mongoose lean document into a plain JSON-safe object.
 *
 * - Converts `_id` (ObjectId) → string
 * - Converts `createdAt` / `updatedAt` (Date) → ISO string
 * - Removes `__v`
 */
export function serializeDoc<T>(doc: T): T {
  if (!doc || typeof doc !== "object") return doc;

  const obj = { ...(doc as any) };

  // _id → string
  if (obj._id && typeof obj._id !== "string") {
    obj._id = obj._id.toString();
  }

  // Date fields → ISO string
  if (obj.createdAt instanceof Date) {
    obj.createdAt = obj.createdAt.toISOString();
  }
  if (obj.updatedAt instanceof Date) {
    obj.updatedAt = obj.updatedAt.toISOString();
  }

  // Remove Mongoose version key
  delete obj.__v;

  return obj as T;
}

/**
 * Serialize an array of Mongoose lean documents.
 */
export function serializeDocs<T>(docs: T[]): T[] {
  return docs.map(serializeDoc);
}
