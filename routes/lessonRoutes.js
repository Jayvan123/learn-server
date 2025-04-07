const express = require("express");
const { body, param, validationResult } = require("express-validator");
const router = express.Router();
const handleValidationErrors = require('../utils/validationErrorHandling');
const authMiddleware = require("../middleware/authMiddleware");
const {
  createLesson,
  getLessons,
  getLessonById,
  updateLesson,
  deleteLesson,
} = require("../controllers/lessonController");

// Create Lesson
router.post(
  "/",
  authMiddleware,
  body("title")
    .exists().withMessage("Title is required.")
    .bail()
    .isString().withMessage("Title must be a string.")
    .bail()
    .trim()
    .notEmpty().withMessage("Title cannot be empty."),
  body("content")
    .exists().withMessage("Content is required.")
    .bail()
    .isString().withMessage("Content must be a string.")
    .bail()
    .trim()
    .notEmpty().withMessage("Content cannot be empty."),
  body("categoryName")
    .optional()
    .isString().withMessage("Category name must be a string.")
    .trim(),
  handleValidationErrors,
  createLesson
);

// Get All Lessons
router.get(
  "/",
  authMiddleware,
  getLessons
);

// Get Lesson by ID
router.get(
  "/:id",
  authMiddleware,
  param("id")
    .isMongoId().withMessage("Invalid lesson ID."),
  handleValidationErrors,
  getLessonById
);

// Update Lesson
router.put(
  "/:id",
  authMiddleware,
  param("id")
    .isMongoId().withMessage("Invalid lesson ID."),
  body("title")
    .optional()
    .isString().withMessage("Title must be a string.")
    .bail()
    .trim()
    .notEmpty().withMessage("Title cannot be empty."),
  body("content")
    .optional()
    .isString().withMessage("Content must be a string.")
    .bail()
    .trim()
    .notEmpty().withMessage("Content cannot be empty."),
  handleValidationErrors,
  updateLesson
);

// Delete Lesson
router.delete(
  "/:id",
  authMiddleware,
  param("id")
    .isMongoId().withMessage("Invalid lesson ID."),
  handleValidationErrors,
  deleteLesson
);

module.exports = router;
