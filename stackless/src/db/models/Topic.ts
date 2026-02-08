import mongoose, { Schema, type InferSchemaType } from "mongoose";

const TopicSchema = new Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
  },
  { timestamps: true }
);

export type ITopic = InferSchemaType<typeof TopicSchema>;

const Topic = mongoose.models.Topic || mongoose.model("Topic", TopicSchema);
export default Topic;
