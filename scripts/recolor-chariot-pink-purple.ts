/**
 * Recolor Chariot with Pink Purple Palette
 * Matching the musky pink and purple ethereal style
 */

import fs from 'fs';
import path from 'path';

async function recolorChariot(): Promise<void> {
  console.log('🏇 Recoloring Chariot with pink purple palette...');
  
  try {
    const prompt = "Ultra-photorealistic 3D The Chariot tarot card with breathtaking lifelike quality in musky pink and purple color palette. Victorious otherworldly charioteer with incredibly realistic human features, natural skin texture with subtle pink ethereal glow, flowing liquid starlight hair in shimmering purple and pink tones. His eyes are deeply realistic showing profound determination and confidence. Translucent ethereal armor and robes flowing in rich musky purple and soft pink aurora tones with gossamer fabric physics, metallic surfaces reflecting pink and purple starlight. He stands in a crystalline chariot with incredible pink and purple crystal formations and light refraction. Two cosmic sphinxes pulling the chariot with completely realistic anatomy - one sphinx in deep purple tones, one sphinx in soft pink tones, both with natural fur texture and lifelike expressions. Stars crown his head with dimensional pink and purple starlight casting ethereal shadows. Cosmic battlefield background bathed in soft purple and pink cosmic lighting with infinite atmospheric depth. Ultra-ethereal dreamlike quality with translucent gossamer elements all rendered in the signature musky pink and purple color palette. Photographic realism with magical pink purple atmosphere.";

    const response = await fetch("https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0", {
      headers: {
        Authorization: `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          width: 512,
          height: 768,
          num_inference_steps: 50,
          guidance_scale: 8.0
        }
      }),
    });

    if (!response.ok) {
      console.error(`❌ API error: ${response.status}`);
      return;
    }

    const buffer = await response.arrayBuffer();
    const outputPath = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana', '07-chariot.png');
    fs.writeFileSync(outputPath, Buffer.from(buffer));
    
    console.log(`✨ Chariot recolored! Size: ${buffer.byteLength} bytes`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

recolorChariot();