const express = require("express");
const { body, param } = require("express-validator");
const router = express.Router();
const validationError = require('../utils/validationError');
const authMiddleware = require("../middleware/authMiddleware");
const {
  createLesson,
  getLessons,
  getLessonsByCategoryId,
  getLessonById,
  updateLesson,
  deleteLesson,
  getLatestLessons,
  countUserLessons
} = require("../controllers/lessonController");


router.post(
  "/",
  authMiddleware,
  body("title")
    .exists().withMessage("Title is required.")
    .isString().withMessage("Title must be a string.")
    .trim()
    .notEmpty().withMessage("Title cannot be empty."),
  body("content")
    .exists().withMessage("Content is required.")
    .isString().withMessage("Content must be a string.")
    .trim()
    .notEmpty().withMessage("Content cannot be empty."),
  body("categoryName")
    .optional()
    .isString().withMessage("Category name must be a string.")
    .trim(),
    validationError,
  createLesson
);


// Get all Lessons for specific user
router.get(
  "/",
  authMiddleware,
  getLessons
);

// Get Lesson by Category ID
router.get(
  "/category/:categoryId",
  authMiddleware,
  param("categoryId")
    .isMongoId().withMessage("Invalid Category ID."),
  validationError,
  getLessonsByCategoryId
);

// Get Lesson by ID
router.get(
  "/:id",
  authMiddleware,
  param("id")
    .isMongoId().withMessage("Invalid lesson ID."),
    validationError,
  getLessonById
);


router.put(
  "/:id",
  authMiddleware,
  param("id")
    .isMongoId().withMessage("Invalid lesson ID."),
  body("title")
    .optional()
    .isString().withMessage("Title must be a string.")
    .trim()
    .notEmpty().withMessage("Title cannot be empty."),
  body("content")
    .optional()
    .isString().withMessage("Content must be a string.")
    .trim()
    .notEmpty().withMessage("Content cannot be empty."),
    validationError,
  updateLesson
);

// Delete Lesson
router.delete(
  "/:id",
  authMiddleware,
  param("id")
    .isMongoId().withMessage("Invalid lesson ID."),
    validationError,
  deleteLesson
);

// Get Latest Lessons
router.get(
  "/latest/:userId",
  authMiddleware,
  param("userId")
  .notEmpty().withMessage("User ID is required")
  .isMongoId().withMessage("Invalid User ID"),
  validationError,
  getLatestLessons
);

// Count Lessons for a User
router.get(
  "/count/:userId",
  authMiddleware,
  param("userId").notEmpty().withMessage("User ID is required")
    .isMongoId().withMessage("Invalid User ID"),
  validationError,
  countUserLessons
);

module.exports = router;
