/**
 * Generate Single Card Image - Efficient Generation
 */

import OpenAI from "openai";
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const ASSETS_DIR = path.join(process.cwd(), 'public', 'assets', 'cards');

// Get card name from command line argument
const cardName = process.argv[2];
const fileName = process.argv[3];

if (!cardName || !fileName) {
  console.error('Usage: npx tsx scripts/generate-single-card.ts "The Magician" "the-magician.png"');
  process.exit(1);
}

async function generateSingleCard() {
  try {
    console.log(`🎨 Generating ${cardName}...`);
    
    const prompt = `Create a beautiful traditional tarot card illustration for "${cardName}". 
    The image should be:
    - Classic tarot art style with mystical symbolism
    - Rich in spiritual meaning and imagery
    - Professional tarot card aesthetic
    - Detailed and visually striking
    - Portrait orientation suitable for a tarot card`;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    const imageUrl = response.data[0].url;
    if (!imageUrl) throw new Error("No image URL returned");

    // Download and save
    console.log(`📥 Downloading image...`);
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) throw new Error(`Download failed: ${imageResponse.statusText}`);
    
    const buffer = await imageResponse.arrayBuffer();
    const filepath = path.join(ASSETS_DIR, fileName);
    
    fs.writeFileSync(filepath, Buffer.from(buffer));
    console.log(`✅ Successfully saved ${fileName}`);
    
  } catch (error) {
    console.error(`❌ Failed to generate ${cardName}:`, error);
    process.exit(1);
  }
}

generateSingleCard();