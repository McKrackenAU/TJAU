/**
 * Enhance Single Card - The Moon
 * Ultra 3D depth enhancement
 */

import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function enhanceMoon(): Promise<void> {
  console.log('🌙 Creating enhanced Moon...');
  
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: "Ultra-realistic 3D The Moon tarot card with extreme photorealistic depth. Mystical full moon with serene face rendered in complete dimensional realism, glowing brilliantly with realistic lunar textures and natural lighting. Two towers of starlight standing on either side extending into genuine 3D depth with incredible architectural detail. Winding path made of liquid moonlight flowing with realistic physics through cosmic landscape with dimensional depth. Cosmic wolf and ethereal dog with flowing starlight fur howling peacefully at moon, rendered with photorealistic musculature, natural animal anatomy, and lifelike presence - fur textures and facial expressions completely realistic. Mystical crayfish made of starlight emerging from pool of cosmic water with genuine depth reflection and realistic water physics, shell and claws rendered with natural detail. Gentle dewdrops falling like liquid starlight through 3D space with realistic physics. Background with soft purple and pink cosmic clouds, layered atmospheric perspective stretching to infinity. Natural moonbeams casting dimensional shadows and realistic lighting effects throughout scene. Every element has natural textures and dimensional depth. Same incredible dimensional realism as professional photography. Ultra-ethereal style with musky purple and pink cosmic colors.",
    n: 1,
    size: "1024x1792",
    quality: "hd",
    style: "natural"
  });

  if (response.data?.[0]?.url) {
    const imageResponse = await fetch(response.data[0].url);
    const buffer = await imageResponse.arrayBuffer();
    
    const outputPath = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana', '18-moon.png');
    fs.writeFileSync(outputPath, Buffer.from(buffer));
    
    console.log(`✨ Enhanced Moon created! Size: ${buffer.byteLength} bytes`);
  }
}

enhanceMoon().catch(console.error);