require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Question = require("../models/questionModel");
const Lesson = require("../models/lessonModel");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Generate Questions
const generateQuestions = async (req, res) => {
  try {
    const { lessonId } = req.params;
   
    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return res.status(404).json({ error: "Lesson not found" });

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-pro-exp-02-05" });

    const generationConfig = {
      temperature: 0.2,
      topP: 0.95,
      topK: 40,
      max_output_tokens: 8192,
      response_mime_type: "application/json",
    };

    const prompt = `
    I have the following lesson notes:
    "${lesson.content}"
  
    Generate exactly 5 multiple-choice questions based on this lesson.
    Each question must have exactly 4 answer choices.
    Indicate the correct answer.

    **VERY IMPORTANT:** Return ONLY valid text in a JSON format without any explanations, extra text, or formatting like markdown, backticks, or code blocks.

    Format it EXACTLY like this:
    
    {
      "questions": [
        {
          "questionText": "Your question here",
          "choices": ["Choice A", "Choice B", "Choice C", "Choice D"],
          "correctAnswer": "Choice A"
        }
      ]
    }

    `;

    const cleanResponse = (responseText) => {
      // Remove the unwanted 'ny' and markdown formatting (backticks)
      const cleanedText = responseText.replace(/^[a-zA-Z]+\n*|```json|\n```/g, '').trim();
      return cleanedText;
    };
    
    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
    });
    
    const responseText = await result.response.text();
    const cleanedResponse = cleanResponse(responseText);
    console.log("Cleaned Response:", cleanedResponse);
    
    // Now parse the cleaned response as JSON
    const parsedData = JSON.parse(cleanedResponse);
    const generatedQuestions = parsedData.questions;
    

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
    console.error("Error generating questions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Get Questions by Lesson ID
const getQuestionsByLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;


    if (!lessonId) {
      return res.status(400).json({ error: "Lesson ID is required" });
    }

 
    const questions = await Question.find({ lessonId });


    res.status(200).json({ questions });
  } catch (error) {
    console.error("Error fetching questions:", error);
    res.status(500).json({ error: "Failed to fetch questions" });
  }
};

module.exports = { generateQuestions, getQuestionsByLesson };