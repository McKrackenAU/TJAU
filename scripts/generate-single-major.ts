/**
 * Generate Single Major Arcana Card
 */

import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateSingleMajor() {
  try {
    console.log('🎯 Creating authentic Fool card that shows proper traditional imagery...');
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: 'Traditional Rider-Waite tarot card The Fool: young androgynous person in multicolored patchwork clothing carrying bindle over shoulder, stepping confidently toward cliff edge with one foot dangling over precipice, small loyal white dog at their feet looking up adoringly, bright yellow sun shining in clear blue sky above, white rose held delicately in free hand, carefree joyful expression of innocence and new beginnings, snow-capped mountains in background, vertical tarot card format, detailed traditional symbolism',
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
      
      // Save as the-fool.png to replace current image
      fs.writeFileSync(path.join(assetsDir, 'the-fool.png'), buffer);
      
      console.log('✅ Authentic Fool card created! Now shows traditional cliff-edge imagery');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error creating Fool card:', error);
    return false;
  }
}

generateSingleMajor();