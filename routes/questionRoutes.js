const express = require("express");
const router = express.Router();
const { generateQuestions, getQuestionsByLesson } = require("../controllers/questionController");


router.post("/lessons/:lessonId/generate", 
    generateQuestions
);

router.get("/lessons/:lessonId", 
    getQuestionsByLesson
);

module.exports = router;