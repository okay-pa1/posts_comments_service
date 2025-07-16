import mongoose from "mongoose";

const Schema = mongoose.Schema;
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Posts",
      },
    ],
  },
  { timestamps: true }
);

const User = new mongoose.model("User", UserSchema);

export default User;
