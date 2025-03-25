const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {createLesson, getLessons, getLessonById, updateLesson, deleteLesson} = require("../controllers/lessonController");
const { validateLesson, validateLessonId, validateLessonUpdate } = require("../middleware/validators/lessonValidator");

router.post("/", 
    authMiddleware, 
    validateLesson, 
    createLesson
);

router.get("/", 
    authMiddleware, 
    getLessons
);

router.get("/:id", 
    authMiddleware, 
    validateLessonId, 
    getLessonById
);
router.put("/:id", 
    authMiddleware, 
    validateLessonId, 
    validateLessonUpdate, 
    updateLesson
);

router.delete("/:id", 
    authMiddleware, 
    validateLessonId, 
    deleteLesson
);

module.exports = router;
