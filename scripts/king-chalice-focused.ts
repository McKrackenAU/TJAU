/**
 * King of Cups with Colossal Chalice Focus
 */

import fs from 'fs';
import path from 'path';

async function createKingWithChalice(): Promise<void> {
  console.log('👑 Creating King of Cups with COLOSSAL chalice...');
  
  try {
    const prompt = "Ultra-photorealistic 3D King of Cups tarot card. Mature male king with beard sitting on throne, holding a COLOSSAL ORNATE GOLDEN CHALICE in front of his chest with both hands - this chalice should be the dominant feature of the entire image. The chalice should be massive, incredibly detailed, and the clear focal point. Flowing ethereal hair and beard in purple and pink tones. His throne decorated with cups and chalices. The main chalice should overflow with cosmic energy and be the largest visual element. Translucent royal robes and crown in purple and pink. Ultra-ethereal dreamlike quality with photographic realism. Ocean background with ship.";

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
    const outputPath = path.join(dir, 'king-of-cups.png');
    fs.writeFileSync(outputPath, Buffer.from(buffer));
    
    console.log(`✨ King of Cups created with COLOSSAL chalice! Size: ${buffer.byteLength} bytes`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createKingWithChalice();