import mongoose, { Schema } from "mongoose";

const PostSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    summary: { type: String, default: "" },
    content: { type: String, default: "" },
    topic: { type: String, default: "" },
    sourceUrl: { type: String, default: "" },
    sourcePublisher: { type: String, default: "" },
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate", "advanced"],
      default: "beginner",
    },
    readTimeMinutes: { type: Number, default: 5 },
    publishedAt: { type: String, default: "" },
    featured: { type: Boolean, default: false },
    draft: { type: Boolean, default: false },
    published: { type: Boolean, default: false, index: true },
    readNext: { type: [String], default: [] },
    order: { type: Number, default: 0 },
    ogImage: { type: String, default: "" },
  },
  { timestamps: true }
);

const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);
export default Post;
