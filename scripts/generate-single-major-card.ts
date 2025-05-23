/**
 * Generate Single Major Arcana Card - Quick Generation
 */

import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
async function generateSingleMajorCard() {
  // Generate Wheel of Fortune - important card
  const cardData = {
    id: '10',
    name: 'Wheel of Fortune',
    prompt: 'Large mystical wheel with Hebrew letters YHVH, sphinx on top, snake descending left side, Anubis ascending right side, four winged creatures in corners reading books, golden wheel with spokes, destiny and cycles, traditional tarot art style with rich symbolic details'
  };
  
  try {
    console.log(`🎨 Creating: ${cardData.name}`);
    
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
      
      fs.writeFileSync(path.join(assetsDir, `${cardData.id}.png`), buffer);
      
      console.log(`✅ ${cardData.name} completed with beautiful authentic artwork!`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error creating ${cardData.name}:`, error);
    return false;
  }
}

generateSingleMajorCard();