const express = require("express");
const router = express.Router();
const { generateQuestions, getQuestionsByLesson } = require("../controllers/questionController");

// 🔹 Generate questions for a specific lesson
router.post("/lessons/:lessonId/generate", generateQuestions);
router.get("/lessons/:lessonId", getQuestionsByLesson);

module.exports = router;
