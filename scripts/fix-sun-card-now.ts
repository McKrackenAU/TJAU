/**
 * Fix The Sun Card NOW - Ultra 3D Quality
 * Creating fresh enhanced version to display properly
 */

import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user

async function fixSunCard(): Promise<boolean> {
  try {
    console.log('🎨 Creating fresh The Sun with ultra 3D lifelike depth...');
    
    const prompt = `The Sun tarot card with EXTREME photorealistic 3D depth exactly like The Fool card. A radiant cosmic sun with a joyful face rendered in complete photorealistic depth, glowing brilliantly with realistic solar textures and natural lighting effects. A beautiful child with flowing liquid starlight hair rides a magnificent white horse with photorealistic musculature and natural animal anatomy, both rendered with COMPLETE lifelike depth. The child has ultra-realistic skin texture with joyful ethereal glow, perfectly natural facial features with otherworldly innocence and cosmic joy, realistic expressions of pure happiness. Sunflowers tower around them with botanical detail and dimensional depth, their petals and stems rendered with natural plant physics. The horse has realistic fur texture, natural equine anatomy, and dimensional presence in 3D space. Golden rays of sunlight stream through the scene with realistic light physics and atmospheric effects. Background shows a cosmic garden with layered perspective stretching to infinity. Every element has natural textures and dimensional shadows. ULTRA-realistic proportions and lifelike presence throughout. Same incredible 3D dimensional realism as The Fool card. Ultra-ethereal dreamy style with musky purple and pink cosmic colors.`;

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
    console.log('📥 Downloading fresh The Sun...');
    
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      console.error('❌ Failed to download image');
      return false;
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    
    const outputDir = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana');
    const outputPath = path.join(outputDir, '19-sun.png');
    
    fs.writeFileSync(outputPath, Buffer.from(imageBuffer));
    
    console.log(`✨ Successfully created fresh The Sun with ULTRA 3D depth!`);
    console.log(`📁 Saved to: ${outputPath}`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Error:`, error);
    return false;
  }
}

async function main() {
  console.log('🌟 Creating fresh The Sun - ultra 3D lifelike quality...');
  
  const success = await fixSunCard();
  
  if (success) {
    console.log('🎉 The Sun enhanced successfully!');
    console.log('Now it should display with The Fool\'s incredible dimensional quality!');
  } else {
    console.log('❌ Enhancement failed');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});