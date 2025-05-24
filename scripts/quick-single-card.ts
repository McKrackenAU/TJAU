/**
 * Quick Single Card Generator - Optimized for Speed
 */

import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Card definitions for quick generation
const cardData: Record<string, { name: string; prompt: string }> = {
  "5": {
    name: "The Hierophant",
    prompt: "Traditional tarot The Hierophant: religious figure in robes on throne, blessing gesture, spiritual teacher, sacred wisdom, vertical card"
  },
  "6": {
    name: "The Lovers", 
    prompt: "Traditional tarot The Lovers: man and woman beneath angel, divine love, choice, harmony, garden paradise, vertical card"
  },
  "7": {
    name: "The Chariot",
    prompt: "Traditional tarot The Chariot: warrior in chariot with two sphinxes, determination, victory, willpower, vertical card"
  },
  "8": {
    name: "Strength",
    prompt: "Traditional tarot Strength: woman gently closing lion's mouth, inner strength, courage, infinity symbol, vertical card"
  },
  "9": {
    name: "The Hermit",
    prompt: "Traditional tarot The Hermit: old man with lantern and staff on mountain, seeking wisdom, introspection, vertical card"
  }
};

async function generateCard(cardId: string) {
  const card = cardData[cardId];
  if (!card) {
    console.log(`❌ Card ${cardId} not found in definitions`);
    return false;
  }

  try {
    console.log(`🎨 Generating ${card.name}...`);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: card.prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard", // Faster generation
    });

    const imageUrl = response.data?.[0]?.url;
    if (!imageUrl) {
      throw new Error("No image URL returned");
    }

    console.log(`✅ Image generated for ${card.name}, downloading...`);

    const imageResponse = await fetch(imageUrl);
    const buffer = Buffer.from(await imageResponse.arrayBuffer());
    
    const filepath = path.join("public", "assets", "cards", `${cardId}.png`);
    fs.writeFileSync(filepath, buffer);
    
    console.log(`✅ ${card.name} saved successfully as ${cardId}.png`);
    return true;
    
  } catch (error) {
    console.error(`❌ Failed to generate ${card.name}:`, error);
    return false;
  }
}

// Get card ID from command line argument
const cardId = process.argv[2];
if (!cardId) {
  console.log("Usage: npx tsx quick-single-card.ts <card-id>");
  console.log("Available cards: 5, 6, 7, 8, 9");
  process.exit(1);
}

generateCard(cardId);