/**
 * Immediate Sun Card Fix - Direct Generation
 * Creating fresh enhanced version right now
 */

import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function fixSunNow(): Promise<void> {
  console.log('🌟 Creating enhanced Sun card...');
  
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: "The Sun tarot card with EXTREME photorealistic 3D depth exactly like The Fool card. A radiant cosmic sun with a joyful face rendered in complete photorealistic depth, glowing brilliantly with realistic solar textures and natural lighting effects. A beautiful child with flowing liquid starlight hair rides a magnificent white horse with photorealistic musculature and natural animal anatomy, both rendered with COMPLETE lifelike depth. Ultra-realistic skin texture with joyful ethereal glow, perfectly natural facial features with otherworldly innocence and cosmic joy. Sunflowers tower around them with botanical detail and dimensional depth. Golden rays of sunlight stream through the scene with realistic light physics. Background shows a cosmic garden with layered perspective stretching to infinity. Same incredible 3D dimensional realism as The Fool card. Ultra-ethereal dreamy style with musky purple and pink cosmic colors.",
      n: 1,
      size: "1024x1792",
      quality: "hd",
      style: "natural"
    });

    if (response.data?.[0]?.url) {
      const imageResponse = await fetch(response.data[0].url);
      const buffer = await imageResponse.arrayBuffer();
      
      const outputPath = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana', '19-sun.png');
      fs.writeFileSync(outputPath, Buffer.from(buffer));
      
      console.log('✨ Enhanced Sun card created successfully!');
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

fixSunNow();