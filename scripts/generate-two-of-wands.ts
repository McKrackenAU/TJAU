/**
 * Generate Two of Wands - Ultra 3D Quality
 * Matching The Fool's incredible dimensional depth
 */

import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user

function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function generateTwoOfWands(): Promise<boolean> {
  try {
    console.log('🎨 Generating Two of Wands with ultra 3D lifelike depth...');
    
    const prompt = `Two of Wands tarot card with EXTREME photorealistic 3D depth exactly like The Fool card. A majestic otherworldly figure with flowing liquid starlight hair standing on a castle balcony with incredible architectural detail and dimensional stonework, rendered with COMPLETE photorealistic depth like a real living person. Ultra-realistic skin texture with visionary ethereal glow, perfectly natural facial features with otherworldly determination and planning wisdom, realistic eyes gazing into the distance with contemplative expression. He holds a crystalline globe showing swirling galaxies with realistic sphere physics and dimensional reflections, while one cosmic wand leans against the wall with ultra-realistic wood texture and carved details. His robes flow with natural fabric physics in musky purple and pink aurora tones. The castle extends into genuine 3D depth with realistic perspective and shadows. Background shows vast cosmic landscapes with layered atmospheric depth stretching to infinity. The globe reflects light naturally with realistic crystal physics. Every stone in the castle has natural texture and dimensional detail. ULTRA-realistic human proportions and lifelike presence. Same incredible 3D dimensional realism as The Fool card. Ultra-ethereal dreamy style with musky purple and pink cosmic colors.`;

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
    console.log('📥 Downloading Two of Wands...');
    
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      console.error('❌ Failed to download image');
      return false;
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    
    const outputDir = path.join(process.cwd(), 'public', 'authentic-cards', 'minor-arcana', 'wands');
    ensureDirectoryExists(outputDir);
    const outputPath = path.join(outputDir, 'two-of-wands.png');
    
    fs.writeFileSync(outputPath, Buffer.from(imageBuffer));
    
    console.log(`✨ Successfully generated Two of Wands with ULTRA 3D depth!`);
    console.log(`📁 Saved to: ${outputPath}`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Error:`, error);
    return false;
  }
}

async function main() {
  console.log('🌟 Generating Two of Wands - ultra 3D lifelike quality...');
  
  const success = await generateTwoOfWands();
  
  if (success) {
    console.log('🎉 Two of Wands generated successfully!');
    console.log('Planning and vision card with The Fool\'s dimensional quality!');
  } else {
    console.log('❌ Generation failed');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});