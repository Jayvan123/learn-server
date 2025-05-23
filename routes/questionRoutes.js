const express = require("express");
const router = express.Router();
const { generateLimiter } = require("../utils/rateLimit");
const { generateQuestions, 
        getQuestionsByLesson,
        batchUpdateQuestions
     } = require("../controllers/questionController");


router.post("/lessons/:lessonId/generate", 
    generateLimiter,
    generateQuestions
);

router.get("/lessons/:lessonId", 
    getQuestionsByLesson
);

<<<<<<< HEAD
module.exports = router;
=======
router.post("/batch-update", batchUpdateQuestions);

module.exports = router;
>>>>>>> 6866c024b0d885c5b1bf2e9f85bbc0c33306adaa
