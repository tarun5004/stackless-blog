/**
 * MongoDB connection singleton.
 *
 * Uses a global cache to prevent multiple connections during
 * Next.js hot reload in development.
 */

import mongoose from "mongoose";

/**
 * Global cache — survives Next.js hot reloads in dev.
 * In production there is no hot reload, so this just ensures
 * a single connection per serverless cold start.
 */
interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var _mongooseCache: MongooseCache | undefined;
}

const cached: MongooseCache = global._mongooseCache ?? {
  conn: null,
  promise: null,
};

if (!global._mongooseCache) {
  global._mongooseCache = cached;
}

/**
 * Connect to MongoDB. Returns the mongoose instance.
 * Safe to call multiple times — only connects once.
 */
export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(uri, { dbName: "stackless" })
      .then((m) => {
        console.log("[db] Connected to MongoDB (stackless)");
        return m;
      })
      .catch((err) => {
        cached.promise = null;
        console.error("[db] MongoDB connection failed:", err.message);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}
