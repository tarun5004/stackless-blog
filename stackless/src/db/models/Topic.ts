import mongoose, { Schema } from "mongoose";

const TopicSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, default: "" },
  },
  { timestamps: true }
);

const Topic = mongoose.models.Topic || mongoose.model("Topic", TopicSchema);
export default Topic;
