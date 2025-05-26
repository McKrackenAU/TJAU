/**
 * OpenAI Enhanced World - Ultra 3D Lifelike Quality
 * Matching The Fool's incredible dimensional depth exactly
 */

import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user

async function enhanceWorldOpenAI(): Promise<boolean> {
  try {
    console.log('🎨 Enhancing The World with OpenAI - ultra 3D lifelike depth...');
    
    const prompt = `The World tarot card with EXTREME photorealistic 3D depth and ultra-lifelike presence exactly like The Fool card. A graceful otherworldly dancing figure with flowing liquid starlight hair floating within a cosmic laurel wreath made of liquid light and starfire, rendered with COMPLETE photorealistic depth like a real living person. Ultra-realistic skin texture with triumphant ethereal glow, perfectly natural facial features with otherworldly joy and cosmic unity, realistic eyes and natural expressions. Translucent flowing ribbons of pure energy flow from their hands with ultra-realistic fabric physics and dimensional movement. In the four corners, celestial symbols appear as ethereal beings rendered with photorealistic 3D depth - an angel of light with magnificent wings and realistic anatomy, an eagle of cosmic winds with realistic feathers and natural bird features, a lion of stellar fire with natural musculature and lifelike presence, and a bull of earth energy with dimensional form and realistic animal anatomy - all translucent and glowing with lifelike textures. The laurel wreath extends into genuine 3D space with botanical detail and dimensional shadows. The entire scene represents completion, fulfillment, and cosmic unity with realistic lighting physics. Background has soft purple and pink cosmic clouds with gentle divine light radiating everywhere, creating true atmospheric perspective stretching to infinity. ULTRA-realistic human proportions and lifelike presence. Same incredible 3D dimensional realism as The Fool card. Ultra-ethereal dreamy style with musky purple and pink cosmic colors.`;

    console.log('📡 Calling OpenAI image generation...');
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1792",
      quality: "hd",
      style: "natural"
    });

    if (!response.data || !response.data[0]?.url) {
      console.error('❌ No image URL returned');
      return false;
    }

    const imageUrl = response.data[0].url;
    console.log('📥 Downloading enhanced image...');
    
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      console.error('❌ Failed to download image');
      return false;
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    
    const outputDir = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana');
    const outputPath = path.join(outputDir, '21-world.png');
    
    fs.writeFileSync(outputPath, Buffer.from(imageBuffer));
    
    console.log(`✨ Successfully enhanced The World with ULTRA 3D depth!`);
    console.log(`📁 Saved to: ${outputPath}`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Error:`, error);
    return false;
  }
}

async function main() {
  console.log('🌟 Enhancing The World with OpenAI - ultra 3D lifelike depth...');
  
  const success = await enhanceWorldOpenAI();
  
  if (success) {
    console.log('🎉 World OpenAI enhancement completed!');
    console.log('Now it should match The Fool\'s incredible dimensional quality!');
  } else {
    console.log('❌ Enhancement failed');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});