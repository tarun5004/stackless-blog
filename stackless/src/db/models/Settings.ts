import mongoose, { Schema, type InferSchemaType } from "mongoose";

const SettingsSchema = new Schema(
  {
    siteName: { type: String, default: "Stackless" },
    description: { type: String, default: "" },
    social: {
      twitter: { type: String, default: "" },
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

export type ISettings = InferSchemaType<typeof SettingsSchema>;

const Settings =
  mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);
export default Settings;
