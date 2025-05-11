const express = require("express");
const { body, param } = require("express-validator");
const authMiddleware = require("../middleware/authMiddleware");
const validationError = require("../utils/validationError");
const {
  saveLessonAttempt,
  getAttemptsByUser,
  getLessonAttempts,
  getUserTotalAttempts,
  getAverageScoreByLesson,
  getAverageScoreByUser
} = require("../controllers/attemptController");

const router = express.Router();

// Save Lesson Attempt
router.post(
  "/",
    body("userId")
        .notEmpty().withMessage("User ID is required")
        .isMongoId().withMessage("Invalid User ID"),
    body("lessonId")
        .notEmpty().withMessage("Lesson ID is required")
        .isMongoId().withMessage("Invalid Lesson ID"),
    body("score")
        .notEmpty().withMessage("Score is required")
        .isNumeric().withMessage("Score must be a number"),
    body("totalItems")
        .notEmpty().withMessage("Total items is required")
        .isInt({ min: 1 }).withMessage("Total items must be at least 1"),
    body("correctAnswers")
        .notEmpty().withMessage("Correct answers is required")
        .isInt({ min: 0 }).withMessage("Correct answers must be at least 0"),
  validationError,
  saveLessonAttempt
);

router.get("/allattempts/:userId", getAttemptsByUser);

// Get Attempt for a specific Lesson
router.get("/lesson/:lessonId", 
    authMiddleware,
    param("lessonId").notEmpty().withMessage("User ID is required")
        .isMongoId().withMessage("Invalid User ID"),
    validationError,
    getLessonAttempts
);

// Get Total Attempts for a specific User
router.get("/user/:userId", 
    authMiddleware,
    param("userId").notEmpty().withMessage("User ID is required")
        .isMongoId().withMessage("Invalid User ID"),
    validationError,
    getUserTotalAttempts
);

// Average score by lesson
router.get(
    "/average/lesson/:lessonId",
    authMiddleware,
    param("lessonId")
        .notEmpty().isMongoId().withMessage("Invalid lesson ID"),
    validationError,
    getAverageScoreByLesson
);
  
  // Average score by user
router.get(
    "/average/user/:userId",
    authMiddleware,
    param("userId").notEmpty().isMongoId().withMessage("Invalid user ID"),
    validationError,
    getAverageScoreByUser
);

module.exports = router;
