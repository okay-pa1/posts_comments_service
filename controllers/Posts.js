import Post from "../models/Posts.js";
import User from "../models/User.js";
import { logUserActivity } from "./userActivity.js";

export const createPost = async (req, res) => {
  try {
    const newPost = new Post({
      title: req.body.title,
      description: req.body.description,
      postedBy: req._id,
    });

    const savedPost = await newPost.save();

    await User.findByIdAndUpdate(req._id, {
      $push: { posts: newPost._id },
    });

    await logUserActivity({
      userId: req._id,
      action: "createPost",
      collection: "Post",
      metadata: { postId: savedPost._id },
    });

    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getPost = async (req, res) => {
  try {
    const post = await Post.findOne({
      _id: req.params.postId,
      isDeleted: false,
    }).populate("postedBy", "username");
    if (!post) {
      res.status(404).json({ message: "Post doesn't exist" });
    }

    await logUserActivity({
      userId: req._id,
      action: "readPost",
      collection: "Post",
      metadata: { postId: post._id },
    });

    res.status(200).send(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllUserPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortBy = req.query.sortBy === "createdAt" ? "createdAt" : "createdAt";
  const order = req.query.order === "asc" ? "1" : "-1";
  try {
    const allPosts = await Post.find({
      postedBy: req._id,
      isDeleted: false,
    })
      .populate("postedBy", "username")
      .sort({ [sortBy]: order })
      .skip((page - 1) * 10)
      .limit(limit);

    await logUserActivity({
      userId: req._id,
      action: "readAllUserPosts",
      collection: "Post",
      metadata: { postIds: allPosts.map((post) => post._id.toString) },
    });

    const total = await Post.countDocuments({
      postedBy: req._id,
      isDeleted: false,
    });

    res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      posts,
    });
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({ message: err.message });
  }
};

export const getAllPosts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const sortBy = req.query.sortBy === "createdAt" ? "createdAt" : "createdAt";
  const order = req.query.order === "asc" ? 1 : -1;

  try {
    const posts = await Post.find({ isDeleted: false })
      .populate("postedBy", "username")
      .sort({ [sortBy]: order })
      .skip((page - 1) * limit)
      .limit(limit);

    const total = await Post.countDocuments({ isDeleted: false });

    await logUserActivity({
      userId: req._id,
      action: "readAllPosts",
      collection: "Post",
      metadata: { postIds: posts.map((post) => post._id) },
    });

    res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      posts,
    });
  } catch (err) {
    const errStatus = err.status || 500;
    res.status(errStatus).json({ message: err.message });
  }
};

export const editPost = async (req, res) => {
  try {
    const id = req.params.postId;
    const data = req.body;

    const updatedPost = await Post.findOneAndUpdate(
      { _id: id, isDeleted: false },
      data,
      { new: true }
    ).populate("postedBy", "username");

    if (!updatedPost) res.status(404).json({ message: "Post doesn't exist" });

    await logUserActivity({
      userId: req._id,
      action: "updatePost",
      collection: "Post",
      metadata: { postId: updatedPost._id },
    });

    res.status(200).send(updatedPost);
  } catch (err) {
    const errStatus = err.status || 500;
    res.status(errStatus).json({ message: err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const id = req.params.postId;

    //soft deleting the post
    const deletedPost = await Post.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );
    if (!deletedPost) res.status(404).json({ message: "Post doesn't exist" });

    await logUserActivity({
      userId: req._id,
      action: "deletePost",
      collection: "Post",
      metadata: { postIds: deletedPost._id },
    });

    res.status(200).send(deletedPost);
  } catch (err) {
    const errStatus = err.status || 500;
    res.status(errStatus).send(err.message);
  }
};
