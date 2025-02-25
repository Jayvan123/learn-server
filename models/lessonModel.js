const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true }, // The actual lesson notes
  },
  { timestamps: true } // Automatically adds createdAt & updatedAt
);

const Lesson = mongoose.model("Lesson", lessonSchema);
module.exports = Lesson;
