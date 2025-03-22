const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const lessonController = require("../controllers/lessonController");
const { validateLesson, validateLessonId, validateLessonUpdate } = require("../middleware/validators/lessonValidator");

router.post("/", authMiddleware, validateLesson, lessonController.createLesson);
router.get("/", authMiddleware, lessonController.getLessons);
router.get("/:id", authMiddleware, validateLessonId, lessonController.getLessonById);
router.put("/:id", authMiddleware, validateLessonId, validateLessonUpdate, lessonController.updateLesson);
router.delete("/:id", authMiddleware, validateLessonId, lessonController.deleteLesson);

module.exports = router;
