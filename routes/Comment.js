import express from "express";
import { verifyToken } from "../middlewares/authMiddleware.js";
import {
  createComment,
  getComment,
  getAllPostComments,
  getAllUserComments,
  updateComment,
  deleteComment,
} from "../controllers/Comments.js";

const router = express.Router();

router.post("/:postId", verifyToken, createComment);
router.get("/:commentId", verifyToken, getComment);
router.get("/under/:postId", verifyToken, getAllPostComments);
router.get("/", verifyToken, getAllUserComments);
router.put("/:commentId", verifyToken, updateComment);
router.delete("/:commentId", verifyToken, deleteComment);

export default router;
