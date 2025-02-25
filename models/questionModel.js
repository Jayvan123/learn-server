const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  lessonId: { type: mongoose.Schema.Types.ObjectId, ref: "Lesson", required: true },
  questionText: { type: String, required: true },
  choices: [{ type: String, required: true }], // Array of 4 choices
  correctAnswer: { type: String, required: true }, // One correct answer
  createdAt: { type: Date, default: Date.now },
});

const Question = mongoose.model("Question", questionSchema);
module.exports = Question;
