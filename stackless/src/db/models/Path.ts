import mongoose, { Schema, type InferSchemaType } from "mongoose";

const PathSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, index: true },
    postIds: [{ type: Schema.Types.ObjectId, ref: "Post" }],
  },
  { timestamps: true }
);

export type IPath = InferSchemaType<typeof PathSchema>;

const Path = mongoose.models.Path || mongoose.model("Path", PathSchema);
export default Path;
