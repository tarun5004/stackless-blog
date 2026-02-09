/**
 * PostEditor — client component for creating and editing blog posts.
 *
 * Provides a form with all post fields, markdown content textarea,
 * and submit handling. Used by both Create and Edit admin pages.
 */

"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

interface TopicOption {
  slug: string;
  name: string;
}

interface PostFormData {
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
  ogImage: string;
}

interface PostEditorProps {
  /** Pre-filled data for editing; omit for creating a new post. */
  initialData?: Partial<PostFormData>;
  /** Available topics for the dropdown. */
  topics: TopicOption[];
  /** API endpoint to submit to. */
  endpoint: string;
  /** HTTP method — POST for create, PUT for update. */
  method?: "POST" | "PUT";
}

const EMPTY_FORM: PostFormData = {
  title: "",
  slug: "",
  summary: "",
  content: "",
  topic: "",
  sourceUrl: "",
  sourcePublisher: "",
  difficulty: "beginner",
  readTimeMinutes: 5,
  publishedAt: new Date().toISOString().split("T")[0],
  featured: false,
  draft: true,
  ogImage: "",
};

export default function PostEditor({
  initialData,
  topics,
  endpoint,
  method = "POST",
}: PostEditorProps) {
  const router = useRouter();
  const [form, setForm] = useState<PostFormData>({ ...EMPTY_FORM, ...initialData });
  const [status, setStatus] = useState<"idle" | "saving" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  function update<K extends keyof PostFormData>(key: K, value: PostFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setErrorMsg("");

    try {
      const payload = { ...form, published: !form.draft };
      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error ?? `Server returned ${res.status}`);
      }

      setStatus("success");
      router.push("/admin/posts");
      router.refresh();
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold text-text-primary">Post Details</legend>

        <label className="block">
          <span className="text-sm font-medium text-text-secondary">Title</span>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => update("title", e.target.value)}
            className="mt-1 block w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-brand-600 focus:ring-1 focus:ring-brand-600 outline-none"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-text-secondary">Slug</span>
          <input
            type="text"
            required
            value={form.slug}
            onChange={(e) => update("slug", e.target.value)}
            placeholder="my-post-slug"
            className="mt-1 block w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-brand-600 focus:ring-1 focus:ring-brand-600 outline-none font-mono"
          />
        </label>

        <label className="block">
          <span className="text-sm font-medium text-text-secondary">Summary</span>
          <textarea
            rows={2}
            value={form.summary}
            onChange={(e) => update("summary", e.target.value)}
            className="mt-1 block w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-brand-600 focus:ring-1 focus:ring-brand-600 outline-none"
          />
        </label>
      </fieldset>

      {/* Metadata */}
      <fieldset className="space-y-4">
        <legend className="text-lg font-semibold text-text-primary">Metadata</legend>

        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-text-secondary">Topic</span>
            <select
              value={form.topic}
              onChange={(e) => update("topic", e.target.value)}
              className="mt-1 block w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-brand-600 focus:ring-1 focus:ring-brand-600 outline-none"
            >
              <option value="">Select topic…</option>
              {topics.map((t) => (
                <option key={t.slug} value={t.slug}>
                  {t.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-text-secondary">Difficulty</span>
            <select
              value={form.difficulty}
              onChange={(e) => update("difficulty", e.target.value as PostFormData["difficulty"])}
              className="mt-1 block w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-brand-600 focus:ring-1 focus:ring-brand-600 outline-none"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </label>

          <label className="block">
            <span className="text-sm font-medium text-text-secondary">Read Time (min)</span>
            <input
              type="number"
              min={1}
              value={form.readTimeMinutes}
              onChange={(e) => update("readTimeMinutes", Number(e.target.value))}
              className="mt-1 block w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-brand-600 focus:ring-1 focus:ring-brand-600 outline-none"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-text-secondary">Published Date</span>
            <input
              type="date"
              value={form.publishedAt}
              onChange={(e) => update("publishedAt", e.target.value)}
              className="mt-1 block w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-brand-600 focus:ring-1 focus:ring-brand-600 outline-none"
            />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className="block">
            <span className="text-sm font-medium text-text-secondary">Source URL</span>
            <input
              type="url"
              value={form.sourceUrl}
              onChange={(e) => update("sourceUrl", e.target.value)}
              className="mt-1 block w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-brand-600 focus:ring-1 focus:ring-brand-600 outline-none"
            />
          </label>

          <label className="block">
            <span className="text-sm font-medium text-text-secondary">Source Publisher</span>
            <input
              type="text"
              value={form.sourcePublisher}
              onChange={(e) => update("sourcePublisher", e.target.value)}
              className="mt-1 block w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-brand-600 focus:ring-1 focus:ring-brand-600 outline-none"
            />
          </label>
        </div>

        <label className="block">
          <span className="text-sm font-medium text-text-secondary">OG Image filename</span>
          <input
            type="text"
            value={form.ogImage}
            onChange={(e) => update("ogImage", e.target.value)}
            placeholder="og-my-post.png"
            className="mt-1 block w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-brand-600 focus:ring-1 focus:ring-brand-600 outline-none font-mono"
          />
        </label>

        <div className="flex gap-6">
          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.draft}
              onChange={(e) => update("draft", e.target.checked)}
              className="rounded border-border text-brand-600 focus:ring-brand-600"
            />
            <span className="text-text-secondary">Draft</span>
          </label>

          <label className="inline-flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.featured}
              onChange={(e) => update("featured", e.target.checked)}
              className="rounded border-border text-brand-600 focus:ring-brand-600"
            />
            <span className="text-text-secondary">Featured</span>
          </label>
        </div>
      </fieldset>

      {/* Content */}
      <fieldset className="space-y-2">
        <legend className="text-lg font-semibold text-text-primary">Content (Markdown)</legend>
        <textarea
          rows={20}
          value={form.content}
          onChange={(e) => update("content", e.target.value)}
          className="block w-full rounded-lg border border-border bg-surface px-4 py-3 text-sm text-text-primary font-mono focus:border-brand-600 focus:ring-1 focus:ring-brand-600 outline-none"
          placeholder="Write your markdown content here…"
        />
      </fieldset>

      {/* Submit */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={status === "saving"}
          className="rounded-lg bg-brand-600 px-6 py-2 text-sm font-medium text-white hover:bg-brand-700 disabled:opacity-50 transition-colors"
        >
          {status === "saving" ? "Saving…" : method === "PUT" ? "Update Post" : "Create Post"}
        </button>

        {status === "success" && (
          <span className="text-sm text-green-600">Saved successfully!</span>
        )}
        {status === "error" && (
          <span className="text-sm text-red-600">{errorMsg}</span>
        )}
      </div>
    </form>
  );
}
