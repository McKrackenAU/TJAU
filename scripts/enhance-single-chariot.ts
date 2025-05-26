/**
 * Enhance Single Card - The Chariot
 * Ultra 3D depth enhancement
 */

import fs from 'fs';
import path from 'path';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function enhanceChariot(): Promise<void> {
  console.log('🏇 Creating enhanced Chariot...');
  
  const response = await openai.images.generate({
    model: "dall-e-3",
    prompt: "Ultra-realistic 3D The Chariot tarot card with extreme photorealistic depth. Victorious charioteer with flowing starlight hair rendered with complete lifelike depth. Ultra-realistic skin texture with triumphant ethereal glow, natural facial features with otherworldly determination and confidence. Translucent flowing armor and robes in musky purple and pink aurora tones with realistic fabric physics and metallic gleam. Standing in crystalline chariot extending into genuine 3D depth with incredible architectural detail and dimensional craftsmanship. Two cosmic sphinxes, one black one white, pulling chariot with realistic musculature, natural animal anatomy, and dimensional depth - fur and features rendered with lifelike detail. Stars crowning head with dimensional light and realistic shadows. Background with cosmic battlefield, layered elements stretching to infinity with true atmospheric perspective. Chariot wheels with realistic spokes and dimensional detail. Every surface reflects light naturally with realistic physics. Same incredible dimensional realism as professional photography. Ultra-ethereal style with musky purple and pink cosmic colors.",
    n: 1,
    size: "1024x1792",
    quality: "hd",
    style: "natural"
  });

  if (response.data?.[0]?.url) {
    const imageResponse = await fetch(response.data[0].url);
    const buffer = await imageResponse.arrayBuffer();
    
    const outputPath = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana', '07-chariot.png');
    fs.writeFileSync(outputPath, Buffer.from(buffer));
    
    console.log(`✨ Enhanced Chariot created! Size: ${buffer.byteLength} bytes`);
  }
}

enhanceChariot().catch(console.error);