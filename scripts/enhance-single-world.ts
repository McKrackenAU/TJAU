/**
 * Enhance Single Card - The World
 * Ultra 3D depth enhancement
 */

import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function enhanceWorld(): Promise<void> {
  console.log('🌍 Creating enhanced World...');
  
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: "Ultra-realistic 3D The World tarot card with extreme photorealistic depth. Graceful dancing figure with flowing starlight hair floating within cosmic laurel wreath made of liquid light, rendered with complete lifelike depth. Ultra-realistic skin texture with triumphant ethereal glow, natural facial features with cosmic joy and unity. Translucent flowing ribbons of pure energy with realistic fabric physics and dimensional movement. In four corners, celestial symbols as ethereal beings with photorealistic 3D depth - angel with magnificent wings, eagle with realistic feathers, lion with natural musculature, bull with dimensional form - all translucent and glowing. Laurel wreath extending into genuine 3D space with botanical detail and dimensional shadows. Scene represents completion and cosmic unity with realistic lighting physics. Background with soft purple and pink cosmic clouds, gentle divine light, true atmospheric perspective stretching to infinity. Same incredible dimensional realism as professional photography. Ultra-ethereal style with musky purple and pink cosmic colors.",
    n: 1,
    size: "1024x1792",
    quality: "hd",
    style: "natural"
  });

  if (response.data?.[0]?.url) {
    const imageResponse = await fetch(response.data[0].url);
    const buffer = await imageResponse.arrayBuffer();
    
    const outputPath = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana', '21-world.png');
    fs.writeFileSync(outputPath, Buffer.from(buffer));
    
    console.log(`✨ Enhanced World created! Size: ${buffer.byteLength} bytes`);
  }
}

enhanceWorld().catch(console.error);