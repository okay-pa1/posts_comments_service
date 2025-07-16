import express from "express";
import {
  createPost,
  getAllUserPosts,
  getAllPosts,
  getPost,
  editPost,
  deletePost,
} from "../controllers/Posts.js";
import { verifyToken } from "../middlewares/authMiddleware.js";

const router = express.Router();

//create post
router.post("/", verifyToken, createPost);
router.get("/:postId", verifyToken, getPost);
router.get("/", verifyToken, getAllPosts);
router.get("/user", verifyToken, getAllUserPosts);
router.put("/:postId", verifyToken, editPost);
router.delete("/:postId", verifyToken, deletePost);

export default router;
