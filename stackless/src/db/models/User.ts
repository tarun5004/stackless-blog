import mongoose, { Schema, type InferSchemaType } from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ["ADMIN", "USER"],
      default: "USER",
    },
  },
  { timestamps: true }
);

export type IUser = InferSchemaType<typeof UserSchema>;

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;
