import "dotenv/config";
import express from "express";
import multer from "multer";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = Number(process.env.API_PORT || 3001);
const API_KEY = process.env.GEMINI_API_KEY;
const MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.mimetype)) {
      return cb(new Error("Please upload a JPG, PNG, or WEBP image."));
    }
    cb(null, true);
  },
});

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    service: "Panda food recognition",
    apiKeyConfigured: Boolean(API_KEY),
  });
});

app.post("/api/food-identify", upload.single("image"), async (req, res) => {
  if (!API_KEY) {
    return res.status(503).json({
      error: "Gemini API key is missing. Check your .env file.",
    });
  }

  if (!req.file) {
    return res.status(400).json({
      error: "Please upload a food image.",
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: API_KEY });

    const result = await ai.models.generateContent({
      model: MODEL,
      contents: [
        {
          inlineData: {
            mimeType: req.file.mimetype,
            data: req.file.buffer.toString("base64"),
          },
        },
        {
          text: 'Identify the main food or drink in this image. Return only JSON in this format: {"name":"Idli"}. Use a short, common food name. If it is not food or cannot be identified, return {"name":"Unknown food"}. Do not estimate calories or portion size.',
        },
      ],
      config: {
        responseMimeType: "application/json",
      },
    });

    const data = JSON.parse(result.text || "{}");
    const name =
      typeof data.name === "string" ? data.name.trim() : "";

    if (!name) {
      return res.status(502).json({
        error: "No food name was returned.",
      });
    }
    console.log("🐼 AI identified food:", name);
    res.json({ name });
  } catch (error) {
    console.error("Gemini error:", error.message || error);

    res.status(502).json({
      error: "Food recognition failed. Check your API key and model access.",
    });
  }
});

app.use((error, _req, res, _next) => {
  res.status(400).json({
    error: error.message || "Invalid image upload.",
  });
});

app.listen(PORT, () => {
  console.log(`🐼 Panda backend running at http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
  console.log(`API key configured: ${Boolean(API_KEY)}`);
});