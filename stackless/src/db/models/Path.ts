import mongoose, { Schema } from "mongoose";

const PathSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, index: true },
    description: { type: String, default: "" },
    posts: { type: [String], default: [] },
  },
  { timestamps: true }
);

const Path = mongoose.models.Path || mongoose.model("Path", PathSchema);
export default Path;
