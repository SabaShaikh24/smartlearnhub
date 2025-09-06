/* eslint-disable no-undef */
import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = express.Router();

// POST /api/chat
router.post("/", async (req, res) => {
  try {
    const { message, image } = req.body;

    if (!message && !image) {
      return res.status(400).json({ error: "message or image is required" });
    }

    // Initialize Gemini with API key from environment variable
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
   const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    // Generate response from Gemini
    
    let content;

if (image) {
  content = [
    message || "What's in this image?",
    { inlineData: { mimeType: "image/jpeg", data: image.split(",")[1] } }
  ];
}
else {
  content = message;
}

const result = await model.generateContent(content);
const response = await result.response;
const text = response.text();

    res.json({ reply: text }); // Send Gemini's reply as JSON
  } catch (error) {
    console.error("Error in Gemini API:", error);
    res.status(500).json({ error: "Failed to get response from AI" });
  }
});

export default router;