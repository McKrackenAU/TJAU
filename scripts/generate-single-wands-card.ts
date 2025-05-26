/**
 * Generate Single Wands Card - Ultra 3D Quality
 * Starting with Ace of Wands to match The Fool's incredible depth
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

async function generateAceOfWands(): Promise<boolean> {
  try {
    console.log('🎨 Generating Ace of Wands with ultra 3D lifelike depth...');
    
    const prompt = `Ace of Wands tarot card with EXTREME photorealistic 3D depth exactly like The Fool card. A single magnificent cosmic wand floating in 3D space with ultra-realistic wood grain texture and dimensional carved details, emerging from a celestial cloud with realistic vapor physics. The wand glows with inner fire and starlight, rendered with natural lighting effects and genuine shadows. Sprouting leaves of liquid light grow from the wand with botanical detail and dimensional depth. A ethereal hand made of starlight reaches from cosmic clouds to grasp the wand, rendered with photorealistic skin texture and natural anatomy. Background shows a mystical landscape with layered atmospheric perspective stretching to infinity, soft purple and pink cosmic clouds with gentle divine light. The wand has realistic weight and presence in 3D space. ULTRA-realistic proportions and lifelike textures throughout. Same incredible 3D dimensional realism as The Fool card. Ultra-ethereal dreamy style with musky purple and pink cosmic colors.`;

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
    console.log('📥 Downloading Ace of Wands...');
    
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      console.error('❌ Failed to download image');
      return false;
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    
    const outputDir = path.join(process.cwd(), 'public', 'authentic-cards', 'minor-arcana', 'wands');
    ensureDirectoryExists(outputDir);
    const outputPath = path.join(outputDir, 'ace-of-wands.png');
    
    fs.writeFileSync(outputPath, Buffer.from(imageBuffer));
    
    console.log(`✨ Successfully generated Ace of Wands with ULTRA 3D depth!`);
    console.log(`📁 Saved to: ${outputPath}`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Error:`, error);
    return false;
  }
}

async function main() {
  console.log('🌟 Generating Ace of Wands - ultra 3D lifelike quality...');
  
  const success = await generateAceOfWands();
  
  if (success) {
    console.log('🎉 Ace of Wands generated successfully!');
    console.log('Now it has The Fool\'s incredible dimensional quality!');
  } else {
    console.log('❌ Generation failed');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});