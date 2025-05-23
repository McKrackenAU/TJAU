/**
 * Create Authentic Fool Card
 */

import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function createAuthenticFool() {
  try {
    console.log('🎯 Creating authentic Fool card with traditional symbolism...');
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: 'Traditional tarot card The Fool: young person in colorful patchwork clothes with bindle over shoulder, stepping confidently toward cliff edge, small loyal white dog at feet, bright yellow sun above, white rose in hand, carefree joyful expression, mountains in background, symbolizing new beginnings and leap of faith, Rider-Waite tarot style, vertical card format',
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
      
      // Replace the current fool image with authentic one
      fs.writeFileSync(path.join(assetsDir, 'the-fool.png'), buffer);
      
      console.log('✅ Authentic Fool card created successfully!');
      console.log('🎯 The Fool now shows proper traditional tarot imagery');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error creating authentic Fool:', error);
    return false;
  }
}

createAuthenticFool();