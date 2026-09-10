import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Increase the limit for JSON bodies if base64 images are large
  app.use(express.json({ limit: "50mb" }));

  // API Route: AI Triage Chatbot
  app.post("/api/triage", async (req, res) => {
    try {
      const { message, history } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY environment variable is missing" });
      }

      const ai = new GoogleGenAI({ apiKey });

      // Convert history to format required by Gemini SDK
      // Using gemini-2.5-flash as default fast model
      
      const systemInstruction = `You are Cura AI, a helpful, empathetic, and professional medical triage assistant. 
Your goal is to gather information about the user's symptoms, ask clarifying questions, and provide general informational guidance.
DO NOT diagnose or prescribe medications. 
Always include a disclaimer for severe symptoms to seek immediate medical attention. 
Keep your responses concise, structured, and easy to read on a mobile device.`;

      let contents = [];
      if (history && Array.isArray(history)) {
        contents = history.map((msg: any) => ({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        }));
      }

      contents.push({
        role: 'user',
        parts: [{ text: message }]
      });

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: contents,
        config: {
          systemInstruction: systemInstruction,
          temperature: 0.4
        }
      });

      res.json({ reply: response.text });
    } catch (error: any) {
      console.error("Triage AI Error:", error);
      res.status(500).json({ error: "Failed to generate AI response", details: error.message });
    }
  });

  // API Route: OCR Prescription & Report Extraction
  app.post("/api/extract-report", async (req, res) => {
    try {
      const { imageBase64, reportType } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY environment variable is missing" });
      }

      if (!imageBase64) {
        return res.status(400).json({ error: "Image data is required" });
      }

      // Remove the data URL prefix to get raw base64 string
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

      const ai = new GoogleGenAI({ apiKey });

      const prompt = `You are a medical data extraction assistant. I am providing an image of a ${reportType}.
Please extract any medications, dosages, frequency, and general notes from this document.
Return your response EXCLUSIVELY as a JSON object with this exact structure:
{
  "medicines": ["Medicine Name - Dosage - Frequency"],
  "notes": "A brief, 1-2 sentence summary or important clinical note extracted."
}
If no medicines are found, leave the array empty. Do not include markdown formatting or backticks around the JSON.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: base64Data
                }
              }
            ]
          }
        ],
        config: {
          temperature: 0.1,
          responseMimeType: "application/json"
        }
      });

      const responseText = response.text || "{}";
      const parsedData = JSON.parse(responseText);

      res.json(parsedData);
    } catch (error: any) {
      console.error("Extraction AI Error:", error);
      res.status(500).json({ error: "Failed to extract data", details: error.message });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
