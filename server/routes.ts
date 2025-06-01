import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertReadingSchema, insertStudyProgressSchema, insertJournalEntrySchema, users, insertAngelNumberSchema } from "@shared/schema";
import { generateCardInterpretation, generateMeditation, generateDailyAffirmation, analyzeCardCombination, generateCardSymbolism, generateCardImage, getCardFrequency } from "./ai-service";
import { tarotCards } from "@shared/tarot-data";
import { angelNumbersData } from "@shared/angel-numbers-data";
import { addDays } from "date-fns";
import { insertLearningTrackSchema, insertUserProgressSchema, insertQuizResultSchema } from "@shared/schema";
import multer from 'multer';
import { requireAdmin } from "./middleware/admin";
import { importCardsFromExcel } from "./utils/import-cards";
import { apiUsageTracker, API_COSTS } from "./utils/api-usage-tracker";
import path from 'path';
import fs from 'fs';
import express from 'express';
import OpenAI from "openai";
import { setupAuth } from "./auth";
import Stripe from 'stripe';
import { scrypt, randomBytes } from "crypto";
import { handleAppStorePurchaseVerification } from "./app-store-verification";

// Initialize Stripe with API key
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16' as any, // Cast to any to avoid TS version error
});
import { promisify } from "util";
import { db } from "./db";
import { eq } from "drizzle-orm";
import { learningTracks } from "../shared/schema";

// Define cache directory path
const CACHE_DIR = path.join(process.cwd(), '.cache');

// Import for newsletter functionality
import { initializeEmailService, unsubscribeUserByToken } from './services/email-service';
import { generateAndSendWeeklyNewsletter, checkAndSendWeeklyNewsletter } from './services/newsletter-generator';
import crypto from 'crypto';

export function registerRoutes(app: Express): Server {
  // Add CORS headers for custom domain support
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    console.log("Request from origin:", origin);
    
    // Allow requests from any origin for mobile apps
    res.header('Access-Control-Allow-Origin', origin || '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    
    next();
  });

  // Set up authentication routes and middleware
  setupAuth(app);

  // Create OpenAI instance
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY_TWO });

  // Test endpoint for debugging mobile issues
  app.get("/api/test-auth", (req, res) => {
    const userAgent = req.headers['user-agent'] || 'unknown';
    const isAuth = req.isAuthenticated();
    const sessionData = req.session;
    
    console.log("Auth test request from:", userAgent);
    console.log("Is authenticated:", isAuth);
    console.log("Session ID:", req.sessionID);
    console.log("User:", req.user ? `${req.user.username} (ID: ${req.user.id})` : 'none');
    
    res.json({
      authenticated: isAuth,
      userAgent,
      sessionId: req.sessionID,
      user: req.user || null,
      timestamp: new Date().toISOString()
    });
  });

  // Serve the cache files
  const cacheDir = path.join(process.cwd(), '.cache');
  if (fs.existsSync(cacheDir)) {
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
        isSubscribed: true, // Admins get free subscription
        hasUsedFreeTrial: true // Admins don't need trial
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
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const userId = req.user!.id;
    const readings = await storage.getReadings(userId);
    res.json(readings);
  });

  app.get("/api/readings/daily", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const userId = req.user!.id;
    const readings = await storage.getDailyReadings(userId);
    res.json(readings);
  });

  app.get("/api/readings/spreads", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }
    const userId = req.user!.id;
    const readings = await storage.getSpreadReadings(userId);
    res.json(readings);
  });

  app.post("/api/interpret", async (req, res) => {
    try {
      const { cardId, context } = req.body;
      console.log("=== AI INTERPRETATION REQUEST RECEIVED ===");
      console.log("AI Interpretation request - Card ID:", cardId, "Context:", context);
      console.log("Request origin:", req.headers.origin);
      console.log("Request referer:", req.headers.referer);
      console.log("Request user-agent:", req.headers['user-agent']);
      console.log("Request cookies:", req.headers.cookie);
      console.log("Session ID:", req.sessionID);
      console.log("Authentication status:", req.isAuthenticated());

      if (!req.isAuthenticated()) {
        console.log("Authentication failed for AI interpretation request");
        console.log("Session cookies:", req.headers.cookie);
        console.log("Session data:", req.session);
        console.log("User in session:", req.user);
        
        // For mobile apps with custom domains, allow requests with user ID as backup
        const { userId } = req.body;
        if (userId && typeof userId === 'number') {
          console.log("Allowing AI interpretation for mobile app with userId:", userId);
          // Create a minimal user object for this request
          req.user = { id: userId } as any;
        } else {
          return res.status(401).json({ error: "Authentication required" });
        }
      }
      const userId = req.user!.id;
      console.log("Authenticated user ID:", userId);

      // Get all available cards including imported ones
      const allCards = await storage.getImportedCards(userId);
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
      
      try {
        const interpretation = await generateCardInterpretation(card, context);
        console.log("AI interpretation generated successfully for card:", card.name);
        res.json({ interpretation });
      } catch (aiError) {
        console.error("AI generation error:", aiError);
        
        // Check if it's an OpenAI API issue
        if (aiError instanceof Error && aiError.message.includes('API')) {
          return res.status(503).json({
            error: "AI service temporarily unavailable",
            details: "The AI interpretation service is experiencing issues. Please try again in a moment."
          });
        }
        
        throw aiError; // Re-throw for general error handling
      }
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

      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const userId = req.user!.id;

      if (!Array.isArray(cardIds) || cardIds.length < 2) {
        return res.status(400).json({
          error: "Please provide at least two cards to analyze"
        });
      }

      // Get all available cards including imported ones
      const allCards = await storage.getImportedCards(userId);
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

  // New endpoint for spread interpretation
  app.post("/api/interpret-spread", async (req, res) => {
    try {
      const { cardIds, spreadType, positions } = req.body;
      console.log("Spread interpretation request:", { cardIds, spreadType, positions });
      console.log("Request headers:", req.headers['user-agent']);
      console.log("Authentication status:", req.isAuthenticated());

      if (!req.isAuthenticated()) {
        console.log("Authentication failed for spread interpretation request");
        return res.status(401).json({ error: "Authentication required" });
      }
      const userId = req.user!.id;
      console.log("Authenticated user ID:", userId);

      if (!Array.isArray(cardIds) || cardIds.length < 2) {
        return res.status(400).json({
          error: "Please provide at least two cards to interpret"
        });
      }

      if (!Array.isArray(positions) || positions.length !== cardIds.length) {
        return res.status(400).json({
          error: "Number of positions must match number of cards"
        });
      }

      // Get all available cards including imported ones
      const allCards = await storage.getImportedCards(userId);
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

      // Create context with cards and their positions
      const formattedCards = cards.map((card, index) => ({
        name: card.name,
        position: positions[index],
        meanings: {
          upright: card.meanings.upright.join(", "),
          reversed: card.meanings.reversed.join(", ")
        },
        description: card.description
      }));

      // Cache key for spread interpretations
      const cardIdsString = cards.map(c => c.id).join('-');
      const cacheKey = `spread_interpretation_${spreadType}_${cardIdsString}`;
      const cacheFilePath = path.join(CACHE_DIR, `${cacheKey}.json`);
      let interpretation;

      // Try to get from cache first
      if (fs.existsSync(cacheFilePath)) {
        try {
          console.log(`Found cached spread interpretation at: ${cacheFilePath}`);
          const cachedData = JSON.parse(fs.readFileSync(cacheFilePath, 'utf8'));
          interpretation = cachedData.interpretation;
        } catch (cacheError) {
          console.error("Error reading cache:", cacheError);
        }
      }

      // Generate new interpretation if not in cache
      if (!interpretation) {
        console.log("Generating new spread interpretation");

        // Track API usage
        apiUsageTracker.trackUsage({
          endpoint: '/api/interpret-spread',
          model: "gpt-3.5-turbo",
          operation: 'chat.completion',
          status: 'success',
          estimatedCost: API_COSTS["gpt-3.5-turbo"]['chat.completion'],
          cardId: cards[0].id,
          cardName: spreadType
        });

        const prompt = `
        As an experienced Tarot reader, please provide a complete interpretation of this ${spreadType} spread.

        CARDS IN SPREAD:
        ${formattedCards.map((card, i) => 
          `Card ${i+1}: ${card.name} in the ${card.position} position
          Description: ${card.description}
          Upright meanings: ${card.meanings.upright}
          Reversed meanings: ${card.meanings.reversed}`
        ).join('\n\n')}

        Please provide:

        1. Overview of the entire spread (what overall story or energy is being conveyed)

        2. For each individual card:
          - Brief interpretation of what this specific card means in its position
          - How it relates to other cards in the spread

        3. Final summary with guidance and advice based on the complete spread

        Keep the language accessible and conversational while providing genuine spiritual insights.
        `;

        try {
          const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [
              {
                role: "system",
                content: "You are a wise and experienced Tarot reader with deep knowledge of card meanings and spread interpretations. You explain readings in a clear, meaningful way that connects with the querent's life situation."
              },
              {
                role: "user",
                content: prompt
              }
            ],
            temperature: 0.7,
            max_tokens: 2000
          });

          if (!response.choices || response.choices.length === 0 || !response.choices[0].message.content) {
            throw new Error("OpenAI API returned an empty response");
          }

          interpretation = response.choices[0].message.content;

          // Cache the result
          fs.writeFileSync(cacheFilePath, JSON.stringify({ interpretation }));
        } catch (apiError) {
          console.error("OpenAI API error:", apiError);
          throw new Error(apiError instanceof Error ? 
            `OpenAI API error: ${apiError.message}` : 
            "Failed to get response from OpenAI API");
        }
      }

      res.json({ interpretation });
    } catch (error) {
      console.error("Spread interpretation error:", error);

      // Check for OpenAI-specific errors
      if (error instanceof Error && error.message.includes("OpenAI API")) {
        res.status(500).json({
          error: "OpenAI service temporarily unavailable",
          details: "The AI service is currently experiencing issues. Please try again in a few moments."
        });
      } else {
        res.status(500).json({
          error: "Failed to generate spread interpretation",
          details: error instanceof Error ? error.message : "Unknown error"
        });
      }
    }
  });

  // New endpoint for spread meditation
  app.post("/api/meditate-spread", async (req, res) => {
    try {
      const { cardIds, spreadType, positions } = req.body;
      console.log("Received request for spread meditation:", { cardIds, spreadType, positions });

      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const userId = req.user!.id;

      if (!Array.isArray(cardIds) || cardIds.length < 2) {
        return res.status(400).json({
          error: "Please provide at least two cards for spread meditation"
        });
      }

      if (!Array.isArray(positions) || positions.length !== cardIds.length) {
        return res.status(400).json({
          error: "Number of positions must match number of cards"
        });
      }

      // Get all available cards including imported ones
      const allCards = await storage.getImportedCards(userId);
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

      console.log("Finding requested cards for meditation...");
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

      // Format cards with positions for the prompt
      const formattedCards = cards.map((card, index) => ({
        name: card.name,
        position: positions[index],
        meanings: {
          upright: card.meanings.upright.join(", "),
          reversed: card.meanings.reversed.join(", ")
        }
      }));

      // Cache key based on cards and spread type
      const cacheIdString = cards.map(c => c.id).join('-');
      const cacheKey = `spread_meditation_${spreadType}_${cacheIdString}`;
      const cacheFilePath = path.join(CACHE_DIR, `${cacheKey}.json`);

      // Try to get from cache first
      if (fs.existsSync(cacheFilePath)) {
        try {
          console.log(`Found cached spread meditation at: ${cacheFilePath}`);
          const cachedData = JSON.parse(fs.readFileSync(cacheFilePath, 'utf8'));
          return res.json(cachedData);
        } catch (cacheError) {
          console.error("Error reading cache:", cacheError);
          // Continue to generate new meditation on cache error
        }
      } else {
        console.log(`No cache found at: ${cacheFilePath}, generating new spread meditation`);
      }

      console.log(`Generating meditation for ${spreadType} spread`);

      // Generate meditation script referencing all cards but providing a unified narrative
      const meditationPrompt = `Create a guided meditation script for a ${spreadType} Tarot spread with these cards:
      ${formattedCards.map((card, i) => 
        `Card ${i+1}: ${card.name} in the ${card.position} position (meanings: ${card.meanings.upright})`
      ).join('\n')}

      The meditation should:
      - Be 3-4 minutes when read aloud at a slow, meditative pace
      - Start with deep breathing guidance with pauses (use ...... for longer pauses)
      - Briefly reference each card's position in the spread
      - Create a unified narrative that weaves all cards together into a cohesive meditation
      - Incorporate the themes and energies of all cards while creating a singular meditation experience
      - Guide the listener to reflect on the spread as a whole with each card's influence
      - Include affirmations related to the spread's overall meaning
      - End with a gentle return to awareness

      Keep the tone deeply calming and peaceful. Add pause markers (......) between each instruction to ensure a very slow, meditative pacing.`;

      // Track API usage for meditation text generation
      apiUsageTracker.trackUsage({
        endpoint: '/api/meditate-spread',
        model: "gpt-3.5-turbo",
        operation: 'chat.completion',
        status: 'success',
        estimatedCost: API_COSTS["gpt-3.5-turbo"]['chat.completion'],
        cardId: cards[0].id,
        cardName: spreadType
      });

      const scriptResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a meditation guide who creates deeply calming, insightful guided meditations. Use extensive pauses between instructions, marked with ...... (six dots for longer pauses). Encourage slow, deep breathing and complete relaxation. Create vivid, peaceful imagery that helps the listener fully immerse in the meditation experience."
          },
          {
            role: "user",
            content: meditationPrompt
          }
        ],
        temperature: 0.7,
        max_tokens: 700
      });

      console.log("Spread meditation script generated successfully");
      const meditationText = scriptResponse.choices[0].message.content || "";

      // Generate voice audio
      console.log("Generating audio from spread meditation script");

      // Track API usage for TTS
      apiUsageTracker.trackUsage({
        endpoint: '/api/meditate-spread',
        model: "tts-1",
        operation: 'audio.speech',
        status: 'success',
        estimatedCost: API_COSTS["tts-1"]['audio.speech'],
        cardId: cards[0].id,
        cardName: spreadType
      });

      const audioResponse = await openai.audio.speech.create({
        model: "tts-1",
        voice: "nova", // Using a calming voice
        input: meditationText,
        response_format: "mp3",
        speed: 0.75, // Slowed down for meditative pacing
      });

      console.log("Voice audio generated successfully");
      const audioBuffer = Buffer.from(await audioResponse.arrayBuffer());

      // Save the audio file to cache
      const audioFileName = `${cacheKey}.mp3`;
      const audioFilePath = path.join(CACHE_DIR, audioFileName);
      fs.writeFileSync(audioFilePath, audioBuffer);

      // Use a file path URL instead of base64 to reduce payload size
      const audioUrl = `/cache/${audioFileName}`;

      // Calculate appropriate theta frequency (average of all cards)
      const averageThetaFrequency = cards.reduce((sum, card) => sum + getCardFrequency(card), 0) / cards.length;

      // Prepare the result
      const result = {
        text: meditationText,
        audioUrl: audioUrl,
        thetaFrequency: averageThetaFrequency
      };

      // Cache the result
      fs.writeFileSync(cacheFilePath, JSON.stringify(result));

      res.json(result);
    } catch (error) {
      console.error("Error generating spread meditation:", error);

      // Check for rate limit errors
      if (error?.status === 429 || 
          (error?.error?.code === 'rate_limit_exceeded') || 
          (error?.message && error.message.toLowerCase().includes('rate limit'))) {

        console.log(`OpenAI rate limit hit while generating spread meditation`);

        // Track the rate limit in our usage stats
        apiUsageTracker.trackUsage({
          endpoint: '/api/meditate-spread',
          model: "gpt-3.5-turbo",
          operation: 'chat.completion',
          status: 'rate_limited',
          estimatedCost: 0,
          cardId: "spread",
          cardName: "spread"
        });
      } else {
        // Track other errors
        apiUsageTracker.trackUsage({
          endpoint: '/api/meditate-spread',
          model: "gpt-3.5-turbo",
          operation: 'error',
          status: 'error',
          estimatedCost: 0,
          cardId: "spread",
          cardName: "spread"
        });
      }

      res.status(500).json({
        error: "Failed to generate spread meditation",
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

        if (!req.isAuthenticated()) {
          return res.status(401).json({ error: "Authentication required" });
        }
        const userId = req.user!.id;

        const importedCards = await storage.getImportedCards(userId);
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
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const userId = req.user!.id;
      const progress = await storage.getStudyProgress(userId, req.params.cardId);
      res.json(progress || null);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch study progress" });
    }
  });

  app.post("/api/study/progress", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const userId = req.user!.id;
      const { cardId, confidenceLevel } = req.body;

      // Calculate next review date based on confidence level
      const daysUntilNextReview = Math.pow(2, confidenceLevel);
      const nextReviewDue = addDays(new Date(), daysUntilNextReview);

      const progress = insertStudyProgressSchema.parse({
        cardId,
        confidenceLevel,
        nextReviewDue,
      });

      const result = await storage.updateStudyProgress(userId, progress);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: "Invalid study progress data" });
    }
  });

  app.get("/api/study/due-cards", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const userId = req.user!.id;
      const dueCards = await storage.getDueCards(userId);
      res.json(dueCards);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch due cards" });
    }
  });

  // Journal routes
  app.post("/api/journal", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const userId = req.user!.id;
      console.log("Creating journal entry for user:", userId, "body:", JSON.stringify(req.body, null, 2));

      // Create a clean entry object with all required fields properly formatted
      const cleanEntry = {
        title: req.body.title || "",
        content: req.body.content || "",
        userId: userId, // Will be used in storage, not needed for validation
        cards: Array.isArray(req.body.cards) ? req.body.cards : [],
        tags: Array.isArray(req.body.tags) ? req.body.tags : [],
        mood: req.body.mood || null
      };

      console.log("Prepared entry data:", JSON.stringify(cleanEntry, null, 2));

      try {
        // Directly use the cleaned data
        const result = await storage.createJournalEntry(userId, cleanEntry);
        console.log("Journal entry created:", result);
        res.json(result);
      } catch (error) {
        console.error("Error creating journal entry in storage:", error);
        return res.status(500).json({ 
          error: "Failed to save journal entry", 
          details: error instanceof Error ? error.message : "Unknown error" 
        });
      }
    } catch (error) {
      console.error("Error in journal entry route:", error);
      res.status(500).json({ 
        error: "Failed to create journal entry", 
        details: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  app.get("/api/journal", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const userId = req.user!.id;
      const entries = await storage.getJournalEntries(userId);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch journal entries" });
    }
  });

  app.get("/api/journal/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const userId = req.user!.id;
      const entry = await storage.getJournalEntry(userId, Number(req.params.id));
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
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const userId = req.user!.id;
      const entries = await storage.getJournalEntriesByCard(userId, req.params.cardId);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch journal entries" });
    }
  });

  app.get("/api/journal/tag/:tag", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const userId = req.user!.id;
      const entries = await storage.getJournalEntriesByTag(userId, req.params.tag);
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
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const userId = req.user!.id;
      console.log("Creating progress for user:", userId, "body:", req.body);

      // Validate that the track exists in the database
      const trackId = req.body.trackId;
      if (trackId) {
        // Simple direct database query for track existence
        const [track] = await db
          .select()
          .from(learningTracks)
          .where(eq(learningTracks.id, trackId))
          .limit(1);

        if (!track) {
          return res.status(404).json({ error: "Learning track not found" });
        }

        console.log(`Track ${trackId} found:`, track.name);
      }

      const progress = insertUserProgressSchema.parse(req.body);
      const result = await storage.createUserProgress(userId, progress);
      res.json(result);
    } catch (error) {
      console.error("Error creating user progress:", error);
      res.status(400).json({ error: "Invalid progress data", details: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  app.patch("/api/learning/progress/:id", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const userId = req.user!.id;
      const progress = insertUserProgressSchema.partial().parse(req.body);
      const result = await storage.updateUserProgress(userId, Number(req.params.id), progress);
      res.json(result);
    } catch (error) {
      res.status(400).json({ error: "Invalid progress update data" });
    }
  });

  app.get("/api/learning/progress/:trackId", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const userId = req.user!.id;
      const progress = await storage.getUserProgress(userId, Number(req.params.trackId));
      res.json(progress || null);
    } catch (error) {
      console.error("Error fetching user progress:", error);
      res.status(500).json({ error: "Failed to fetch user progress" });
    }
  });


  // Quiz Results routes
  app.post("/api/learning/quiz-results", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const userId = req.user!.id;
      const result = insertQuizResultSchema.parse(req.body);
      const created = await storage.createQuizResult(userId, result);
      res.json(created);
    } catch (error) {
      res.status(400).json({ error: "Invalid quiz result data" });
    }
  });

  app.get("/api/learning/quiz-results/:trackId", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const userId = req.user!.id;
      const results = await storage.getQuizResults(userId, Number(req.params.trackId));
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch quiz results" });
    }
  });

  app.get("/api/learning/recent-quiz-results", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const userId = req.user!.id;
      const limit = req.query.limit ? Number(req.query.limit) : undefined;
      const results = await storage.getRecentQuizResults(userId, limit);
      res.json(results);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch recent quiz results" });
    }
  });

  // Set up multer for both Excel and image uploads
  const upload = multer({
    storage: multer.memoryStorage(), // Use memory storage to preserve quality
    limits: {
      fileSize: 10 * 1024 * 1024 // 10MB limit for high quality images
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

  // Card image upload endpoint
  app.post("/api/upload-card-image", upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No image file uploaded" });
      }

      const { cardName, cardSuit } = req.body;
      if (!cardName || !cardSuit) {
        return res.status(400).json({ error: "Card name and suit are required" });
      }

      // Create the destination directory structure
      const cardDir = path.join(process.cwd(), 'public', 'authentic-cards', 'minor-arcana', cardSuit);
      await fs.promises.mkdir(cardDir, { recursive: true });

      // Generate the final filename
      const filename = cardName.toLowerCase().replace(/\s+/g, '-') + '.png';
      const finalPath = path.join(cardDir, filename);

      // Write the file exactly as uploaded with zero processing
      await fs.promises.writeFile(finalPath, req.file.buffer);

      console.log(`Card image uploaded: ${cardName} -> ${finalPath}`);
      
      res.json({
        success: true,
        message: `${cardName} image uploaded successfully`,
        path: `/authentic-cards/minor-arcana/${cardSuit}/${filename}`
      });

    } catch (error) {
      console.error("Card upload error:", error);
      res.status(500).json({
        error: "Failed to upload card image",
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
        if (!req.isAuthenticated()) {
          return res.status(401).json({ error: "Authentication required" });
        }
        const userId = req.user!.id;
        const cardId = parseInt(id.replace("imported_", ""));
        const importedCard = await storage.getImportedCard(userId, cardId);

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

  // Direct access to cached card images
  app.get("/cache/images/:filename", (req, res) => {
    const filename = req.params.filename;
    const imagePath = path.join(process.cwd(), 'public', 'cache', 'images', filename);
    
    if (fs.existsSync(imagePath)) {
      res.sendFile(imagePath);
    } else {
      res.status(404).json({ error: "Image not found" });
    }
  });

  // Get card image
  // Track rate limiting status
  let imageGenerationRateLimited = false;
  let rateLimitResetTime: number | null = null;

  app.get("/api/cards/:id/image", async (req, res) => {
    try {
      // Set cache headers to improve performance for repeated requests
      // Cache for 7 days (604800 seconds)
      res.setHeader('Cache-Control', 'public, max-age=604800');

      const { id } = req.params;
      
      // First check if the image already exists in cache
      const imageCachePath = path.join(process.cwd(), 'public', 'cache', 'images', `image_${id}.png`);
      const jsonMetadataPath = path.join(process.cwd(), 'public', 'cache', 'images', `image_${id}.json`);
      
      if (fs.existsSync(imageCachePath) && fs.existsSync(jsonMetadataPath)) {
        // Image exists, return the cached info
        try {
          const jsonData = fs.readFileSync(jsonMetadataPath, 'utf-8');
          const metadata = JSON.parse(jsonData);
          return res.json(metadata);
        } catch (err) {
          console.error(`Error reading cache metadata for ${id}:`, err);
          // If reading the metadata fails, continue to generation
        }
      }

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

      console.log(`Fetching image for card ${id}`);

      // Initialize card
      let card: TarotCard | null = null;

      // Check if this is an imported card
      if (id.startsWith("imported_")) {
        if (!req.isAuthenticated()) {
          return res.status(401).json({ error: "Authentication required" });
        }
        const userId = req.user!.id;
        const cardId = parseInt(id.replace("imported_", ""));
        const importedCard = await storage.getImportedCard(userId, cardId);

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

        // Set additional header for caching
        res.setHeader('ETag', `"card-${card.id}"`);

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

      // Get user-specific imported cards if authenticated
      let importedCardsData: ImportedCard[] = [];
      if (req.isAuthenticated()) {
        const userId = req.user!.id;
        importedCardsData = await storage.getImportedCards(userId);
        console.log(`Found ${importedCardsData.length} imported cards for user ${userId}:`, importedCardsData);
      } else {
        console.log("User not authenticated, returning only standard cards");
      }

      // Transform imported cards to match tarot card format
      const transformedImportedCards = importedCardsData.map(card => {
        // Determine arcana type based on card name
        const majorArcanaNames = [
          'The Fool', 'The Magician', 'The High Priestess', 'The Empress', 'The Emperor',
          'The Hierophant', 'The Lovers', 'The Chariot', 'Strength', 'The Hermit',
          'Wheel of Fortune', 'Justice', 'The Hanged Man', 'Death', 'Temperance',
          'The Devil', 'The Tower', 'The Star', 'The Moon', 'The Sun', 'Judgment', 'The World'
        ];
        
        let arcana: "major" | "minor" | "custom" = "custom";
        let number: number | undefined = undefined;
        let suit: string | undefined = undefined;
        
        if (majorArcanaNames.includes(card.name)) {
          arcana = "major";
          number = majorArcanaNames.indexOf(card.name);
        } else if (card.name.includes(' of ')) {
          arcana = "minor";
          const parts = card.name.split(' of ');
          if (parts.length === 2) {
            suit = parts[1].toLowerCase();
            const cardValue = parts[0].toLowerCase();
            if (cardValue === 'ace') number = 1;
            else if (['two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'].includes(cardValue)) {
              number = ['two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'].indexOf(cardValue) + 2;
            }
          }
        }
        
        return {
          id: `imported_${card.id}`,
          name: card.name,
          description: card.description,
          meanings: {
            upright: Array.isArray(card.meanings?.upright) ? card.meanings.upright :
              card.meanings?.upright?.split(',').map(m => m.trim()).filter(Boolean) || [],
            reversed: Array.isArray(card.meanings?.reversed) ? card.meanings.reversed :
              card.meanings?.reversed?.split(',').map(m => m.trim()).filter(Boolean) || []
          },
          arcana,
          number,
          suit
        };
      });
      console.log("Transformed imported cards:", transformedImportedCards);

      // Get standard cards first (they have working images), then fill gaps with imported cards
      const standardMajorArcana = tarotCards.filter(card => card.arcana === "major");
      const importedMajorArcana = transformedImportedCards.filter(card => card.arcana === "major");
      
      // Create a map of standard major arcana by card name to avoid duplicates
      // Handle spelling variations (Judgment vs Judgement)
      const normalizeCardName = (name: string) => {
        return name.replace(/Judgement/i, 'Judgment');
      };
      
      const standardMajorNames = new Set(standardMajorArcana.map(card => normalizeCardName(card.name)));
      const filteredImportedMajor = importedMajorArcana.filter(card => !standardMajorNames.has(normalizeCardName(card.name)));
      
      const allMajorArcana = [
        ...standardMajorArcana,
        ...filteredImportedMajor
      ].sort((a, b) => (a.number || 0) - (b.number || 0));
      
      // Get standard cards first (they have working images), then fill gaps with imported cards
      const standardMinorArcana = tarotCards.filter(card => card.arcana === "minor");
      const importedMinorArcana = transformedImportedCards.filter(card => card.arcana === "minor");
      
      // Create a map of standard minor arcana by card name to avoid duplicates
      const standardMinorNames = new Set(standardMinorArcana.map(card => card.name));
      const filteredImportedMinor = importedMinorArcana.filter(card => !standardMinorNames.has(card.name));
      
      const minorArcanaCards = [
        ...standardMinorArcana,
        ...filteredImportedMinor
      ];
      
      // Order suits: Wands, Cups, Swords, Pentacles
      const suitOrder = ['wands', 'cups', 'swords', 'pentacles'];
      
      // Group Minor Arcana cards by suit in the correct order
      const allMinorArcana = [];
      
      // Process each suit in traditional order: Wands, Cups, Swords, Pentacles
      for (const targetSuit of suitOrder) {
        // Get all cards for this specific suit
        const suitCards = minorArcanaCards.filter(card => card.suit === targetSuit);

        
        // Sort cards within this suit: Ace (1) through 10, then Page, Knight, Queen, King
        const sortedSuitCards = suitCards.sort((a, b) => {
          const courtOrder = { 'page': 11, 'knight': 12, 'queen': 13, 'king': 14 };
          
          // Get the first word of the card name for court card detection
          const aFirstWord = a.name?.toLowerCase().split(' ')[0] || '';
          const bFirstWord = b.name?.toLowerCase().split(' ')[0] || '';
          
          const aValue = courtOrder[aFirstWord] || a.number || 0;
          const bValue = courtOrder[bFirstWord] || b.number || 0;
          
          return aValue - bValue;
        });
        
        // Add all cards from this complete suit to our result
        allMinorArcana.push(...sortedSuitCards);
      }
      
      // Get only custom cards that don't duplicate standard tarot
      const customCards = transformedImportedCards.filter(card => 
        card.arcana === "custom" && !tarotCards.some(standardCard => 
          standardCard.name.toLowerCase() === card.name.toLowerCase()
        )
      );
      
      // Combine: ALL Major Arcana first, then ALL Minor Arcana, then Custom Cards
      const allCards = [
        ...allMajorArcana,
        ...allMinorArcana,
        ...customCards
      ];
      
      console.log(`Returning organized cards: ${allMajorArcana.length} major, ${allMinorArcana.length} minor, ${customCards.length} custom`);
      console.log(`Total unique cards: ${allCards.length}`);

      res.json(allCards);
    } catch (error) {
      console.error("Error fetching cards:", error);
      res.status(500).json({
        error: "Failed to fetch cards",
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Angel Numbers API endpoints
  app.get("/api/angel-numbers", async (req, res) => {
    try {
      // First, check if we have any angel numbers in the database
      const dbAngelNumbers = await storage.getAngelNumbers();

      // If no angel numbers in the database, seed from the data file
      if (dbAngelNumbers.length === 0) {
        console.log("No angel numbers found in database, seeding from data file...");
        for (const angelNumber of angelNumbersData) {
          await storage.createAngelNumber({
            number: angelNumber.number,
            name: angelNumber.name,
            meaning: angelNumber.meaning,
            spiritualMeaning: angelNumber.spiritualMeaning,
            practicalGuidance: angelNumber.practicalGuidance
          });
        }
        console.log(`Seeded ${angelNumbersData.length} angel numbers to database`);
      }

      // Get the angel numbers from the database
      const angelNumbers = await storage.getAngelNumbers();
      res.json(angelNumbers);
    } catch (error) {
      console.error("Error fetching angel numbers:", error);
      res.status(500).json({
        error: "Failed to fetch angel numbers",
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  app.get("/api/angel-numbers/:number", async (req, res) => {
    try {
      const angelNumber = await storage.getAngelNumberByNumber(req.params.number);

      if (!angelNumber) {
        return res.status(404).json({ error: "Angel number not found" });
      }

      res.json(angelNumber);
    } catch (error) {
      console.error("Error fetching angel number:", error);
      res.status(500).json({
        error: "Failed to fetch angel number",
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

      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }
      const userId = req.user!.id;
      const cardId = req.params.cardId;
      const imageUrl = `/uploads/${req.file.filename}`;

      // Update the card with the new image URL
      await storage.updateCardImage(userId, parseInt(cardId.replace('imported_', '')), imageUrl);

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

    // Removed duplicate subscription endpoint in favor of /api/create-subscription

    // Endpoint to get subscription details
    app.get('/api/subscription-details', async (req, res) => {
      try {
        if (!req.isAuthenticated()) {
          return res.status(401).json({ error: "Authentication required" });
        }

        const user = req.user;
        console.log("Fetching subscription details for user:", user.id, user.username);

        if (!user.stripeSubscriptionId) {
          return res.json({ 
            active: false,
            trialStatus: null,
            renewalDate: null,
            canceledAt: null,
            hasPaymentMethod: false
          });
        }

        // Retrieve the subscription with expanded customer
        const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId, {
          expand: ['customer', 'default_payment_method']
        });

        // Calculate trial end date
        const trialEnd = subscription.trial_end ? new Date(subscription.trial_end * 1000) : null;
        const currentPeriodEnd = new Date(subscription.current_period_end * 1000);
        const canceledAt = subscription.canceled_at ? new Date(subscription.canceled_at * 1000) : null;

        // Determine if the subscription is in trial period
        const now = new Date();
        const inTrialPeriod = trialEnd ? now < trialEnd : false;

        // Check if the subscription has a valid payment method
        const hasPaymentMethod = !!subscription.default_payment_method;

        res.json({
          active: subscription.status === 'active' || subscription.status === 'trialing',
          status: subscription.status,
          trialStatus: inTrialPeriod ? {
            inTrial: true,
            trialEnd: trialEnd?.toISOString(),
            daysRemaining: trialEnd ? Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)) : 0
          } : null,
          renewalDate: currentPeriodEnd.toISOString(),
          canceledAt: canceledAt?.toISOString() || null,
          cancelAtPeriodEnd: subscription.cancel_at_period_end,
          hasPaymentMethod
        });
      } catch (error: any) {
        console.error("Error fetching subscription details:", error);
        res.status(500).json({ 
          error: "Error retrieving subscription details", 
          message: error.message 
        });
      }
    });

    // Endpoint to apply a coupon to an existing subscription
    app.post('/api/apply-coupon', async (req, res) => {
      try {
        if (!req.isAuthenticated()) {
          return res.status(401).json({ error: "Authentication required" });
        }

        const user = req.user;
        const { couponCode, subscriptionId } = req.body;

        console.log("Applying coupon for user:", user.id, user.username);

        if (!subscriptionId) {
          return res.status(400).json({ error: "No subscription ID provided" });
        }

        if (!couponCode || typeof couponCode !== 'string') {
          return res.status(400).json({ error: "Valid coupon code is required" });
        }

        // Verify the coupon exists and is valid
        try {
          const coupon = await stripe.coupons.retrieve(couponCode);

          if (!coupon.valid) {
            return res.status(400).json({ error: "This coupon is no longer valid" });
          }

          console.log("Valid coupon found:", coupon.id);
        } catch (error) {
          console.error("Failed to retrieve coupon:", error);
          return res.status(400).json({ error: "Invalid coupon code" });
        }

        // Retrieve the existing subscription
        const subscription = await stripe.subscriptions.retrieve(subscriptionId);
        console.log("Retrieved subscription:", subscription.id, "status:", subscription.status);

        if (subscription.status === 'canceled') {
          return res.status(400).json({ error: "Cannot apply coupon to a canceled subscription" });
        }

        // Apply the coupon by updating the subscription
        const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
          coupon: couponCode,
        });

        console.log("Applied coupon to subscription:", updatedSubscription.id);

        return res.json({ 
          success: true, 
          message: "Coupon applied successfully" 
        });
      } catch (error) {
        console.error("Error applying coupon:", error);
        return res.status(500).json({ 
          error: "Failed to apply coupon", 
          message: error instanceof Error ? error.message : "Unknown error" 
        });
      }
    });

    // Endpoint to cancel a subscription
    app.post('/api/cancel-subscription', async (req, res) => {
      try {
        if (!req.isAuthenticated()) {
          return res.status(401).json({ error: "Authentication required" });
        }

        const user = req.user;
        console.log("Processing subscription cancellation for user:", user.id, user.username);

        if (!user.stripeSubscriptionId) {
          return res.status(400).json({ error: "No active subscription found" });
        }

        // Retrieve the subscription to check its status
        const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
        console.log("Retrieved subscription for cancellation:", subscription.id, "status:", subscription.status);

        if (subscription.status === 'canceled') {
          console.log("Subscription already canceled");

          // Update user record
          await storage.updateUserSubscription(user.id, {
            isSubscribed: false,
            stripeSubscriptionId: ''
          });

          return res.json({ 
            success: true, 
            message: "Subscription was already canceled" 
          });
        }

        // Cancel the subscription at the end of the current period
        // This way the user can still use the service until the end of what they paid for
        const cancelAtEnd = req.body.cancelAtEnd !== false; // Default to true if not specified

        if (cancelAtEnd) {
          // Schedule cancellation at the end of the billing period
          const updatedSubscription = await stripe.subscriptions.update(subscription.id, {
            cancel_at_period_end: true
          });
          console.log("Scheduled subscription cancellation at period end:", updatedSubscription.id);

          // Don't update the user's subscription status yet - they're still subscribed until the period ends
          res.json({ 
            success: true, 
            message: "Subscription will be canceled at the end of the current billing period",
            currentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString()
          });
        } else {
          // Cancel immediately if explicitly requested
          const canceledSubscription = await stripe.subscriptions.cancel(subscription.id);
          console.log("Canceled subscription immediately:", canceledSubscription.id);

          // Update user record
          await storage.updateUserSubscription(user.id, {
            isSubscribed: false,
            stripeSubscriptionId: ''
          });

          res.json({ 
            success: true, 
            message: "Subscription has been canceled immediately" 
          });
        }

        return;
      } catch (error: any) {
        console.error("Subscription cancellation error:", error);
        res.status(500).json({ 
          error: "Error canceling subscription", 
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

  // Learning tracks API endpoints
  app.get("/api/learning/tracks", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    try {
      const tracks = await storage.getLearningTracks();
      res.json(tracks);
    } catch (error) {
      console.error("Error fetching learning tracks:", error);
      res.status(500).send("Error fetching learning tracks");
    }
  });

  app.get("/api/learning/tracks/:id", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    try {
      const track = await storage.getLearningTrack(parseInt(req.params.id, 10));
      if (!track) {
        return res.status(404).send("Learning track not found");
      }
      res.json(track);
    } catch (error) {
      console.error("Error fetching learning track:", error);
      res.status(500).send("Error fetching learning track");
    }
  });

  app.post("/api/learning/tracks", requireAdmin, async (req, res) => {
    try {
      const track = await storage.createLearningTrack(req.body);
      res.status(201).json(track);
    } catch (error) {
      console.error("Error creating learning track:", error);
      res.status(500).send("Error creating learning track");
    }
  });

  app.post("/api/learning/progress/start/:trackId", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    try {
      const trackId = parseInt(req.params.trackId, 10);

      // Check if user already has progress for this track
      const existingProgress = await storage.getUserProgress(trackId);
      if (existingProgress) {
        return res.json(existingProgress);
      }

      // Create new progress
      const newProgress = {
        trackId,
        userId: req.user.id,
        currentLesson: 1,
        completedLessons: [],
        lastAccessed: new Date()
      };

      const progress = await storage.createUserProgress(newProgress);
      res.status(201).json(progress);
    } catch (error) {
      console.error("Error starting track progress:", error);
      res.status(500).send("Error starting track progress");
    }
  });

  app.get("/api/learning/progress/:trackId", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    try {
      const trackId = parseInt(req.params.trackId, 10);
      const progress = await storage.getUserProgress(trackId);

      if (!progress) {
        return res.status(404).send("No progress found for this track");
      }

      res.json(progress);
    } catch (error) {
      console.error("Error fetching track progress:", error);
      res.status(500).send("Error fetching track progress");
    }
  });

  app.patch("/api/learning/progress/:progressId", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    try {
      const progressId = parseInt(req.params.progressId, 10);
      const updatedProgress = await storage.updateUserProgress(progressId, req.body);
      res.json(updatedProgress);
    } catch (error) {
      console.error("Error updating track progress:", error);
      res.status(500).send("Error updating track progress");
    }
  });

  app.get("/api/learning/recent-quiz-results", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).send("Not authenticated");
    }

    try {
      const results = await storage.getRecentQuizResults(5);
      res.json(results);
    } catch (error) {
      console.error("Error fetching quiz results:", error);
      res.status(500).send("Error fetching quiz results");
    }
  });

  // Newsletter endpoints

  // Initialize email service when the application starts
  initializeEmailService().catch(err => {
    console.error("Failed to initialize email service:", err);
  });

  // Endpoint to manage newsletter subscription for the current user
  app.post("/api/newsletter/subscription", async (req, res) => {
    try {
      if (!req.isAuthenticated()) {
        return res.status(401).json({ error: "Authentication required" });
      }

      const { subscribe } = req.body;

      if (typeof subscribe !== 'boolean') {
        return res.status(400).json({ 
          error: "Invalid request format",
          details: "The 'subscribe' field must be a boolean"
        });
      }

      // Get user from request (set by Passport)
      const user = req.user;

      // If they're subscribing and don't have an unsubscribe token, generate one
      if (subscribe && !user.unsubscribeToken) {
        const token = crypto.randomBytes(32).toString('hex');
        await db.update(users)
          .set({ unsubscribeToken: token })
          .where(eq(users.id, user.id));
      }

      // Update subscription preference
      const updatedUser = await storage.updateUserNewsletterPreference(user.id, subscribe);

      res.json({ 
        success: true, 
        subscribed: updatedUser.newsletterSubscribed,
        message: subscribe 
          ? "You have been successfully subscribed to our weekly astrology newsletter!"
          : "You have been unsubscribed from our weekly astrology newsletter."
      });
    } catch (error) {
      console.error("Error updating newsletter subscription:", error);
      res.status(500).json({ 
        error: "Failed to update newsletter subscription",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Endpoint for unsubscribing with a token (no login required)
  app.get("/api/newsletter/unsubscribe", async (req, res) => {
    try {
      const { token } = req.query;

      if (typeof token !== 'string' || !token) {
        return res.status(400).json({ error: "Invalid or missing unsubscribe token" });
      }

      const success = await unsubscribeUserByToken(token);

      if (success) {
        res.json({ 
          success: true, 
          message: "You have been successfully unsubscribed from our newsletter."
        });
      } else {
        res.status(404).json({ 
          error: "Failed to unsubscribe",
          details: "The provided token is invalid or has expired."
        });
      }
    } catch (error) {
      console.error("Error unsubscribing from newsletter:", error);
      res.status(500).json({ 
        error: "Failed to process unsubscribe request",
        details: error instanceof Error ? error.message : "An unexpected error occurred"
      });
    }
  });

  // Admin endpoint to manually generate and send a newsletter (for testing)
  app.post("/api/admin/send-newsletter", requireAdmin, async (req, res) => {
    try {
      // Start the newsletter generation and sending process
      // This is asynchronous and will continue running after response is sent
      generateAndSendWeeklyNewsletter()
        .then(() => {
          console.log("Newsletter generation and sending completed");
        })
        .catch(err => {
          console.error("Newsletter generation failed:", err);
        });

      // Send immediate response
      res.json({ 
        success: true, 
        message: "Newsletter generation and sending process has been started. Check logs for details."
      });
    } catch (error) {
      console.error("Error starting newsletter generation:", error);
      res.status(500).json({ 
        error: "Failed to start newsletter generation",
        details: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  // Setup newsletter scheduler
  // This should run each time the server starts
  function setupNewsletterScheduler() {
    console.log("Setting up weekly newsletter scheduler...");

    // Schedule the newsletter to be checked daily
    // In a production environment, you should use a proper scheduler like node-cron
    const HOUR_IN_MS = 60 * 60 * 1000;
    setInterval(() => {
      console.log("Running scheduled newsletter check...");
      checkAndSendWeeklyNewsletter();
    }, 24 * HOUR_IN_MS); // Check once per day

    // Also run once at startup (helpful for development)
    console.log("Running initial newsletter check...");
    checkAndSendWeeklyNewsletter();
  }

  // Start the scheduler
  setupNewsletterScheduler();

  // Stripe Subscription Endpoints

  // Create or retrieve subscription
  app.post("/api/create-subscription", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "User must be logged in" });
    }

    const user = req.user;
    const { couponCode } = req.body;

    try {
      console.log("Processing subscription for user:", user.id, user.username);

      // If user already has a subscription, retrieve it
      if (user.stripeSubscriptionId) {
        console.log("User already has subscription ID:", user.stripeSubscriptionId);

        const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);
        console.log("Retrieved existing subscription:", subscription.id, "status:", subscription.status);

        // Check if this is an incomplete subscription
        if (subscription.status === 'incomplete') {
          console.log("Found incomplete subscription - cancelling and creating a new one");
          // Cancel the incomplete subscription
          await stripe.subscriptions.cancel(subscription.id);
          console.log("Cancelled incomplete subscription:", subscription.id);

          // Clear the subscription ID from the user
          await db
            .update(users)
            .set({ stripeSubscriptionId: '' })
            .where(eq(users.id, user.id));

          console.log("Cleared subscription ID from user record");
          // Will continue to create a new subscription
        } else {
          // Check if the subscription has a pending payment intent
          if (subscription.latest_invoice) {
            const invoice = typeof subscription.latest_invoice === 'string'
              ? await stripe.invoices.retrieve(subscription.latest_invoice, { expand: ['payment_intent'] })
              : subscription.latest_invoice;

            if (invoice.payment_intent) {
              const paymentIntent = typeof invoice.payment_intent === 'string'
                ? await stripe.paymentIntents.retrieve(invoice.payment_intent)
                : invoice.payment_intent;

              if (paymentIntent.client_secret) {
                // Return the client secret for client-side confirmation
                console.log("Returning existing client secret");
                return res.json({
                  subscriptionId: subscription.id,
                  clientSecret: paymentIntent.client_secret,
                });
              }
            }
          }

          // For active subscriptions, just return success
          if (subscription.status === 'active' || subscription.status === 'trialing') {
            console.log("Returning active subscription");
            return res.json({ 
              subscriptionId: subscription.id,
              status: subscription.status,
              message: "Subscription already active"
            });
          }
        }
      }

      if (!user.email) {
        console.error("User has no email address");
        return res.status(400).json({ message: "User email is required for subscription" });
      }

      console.log("Using Stripe price ID:", process.env.STRIPE_PRICE_ID);
      if (!process.env.STRIPE_PRICE_ID) {
        return res.status(500).json({ message: "Stripe price ID is not configured" });
      }

      // Create a new customer or use the existing one
      let customerId = user.stripeCustomerId;
      if (!customerId) {
        console.log("Creating new Stripe customer for user:", user.id);
        const customer = await stripe.customers.create({
          email: user.email,
          name: user.username,
          metadata: {
            userId: user.id.toString(),
          }
        });
        customerId = customer.id;
        console.log("Created customer:", customerId);
        await storage.updateStripeCustomerId(user.id, customer.id);
      } else {
        console.log("Using existing customer ID:", customerId);
      }

      // Prepare subscription params
      const subscriptionParams: Stripe.SubscriptionCreateParams = {
        customer: customerId,
        items: [{
          price: process.env.STRIPE_PRICE_ID,
        }],
        payment_behavior: 'default_incomplete',
        payment_settings: {
          payment_method_types: ['card'],
          save_default_payment_method: 'on_subscription'
        },
        expand: ['latest_invoice.payment_intent'],
      };

      // Only add trial period if user hasn't used one before
      if (!user.hasUsedFreeTrial) {
        console.log("User is eligible for 7-day free trial");
        subscriptionParams.trial_period_days = 7;

        // Mark that this user has now used their free trial
        await storage.updateUserTrialStatus(user.id, true);
        console.log("Updated user trial status: trial has been used");
      } else {
        console.log("User has already used their free trial, no trial period added");
      }

      // Apply coupon code if provided
      if (couponCode) {
        try {
          // Verify that the coupon exists and is valid
          const coupon = await stripe.coupons.retrieve(couponCode);
          if (coupon.valid) {
            // Apply the coupon to the subscription
            subscriptionParams.coupon = couponCode;
            console.log(`Applied coupon ${couponCode} to subscription`);
          }
        } catch (couponError) {
          console.error("Invalid coupon code:", couponError);
        }
      }

      // Create the subscription
      console.log("Creating subscription with customer:", customerId);
      const subscription = await stripe.subscriptions.create(subscriptionParams);
      console.log("Created subscription:", subscription.id);

      // Update user with subscription information
      await storage.updateUserStripeInfo(user.id, {
        customerId, 
        subscriptionId: subscription.id
      });

      // Return the client secret for client-side confirmation
      if (subscription.latest_invoice && typeof subscription.latest_invoice !== 'string') {
        const invoice = subscription.latest_invoice as any;
        if (invoice.payment_intent && typeof invoice.payment_intent !== 'string') {
          console.log("Sending client secret to frontend");
          return res.json({
            subscriptionId: subscription.id,
            clientSecret: invoice.payment_intent.client_secret,
          });
        }
      }

      // If we couldn't get the client secret, return error
      console.error("No client secret found in subscription response");
      return res.status(400).json({ message: "Failed to create payment intent" });

    } catch (error) {
      console.error("Subscription creation error:", error);
      let errorMessage = error instanceof Error ? error.message : "Unknown error";

      if (error.type === 'StripeCardError') {
        errorMessage = `Card error: ${error.message}`;
      } else if (error.type === 'StripeInvalidRequestError') {
        errorMessage = `Invalid request: ${error.message}`;
      }

      return res.status(500).json({ 
        message: "Failed to process subscription", 
        details: errorMessage 
      });
    }
  });

  // Handle app store purchase verification
  app.post("/api/verify-app-purchase", (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "User must be logged in" });
    }

    // Handle the purchase verification through our dedicated handler
    handleAppStorePurchaseVerification(req, res);
  });

  // Get subscription details
  app.get("/api/subscription-details", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "User must be logged in" });
    }

    const user = req.user;

    if (!user.stripeSubscriptionId) {
      return res.status(404).json({ message: "No subscription found" });
    }

    try {
      const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId, {
        expand: ['default_payment_method']
      });

      // Format the subscription data for the frontend
      const now = Math.floor(Date.now() / 1000);
      // Cast to any to work around TypeScript incompatibility
      const subAny = subscription as any;
      const currentPeriodEnd = subAny.current_period_end;
      const canceledAt = subAny.canceled_at;

      // Trial information
      let trialStatus = null;
      if (subscription.trial_end) {
        const trialEnd = new Date(subscription.trial_end * 1000);
        const daysRemaining = Math.ceil((subscription.trial_end - now) / (24 * 60 * 60));

        trialStatus = {
          inTrial: now < subscription.trial_end,
          trialEnd: trialEnd.toISOString(),
          daysRemaining: Math.max(0, daysRemaining),
        };
      }

      // Return formatted subscription info
      return res.json({
        active: subscription.status === 'active' || subscription.status === 'trialing',
        status: subscription.status,
        trialStatus,
        renewalDate: new Date(currentPeriodEnd * 1000).toISOString(),
        canceledAt: canceledAt ? new Date(canceledAt * 1000).toISOString() : null,
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        hasPaymentMethod: !!subscription.default_payment_method,
      });

    } catch (error) {
      console.error("Subscription details error:", error);
      return res.status(500).json({ 
        message: "Failed to retrieve subscription details", 
        details: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Cancel subscription
  app.post("/api/cancel-subscription", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "User must be logged in" });
    }

    const user = req.user;

    if (!user.stripeSubscriptionId) {
      return res.status(404).json({ message: "No subscription found" });
    }

    try {
      const { cancelAtEnd = true } = req.body;

      if (cancelAtEnd) {
        // Cancel at end of billing period (recommended)
        await stripe.subscriptions.update(user.stripeSubscriptionId, {
          cancel_at_period_end: true,
        });

        return res.json({ 
          message: "Your subscription will be canceled at the end of the current billing period"
        });
      } else {
        // Immediate cancellation
        await stripe.subscriptions.cancel(user.stripeSubscriptionId);

        // Update user's subscription status
        await storage.updateUserSubscription(user.id, {
          isSubscribed: false,
          stripeSubscriptionId: ''
        });

        return res.json({ message: "Your subscription has been canceled" });
      }

    } catch (error) {
      console.error("Subscription cancellation error:", error);
      return res.status(500).json({ 
        message: "Failed to cancel subscription", 
        details: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // Special middleware for Stripe webhooks (should be before any json body parser)
  const webhookMiddleware = express.raw({ type: 'application/json' });

  // Stripe webhook for subscription events
  app.post("/api/stripe-webhook", webhookMiddleware, async (req, res) => {
    const signature = req.headers['stripe-signature'];

    if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
      return res.status(400).json({ message: "Missing Stripe signature or webhook secret" });
    }

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (error) {
      console.error("Webhook signature verification failed:", error);
      return res.status(400).json({ message: "Webhook signature verification failed" });
    }

    try {
      // Handle specific event types
      switch (event.type) {
        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          const subscription = event.data.object as Stripe.Subscription;
          const customerId = subscription.customer as string;

          // Find user by Stripe customer ID
          const user = await storage.getUserByStripeCustomerId(customerId);

          if (user) {
            // Update user's subscription status
            await storage.updateUserSubscription(user.id, {
              isSubscribed: subscription.status === 'active' || subscription.status === 'trialing',
              stripeSubscriptionId: subscription.id
            });
          }
          break;

        case 'customer.subscription.deleted':
          const canceledSubscription = event.data.object as Stripe.Subscription;
          const canceledCustomerId = canceledSubscription.customer as string;

          // Find user by Stripe customer ID
          const canceledUser = await storage.getUserByStripeCustomerId(canceledCustomerId);

          if (canceledUser) {
            // Update user's subscription status
            await storage.updateUserSubscription(canceledUser.id, {
              isSubscribed: false,
              stripeSubscriptionId: ''
            });
          }
          break;
      }

      return res.json({ received: true });

    } catch (error) {
      console.error("Webhook processing error:", error);
      return res.status(500).json({ message: "Webhook processing failed" });
    }
  });

  // App Store purchase verification endpoint
  app.post('/api/verify-app-store-purchase', async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    // Handle the verification using our dedicated handler
    return handleAppStorePurchaseVerification(req, res);
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