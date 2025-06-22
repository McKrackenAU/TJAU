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
import bcrypt from "bcrypt";
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

  // Set the custom Josie voice ID for meditations
  process.env.CUSTOM_MEDITATION_VOICE_ID = "LSufHJs05fSH7jJqUHhF"; // Josie voice ID

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
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: "Authentication required" });
    }
    
    try {
      const reading = insertReadingSchema.parse(req.body);
      const result = await storage.createReading(req.user!.id, reading);
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

  // Test endpoint for debugging mobile connectivity
  app.post("/api/test-connection", (req, res) => {
    console.log("=== TEST CONNECTION REQUEST ===");
    console.log("Request received successfully");
    console.log("Headers:", req.headers);
    console.log("Body:", req.body);
    res.json({ status: "connected", timestamp: new Date().toISOString() });
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
    console.log("=== SPREAD INTERPRETATION REQUEST RECEIVED ===");
    console.log("Request body:", req.body);
    console.log("User agent:", req.headers['user-agent']);
    console.log("Content-Type:", req.headers['content-type']);

    try {
      const { cardIds, spreadType, positions } = req.body;
      console.log("Parsed request data:", { cardIds, spreadType, positions });
      console.log("Authentication status:", req.isAuthenticated());

      if (!req.isAuthenticated()) {
        console.log("Authentication failed for spread interpretation request");
        console.log("Session cookies:", req.headers.cookie);
        console.log("Session data:", req.session);
        console.log("User in session:", req.user);

        // For mobile apps with custom domains, allow requests with user ID as backup
        const { userId } = req.body;
        if (userId && typeof userId === 'number') {
          console.log("Allowing spread interpretation for mobile app with userId:", userId);
          // Create a minimal user object for this request
          req.user = { id: userId } as any;
        } else {
          return res.status(401).json({ error: "Authentication required" });
        }
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

      // Cache key based on cards and spread type with mobile optimization
      const userAgent = req.headers['user-agent'] || '';
      const isMobileApp = userAgent.includes('Tarot Journey App') || 
                         req.headers.origin?.includes('capacitor') ||
                         req.headers.origin === undefined;
      
      const cacheIdString = cards.map(c => c.id).join('-');
      const cacheKey = `spread_meditation_${spreadType}_${cacheIdString}${isMobileApp ? '_mobile' : ''}`;
      const cacheFilePath = path.join(CACHE_DIR, `${cacheKey}.json`);
      
      if (isMobileApp) {
        console.log("Mobile app detected - using optimized meditation generation");
      }

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
        max_tokens: isMobileApp ? 500 : 700 // Shorter for mobile to reduce latency
      });

      console.log("Spread meditation script generated successfully");
      const meditationText = scriptResponse.choices[0].message.content || "";

      // Generate voice audio with custom voice or fallback to OpenAI
      console.log("Generating audio from spread meditation script");

      let audioBuffer: Buffer;

      // Check if custom voice is configured
      const customVoiceId = "LSufHJs05fSH7jJqUHhF"; // Josie voice ID

      if (customVoiceId && process.env.ELEVENLABS_API_KEY) {
        try {
          console.log("Using custom voice for spread meditation");
          const { voiceCloningService } = await import('./services/voice-cloning-service');
          audioBuffer = await voiceCloningService.generateSpeech(
            meditationText, 
            customVoiceId,
            0.8, // Higher stability for meditation
            0.9  // Higher similarity for authenticity
          );

          // Track API usage for ElevenLabs
          apiUsageTracker.trackUsage({
            endpoint: '/api/meditate-spread',
            model: "elevenlabs-custom",
            operation: 'audio.speech',
            status: 'success',
            estimatedCost: 0.18, // ElevenLabs pricing per 1000 characters
            cardId: cards[0].id,
            cardName: spreadType
          });
        } catch (error) {
          console.error("Custom voice generation failed, falling back to OpenAI:", error);
          // Fallback to OpenAI
          const audioResponse = await openai.audio.speech.create({
            model: "tts-1",
            voice: "nova",
            input: meditationText,
            response_format: "mp3",
            speed: 0.75,
          });
          audioBuffer = Buffer.from(await audioResponse.arrayBuffer());

          apiUsageTracker.trackUsage({
            endpoint: '/api/meditate-spread',
            model: "tts-1",
            operation: 'audio.speech',
            status: 'success',
            estimatedCost: API_COSTS["tts-1"]['audio.speech'],
            cardId: cards[0].id,
            cardName: spreadType
          });
        }
      } else {
        console.log("Using OpenAI TTS for spread meditation");
        const audioResponse = await openai.audio.speech.create({
          model: "tts-1",
          voice: "nova",
          input: meditationText,
          response_format: "mp3",
          speed: 0.75,
        });
        audioBuffer = Buffer.from(await audioResponse.arrayBuffer());

        apiUsageTracker.trackUsage({
          endpoint: '/api/meditate-spread',
          model: "tts-1",
          operation: 'audio.speech',
          status: 'success',
          estimatedCost: API_COSTS["tts-1"]['audio.speech'],
          cardId: cards[0].id,
          cardName: spreadType
        });
      }

      console.log("Voice audio generated successfully");

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

  // Set up multer for Excel, image, and voice uploads
  const upload = multer({
    storage: multer.memoryStorage(), // Use memory storage to preserve quality
    limits: {
      fileSize: 10 * 1024 * 1024 // 10MB limit for high quality files
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
      } else if (file.fieldname === 'voiceFile') {
        // Audio files for voice cloning
        const validAudioTypes = ['audio/wav', 'audio/mp3', 'audio/mpeg', 'audio/m4a', 'audio/mp4'];
        cb(null, validAudioTypes.includes(file.mimetype));
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

  // Voice upload and cloning endpoint
  app.post("/api/admin/upload-voice", requireAdmin, upload.single('voiceFile'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No voice file uploaded" });
      }

      const { voiceName, description } = req.body;
      if (!voiceName || !voiceName.trim()) {
        return res.status(400).json({ error: "Voice name is required" });
      }

      console.log("Processing voice upload:", {
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        voiceName: voiceName.trim(),
        description: description?.trim() || ''
      });

      const { voiceCloningService } = await import('./services/voice-cloning-service.js');
      
      // First check if a voice with this name already exists
      try {
        const existingVoices = await voiceCloningService.getAvailableVoices();
        const existingVoice = existingVoices.find(voice => 
          voice.name.toLowerCase() === voiceName.trim().toLowerCase()
        );
        
        if (existingVoice) {
          console.log(`Voice "${voiceName}" already exists with ID: ${existingVoice.voice_id}`);
          return res.json({
            success: true,
            message: `Voice "${voiceName}" already exists and is ready to use`,
            voiceId: existingVoice.voice_id,
            existing: true
          });
        }
      } catch (voiceCheckError) {
        console.warn("Could not check existing voices:", voiceCheckError);
      }

      // Save the audio file temporarily
      const tempDir = path.join(process.cwd(), '.temp');
      await fs.promises.mkdir(tempDir, { recursive: true });
      
      const tempFilename = `voice_${Date.now()}_${req.file.originalname}`;
      const tempFilePath = path.join(tempDir, tempFilename);
      
      await fs.promises.writeFile(tempFilePath, req.file.buffer);
      console.log(`Temporary voice file saved: ${tempFilePath}`);

      // Create the voice clone
      const voiceId = await voiceCloningService.createVoiceClone(
        tempFilePath,
        voiceName.trim(),
        description?.trim() || ''
      );

      // Clean up temporary file
      try {
        await fs.promises.unlink(tempFilePath);
        console.log(`Cleaned up temporary file: ${tempFilePath}`);
      } catch (cleanupError) {
        console.warn(`Failed to cleanup temporary file: ${cleanupError}`);
      }

      if (!voiceId) {
        return res.status(500).json({ error: "Failed to create voice clone" });
      }

      console.log(`Voice clone created successfully: ${voiceId}`);

      res.json({
        success: true,
        message: `Voice "${voiceName}" uploaded and cloned successfully`,
        voiceId: voiceId
      });

    } catch (error) {
      console.error("Voice upload error:", error);
      res.status(500).json({
        error: "Failed to upload and clone voice",
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get available voices
  app.get("/api/admin/voices", requireAdmin, async (req, res) => {
    try {
      const { voiceCloningService } = await import('./services/voice-cloning-service.js');
      const voices = await voiceCloningService.getAvailableVoices();
      res.json(voices);
    } catch (error) {
      console.error("Error fetching voices:", error);
      res.status(500).json({
        error: "Failed to fetch voices",
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Delete a voice
  app.delete("/api/admin/voices/:voiceId", requireAdmin, async (req, res) => {
    try {
      const { voiceId } = req.params;
      const { voiceCloningService } = await import('./services/voice-cloning-service.js');
      const success = await voiceCloningService.deleteVoice(voiceId);
      
      if (success) {
        res.json({ success: true, message: "Voice deleted successfully" });
      } else {
        res.status(500).json({ error: "Failed to delete voice" });
      }
    } catch (error) {
      console.error("Error deleting voice:", error);
      res.status(500).json({
        error: "Failed to delete voice",
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Generate speech with Josie voice for all voice features
  app.post("/api/generate-speech", async (req, res) => {
    try {
      const { text, speed = 1.0 } = req.body;
      
      if (!text || typeof text !== 'string' || text.trim().length === 0) {
        console.log("Invalid text received:", { text, type: typeof text });
        return res.status(400).json({ error: "Text is required" });
      }
      
      console.log("=== GENERATING SPEECH WITH JOSIE VOICE ===");
      console.log("Text length:", text.length);
      console.log("Speed:", speed);
      console.log("User agent:", req.headers['user-agent'] || 'unknown');
      console.log("Origin:", req.headers.origin || 'unknown');
      
      const customVoiceId = "LSufHJs05fSH7jJqUHhF"; // Josie voice ID
      
      if (customVoiceId && process.env.ELEVENLABS_API_KEY) {
        try {
          const { voiceCloningService } = await import('./services/voice-cloning-service.js');
          
          // Adjust stability and similarity based on speed
          const stability = speed > 1.0 ? 0.7 : 0.8;
          const similarity = 0.9;
          
          const audioBuffer = await voiceCloningService.generateSpeech(
            text, 
            customVoiceId,
            stability,
            similarity
          );
          
          console.log("=== SPEECH GENERATION SUCCESSFUL ===");
          console.log("Audio buffer size:", audioBuffer.length);
          console.log("Voice ID used:", customVoiceId);
          console.log("Stability:", stability, "Similarity:", similarity);
          
          res.set({
            'Content-Type': 'audio/mpeg',
            'Content-Length': audioBuffer.length.toString(),
            'Cache-Control': 'no-cache'
          });
          
          res.send(audioBuffer);
          return;
          
        } catch (error) {
          console.error("=== CUSTOM VOICE GENERATION FAILED ===");
          console.error("Error details:", error);
          return res.status(500).json({ error: "Speech generation failed" });
        }
      } else {
        console.error("ElevenLabs API key or voice ID not configured");
        return res.status(500).json({ error: "Voice service not configured" });
      }
      
    } catch (error) {
      console.error("Error generating speech:", error);
      res.status(500).json({
        error: "Failed to generate speech",
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Set meditation voice
  app.post("/api/admin/set-meditation-voice", requireAdmin, async (req, res) => {
    try {
      const { voiceId } = req.body;
      if (!voiceId) {
        return res.status(400).json({ error: "Voice ID is required" });
      }

      // Store the voice ID in environment variable (this would typically be saved to a config file or database)
      process.env.CUSTOM_MEDITATION_VOICE_ID = voiceId;
      
      console.log(`Set meditation voice to: ${voiceId}`);
      
      res.json({
        success: true,
        message: "Meditation voice updated successfully",
        voiceId: voiceId
      });
    } catch (error) {
      console.error("Error setting meditation voice:", error);
      res.status(500).json({
        error: "Failed to set meditation voice",
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

        // Map friendly coupon codes to actual Stripe coupon IDs
        const couponMapping: Record<string, string> = {
          "TJ1111FF": "RMr9tEGb",
          "TJ1111": "hCcwd0En"
        };

        // Get the actual Stripe coupon ID (use mapping if exists, otherwise use the input)
        const stripeCouponId = couponMapping[couponCode] || couponCode;

        console.log("Mapped coupon code:", couponCode, "to Stripe coupon ID:", stripeCouponId);

        // Verify the coupon exists and is valid
        try {
          const coupon = await stripe.coupons.retrieve(stripeCouponId);

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
          coupon: stripeCouponId,
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
          // Cancel at end of billing period (recommended)
          const updatedSubscription = await stripe.subscriptions.update(user.stripeSubscriptionId, {
            cancel_at_period_end: true
          });

          res.json({ 
            success: true, 
            message: "Subscription will be canceled at the end of the current billing period",
            currentPeriodEnd: new Date(updatedSubscription.current_period_end * 1000).toISOString()
          });
        } else {
          // Cancel immediately
          const canceledSubscription = await stripe.subscriptions.cancel(user.stripeSubscriptionId);

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
      } catch (error) {
        console.error("Subscription cancellation error:", error);
        res.status(500).json({ 
          error: "Error canceling subscription", 
          message: error instanceof Error ? error.message : "Unknown error" 
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

  // User Management API endpoints - admin only
  app.get("/api/admin/users", requireAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      // Remove password field for security
      const safeUsers = users.map(user => {
        const { password, ...safeUser } = user;
        return safeUser;
      });
      res.json(safeUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  app.patch("/api/admin/users/:id", requireAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const updates = req.body;
      
      // Remove sensitive fields that shouldn't be updated directly
      const { password, id, createdAt, ...safeUpdates } = updates;
      
      const updatedUser = await storage.updateUser(userId, safeUpdates);
      const { password: _, ...safeUser } = updatedUser;
      res.json(safeUser);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  app.delete("/api/admin/users/:id", requireAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      // Prevent admin from deleting themselves
      if (req.user && req.user.id === userId) {
        return res.status(400).json({ error: "Cannot delete your own account" });
      }
      
      await storage.deleteUser(userId);
      res.json({ success: true, message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ error: "Failed to delete user" });
    }
  });

  app.patch("/api/admin/users/:id/toggle-admin", requireAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      // Prevent admin from removing their own admin status
      if (req.user && req.user.id === userId) {
        return res.status(400).json({ error: "Cannot modify your own admin status" });
      }
      
      const updatedUser = await storage.toggleUserAdmin(userId);
      const { password: _, ...safeUser } = updatedUser;
      res.json(safeUser);
    } catch (error) {
      console.error("Error toggling admin status:", error);
      res.status(500).json({ error: "Failed to toggle admin status" });
    }
  });

  app.patch("/api/admin/users/:id/toggle-subscription", requireAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const updatedUser = await storage.toggleUserSubscription(userId);
      const { password: _, ...safeUser } = updatedUser;
      res.json(safeUser);
    } catch (error) {
      console.error("Error toggling subscription:", error);
      res.status(500).json({ error: "Failed to toggle subscription" });
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

      if (!user.stripeSubscriptionId) {
        return res.status(400).json({ error: "No active subscription found" });
      }

      // Retrieve the subscription to check its status
      const subscription = await stripe.subscriptions.retrieve(user.stripeSubscriptionId);

      if (subscription.status === 'canceled') {
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

      if (cancelAtEnd) {
        // Cancel at end of billing period (recommended)
        const updatedSubscription = await stripe.subscriptions.update(user.stripeSubscriptionId, {
          cancel_at_period_end: true
        });

        res.json({ 
          success: true, 
          message: "Subscription will be canceled at the end of the current billing period",
          currentPeriodEnd: new Date(updatedSubscription.current_period_end * 1000).toISOString()
        });
      } else {
        // Cancel immediately
        const canceledSubscription = await stripe.subscriptions.cancel(user.stripeSubscriptionId);

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
    } catch (error) {
      console.error("Subscription cancellation error:", error);
      res.status(500).json({ 
        error: "Error canceling subscription", 
        message: error instanceof Error ? error.message : "Unknown error" 
      });
    }
  });

  // System Status endpoints (Admin only)
  app.get("/api/admin/system-status", requireAdmin, async (req, res) => {
    try {
      const startTime = Date.now();
      
      // Database health check
      let dbHealth = { status: 'down', responseTime: 0, error: null };
      try {
        const dbStart = Date.now();
        await db.select().from(users).limit(1);
        dbHealth = {
          status: 'up',
          responseTime: Date.now() - dbStart,
          error: null
        };
      } catch (error) {
        dbHealth = {
          status: 'down',
          responseTime: Date.now() - startTime,
          error: error instanceof Error ? error.message : 'Unknown error'
        };
      }

      // Memory usage
      const memUsage = process.memoryUsage();
      const totalMemory = memUsage.heapTotal + memUsage.external;
      const usedMemory = memUsage.heapUsed;
      
      // System uptime
      const uptime = process.uptime();
      
      // Environment info
      const environment = {
        nodeVersion: process.version,
        platform: process.platform,
        arch: process.arch,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      };

      // API service health checks
      const services = {
        openai: process.env.OPENAI_API_KEY ? 'configured' : 'not_configured',
        stripe: process.env.STRIPE_SECRET_KEY ? 'configured' : 'not_configured',
        elevenlabs: process.env.ELEVENLABS_API_KEY ? 'configured' : 'not_configured',
        database: process.env.DATABASE_URL ? 'configured' : 'not_configured'
      };

      res.json({
        timestamp: new Date().toISOString(),
        status: 'healthy',
        uptime: Math.floor(uptime),
        database: dbHealth,
        memory: {
          used: usedMemory,
          total: totalMemory,
          usagePercent: Math.round((usedMemory / totalMemory) * 100),
          rss: memUsage.rss,
          external: memUsage.external
        },
        environment,
        services,
        responseTime: Date.now() - startTime
      });
    } catch (error) {
      console.error('System status error:', error);
      res.status(500).json({
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  });

  app.get("/api/admin/system-metrics", requireAdmin, async (req, res) => {
    try {
      // Get user statistics
      const totalUsers = await storage.getUserCount();
      const activeUsers = await storage.getActiveUserCount();
      
      // Get reading statistics
      const totalReadings = await storage.getTotalReadingsCount();
      const todayReadings = await storage.getTodayReadingsCount();
      
      // Get journal statistics
      const totalJournalEntries = await storage.getTotalJournalEntriesCount();
      
      // Get subscription statistics
      const subscriptionStats = await storage.getSubscriptionStats();
      
      res.json({
        users: {
          total: totalUsers,
          active: activeUsers,
          growth: Math.round(((activeUsers / Math.max(totalUsers, 1)) * 100))
        },
        readings: {
          total: totalReadings,
          today: todayReadings,
          avgPerUser: Math.round(totalReadings / Math.max(totalUsers, 1))
        },
        journal: {
          totalEntries: totalJournalEntries,
          avgPerUser: Math.round(totalJournalEntries / Math.max(totalUsers, 1))
        },
        subscriptions: subscriptionStats,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('System metrics error:', error);
      res.status(500).json({
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
  });

  // Password reset endpoints - supports both endpoint names for compatibility
  app.post('/api/forgot-password', async (req, res) => {
    await handlePasswordResetRequest(req, res);
  });

  app.post('/api/request-password-reset', async (req, res) => {
    await handlePasswordResetRequest(req, res);
  });

  async function handlePasswordResetRequest(req: any, res: any) {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: 'Email is required' });
      }

      const user = await storage.getUserByEmail(email);
      if (!user) {
        // Return success even if user doesn't exist for security
        return res.json({ message: 'If an account with that email exists, a reset link has been sent.' });
      }

      // Generate reset token
      const resetToken = randomBytes(32).toString('hex');
      const resetExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

      await storage.setPasswordResetToken(email, resetToken, resetExpires);

      // Try to send email with reset link
      try {
        const { sendEmail } = await import('./services/email-service');
        const resetUrl = `${req.protocol}://${req.get('host')}/reset-password?token=${resetToken}`;
        
        const emailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Password Reset Request</h2>
            <p>You have requested to reset your password for your Tarot Journey account.</p>
            <p>Click the link below to reset your password:</p>
            <a href="${resetUrl}" style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Reset Password</a>
            <p>This link will expire in 24 hours.</p>
            <p>If you didn't request this reset, please ignore this email.</p>
          </div>
        `;
        
        const emailSent = await sendEmail(email, 'Password Reset - Tarot Journey', emailHtml);
        
        if (emailSent) {
          console.log(`Password reset email sent to ${email}`);
        } else {
          console.log(`Failed to send password reset email to ${email}, token: ${resetToken}`);
        }
      } catch (emailError) {
        console.error('Email service error:', emailError);
        console.log(`Password reset token for ${email}: ${resetToken}`);
      }

      res.json({ message: 'If an account with that email exists, a reset link has been sent.' });
    } catch (error) {
      console.error('Forgot password error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }

  app.post('/api/reset-password', async (req, res) => {
    try {
      const { token, password } = req.body;

      if (!token || !password) {
        return res.status(400).json({ message: 'Token and password are required' });
      }

      if (password.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
      }

      const user = await storage.getUserByResetToken(token);
      if (!user || !user.passwordResetExpires || user.passwordResetExpires < new Date()) {
        return res.status(400).json({ message: 'Invalid or expired reset token' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await storage.updatePassword(user.id, hashedPassword);

      res.json({ message: 'Password has been reset successfully' });
    } catch (error) {
      console.error('Reset password error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  // Simple auth middleware
  const requireAuth = (req: any, res: any, next: any) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ message: "Authentication required" });
    }
    next();
  };

  // Admin password reset endpoint
  app.post('/api/admin/reset-user-password', requireAuth, requireAdmin, async (req, res) => {
    try {
      const { userId, newPassword } = req.body;

      if (!userId || !newPassword) {
        return res.status(400).json({ message: 'User ID and new password are required' });
      }

      if (newPassword.length < 6) {
        return res.status(400).json({ message: 'Password must be at least 6 characters long' });
      }

      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await storage.updatePassword(userId, hashedPassword);

      res.json({ message: `Password reset successfully for user ${user.username}` });
    } catch (error) {
      console.error('Admin password reset error:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  const adminAuth = requireAdmin;

  const httpServer = createServer(app);
  return httpServer;
}