/**
 * OpenAI Enhanced Moon - Ultra 3D Lifelike Quality
 * Matching The Fool's incredible dimensional depth exactly
 */

import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user

async function enhanceMoonOpenAI(): Promise<boolean> {
  try {
    console.log('🎨 Enhancing The Moon with OpenAI - ultra 3D lifelike depth...');
    
    const prompt = `The Moon tarot card with EXTREME photorealistic 3D depth and ultra-lifelike presence exactly like The Fool card. A mystical full moon with a serene face rendered in complete photorealistic depth, glowing brilliantly in the cosmic sky with realistic lunar textures and natural lighting. Two towers of starlight stand on either side extending into genuine 3D depth with incredible architectural detail. A winding path made of liquid moonlight flows with realistic physics through the cosmic landscape with dimensional depth. A cosmic wolf and ethereal dog with flowing liquid starlight fur howl peacefully at the moon, rendered with photorealistic musculature, natural animal anatomy, and lifelike presence - their fur textures and facial expressions completely realistic. A mystical crayfish made of starlight emerges from a pool of cosmic water with genuine depth reflection and realistic water physics, its shell and claws rendered with natural detail. Gentle dewdrops fall like liquid starlight through 3D space with realistic physics. Background has soft purple and pink cosmic clouds with layered atmospheric perspective stretching to infinity. Natural moonbeams cast dimensional shadows and realistic lighting effects throughout the scene. Every element has natural textures and dimensional depth. ULTRA-realistic proportions and lifelike presence throughout. Same incredible 3D dimensional realism as The Fool card. Ultra-ethereal dreamy style with musky purple and pink cosmic colors.`;

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
    const outputPath = path.join(outputDir, '18-moon.png');
    
    fs.writeFileSync(outputPath, Buffer.from(imageBuffer));
    
    console.log(`✨ Successfully enhanced The Moon with ULTRA 3D depth!`);
    console.log(`📁 Saved to: ${outputPath}`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Error:`, error);
    return false;
  }
}

async function main() {
  console.log('🌟 Enhancing The Moon with OpenAI - ultra 3D lifelike depth...');
  
  const success = await enhanceMoonOpenAI();
  
  if (success) {
    console.log('🎉 Moon OpenAI enhancement completed!');
    console.log('🎊 ALL REQUESTED CARDS ENHANCED WITH ULTRA 3D DEPTH!');
  } else {
    console.log('❌ Enhancement failed');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});