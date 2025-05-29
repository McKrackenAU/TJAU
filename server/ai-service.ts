import OpenAI from "openai";
import { TarotCard } from "@shared/tarot-data";
import fs from "fs";
import path from "path";
import { CACHE_DIR } from "./utils/constants";
import { apiUsageTracker, API_COSTS } from "./utils/api-usage-tracker";

if (!process.env.OPENAI_API_KEY_TWO) {
  throw new Error("OPENAI_API_KEY_TWO environment variable is required");
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY_TWO
});

// CACHE_DIR is now imported at the top

export async function generateCardInterpretation(
  card: TarotCard,
  context?: string
): Promise<string> {
  const prompt = `As an expert Tarot reader, provide a personalized interpretation for the ${card.name} card.
${context ? `Consider this context: ${context}` : ""}
Include insights about:
- The card's general meaning
- How it relates to the querent's situation
- Advice or guidance based on this card
Keep the response concise but insightful, around 2-3 paragraphs.`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are a wise and experienced Tarot reader who provides insightful, compassionate interpretations."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 300
  });

  return response.choices[0].message.content || "Unable to generate interpretation.";
}

// Generate theta wave frequencies for meditation background
function generateThetaWave(frequency: number, durationSecs: number, sampleRate: number = 44100): Float32Array {
  const samples = durationSecs * sampleRate;
  const wave = new Float32Array(samples);

  for (let i = 0; i < samples; i++) {
    // Generate sine wave at theta frequency with higher amplitude
    wave[i] = Math.sin(2 * Math.PI * frequency * i / sampleRate) * 0.5; // Increased amplitude for better audibility
  }

  return wave;
}

export function getCardFrequency(card: TarotCard): number {
  if (card.arcana === 'major') {
    // Major Arcana: Higher theta frequencies for spiritual insight (6-7 Hz)
    return 6 + (card.number || 0) / 22;
  } else {
    // Minor Arcana: Lower theta frequencies for emotional processing
    const suitFrequencies: { [key: string]: number } = {
      'Wands': 5.5,    // Energy and passion
      'Cups': 4.5,     // Emotions and intuition
      'Swords': 5.0,   // Mental clarity
      'Pentacles': 4.0 // Material concerns
    };
    return suitFrequencies[card.suit || 'Wands'];
  }
}

// Enhanced meditation generation with improved prompts and audio and caching
export async function generateMeditation(card: TarotCard): Promise<{
  text: string;
  audioUrl: string;
  thetaFrequency: number;
}> {
  try {
    // Create a cache key using the card ID
    const cacheKey = `meditation_${card.id.replace(/[^a-zA-Z0-9]/g, '_')}`;
    const cacheFilePath = path.join(CACHE_DIR, `${cacheKey}.json`);
    
    console.log(`Checking cache for card ${card.id} with cache key: ${cacheKey}`);
    
    // Check if we have a cached meditation for this card
    if (fs.existsSync(cacheFilePath)) {
      try {
        console.log(`Found cached meditation at: ${cacheFilePath}`);
        const cachedData = JSON.parse(fs.readFileSync(cacheFilePath, 'utf8'));
        console.log(`Successfully loaded cached meditation data`);
        return cachedData;
      } catch (cacheError) {
        console.error("Error reading from cache:", cacheError);
        // Continue to generate new meditation on cache error
      }
    } else {
      console.log(`No cache found at: ${cacheFilePath}, generating new meditation`);
    }
    
    console.log(`Generating meditation for card: ${card.name}`);

    // Generate meditation script with more extensive pauses and deeply relaxing guidance
    const meditationPrompt = `Create a short guided meditation script based on the ${card.name} Tarot card.
The meditation should:
- Be 2-3 minutes when read aloud at a slow, meditative pace
- Include deep breathing guidance with extended pauses (use ...... for longer pauses)
- Connect to the card's core meanings: ${card.meanings.upright.join(", ")}
- Create a deeply relaxing atmosphere with imagery related to the card
- Guide the listener to reflect on these themes mindfully
- Include affirmations related to the card's energy
- End with a gentle return to awareness

Keep the tone deeply calming and peaceful. Add extensive pause markers (......) between each instruction to ensure a very slow, meditative pacing. The pauses should be longer than usual to allow for deep contemplation.`;

    // Track API usage for meditation text generation
    apiUsageTracker.trackUsage({
      endpoint: '/api/cards/:id/meditation',
      model: "gpt-3.5-turbo",
      operation: 'chat.completion',
      status: 'success',
      estimatedCost: API_COSTS["gpt-3.5-turbo"]['chat.completion'],
      cardId: card.id,
      cardName: card.name
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
      max_tokens: 500
    });

    console.log("Meditation script generated successfully");
    const meditationText = scriptResponse.choices[0].message.content || "";

    // Generate voice audio with much slower settings for a deeply meditative pacing
    console.log("Generating audio from meditation script");
    
    // Track API usage for TTS
    apiUsageTracker.trackUsage({
      endpoint: '/api/cards/:id/meditation',
      model: "tts-1",
      operation: 'audio.speech',
      status: 'success',
      estimatedCost: API_COSTS["tts-1"]['audio.speech'],
      cardId: card.id,
      cardName: card.name
    });
    
    const audioResponse = await openai.audio.speech.create({
      model: "tts-1",
      voice: "nova", // Using a calming voice
      input: meditationText,
      response_format: "mp3",
      speed: 0.75, // Further slowed down for deeper meditative pacing
    });

    console.log("Voice audio generated successfully");
    const audioBuffer = Buffer.from(await audioResponse.arrayBuffer());
    
    // Save the audio file to cache
    const audioFileName = `${cacheKey}.mp3`;
    const audioFilePath = path.join(CACHE_DIR, audioFileName);
    fs.writeFileSync(audioFilePath, audioBuffer);
    
    // Use a file path URL instead of base64 to reduce payload size
    const audioUrl = `/cache/${audioFileName}`;

    // Calculate appropriate theta frequency for this card
    const thetaFrequency = getCardFrequency(card);

    // Prepare the result
    const result = {
      text: meditationText,
      audioUrl: audioUrl,
      thetaFrequency
    };
    
    // Cache the result
    fs.writeFileSync(cacheFilePath, JSON.stringify(result));
    
    return result;
  } catch (error: any) {
    console.error("Error generating meditation:", error);
    
    // Check for rate limit errors
    if (error?.status === 429 || 
        (error?.error?.code === 'rate_limit_exceeded') || 
        (error?.message && error.message.toLowerCase().includes('rate limit'))) {
      
      console.log(`OpenAI rate limit hit while generating meditation for ${card.name}`);
      
      // Track the rate limit in our usage stats
      apiUsageTracker.trackUsage({
        endpoint: '/api/cards/:id/meditation',
        model: "gpt-3.5-turbo",
        operation: 'chat.completion',
        status: 'rate_limited',
        estimatedCost: 0,
        cardId: card.id,
        cardName: card.name
      });
    } else {
      // Track other errors
      apiUsageTracker.trackUsage({
        endpoint: '/api/cards/:id/meditation',
        model: "gpt-3.5-turbo",
        operation: 'error',
        status: 'error',
        estimatedCost: 0,
        cardId: card.id,
        cardName: card.name
      });
    }
    
    throw error;
  }
}

export async function generateDailyAffirmation(card: TarotCard): Promise<string> {
  const prompt = `Create an inspiring daily affirmation based on the ${card.name} tarot card.
Consider these upright meanings: ${card.meanings.upright.join(", ")}
The affirmation should:
- Be positive and empowering
- Be in first person ("I am...", "I embrace...", etc.)
- Connect to the card's core themes
- Be concise (1-2 sentences)
Keep the tone uplifting and motivational.`;

  const response = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "You are an inspiring spiritual guide who creates powerful, positive affirmations."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 100
  });

  return response.choices[0].message.content || "I embrace the wisdom of the cards and trust in my journey.";
}

// Add this new function after the existing ones
export async function analyzeCardCombination(
  cards: TarotCard[],
  context?: string
): Promise<string> {
  try {
    console.log("Analyzing cards:", cards.map(c => c.name).join(", "));

    const cardDescriptions = cards.map(card =>
      `${card.name}:\n- Description: ${card.description}\n- Upright meanings: ${card.meanings.upright.join(", ")}`
    ).join("\n\n");

    const prompt = `As an expert Tarot reader, analyze the combination of these cards:
${cardDescriptions}

${context ? `Consider this context: ${context}` : ""}

Please provide:
1. The overall energy and theme of this combination
2. How the cards interact with and influence each other
3. Key insights and guidance based on this specific combination

Keep the response concise but insightful, focusing on the unique synergy between these cards.`;

    console.log("Sending prompt to OpenAI");
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a wise and experienced Tarot reader who excels at understanding the complex interactions between multiple cards."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    const analysis = response.choices[0].message.content;
    if (!analysis) {
      throw new Error("No analysis generated from OpenAI");
    }

    console.log("Successfully generated analysis");
    return analysis;

  } catch (error) {
    console.error("Error in analyzeCardCombination:", error);
    throw error;
  }
}

// Generate detailed symbolism information for a card
export async function generateCardImage(card: TarotCard): Promise<string> {
  try {
    // Create images cache directory if it doesn't exist
    const imagesCacheDir = path.join(CACHE_DIR, 'images');
    try {
      if (!fs.existsSync(imagesCacheDir)) {
        fs.mkdirSync(imagesCacheDir, { recursive: true });
      }
    } catch (error) {
      console.error("Error creating images cache directory:", error);
    }

    // Create a cache key using the card ID
    const cacheKey = `image_${card.id.replace(/[^a-zA-Z0-9]/g, '_')}`;
    const imageFilePath = path.join(imagesCacheDir, `${cacheKey}.png`);
    const metaFilePath = path.join(imagesCacheDir, `${cacheKey}.json`);
    
    // Check if we have a cached version
    if (fs.existsSync(imageFilePath) && fs.existsSync(metaFilePath)) {
      try {
        console.log(`Loading cached image for ${card.name} from ${imageFilePath}`);
        const cachedData = JSON.parse(fs.readFileSync(metaFilePath, 'utf8'));
        return cachedData.imageUrl;
      } catch (cacheError) {
        console.error("Error reading image cache:", cacheError);
        // Continue with generation if cache read fails
      }
    }

    console.log(`Generating image for ${card.name}`);
    
    // Prepare meanings for the prompt
    const meanings = card.meanings.upright.slice(0, 3).join(", ");
    
    // Craft a detailed prompt for the image generation
    let prompt = "";
    
    if (card.arcana === "major") {
      prompt = `Create a mystical, ethereal tarot card image for "${card.name}" (Major Arcana). 
The image should feature a dreamy color palette primarily using soft pinks, magentas, purples, and lavender.
Rich in symbolism representing key meanings: ${meanings}. 
Style: Beautiful, ethereal digital art like the "Oracle of Illusion" deck, with elegant flowing lines and soft gradients.
Include soft glowing light effects, translucent elements, and a dreamlike quality.
Use pink and purple hues with occasional blue accents, matching the Oracle of Illusion card back design.
The artwork should have a magical, feminine energy with a modern, polished finish.`;
    } else {
      prompt = `Create a mystical, ethereal tarot card image for "${card.name}" of the ${card.suit} suit (Minor Arcana).
The image should feature a dreamy color palette primarily using soft pinks, magentas, purples, and lavender.
Represent key meanings: ${meanings} with ${card.suit}-related imagery.
Style: Beautiful, ethereal digital art like the "Oracle of Illusion" deck, with elegant flowing lines and soft gradients.
Include soft glowing light effects, translucent elements, and a dreamlike quality.
Use pink and purple hues with occasional blue accents, matching the Oracle of Illusion card back design.
The artwork should have a magical, feminine energy with a modern, polished finish.`;
    }

    try {
      // Track the API usage before making the call
      apiUsageTracker.trackUsage({
        endpoint: '/api/cards/:id/image',
        model: 'dall-e-3',
        operation: 'image.generate',
        status: 'success', // We'll update this on error
        estimatedCost: API_COSTS['dall-e-3']['image.generate'],
        cardId: card.id,
        cardName: card.name
      });
      
      // Generate the image using DALL-E with vivid style for more vibrant colors
      const response = await openai.images.generate({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
        response_format: "url",
        style: "vivid", // Use vivid style for more intense colors that match Oracle of Illusion
      });

      const imageUrl = response.data[0].url;
      if (!imageUrl) {
        throw new Error("No image URL generated from OpenAI");
      }

      // Download the generated image
      console.log("Downloading generated image");
      const imageResponse = await fetch(imageUrl);
      const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
      fs.writeFileSync(imageFilePath, imageBuffer);

      // Cache the result metadata
      // Ensure path consistency for client access
      const publicImageUrl = `/cache/images/${path.basename(imageFilePath)}`;
      try {
        fs.writeFileSync(
          metaFilePath,
          JSON.stringify({
            id: card.id,
            name: card.name,
            imageUrl: publicImageUrl,
            generatedAt: new Date().toISOString(),
          })
        );
        console.log(`Cached image for ${card.name} at ${imageFilePath} with URL ${publicImageUrl}`);
      } catch (cacheError) {
        console.error("Error writing image metadata to cache:", cacheError);
        // Continue even if caching fails
      }

      console.log("Successfully generated card image");
      return publicImageUrl;
    } catch (error: any) {
      // Enhanced specific handling for rate limit errors
      if (error?.status === 429 || 
          (error?.error?.code === 'rate_limit_exceeded') || 
          (error?.message && error.message.toLowerCase().includes('rate limit'))) {
        
        console.log(`OpenAI rate limit hit while generating image for ${card.name}`);
        
        // Track the rate limit in our usage stats
        apiUsageTracker.trackUsage({
          endpoint: '/api/cards/:id/image',
          model: 'dall-e-3',
          operation: 'image.generate',
          status: 'rate_limited',
          estimatedCost: 0, // No cost incurred for rate limited requests
          cardId: card.id,
          cardName: card.name
        });
        
        // Preserve the original error properties for proper error handling upstream
        // This ensures our routes.ts can extract the retry-after header
        throw error;
      }
      
      // For other errors, add more context but still throw to propagate up
      throw new Error(`Failed to generate image for ${card.name}: ${error.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.error("Error generating card image:", error);
    throw error;
  }
}

export async function generateCardSymbolism(card: TarotCard): Promise<string> {
  try {
    // Create symbolism cache directory if it doesn't exist
    const symbolismCacheDir = path.join(CACHE_DIR, 'symbolism');
    try {
      if (!fs.existsSync(symbolismCacheDir)) {
        fs.mkdirSync(symbolismCacheDir, { recursive: true });
      }
    } catch (error) {
      console.error("Error creating symbolism cache directory:", error);
    }

    // Create a cache key using the card ID
    const cacheKey = `symbolism_${card.id.replace(/[^a-zA-Z0-9]/g, '_')}`;
    const cacheFilePath = path.join(symbolismCacheDir, `${cacheKey}.json`);
    
    // Check if we have a cached version
    if (fs.existsSync(cacheFilePath)) {
      try {
        console.log(`Loading cached symbolism for ${card.name} from ${cacheFilePath}`);
        const cachedData = JSON.parse(fs.readFileSync(cacheFilePath, 'utf8'));
        return cachedData.symbolism;
      } catch (cacheError) {
        console.error("Error reading symbolism cache:", cacheError);
        // Continue with generation if cache read fails
      }
    }

    console.log(`Generating symbolism information for ${card.name}`);

    const prompt = `Provide a detailed analysis of the symbolism in the ${card.name} tarot card.
Include the following sections:
1. Key Symbols - Identify 3-5 important symbols typically found in this card and their meanings
2. Colors - Explain the significance of the primary colors used in traditional renditions of this card
3. Numerology - If applicable, explain the numerological significance of this card (${card.number || 'N/A'})
4. Elemental Associations - Explain the connection to its element (${card.element || 'N/A'})
5. Hidden Details - Mention 1-2 subtle or easily missed symbolic details that provide deeper insight

Format the response with clear section headings and concise explanations. Keep the total length to around 400 words.`;

    // Use gpt-3.5-turbo if available, with fallback to gpt-3.5-turbo
    const model = "gpt-3.5-turbo"; // the newest OpenAI model is "gpt-3.5-turbo" which was released May 13, 2024. do not change this unless explicitly requested by the user
    
    // Track API usage
    apiUsageTracker.trackUsage({
      endpoint: '/api/cards/:id/symbolism',
      model,
      operation: 'chat.completion',
      status: 'success',
      estimatedCost: API_COSTS[model]['chat.completion'],
      cardId: card.id,
      cardName: card.name
    });
    
    const response = await openai.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: "You are an expert on tarot symbolism and iconography with deep knowledge of esoteric traditions. Your explanations are insightful, specific, and educational."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 800
    });

    const symbolism = response.choices[0].message.content;
    if (!symbolism) {
      throw new Error("No symbolism analysis generated from OpenAI");
    }

    // Cache the result
    try {
      fs.writeFileSync(
        cacheFilePath,
        JSON.stringify({
          id: card.id,
          name: card.name,
          symbolism,
          generatedAt: new Date().toISOString(),
        })
      );
      console.log(`Cached symbolism for ${card.name} at ${cacheFilePath}`);
    } catch (cacheError) {
      console.error("Error writing symbolism to cache:", cacheError);
      // Continue even if caching fails
    }

    console.log("Successfully generated card symbolism analysis");
    return symbolism;

  } catch (error: any) {
    console.error("Error generating card symbolism:", error);
    
    // Check for rate limit errors
    if (error?.status === 429 || 
        (error?.error?.code === 'rate_limit_exceeded') || 
        (error?.message && error.message.toLowerCase().includes('rate limit'))) {
      
      console.log(`OpenAI rate limit hit while generating symbolism for ${card.name}`);
      
      // Track the rate limit in our usage stats
      apiUsageTracker.trackUsage({
        endpoint: '/api/cards/:id/symbolism',
        model: "gpt-3.5-turbo",
        operation: 'chat.completion',
        status: 'rate_limited',
        estimatedCost: 0, // No cost incurred for rate limited requests
        cardId: card.id,
        cardName: card.name
      });
    } else {
      // Track other errors
      apiUsageTracker.trackUsage({
        endpoint: '/api/cards/:id/symbolism',
        model: "gpt-3.5-turbo",
        operation: 'chat.completion',
        status: 'error',
        estimatedCost: 0, // No cost for errors
        cardId: card.id,
        cardName: card.name
      });
    }
    
    throw error;
  }
}