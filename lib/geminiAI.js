require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


const model = genAI.getGenerativeModel({ model: "gemini-2.0-pro-exp-02-05" });

const generationConfig = {
  temperature: 0.2,
  topP: 0.95,
  topK: 40,
  max_output_tokens: 8192,
  response_mime_type: "application/json",
};

module.exports = {
  model,
  generationConfig,
};
