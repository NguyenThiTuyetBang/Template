import mongoose from "mongoose";
import Message from "../models/Message";
import { Router, Request, Response } from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";

const router = Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

router.get("/health", async (req: Request, res: Response) => {
  try {
    const isConnected = mongoose.connection.readyState === 1;
    if (isConnected) {
      res.json({ status: "ok", database: "connected" });
    } else {
      res
        .status(500)
        .json({ status: "error", message: "Database not connected" });
    }
  } catch (error) {
    console.error("Database health check failed:", error);
    res
      .status(500)
      .json({ status: "error", message: "Database health check failed" });
  }
});

router.get("/chat", async (req: Request, res: Response) => {
  try {
    const messages = await Message.find().sort({ createdAt: 1 });
    res.json({ messages });
  } catch (error) {
    console.error("Fetch chat history failed:", error);
    res.status(500).json({
      status: "error",
      message: error instanceof Error ? error.message : String(error),
    });
  }
});

router.post("/chat", async (req: Request, res: Response): Promise<void> => {
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== "string") {
    res.status(400).json({ status: "error", message: "Invalid prompt" });
    return;
  }

  try {
    // 1. Save user prompt to database
    await Message.create({ role: "user", content: prompt });

    // 2. Call Gemini
    let responseText = "";
    try {
      const result = await model.generateContent(prompt);
      responseText = result.response.text();
    } catch (apiError: any) {
      // If the model is experiencing high demand (503), gracefully fallback to gemini-1.5-flash
      if (apiError.status === 503) {
        console.warn("gemini-2.5-flash is experiencing high demand (503). Falling back to gemini-1.5-flash...");
        const fallbackModel = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await fallbackModel.generateContent(prompt);
        responseText = result.response.text();
      } else {
        throw apiError; // Re-throw if it's not a 503
      }
    }

    // 3. Save AI response to database
    await Message.create({ role: "ai", content: responseText });

    res.json({
      status: "success",
      reply: responseText,
    });
  } catch (error) {
    console.error("Chat generation failed:", error);
    res.status(500).json({
      status: "error",
      message: error instanceof Error ? error.message : String(error),
    });
  }
});
export default router;
