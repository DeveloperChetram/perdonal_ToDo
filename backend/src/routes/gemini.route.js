const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Create a new router
const geminiRouter = express.Router();

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
// Use a current, stable model name
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' });

// Define the route handler for POST requests
geminiRouter.post('/gemini', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    res.json({ response: text });

  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Export the router
module.exports = geminiRouter;