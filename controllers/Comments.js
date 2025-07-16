import Comment from "../models/Comments.js";
import Post from "../models/Posts.js";

export const createComment = async (req, res) => {
  try {
    const newComment = new Comment({
      comment: req.body.comment,
      underThePost: req.params.postId,
      commentedBy: req._id,
    });

    const savedComment = await newComment.save();

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
      .populate("underThePost", "title description")
      .populate("commentedBy", "username");

    if (!comment) res.status(404).json("Comment doesn't exist");

    res.status(200).send(comment);
  } catch (err) {
    const errStatus = err.status || 500;
    res.status(errStatus).json({ message: err.message });
  }
};
export const getAllPostComments = async (req, res) => {
  try {
    const allPostComments = await Comment.find({
      underThePost: req.params.postId,
      isDeleted: false,
    }).populate("title");

    res.status(200).send(allPostComments);
  } catch (err) {
    const errStatus = err.status || 500;
    res.status(errStatus).json({ message: err.message });
  }
};

export const getAllUserComments = async (req, res) => {
  try {
    const allUserComments = await Comment.find({
      commentedBy: req._id,
      isDeleted: false,
    }).populate("underThePost", "title description");

    res.status(200).send(allUserComments);
  } catch (err) {
    const errStatus = err.status || 500;
    res.status(errStatus).json({ message: err.message });
  }
};
export const updateComment = async (req, res) => {
  try {
    const data = req.body;

    const updatedComment = await Comment.findOneAndUpdate(
      { _id: req.params.commentId, isDeleted: false },
      data,
      { new: true }
    );

    if (!updatedComment)
      res.status(404).json({ message: "Comment doesn't exist" });

    res.status(200).send(updatedComment);
  } catch (err) {
    const errStatus = err.status || 500;
    res.status(errStatus).json({ message: err.message });
  }
};
export const deleteComment = async (req, res) => {
  try {
    const deletedComment = await Comment.findOneAndUpdate(
      { _id: req.params.commentId, isDeleted: false },
      { isDeleted: true } //soft deletion of the comment
    );
    if (!deleteComment)
      res.status(404).json({ message: "Comment doesn't exist" });

    res.status(200).json({ message: "Comment was deleted successfully" });
  } catch (err) {
    const errStatus = err.status || 500;
    res.status(errStatus).json({ message: err.message });
  }
};
