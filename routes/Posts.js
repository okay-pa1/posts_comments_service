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
import {
  createPostValidator,
  editPostValidator,
  paginationValidator,
} from "../middlewares/req_validator/postValidator.js";
import { validateRequest } from "../middlewares/validateRequest.js";

const router = express.Router();

//create post
router.post("/", verifyToken, createPostValidator, validateRequest, createPost);

//get post
router.get("/:postId", verifyToken, getPost);

//get all posts
router.get("/", verifyToken, paginationValidator, validateRequest, getAllPosts);

//get all posts by the user
router.get(
  "/user",
  verifyToken,
  paginationValidator,
  validateRequest,
  getAllUserPosts
);

//edit the post
router.put(
  "/:postId",
  editPostValidator,
  validateRequest,
  verifyToken,
  editPost
);

//delete the post
router.delete("/:postId", verifyToken, deletePost);

export default router;
