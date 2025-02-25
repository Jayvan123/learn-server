const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const lessonController = require("../controllers/lessonController");

router.post("/", authMiddleware, lessonController.createLesson);  // ✅ Protect this route
router.get("/", authMiddleware, lessonController.getLessons);
router.get("/:id", authMiddleware, lessonController.getLessonById);
router.put("/:id", authMiddleware, lessonController.updateLesson);
router.delete("/:id", authMiddleware, lessonController.deleteLesson);

module.exports = router;
