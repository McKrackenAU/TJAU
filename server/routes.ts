import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertReadingSchema, insertStudyProgressSchema, insertJournalEntrySchema } from "@shared/schema";
import { generateCardInterpretation, generateMeditation, generateDailyAffirmation, analyzeCardCombination } from "./ai-service";
import { tarotCards } from "@shared/tarot-data";
import { addDays } from "date-fns";
import { insertLearningTrackSchema, insertUserProgressSchema, insertQuizResultSchema } from "@shared/schema";
import multer from 'multer';
import { requireAdmin } from "./middleware/admin";
import { importCardsFromExcel } from "./utils/import-cards";
import path from 'path';
import fs from 'fs/promises';

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
      console.log("Interpreting card:", cardId, "with context:", context);

      // Get all available cards including imported ones
      const allCards = await storage.getImportedCards();
      const availableCards = [...tarotCards, ...allCards.map(card => ({
        ...card,
        id: `imported_${card.id}`,
        arcana: "custom" as const,
        meanings: {
          upright: Array.isArray(card.meanings?.upright) ? card.meanings.upright :
            card.meanings?.upright?.split(',').map(m => m.trim()).filter(Boolean) || [],
          reversed: Array.isArray(card.meanings?.reversed) ? card.meanings.reversed :
            card.meanings?.reversed?.split(',').map(m => m.trim()).filter(Boolean) || []
        }
      }))];

      const card = availableCards.find(c => c.id === cardId);

      if (!card) {
        console.error("Card not found:", cardId);
        return res.status(400).json({ error: "Invalid card ID" });
      }

      console.log("Found card:", card.name);
      const interpretation = await generateCardInterpretation(card, context);
      res.json({ interpretation });
    } catch (error) {
      console.error("AI interpretation error:", error);
      res.status(500).json({
        error: "Failed to generate interpretation",
        details: error instanceof Error ? error.message : "Unknown error occurred"
      });
    }
  });

  app.post("/api/analyze-combination", async (req, res) => {
    try {
      const { cardIds, context } = req.body;
      console.log("Received request for card combination analysis:", { cardIds, context });

      if (!Array.isArray(cardIds) || cardIds.length < 2) {
        return res.status(400).json({
          error: "Please provide at least two cards to analyze"
        });
      }

      // Get all available cards including imported ones
      const allCards = await storage.getImportedCards();
      const availableCards = [...tarotCards, ...allCards.map(card => ({
        ...card,
        id: `imported_${card.id}`,
        arcana: "custom" as const,
        meanings: {
          upright: Array.isArray(card.meanings?.upright) ? card.meanings.upright :
            card.meanings?.upright?.split(',').map(m => m.trim()).filter(Boolean) || [],
          reversed: Array.isArray(card.meanings?.reversed) ? card.meanings.reversed :
            card.meanings?.reversed?.split(',').map(m => m.trim()).filter(Boolean) || []
        }
      }))];

      console.log("Finding requested cards...");
      const cards = cardIds.map(id => availableCards.find(c => c.id === id))
        .filter((card): card is TarotCard => card !== undefined);

      if (cards.length !== cardIds.length) {
        const missingIds = cardIds.filter(id => !cards.find(c => c.id === id));
        console.error("Missing cards:", missingIds);
        return res.status(400).json({
          error: "One or more invalid card IDs",
          details: `Missing cards: ${missingIds.join(", ")}`
        });
      }

      console.log("Analyzing cards:", cards.map(c => c.name));
      const analysis = await analyzeCardCombination(cards, context);
      console.log("Analysis generated successfully");

      res.json({ analysis });
    } catch (error) {
      console.error("Card combination analysis error:", error);
      res.status(500).json({
        error: "Failed to analyze card combination",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/affirmation", async (req, res) => {
    try {
      const { cardId } = req.body;
      console.log("Generating affirmation for card:", cardId);

      const card = tarotCards.find(c => c.id === cardId);
      if (!card) {
        console.error("Invalid card ID:", cardId);
        return res.status(400).json({ error: "Invalid card ID" });
      }

      console.log("Found card:", card.name);
      const affirmation = await generateDailyAffirmation(card);

      if (!affirmation) {
        throw new Error("Failed to generate affirmation");
      }

      console.log("Generated affirmation:", affirmation);
      res.json({ affirmation });
    } catch (error) {
      console.error("Affirmation generation error:", error);
      res.status(500).json({
        error: "Failed to generate affirmation",
        details: error instanceof Error ? error.message : "Unknown error occurred"
      });
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
      res.json(progress || null);
    } catch (error) {
      console.error("Error fetching user progress:", error);
      res.status(500).json({ error: "Failed to fetch user progress" });
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

  // Set up multer for both Excel and image uploads
  const upload = multer({
    storage: multer.diskStorage({
      destination: async (req, file, cb) => {
        const uploadDir = path.join(process.cwd(), 'public', 'uploads');
        try {
          await fs.mkdir(uploadDir, { recursive: true });
          cb(null, uploadDir);
        } catch (error) {
          cb(error as Error, uploadDir);
        }
      },
      filename: (req, file, cb) => {
        // Generate unique filename
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
      }
    }),
    limits: {
      fileSize: 5 * 1024 * 1024 // 5MB limit
    },
    fileFilter: (req, file, cb) => {
      if (file.fieldname === 'file') {
        // Excel files
        const validExcelTypes = [
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        ];
        cb(null, validExcelTypes.includes(file.mimetype));
      } else if (file.fieldname === 'image') {
        // Image files
        const validImageTypes = ['image/jpeg', 'image/png', 'image/webp'];
        cb(null, validImageTypes.includes(file.mimetype));
      } else {
        cb(null, false);
      }
    }
  });

  // Add card import endpoint
  app.post("/api/admin/import-cards", requireAdmin, upload.single('file'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      console.log("Processing file upload:", {
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size
      });

      // Accept both old and new Excel formats
      if (!req.file.mimetype.includes('spreadsheet') &&
        !req.file.mimetype.includes('excel')) {
        return res.status(400).json({
          error: "Invalid file type. Please upload an Excel file (.xlsx or .xls)"
        });
      }

      const importedCards = await importCardsFromExcel(req.file.buffer);
      console.log(`Successfully imported ${importedCards.length} cards`);

      res.json({
        message: `Successfully processed ${importedCards.length} cards`,
        cards: importedCards
      });
    } catch (error) {
      console.error("Import error:", error);
      res.status(500).json({
        error: "Failed to import cards",
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Update the /api/cards endpoint with better logging
  app.get("/api/cards", async (req, res) => {
    try {
      console.log("Fetching imported cards from database...");
      const importedCardsData = await storage.getImportedCards();
      console.log(`Found ${importedCardsData.length} imported cards:`, importedCardsData);

      // Transform imported cards to match tarot card format
      const transformedImportedCards = importedCardsData.map(card => ({
        id: `imported_${card.id}`,
        name: card.name,
        description: card.description,
        meanings: {
          upright: Array.isArray(card.meanings?.upright) ? card.meanings.upright :
            card.meanings?.upright?.split(',').map(m => m.trim()).filter(Boolean) || [],
          reversed: Array.isArray(card.meanings?.reversed) ? card.meanings.reversed :
            card.meanings?.reversed?.split(',').map(m => m.trim()).filter(Boolean) || []
        },
        arcana: "custom" as const,
      }));
      console.log("Transformed imported cards:", transformedImportedCards);

      // Combine built-in and imported cards
      const allCards = [...tarotCards, ...transformedImportedCards];
      console.log(`Returning total of ${allCards.length} cards`);

      res.json(allCards);
    } catch (error) {
      console.error("Error fetching cards:", error);
      res.status(500).json({
        error: "Failed to fetch cards",
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Add new route for card image upload
  app.post("/api/admin/upload-card-image/:cardId", requireAdmin, upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file uploaded" });
      }

      const cardId = req.params.cardId;
      const imageUrl = `/uploads/${req.file.filename}`;

      // Update the card with the new image URL
      await storage.updateCardImage(parseInt(cardId.replace('imported_', '')), imageUrl);

      res.json({
        message: "Image uploaded successfully",
        imageUrl
      });
    } catch (error) {
      console.error("Image upload error:", error);
      res.status(500).json({
        error: "Failed to upload image",
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

interface TarotCard {
  id: string;
  name: string;
  description: string;
  meanings: {
    upright: string[];
    reversed: string[];
  };
  arcana: "major" | "minor" | "custom";
}