import Comment from "../models/Comments.js";
import { logUserActivity } from "./userActivity.js";

export const createComment = async (req, res) => {
  try {
    const newComment = new Comment({
      comment: req.body.comment,
      postId: req.params.postId,
      commentedBy: req._id,
    });

    const savedComment = await newComment.save();
    await logUserActivity({
      userId: req._id,
      action: "createComment",
      collection: "Comment",
      metadata: {
        commentId: savedComment._id.toString(),
        postId: req.params.postId.toString(),
      },
    });

    res.status(201).send(savedComment);
  } catch (err) {
    const errStatus = err.status || 500;
    res.status(errStatus).send(err.message);
  }
};

export const getComment = async (req, res) => {
  try {
    const comment = await Comment.findOne({
      _id: req.params.commentId,
      isDeleted: false,
    })
      .populate("postId", "title description")
      .populate("commentedBy", "username");

    if (!comment) res.status(404).json("Comment doesn't exist");

    await logUserActivity({
      userId: req._id,
      action: "readComment",
      collection: "Comment",
      metadata: { commentId: comment._id.toString() },
    });

    res.status(200).send(comment);
  } catch (err) {
    const errStatus = err.status || 500;
    res.status(errStatus).json({ message: err.message });
  }
};

export const getAllPostComments = async (req, res) => {
  const postId = req.params.postId;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortBy = req.query.sortBy || "createdAt";
  const order = req.query.order === "asc" ? 1 : -1;

  try {
    const comments = await Comment.find({
      postId: postId,
      isDeleted: false,
    })
      .populate("postId", "title")
      .sort({ [sortBy]: order })
      .skip((page - 1) * limit)
      .limit(limit);

    await logUserActivity({
      userId: req._id,
      action: "readAllPostComments",
      collection: "Comment",
      metadata: {
        commentIds: comments.map((comment) => comment._id.toString()),
        postId: req.params.postId,
      },
    });

    const total = await Comment.countDocuments({
      postId: postId,
      isDeleted: false,
    });

    res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      comments,
    });
  } catch (err) {
    const errStatus = err.status || 500;
    res.status(errStatus).json({ message: err.message });
  }
};

export const getAllUserComments = async (req, res) => {
  const userId = req._id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortBy = req.query.sortBy || "createdAt";
  const order = req.query.order === "asc" ? 1 : -1;

  try {
    const comments = await Comment.find({
      commentedBy: userId,
      isDeleted: false,
    })
      .populate("postId", "title description")
      .sort({ [sortBy]: order })
      .skip((page - 1) * limit)
      .limit(limit);

    await logUserActivity({
      userId: req._id,
      action: "readAllUserComments",
      collection: "Comment",
      metadata: {
        commentIds: comments.map((comment) => comment._id.toString()),
        postId: req.params.postId,
      },
    });

    const total = await Comment.countDocuments({
      commentedBy: userId,
      isDeleted: false,
    });

    res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      comments,
    });
  } catch (err) {
    const errStatus = err.status || 500;
    res.status(errStatus).json({ message: err.message });
  }
};

export const updateComment = async (req, res) => {
  try {
    const data = req.body;

    const updatedComment = await Comment.findOneAndUpdate(
      { _id: req.params.commentId, commentedBy: req._id, isDeleted: false },
      data,
      { new: true }
    );

    if (!updatedComment)
      res.status(404).json({ message: "Comment doesn't exist" });

    await logUserActivity({
      userId: req._id,
      action: "updateComment",
      collection: "Comment",
      metadata: { commentId: updatedComment._id.toString },
    });
    res.status(200).send(updatedComment);
  } catch (err) {
    const errStatus = err.status || 500;
    res.status(errStatus).json({ message: err.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const deletedComment = await Comment.findOneAndUpdate(
      { _id: req.params.commentId, commentedBy: req._id, isDeleted: false },
      { isDeleted: true } //soft deletion of the comment
    );
    if (!deleteComment)
      res.status(404).json({ message: "Comment doesn't exist" });

    await logUserActivity({
      userId: req._id,
      action: "deleteComment",
      collection: "Comment",
      metadata: { commentId: deletedComment._id.toString() },
    });

    res.status(200).json({ message: "Comment was deleted successfully" });
  } catch (err) {
    const errStatus = err.status || 500;
    res.status(errStatus).json({ message: err.message });
  }
};
