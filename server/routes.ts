import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertReadingSchema } from "@shared/schema";
import { generateCardInterpretation } from "./ai-service";
import { tarotCards } from "@shared/tarot-data";

export function registerRoutes(app: Express): Server {
  app.post("/api/readings", async (req, res) => {
    try {
      const reading = insertReadingSchema.parse(req.body);
      const result = await storage.createReading(reading);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: "Invalid reading data" });
    }
  });

  app.get("/api/readings", async (req, res) => {
    const readings = await storage.getReadings();
    res.json(readings);
  });

  app.get("/api/readings/daily", async (req, res) => {
    const readings = await storage.getDailyReadings();
    res.json(readings);
  });

  app.get("/api/readings/spreads", async (req, res) => {
    const readings = await storage.getSpreadReadings();
    res.json(readings);
  });

  app.post("/api/interpret", async (req, res) => {
    try {
      const { cardId, context } = req.body;
      const card = tarotCards.find(c => c.id === cardId);

      if (!card) {
        return res.status(400).json({ error: "Invalid card ID" });
      }

      const interpretation = await generateCardInterpretation(card, context);
      res.json({ interpretation });
    } catch (error) {
      console.error("AI interpretation error:", error);
      res.status(500).json({ error: "Failed to generate interpretation" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}