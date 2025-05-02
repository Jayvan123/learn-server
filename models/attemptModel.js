const mongoose = require("mongoose");

const attemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
    },
    score: {
      type: Number, 
      required: true,
    },
    totalItems: {
      type: Number,
      required: true,
    },
    correctAnswers: {
      type: Number,
      required: true,
    },
    takenAt: {
      type: Date,
      default: Date.now,
    },
  },
);

module.exports = mongoose.model("AttemptSchema", attemptSchema);
