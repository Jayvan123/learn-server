const express = require("express");
const { 
  createLesson, 
  getLessons, 
  getLessonById, 
  updateLesson, 
  deleteLesson 
} = require("../controllers/lessonController");
const authMiddleware = require("../middleware/authMiddleware"); // Protect routes

const router = express.Router();

// 📌 Create a lesson (Protected)
router.post("/", authMiddleware, createLesson);

// 📌 Get all lessons for logged-in user (Protected)
router.get("/", authMiddleware, getLessons);

// 📌 Get a specific lesson (Protected)
router.get("/:id", authMiddleware, getLessonById);

// 📌 Update a lesson (Protected)
router.put("/:id", authMiddleware, updateLesson);

// 📌 Delete a lesson (Protected)
router.delete("/:id", authMiddleware, deleteLesson);

module.exports = router;
