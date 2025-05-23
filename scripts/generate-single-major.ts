/**
 * Generate Single Major Arcana Card
 */

import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateSingleMajor() {
  try {
    console.log('🎨 Creating The Fool card...');
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: 'Young traveler at cliff edge with small bundle, loyal white dog companion, bright mountain landscape, new beginning adventure, traditional tarot card art style',
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
      
      fs.writeFileSync(path.join(assetsDir, '0.png'), buffer);
      
      console.log('✅ The Fool card created successfully!');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error creating The Fool:', error);
    return false;
  }
}

generateSingleMajor();