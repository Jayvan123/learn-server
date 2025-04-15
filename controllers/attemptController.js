const LessonResult = require("../models/attemptModel");
const mongoose = require("mongoose");

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

// Get average score for a specific lesson
const getAverageScoreByLesson = async (req, res) => {
    try {
      const { lessonId } = req.params;
  
      const result = await LessonResult.aggregate([
        { $match: { lessonId: new mongoose.Types.ObjectId(lessonId) } },
        {
          $group: {
            _id: "$lessonId",
            averageScore: { $avg: "$score" },
            totalAttempts: { $sum: 1 }
          },
        },
      ]);
  
      if (result.length === 0) {
        return res.status(404).json({ message: "No attempts found for this lesson." });
      }
  
      res.status(200).json({
        lessonId,
        averageScore: result[0].averageScore,
        totalAttempts: result[0].totalAttempts
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to compute average score for lesson", error });
    }
  };

const getAverageScoreByUser = async (req, res) => {
    try {
      const { userId } = req.params;
  
      const result = await LessonResult.aggregate([
        { $match: { userId: new mongoose.Types.ObjectId(userId) } },
        {
          $group: {
            _id: "$userId",
            averageScore: { $avg: "$score" },
            totalAttempts: { $sum: 1 }
          },
        },
      ]);
  
      if (result.length === 0) {
        return res.status(404).json({ message: "No attempts found for this user." });
      }
  
      res.status(200).json({
        userId,
        averageScore: result[0].averageScore,
        totalAttempts: result[0].totalAttempts
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to compute average score for user", error });
    }
};
  
module.exports = {
    saveLessonAttempt,
    getLessonAttempts,
    getUserTotalAttempts,
    getAverageScoreByLesson,
    getAverageScoreByUser,
};