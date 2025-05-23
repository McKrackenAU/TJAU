/**
 * Generate Single Card Image - Efficient Generation
 */

import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
async function generateSingleCard() {
  // Generate The Fool first - most important card
  const cardData = {
    id: '0',
    name: 'The Fool',
    prompt: 'A young person in colorful clothes stepping off a cliff edge with a small bag on a stick, a white dog companion at their feet, bright yellow sky with sun, snow-capped mountains in distance, symbolizing new beginnings and adventure, beautiful traditional tarot card art style with rich symbolic details'
  };
  
  try {
    console.log(`🎨 Creating beautiful artwork for: ${cardData.name}`);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: cardData.prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    if (response.data?.[0]?.url) {
      const imageUrl = response.data[0].url;
      const imageResponse = await fetch(imageUrl);
      const buffer = Buffer.from(await imageResponse.arrayBuffer());
      
      const assetsDir = path.join(process.cwd(), 'public', 'assets', 'cards');
      fs.mkdirSync(assetsDir, { recursive: true });
      
      const filename = path.join(assetsDir, `${cardData.id}.png`);
      fs.writeFileSync(filename, buffer);
      
      console.log(`✅ Successfully created: ${cardData.name}`);
      console.log(`🎯 Beautiful artwork saved to: ${filename}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error creating ${cardData.name}:`, error);
    return false;
  }
}

generateSingleCard();