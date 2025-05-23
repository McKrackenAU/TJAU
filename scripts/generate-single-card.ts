/**
 * Generate Single Card Image - Efficient Generation
 */

import OpenAI from "openai";
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const ASSETS_DIR = path.join(process.cwd(), 'public', 'assets', 'cards');

async function generateSingleCard() {
  try {
    const cardName = "The Magician";
    const fileName = "the-magician.png";
    
    console.log(`🎨 Creating ${cardName}...`);
    
    const prompt = `Create a beautiful traditional tarot card illustration of "${cardName}". The image should clearly show the specific character, symbols, and imagery associated with ${cardName} in classic tarot tradition. Style: mystical tarot art, rich colors, professional card design that clearly depicts the name "${cardName}".`;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    const imageUrl = response.data?.[0]?.url;
    if (!imageUrl) throw new Error("No image URL returned");

    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) throw new Error(`Download failed`);
    
    const buffer = await imageResponse.arrayBuffer();
    fs.writeFileSync(path.join(ASSETS_DIR, fileName), Buffer.from(buffer));
    console.log(`✅ Saved ${fileName}`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Failed:`, error);
    return false;
  }
}

generateSingleCard();