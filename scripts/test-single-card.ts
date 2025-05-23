/**
 * Test Single Card Generation - The Fool
 */

import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function testSingleCard() {
  try {
    console.log('🎨 Testing card generation with The Fool...');
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: 'Young traveler at cliff edge with small bundle, loyal white dog companion, bright mountain landscape, new beginning adventure, traditional tarot card art style, vertical composition',
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    console.log('📡 AI response received');

    if (response.data?.[0]?.url) {
      console.log('🔗 Image URL obtained');
      const imageUrl = response.data[0].url;
      
      const imageResponse = await fetch(imageUrl);
      console.log('📥 Image downloaded');
      
      const buffer = Buffer.from(await imageResponse.arrayBuffer());
      
      const assetsDir = path.join(process.cwd(), 'public', 'assets', 'cards');
      fs.mkdirSync(assetsDir, { recursive: true });
      
      fs.writeFileSync(path.join(assetsDir, '0.png'), buffer);
      
      console.log('✅ The Fool (0.png) saved successfully!');
      console.log('🎉 Card generation test complete!');
      return true;
    } else {
      console.log('❌ No image URL in response');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
    return false;
  }
}

testSingleCard();