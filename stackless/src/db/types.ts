/**
 * Shared TypeScript types for database documents.
 *
 * These match the shapes returned by Mongoose .lean() queries.
 * Used across pages, components, and lib functions.
 */

export interface DbPost {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  topic: string;
  sourceUrl: string;
  sourcePublisher: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  readTimeMinutes: number;
  publishedAt: string;
  featured: boolean;
  draft: boolean;
  published: boolean;
  readNext: string[];
  order: number;
  ogImage: string;
  createdAt: string;
  updatedAt: string;
}

export interface DbTopic {
  _id: string;
  name: string;
  slug: string;
  description: string;
}

export interface DbPath {
  _id: string;
  title: string;
  slug: string;
  description: string;
  posts: string[];
}

export interface PathNavData {
  pathTitle: string;
  pathSlug: string;
  previous: { title: string; slug: string } | null;
  next: { title: string; slug: string } | null;
  currentIndex: number;
  totalPosts: number;
}

export interface ReadNextSuggestion {
  slug: string;
  title: string;
  summary: string;
  topic: string;
}
