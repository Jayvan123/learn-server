const LessonResult = require("../models/attemptModel");

// Save Lesson Attempt
const saveLessonAttempt = async (req, res) => {
    try {
      const { userId, lessonId, score, totalItems, correctAnswers } = req.body;
  
      const newAttempt = new LessonResult({
        userId,
        lessonId,
        score,
        totalItems,
        correctAnswers,
      });
  
      const savedAttempt = await newAttempt.save();
  
      res.status(201).json({
        message: "Lesson attempt saved successfully",
        attempt: savedAttempt,
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to save attempt", error });
    }
  };

// Get attempts for a specific lesson
const getLessonAttempts = async (req, res) => {
    try {
      const { lessonId } = req.params;
  
      const attempts = await LessonResult.countDocuments({ lessonId });
  
      res.status(200).json({ lessonId, totalAttempts: attempts });
    } catch (error) {
      res.status(500).json({ message: "Failed to count lesson attempts", error });
    }
};

// Get attempts for a specific user
const getUserTotalAttempts = async (req, res) => {
    try {
      const { userId } = req.params;
  
      const attempts = await LessonResult.countDocuments({ userId });
  
      res.status(200).json({ userId, totalAttempts: attempts });
    } catch (error) {
      res.status(500).json({ message: "Failed to count user attempts", error });
    }
  };


module.exports = {
    saveLessonAttempt,
    getLessonAttempts,
    getUserTotalAttempts,
};