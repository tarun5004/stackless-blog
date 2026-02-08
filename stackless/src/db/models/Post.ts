import mongoose, { Schema, type InferSchemaType } from "mongoose";

const PostSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    summary: { type: String, default: "" },
    content: { type: String, default: "" },
    topics: [{ type: Schema.Types.ObjectId, ref: "Topic" }],
    difficulty: {
      type: String,
      enum: ["beginner", "intermediate"],
      default: "beginner",
    },
    published: { type: Boolean, default: false, index: true },
  },
  { timestamps: true }
);

export type IPost = InferSchemaType<typeof PostSchema>;

const Post = mongoose.models.Post || mongoose.model("Post", PostSchema);
export default Post;
