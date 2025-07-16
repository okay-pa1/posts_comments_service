import { body, query } from "express-validator";

export const createCommentValidator = [
  body("comment")
    .trim()
    .notEmpty()
    .withMessage("Comment is required.")
    .isLength({ min: 1 })
    .withMessage("Comment must be at least 5 characters."),
];

export const updateCommentValidator = [
  body("comment")
    .optional()
    .trim()
    .isLength({ min: 1 })
    .withMessage("Comment must be at least 5 characters."),
];

export const paginationValidator = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Page must be a positive integer."),
  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Limit must be a positive integer."),
  query("sortBy")
    .optional()
    .isIn(["createdAt"])
    .withMessage("Invalid sortBy value."),
  query("order")
    .optional()
    .isIn(["asc", "desc"])
    .withMessage("Order must be 'asc' or 'desc'."),
];
