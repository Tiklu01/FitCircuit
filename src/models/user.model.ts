import  { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    clerkUserId: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    email: { type: String },
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt
);

const User = models.User || model("User", UserSchema); 
export { User };
