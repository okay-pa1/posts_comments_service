import mongoose from "mongoose";

const Schema = mongoose.Schema;
const commentSchema = new mongoose.Schema(
  {
    comment: {
      type: String,
      required: true,
    },
    postId: {
      type: Schema.Types.ObjectId,
      ref: "Posts",
      required: true,
    },
    commentedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Comment = new mongoose.model("Comments", commentSchema);

export default Comment;
