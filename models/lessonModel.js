const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true }, 
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
  },
  { timestamps: true } 
);

const Lesson = mongoose.model("Lesson", lessonSchema);

module.exports = Lesson;
