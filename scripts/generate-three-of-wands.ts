/**
 * Generate Three of Wands - Ultra 3D Quality
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

async function generateThreeOfWands(): Promise<boolean> {
  try {
    console.log('🎨 Generating Three of Wands with ultra 3D lifelike depth...');
    
    const prompt = `Three of Wands tarot card with EXTREME photorealistic 3D depth exactly like The Fool card. A confident otherworldly merchant with flowing liquid starlight hair standing on a cliff overlooking cosmic trade routes, rendered with COMPLETE photorealistic depth like a real living person. Ultra-realistic skin texture with ambitious ethereal glow, perfectly natural facial features with otherworldly foresight and expansion vision, realistic eyes scanning the horizon with forward-thinking expression. Three cosmic wands planted in the ground with ultra-realistic wood grain texture and dimensional shadows, extending into genuine 3D space with natural weight and presence. His robes billow naturally in cosmic wind with realistic fabric physics in musky purple and pink tones. Ships of starlight sail across dimensional waters with realistic perspective and atmospheric depth. The cliff face has natural rock texture and geological detail extending into 3D space with realistic erosion patterns. Background shows infinite cosmic trade routes with layered atmospheric perspective stretching to infinity. Each ship has dimensional detail and realistic sailing physics. The wands cast natural shadows on the ground with realistic lighting effects. ULTRA-realistic human proportions and lifelike presence. Same incredible 3D dimensional realism as The Fool card. Ultra-ethereal dreamy style with musky purple and pink cosmic colors.`;

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
    console.log('📥 Downloading Three of Wands...');
    
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      console.error('❌ Failed to download image');
      return false;
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    
    const outputDir = path.join(process.cwd(), 'public', 'authentic-cards', 'minor-arcana', 'wands');
    ensureDirectoryExists(outputDir);
    const outputPath = path.join(outputDir, 'three-of-wands.png');
    
    fs.writeFileSync(outputPath, Buffer.from(imageBuffer));
    
    console.log(`✨ Successfully generated Three of Wands with ULTRA 3D depth!`);
    console.log(`📁 Saved to: ${outputPath}`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Error:`, error);
    return false;
  }
}

async function main() {
  console.log('🌟 Generating Three of Wands - ultra 3D lifelike quality...');
  
  const success = await generateThreeOfWands();
  
  if (success) {
    console.log('🎉 Three of Wands generated successfully!');
    console.log('Expansion and foresight card with The Fool\'s dimensional quality!');
  } else {
    console.log('❌ Generation failed');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});