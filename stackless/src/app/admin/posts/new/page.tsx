/**
 * Admin — Create New Post
 *
 * Uses the PostEditor component with POST method.
 */

import { getTopics } from "@/db/queries/topics";
import PostEditor from "@/components/admin/PostEditor";

export const dynamic = "force-dynamic";

export default async function AdminNewPostPage() {
  const topics = await getTopics();

  const topicOptions = topics.map((t) => ({
    slug: t.slug,
    name: t.name,
  }));

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-text-primary">New Post</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Create a new blog post. It will be saved as a draft by default.
        </p>
      </div>
      <PostEditor topics={topicOptions} endpoint="/api/posts" method="POST" />
    </div>
  );
}
