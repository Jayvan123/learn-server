require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Define the model and generation configuration
const model = genAI.getGenerativeModel({ model: "gemini-2.0-pro-exp-02-05" });

const generationConfig = {
  temperature: 0.2,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "application/json",
};

// Export everything needed in other parts of the application
module.exports = {
  model,
  generationConfig,
};
