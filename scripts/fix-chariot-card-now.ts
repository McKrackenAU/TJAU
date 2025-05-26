/**
 * Fix The Chariot Card NOW - Ultra 3D Quality
 * Creating fresh enhanced version to display properly
 */

import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user

async function fixChariotCard(): Promise<boolean> {
  try {
    console.log('🎨 Creating fresh The Chariot with ultra 3D lifelike depth...');
    
    const prompt = `The Chariot tarot card with EXTREME photorealistic 3D depth exactly like The Fool card. A victorious otherworldly charioteer with flowing liquid starlight hair, rendered with COMPLETE photorealistic depth like a real living person. Ultra-realistic skin texture with triumphant ethereal glow, perfectly natural facial features with otherworldly determination and confidence, realistic eyes and natural expressions. Translucent flowing armor and robes in musky purple and pink aurora tones with ultra-realistic fabric physics and metallic gleam. He stands in a crystalline chariot that extends into genuine 3D depth with incredible architectural detail and dimensional craftsmanship. Two cosmic sphinxes, one black one white, pull the chariot with realistic musculature, natural animal anatomy, and dimensional depth - their fur and features rendered with lifelike detail. Stars crown his head with dimensional light and realistic shadows. Background has cosmic battlefield with layered elements stretching to infinity with true atmospheric perspective. The chariot wheels have realistic spokes and dimensional detail. Every surface reflects light naturally with realistic physics. ULTRA-realistic human proportions and lifelike presence. Same incredible 3D dimensional realism as The Fool card. Ultra-ethereal dreamy style with musky purple and pink cosmic colors.`;

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
    console.log('📥 Downloading fresh The Chariot...');
    
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      console.error('❌ Failed to download image');
      return false;
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    
    const outputDir = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana');
    const outputPath = path.join(outputDir, '07-chariot.png');
    
    fs.writeFileSync(outputPath, Buffer.from(imageBuffer));
    
    console.log(`✨ Successfully created fresh The Chariot with ULTRA 3D depth!`);
    console.log(`📁 Saved to: ${outputPath}`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Error:`, error);
    return false;
  }
}

async function main() {
  console.log('🌟 Creating fresh The Chariot - ultra 3D lifelike quality...');
  
  const success = await fixChariotCard();
  
  if (success) {
    console.log('🎉 The Chariot enhanced successfully!');
    console.log('Victory and determination with The Fool\'s dimensional quality!');
  } else {
    console.log('❌ Enhancement failed');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});