import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertReadingSchema, insertStudyProgressSchema, insertJournalEntrySchema } from "@shared/schema";
import { generateCardInterpretation, generateMeditation } from "./ai-service";
import { tarotCards } from "@shared/tarot-data";
import { addDays } from "date-fns";
import { insertLearningTrackSchema, insertUserProgressSchema, insertQuizResultSchema } from "@shared/schema";

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

  app.post("/api/meditate", async (req, res) => {
    try {
      const { cardId } = req.body;
      const card = tarotCards.find(c => c.id === cardId);

      if (!card) {
        return res.status(400).json({ error: "Invalid card ID" });
      }

      const meditation = await generateMeditation(card);
      res.json(meditation);
    } catch (error) {
      console.error("Meditation generation error:", error);
      res.status(500).json({ error: "Failed to generate meditation" });
    }
  });

  // New study progress endpoints
  app.get("/api/study/progress/:cardId", async (req, res) => {
    try {
      const progress = await storage.getStudyProgress(req.params.cardId);
      res.json(progress || null);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch study progress" });
    }
  });

  app.post("/api/study/progress", async (req, res) => {
    try {
      const { cardId, confidenceLevel } = req.body;

      // Calculate next review date based on confidence level
      const daysUntilNextReview = Math.pow(2, confidenceLevel);
      const nextReviewDue = addDays(new Date(), daysUntilNextReview);

      const progress = insertStudyProgressSchema.parse({
        cardId,
        confidenceLevel,
        nextReviewDue,
      });

      const result = await storage.updateStudyProgress(progress);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: "Invalid study progress data" });
    }
  });

  app.get("/api/study/due-cards", async (req, res) => {
    try {
      const dueCards = await storage.getDueCards();
      res.json(dueCards);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch due cards" });
    }
  });

  // Journal routes
  app.post("/api/journal", async (req, res) => {
    try {
      const entry = insertJournalEntrySchema.parse(req.body);
      const result = await storage.createJournalEntry(entry);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: "Invalid journal entry data" });
    }
  });

  app.get("/api/journal", async (req, res) => {
    try {
      const entries = await storage.getJournalEntries();
      res.json(entries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch journal entries" });
    }
  });

  app.get("/api/journal/:id", async (req, res) => {
    try {
      const entry = await storage.getJournalEntry(Number(req.params.id));
      if (!entry) {
        return res.status(404).json({ error: "Journal entry not found" });
      }
      res.json(entry);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch journal entry" });
    }
  });

  app.get("/api/journal/card/:cardId", async (req, res) => {
    try {
      const entries = await storage.getJournalEntriesByCard(req.params.cardId);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch journal entries" });
    }
  });

  app.get("/api/journal/tag/:tag", async (req, res) => {
    try {
      const entries = await storage.getJournalEntriesByTag(req.params.tag);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch journal entries" });
    }
  });

  // Learning Tracks routes
  app.post("/api/learning/tracks", async (req, res) => {
    try {
      const track = insertLearningTrackSchema.parse(req.body);
      const result = await storage.createLearningTrack(track);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: "Invalid learning track data" });
    }
  });

  app.get("/api/learning/tracks", async (req, res) => {
    try {
      const tracks = await storage.getLearningTracks();
      res.json(tracks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch learning tracks" });
    }
  });

  app.get("/api/learning/tracks/:id", async (req, res) => {
    try {
      const track = await storage.getLearningTrack(Number(req.params.id));
      if (!track) {
        return res.status(404).json({ error: "Learning track not found" });
      }
      res.json(track);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch learning track" });
    }
  });

  // User Progress routes
  app.post("/api/learning/progress", async (req, res) => {
    try {
      const progress = insertUserProgressSchema.parse(req.body);
      const result = await storage.createUserProgress(progress);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: "Invalid progress data" });
    }
  });

  app.patch("/api/learning/progress/:id", async (req, res) => {
    try {
      const progress = insertUserProgressSchema.partial().parse(req.body);
      const result = await storage.updateUserProgress(Number(req.params.id), progress);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: "Invalid progress update data" });
    }
  });

  app.get("/api/learning/progress/:trackId", async (req, res) => {
    try {
      const progress = await storage.getUserProgress(Number(req.params.trackId));
      if (!progress) {
        return res.status(404).json({ error: "Progress not found" });
      }
      res.json(progress);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch progress" });
    }
  });

  // Quiz Results routes
  app.post("/api/learning/quiz-results", async (req, res) => {
    try {
      const result = insertQuizResultSchema.parse(req.body);
      const created = await storage.createQuizResult(result);
      res.json(created);
    } catch (error) {
      res.status(400).json({ error: "Invalid quiz result data" });
    }
  });

  app.get("/api/learning/quiz-results/:trackId", async (req, res) => {
    try {
      const results = await storage.getQuizResults(Number(req.params.trackId));
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch quiz results" });
    }
  });

  app.get("/api/learning/recent-quiz-results", async (req, res) => {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : undefined;
      const results = await storage.getRecentQuizResults(limit);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch recent quiz results" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}