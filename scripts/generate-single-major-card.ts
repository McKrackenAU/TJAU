/**
 * Generate Single Major Arcana Card - Quick Generation
 */

import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
async function generateSingleMajorCard() {
  try {
    // Generate The Fool card first
    const cardId = '0';
    const cardName = 'The Fool';
    
    console.log(`Generating: ${cardName}`);
    
    const prompt = 'A young person stepping off a cliff edge with a small bag and walking stick, white dog companion beside them, bright yellow sky with sun, snow-capped mountains in distance, symbolizing new beginnings and adventure, beautiful tarot card art style with rich colors and mystical atmosphere';
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    if (response.data?.[0]?.url) {
      const imageUrl = response.data[0].url;
      const imageResponse = await fetch(imageUrl);
      const arrayBuffer = await imageResponse.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const assetsDir = path.join(process.cwd(), 'public', 'assets', 'cards');
      if (!fs.existsSync(assetsDir)) {
        fs.mkdirSync(assetsDir, { recursive: true });
      }
      
      const filename = path.join(assetsDir, `${cardId}.png`);
      fs.writeFileSync(filename, buffer);
      
      console.log(`✅ Successfully generated: ${cardName} -> ${cardId}.png`);
      console.log(`File saved to: ${filename}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error generating The Fool:`, error);
    return false;
  }
}

generateSingleMajorCard();