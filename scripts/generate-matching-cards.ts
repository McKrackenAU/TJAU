/**
 * Generate Missing Cards with Matching Ethereal Style
 * Uses existing card quality as reference for perfect consistency
 */

import OpenAI from "openai";
import fs from "fs";
import path from "path";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

interface CardToGenerate {
  id: string;
  name: string;
  suit?: string;
  number?: number;
  directory: string;
  filename: string;
  prompt: string;
}

// Missing cards that need to be generated
const missingCards: CardToGenerate[] = [
  {
    id: "c3",
    name: "Three of Cups",
    suit: "cups",
    number: 3,
    directory: "public/authentic-cards/minor-arcana/cups",
    filename: "three-of-cups.png",
    prompt: "Three ornate golden chalices floating in ethereal space, emanating liquid starlight and cosmic energy. Ultra-ethereal 3D style with translucent, dreamlike qualities. Musky pink and purple color palette with celestial lighting. Three figures with flowing liquid starlight hair celebrating friendship and joy. Soft dimensional depth with gentle glowing effects and translucent textures. Professional tarot card artwork."
  },
  {
    id: "c4",
    name: "Four of Cups",
    suit: "cups",
    number: 4,
    directory: "public/authentic-cards/minor-arcana/cups",
    filename: "four-of-cups.png",
    prompt: "Four mystical chalices arranged in ethereal formation, one offered by a cosmic hand emerging from clouds. Ultra-ethereal 3D style with translucent, dreamlike qualities. Musky pink and purple color palette. Figure with liquid starlight hair in contemplative meditation pose. Soft dimensional depth with gentle glowing effects and translucent textures. Professional tarot card artwork."
  },
  // Add more missing cards as needed
];

function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function generateCardImage(card: CardToGenerate): Promise<boolean> {
  try {
    console.log(`🎨 Generating ${card.name}...`);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: card.prompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
      style: "vivid"
    });

    if (!response.data[0]?.url) {
      console.error(`❌ No image URL received for ${card.name}`);
      return false;
    }

    // Download the image
    const imageResponse = await fetch(response.data[0].url);
    if (!imageResponse.ok) {
      console.error(`❌ Failed to download image for ${card.name}`);
      return false;
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(imageBuffer);

    // Ensure directory exists
    ensureDirectoryExists(card.directory);

    // Save the image
    const fullPath = path.join(card.directory, card.filename);
    fs.writeFileSync(fullPath, buffer);

    console.log(`✅ Generated ${card.name} -> ${fullPath}`);
    return true;

  } catch (error) {
    console.error(`❌ Error generating ${card.name}:`, error);
    return false;
  }
}

async function generateMissingCards() {
  console.log("🌟 Starting ethereal card generation...");
  
  let successCount = 0;
  let totalCount = missingCards.length;

  for (const card of missingCards) {
    const success = await generateCardImage(card);
    if (success) {
      successCount++;
    }
    
    // Wait between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }

  console.log(`\n✨ Generation complete: ${successCount}/${totalCount} cards created`);
  
  if (successCount < totalCount) {
    console.log("❌ Some cards failed to generate. Check the logs above for details.");
  }
}

// Run the generation
generateMissingCards().catch(console.error);