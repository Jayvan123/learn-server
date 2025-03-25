const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    lessonId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Lesson", 
      required: true 
    },
    questionText: { 
      type: String, 
      required: true 
    },
    choices: { 
      type: [String], 
      required: true 
    }, 
    correctAnswer: { 
      type: String, 
      required: true 
    }, 
  },
  { 
    timestamps: true 
  } 
);

module.exports = mongoose.model('Question', questionSchema);
