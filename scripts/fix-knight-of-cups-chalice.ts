/**
 * Fix Knight of Cups with Proper Chalice Symbolism
 */

import fs from 'fs';
import path from 'path';

async function fixKnightOfCups(): Promise<void> {
  console.log('🏇 Creating Knight of Cups with chalice symbolism...');
  
  try {
    const prompt = "Ultra-photorealistic 3D Knight of Cups tarot card with breathtaking ethereal quality. Romantic male knight with flowing liquid starlight hair in shimmering purple and pink tones, riding white horse while prominently holding a large ornate chalice high in the air with incredible dimensional detail. Ultra-realistic skin texture with chivalrous pink ethereal glow, perfectly natural masculine facial features. The chalice glows with cosmic liquid starlight and mystical energy flowing from it, showing clear cup symbolism. Translucent flowing armor and cape in rich musky purple and pink aurora tones. Additional cups and chalices decorating his armor and horse's bridle with dimensional presence. River landscape with ethereal mountains. Ultra-ethereal dreamlike whimsical quality. Completely original artistic interpretation. Photographic realism with magical pink purple atmosphere.";

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
    
    const dir = path.join(process.cwd(), 'public', 'authentic-cards', 'minor-arcana', 'cups');
    const outputPath = path.join(dir, 'knight-of-cups.png');
    fs.writeFileSync(outputPath, Buffer.from(buffer));
    
    console.log(`✨ Knight of Cups created with chalice! Size: ${buffer.byteLength} bytes`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixKnightOfCups();