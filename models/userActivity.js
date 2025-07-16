import mongoose from "mongoose";

const userActivitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    action: {
      type: String,
      enum: [
        "createPost",
        "readPost",
        "readAllUserPosts",
        "readAllPosts",
        "updatePost",
        "deletePost",
        "createComment",
        "readComment",
        "readAllPostComments",
        "readAllUserComments",
        "updateComment",
        "deleteComment",
        "login",
      ],
      required: true,
    },
    collection: {
      type: String,
      enum: ["Post", "Comment", "User"],
      required: true,
    },
    metadata: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

const UserActivity = mongoose.model("UserActivity", userActivitySchema);

export default UserActivity;
