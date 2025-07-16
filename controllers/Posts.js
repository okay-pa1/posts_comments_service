import Post from "../models/Posts.js";
import User from "../models/User.js";

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

    res.status(200).send(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const allPosts = await Post.find({
      postedBy: req._id,
      isDeleted: false,
    }).populate("postedBy", "username");
    res.status(200).send(allPosts);
  } catch (err) {
    const status = err.status || 500;
    res.status(status).json({ message: err.message });
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

    res.status(200).send(deletedPost);
  } catch (err) {
    const errStatus = err.status || 500;
    res.status(errStatus).send(err.message);
  }
};
