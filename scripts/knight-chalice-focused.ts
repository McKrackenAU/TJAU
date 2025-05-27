/**
 * Knight of Cups with Massive Chalice Focus
 */

import fs from 'fs';
import path from 'path';

async function createKnightWithChalice(): Promise<void> {
  console.log('🏇 Creating Knight of Cups with MASSIVE chalice...');
  
  try {
    const prompt = "Ultra-photorealistic 3D Knight of Cups tarot card. Male knight on white horse, raising a MASSIVE ORNATE GOLDEN CHALICE high above his head as the central focal point of the entire image. The chalice should dominate the composition - enormous, detailed, and clearly the main subject. Flowing ethereal hair in purple and pink tones. Multiple cups and chalices attached to his armor and horse's bridle. The raised chalice should be impossible to miss - make it the largest element in the image. Translucent armor in purple and pink. Ultra-ethereal dreamlike quality with photographic realism. River background.";

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
          guidance_scale: 8.5,
          negative_prompt: "no cups, no chalices, empty hands, sword, wand"
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
    
    console.log(`✨ Knight of Cups created with MASSIVE chalice! Size: ${buffer.byteLength} bytes`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createKnightWithChalice();