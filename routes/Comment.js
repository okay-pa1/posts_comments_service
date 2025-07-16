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
import {
  createCommentValidator,
  updateCommentValidator,
  paginationValidator,
} from "../middlewares/req_validator/commentValidator.js";
import { validateRequest } from "../middlewares/validateRequest.js";

const router = express.Router();

router.post(
  "/:postId",
  verifyToken,
  createCommentValidator,
  validateRequest,
  createComment
);
router.get("/:commentId", verifyToken, getComment);
router.get(
  "/under/:postId",
  verifyToken,
  paginationValidator,
  validateRequest,
  getAllPostComments
);
router.get(
  "/",
  verifyToken,
  paginationValidator,
  validateRequest,
  getAllUserComments
);
router.put(
  "/:commentId",
  verifyToken,
  updateCommentValidator,
  validateRequest,
  updateComment
);
router.delete("/:commentId", verifyToken, deleteComment);

export default router;
