import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertReadingSchema, insertStudyProgressSchema, insertJournalEntrySchema } from "@shared/schema";
import { generateCardInterpretation, generateMeditation, generateDailyAffirmation, analyzeCardCombination, generateCardSymbolism, generateCardImage } from "./ai-service";
import { tarotCards } from "@shared/tarot-data";
import { addDays } from "date-fns";
import { insertLearningTrackSchema, insertUserProgressSchema, insertQuizResultSchema } from "@shared/schema";
import multer from 'multer';
import { requireAdmin } from "./middleware/admin";
import { importCardsFromExcel } from "./utils/import-cards";
import { apiUsageTracker } from "./utils/api-usage-tracker";
import path from 'path';
import fs from 'fs/promises';
import fsSync from 'fs';
import express from 'express';
import { setupAuth } from "./auth";
import Stripe from 'stripe';
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

// Define cache directory path
const CACHE_DIR = path.join(process.cwd(), '.cache');

export function registerRoutes(app: Express): Server {
  // Set up authentication routes and middleware
  setupAuth(app);
  
  // Serve the cache files
  const cacheDir = path.join(process.cwd(), '.cache');
  if (fsSync.existsSync(cacheDir)) {
    app.use('/cache', express.static(cacheDir));
    console.log('Serving cache directory at /cache');
  }
  
  // Special admin creation endpoint for trusted email only
  app.post("/api/create-admin", async (req, res) => {
    try {
      const { email, username, password, adminToken } = req.body;
      
      // Verify admin token for security
      const expectedToken = "g6vDAE^YiQT8Uoi!c@XmvoYdhsqGn*xw";
      if (adminToken !== expectedToken) {
        return res.status(403).json({ error: "Invalid admin token" });
      }
      
      // Only allow specific email to be admin
      if (email !== "jo@jmvirtualbusinessservices.com.au") {
        return res.status(403).json({ error: "Unauthorized email for admin" });
      }
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      
      if (existingUser) {
        // If user exists but is not admin, make them admin
        if (!existingUser.isAdmin) {
          const updatedUser = await storage.setUserAsAdmin(existingUser.id);
          return res.status(200).json({ success: true, user: updatedUser });
        }
        // User already exists and is admin
        return res.status(200).json({ success: true, user: existingUser });
      }
      
      // Create new admin user with hashed password
      const scryptAsync = promisify(scrypt);
      
      const hashPassword = async (password: string) => {
        const salt = randomBytes(16).toString("hex");
        const buf = (await scryptAsync(password, salt, 64)) as Buffer;
        return `${buf.toString("hex")}.${salt}`;
      };
      
      const user = await storage.createUser({
        username,
        email,
        password: await hashPassword(password),
        isAdmin: true,  // Set as admin
        isSubscribed: true // Admins get free subscription
      });
      
      res.status(201).json({ success: true, user });
    } catch (error) {
      console.error("Admin creation error:", error);
      res.status(500).json({ error: "Failed to create admin user" });
    }
  });
  
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
      let card;
      
      // Handle both prefixed and non-prefixed card IDs
      const isImportedCard = cardId.toString().startsWith('imported_');
      
      if (isImportedCard) {
        // Extract the numeric ID from the prefixed ID
        const numericId = parseInt(cardId.replace('imported_', ''));
        console.log(`Looking for imported card with numeric ID: ${numericId}`);
        
        const importedCards = await storage.getImportedCards();
        const customCard = importedCards.find(c => c.id === numericId);
        
        if (customCard) {
          // Convert imported card to tarot card format
          card = {
            id: `imported_${customCard.id}`,
            name: customCard.name,
            description: customCard.description,
            arcana: "major", // Default to major arcana for meditation purposes
            meanings: {
              upright: customCard.meanings.upright || [],
              reversed: customCard.meanings.reversed || []
            }
          };
          console.log(`Found custom card: ${card.name}`);
        }
      } else {
        // Check in standard tarot cards
        card = tarotCards.find(c => c.id === cardId);
      }

      if (!card) {
        console.log(`Card not found with ID: ${cardId}`);
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
  // Get card symbolism details
  app.get("/api/cards/:id/symbolism", async (req, res) => {
    try {
      const { id } = req.params;
      let card: TarotCard | undefined;
      
      if (id.startsWith("imported_")) {
        // Custom card from database
        const cardId = parseInt(id.replace("imported_", ""));
        const importedCard = await storage.getImportedCard(cardId);
        
        if (importedCard) {
          card = {
            id: `imported_${importedCard.id}`,
            name: importedCard.name,
            description: importedCard.description,
            arcana: "major" as "major", // Default to major arcana for symbolism analysis
            meanings: {
              upright: Array.isArray(importedCard.meanings?.upright) ? importedCard.meanings.upright :
                importedCard.meanings?.upright?.split(',').map(m => m.trim()).filter(Boolean) || [],
              reversed: Array.isArray(importedCard.meanings?.reversed) ? importedCard.meanings.reversed :
                importedCard.meanings?.reversed?.split(',').map(m => m.trim()).filter(Boolean) || []
            }
          };
        }
      } else {
        // Standard tarot card
        card = tarotCards.find(c => c.id === id);
      }

      if (!card) {
        return res.status(404).json({ error: "Card not found" });
      }

      // Generate symbolism details using OpenAI
      const symbolism = await generateCardSymbolism(card);
      res.json({ symbolism });
    } catch (error) {
      console.error("Error generating symbolism:", error);
      res.status(500).json({ error: "Failed to generate symbolism" });
    }
  });

  // Get card image
  // Track rate limiting status
  let imageGenerationRateLimited = false;
  let rateLimitResetTime: number | null = null;
  
  app.get("/api/cards/:id/image", async (req, res) => {
    try {
      // If we know we're rate limited, don't even try to generate
      if (imageGenerationRateLimited) {
        const now = Date.now();
        if (rateLimitResetTime && now < rateLimitResetTime) {
          // Calculate minutes until reset
          const minutesUntilReset = Math.ceil((rateLimitResetTime - now) / 60000);
          return res.status(429).json({ 
            error: "Rate limit exceeded", 
            message: `API rate limit in effect. Try again in ${minutesUntilReset} minutes.`
          });
        } else {
          // If the reset time has passed, clear the rate limit flag
          imageGenerationRateLimited = false;
          rateLimitResetTime = null;
        }
      }
    
      const { id } = req.params;
      console.log(`Fetching image for card ${id}`);
      
      // Initialize card
      let card: TarotCard | null = null;
      
      // Check if this is an imported card
      if (id.startsWith("imported_")) {
        const cardId = parseInt(id.replace("imported_", ""));
        const importedCard = await storage.getImportedCard(cardId);
        
        if (importedCard) {
          // Format meanings
          const upright = Array.isArray(importedCard.meanings?.upright) 
            ? importedCard.meanings.upright 
            : importedCard.meanings?.upright?.split(',').map(m => m.trim()).filter(Boolean) || [];
            
          const reversed = Array.isArray(importedCard.meanings?.reversed) 
            ? importedCard.meanings.reversed 
            : importedCard.meanings?.reversed?.split(',').map(m => m.trim()).filter(Boolean) || [];
          
          card = {
            id: `imported_${importedCard.id}`,
            name: importedCard.name,
            description: importedCard.description,
            arcana: "major" as "major", // Default to major arcana for image generation
            meanings: {
              upright,
              reversed
            }
          };
        }
      } else {
        // Standard tarot card
        card = tarotCards.find(c => c.id === id) || null;
      }

      if (!card) {
        return res.status(404).json({ error: "Card not found" });
      }

      try {
        // Generate image for the card
        const imageUrl = await generateCardImage(card);
        res.json({ imageUrl });
      } catch (error: any) {
        // Specifically handle rate limit errors
        if (error?.status === 429 || 
            (error?.message && error.message.toLowerCase().includes('rate limit'))) {
          
          console.log("OpenAI rate limit hit, setting global rate limit flag");
          
          // Set the rate limit flag and calculate reset time
          imageGenerationRateLimited = true;
          
          // Get retry-after header if available, otherwise use 1 hour default
          const retryAfter = error?.headers?.['retry-after'];
          const retrySeconds = retryAfter ? parseInt(retryAfter) : 3600;
          rateLimitResetTime = Date.now() + (retrySeconds * 1000);
          
          return res.status(429).json({ 
            error: "Rate limit exceeded", 
            message: `API rate limit in effect. Try again in ${Math.ceil(retrySeconds / 60)} minutes.`
          });
        }
        
        // Rethrow for general error handling
        throw error;
      }
    } catch (error) {
      console.error("Error generating card image:", error);
      res.status(500).json({ error: "Failed to generate card image" });
    }
  });

  // Get all cards
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

  // Set up Stripe payment routes
  if (process.env.STRIPE_SECRET_KEY) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16'
    });

    // Stripe payment route for one-time payments
    app.post("/api/create-payment-intent", async (req, res) => {
      try {
        if (!req.isAuthenticated()) {
          return res.status(401).json({ error: "Authentication required" });
        }

        const { amount } = req.body;
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(amount * 100), // Convert to cents
          currency: "usd",
          // Associate with the customer
          customer: req.user.stripeCustomerId || undefined,
        });
        res.json({ clientSecret: paymentIntent.client_secret });
      } catch (error: any) {
        console.error("Stripe payment error:", error);
        res.status(500).json({ 
          error: "Error creating payment intent", 
          message: error.message 
        });
      }
    });

    // Subscription endpoint
    app.post('/api/get-or-create-subscription', async (req, res) => {
      try {
        if (!req.isAuthenticated()) {
          return res.status(401).json({ error: "Authentication required" });
        }

        const user = req.user;

        if (user.stripeSubscriptionId) {
          // User already has a subscription, retrieve it
          const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);

          res.json({
            subscriptionId: subscription.id,
            clientSecret: subscription.latest_invoice?.payment_intent?.client_secret,
          });
          return;
        }
        
        if (!user.email) {
          throw new Error('No user email on file');
        }

        // Create a new customer if needed
        let customerId = user.stripeCustomerId;
        if (!customerId) {
          const customer = await stripe.customers.create({
            email: user.email,
            name: user.username,
          });
          customerId = customer.id;
          await storage.updateStripeCustomerId(user.id, customer.id);
        }

        // Create subscription
        const subscription = await stripe.subscriptions.create({
          customer: customerId,
          items: [{
            price: process.env.STRIPE_PRICE_ID,
          }],
          payment_behavior: 'default_incomplete',
          expand: ['latest_invoice.payment_intent'],
        });

        // Update user with subscription information
        await storage.updateUserStripeInfo(user.id, {
          customerId, 
          subscriptionId: subscription.id
        });
    
        res.json({
          subscriptionId: subscription.id,
          clientSecret: subscription.latest_invoice?.payment_intent?.client_secret,
        });
      } catch (error: any) {
        console.error("Stripe subscription error:", error);
        res.status(500).json({ 
          error: "Error creating subscription", 
          message: error.message 
        });
      }
    });
    
    // Stripe webhook handler for subscription events
    app.post('/api/webhook/stripe', async (req, res) => {
      const sig = req.headers['stripe-signature'];
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
      
      if (!sig || !endpointSecret) {
        return res.status(400).json({ error: 'Missing signature or webhook secret' });
      }
      
      try {
        let event;
        
        // Verify the event came from Stripe
        try {
          const rawBody = Buffer.from(JSON.stringify(req.body));
          event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
        } catch (err: any) {
          console.error('Webhook signature verification failed:', err.message);
          return res.status(400).json({ error: `Webhook Error: ${err.message}` });
        }
        
        // Handle the event
        if (event.type === 'customer.subscription.updated' || 
            event.type === 'customer.subscription.created') {
          const subscription = event.data.object;
          const customerId = subscription.customer as string;
          
          // Get user by Stripe customer ID
          const user = await storage.getUserByStripeCustomerId(customerId);
          
          if (user) {
            // Update user subscription status based on Stripe status
            const isActive = 
              subscription.status === 'active' || 
              subscription.status === 'trialing';
            
            await storage.updateUserSubscription(user.id, {
              isSubscribed: isActive,
              stripeSubscriptionId: subscription.id
            });
            
            console.log(`Updated subscription status for user ${user.id} to ${isActive}`);
          }
        }
        
        res.json({ received: true });
      } catch (error: any) {
        console.error('Error handling webhook:', error);
        res.status(500).json({ error: `Webhook handler failed: ${error.message}` });
      }
    });
  }

  // API Usage tracking routes - admin only
  app.get("/api/admin/api-usage", requireAdmin, async (req, res) => {
    try {
      const usageSummary = apiUsageTracker.getUsageSummary();
      res.json(usageSummary);
    } catch (error) {
      console.error("Error fetching API usage data:", error);
      res.status(500).json({ error: "Failed to fetch API usage data" });
    }
  });

  app.get("/api/admin/api-usage/logs", requireAdmin, async (req, res) => {
    try {
      const usageLogs = apiUsageTracker.getUsageLog();
      res.json(usageLogs);
    } catch (error) {
      console.error("Error fetching API usage logs:", error);
      res.status(500).json({ error: "Failed to fetch API usage logs" });
    }
  });

  app.post("/api/admin/api-usage/clear", requireAdmin, async (req, res) => {
    try {
      apiUsageTracker.clearUsageLog();
      res.json({ success: true, message: "API usage logs cleared successfully" });
    } catch (error) {
      console.error("Error clearing API usage logs:", error);
      res.status(500).json({ error: "Failed to clear API usage logs" });
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