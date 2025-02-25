const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    lessonId: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", required: true },
    questionText: { type: String, required: true },
    choices: { type: [String], required: true }, // Array of 4 choices
    correctAnswer: { type: String, required: true }, // The correct choice
  },
  { timestamps: true } // Adds createdAt and updatedAt fields automatically
);

const Question = mongoose.model("Question", questionSchema);
module.exports = Question;
