const { GoogleGenerativeAI } = require("@google/generative-ai");
const Question = require("../models/questionModel");
const Lesson = require("../models/lessonModel");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Generate Questions using Gemini AI
exports.generateQuestions = async (req, res) => {
  try {
    const { lessonId } = req.params;
   
    // Find the lesson
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return res.status(404).json({ error: "Lesson not found" });

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-pro-exp-02-05" });

    const generationConfig = {
      temperature: 0.2,
      topP: 0.95,
      topK: 40,
      maxOutputTokens: 8192,
      responseMimeType: "application/json",
    };

    const prompt = `
    I have the following lesson notes:
    "${lesson.content}"
  
    Generate exactly 5 multiple-choice questions based on this lesson.
    Each question must have exactly 4 answer choices.
    Indicate the correct answer.

    **VERY IMPORTANT:** Return ONLY valid JSON without any explanations, extra text, or formatting like markdown, backticks, or code blocks.

    **Format it EXACTLY like this:**
    {
      "questions": [
        {
          "questionText": "Your question here",
          "choices": ["Choice A", "Choice B", "Choice C", "Choice D"],
          "correctAnswer": "Choice A"
        }
      ]
    }

    Do NOT include explanations or any other text, ONLY return valid JSON.
    `;

    // Generate questions with AI
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
    });

    const responseText = await result.response.text();
    console.log(responseText);

    // Parse AI-generated JSON
    const parsedData = JSON.parse(responseText);
    const generatedQuestions = parsedData.questions;

    // Store questions in MongoDB
    const savedQuestions = await Question.insertMany(
      generatedQuestions.map(q => ({
        lessonId,
        questionText: q.questionText,
        choices: q.choices,
        correctAnswer: q.correctAnswer,
      }))
    );

    res.status(201).json(savedQuestions);
  } catch (error) {
    console.error("❌ Error generating questions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.getQuestionsByLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;

    // Check if lessonId is provided
    if (!lessonId) {
      return res.status(400).json({ error: "Lesson ID is required" });
    }

    // Fetch questions from database
    const questions = await Question.find({ lessonId });

    // Return questions
    res.status(200).json({ questions });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ error: "Failed to fetch questions" });
  }
};