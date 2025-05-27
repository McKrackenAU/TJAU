/**
 * Queen of Cups with Gigantic Chalice Focus
 */

import fs from 'fs';
import path from 'path';

async function createQueenWithChalice(): Promise<void> {
  console.log('👑 Creating Queen of Cups with GIGANTIC chalice...');
  
  try {
    const prompt = "Ultra-photorealistic 3D Queen of Cups tarot card. Female queen sitting on throne, cradling a GIGANTIC ORNATE GOLDEN CHALICE in her lap with both hands - this chalice should be the centerpiece of the entire image. The chalice should be enormous, incredibly detailed, and clearly the main subject. Flowing ethereal hair in purple and pink tones. Her throne should be decorated with multiple cups and chalices. The main chalice should glow with mystical energy and be impossible to ignore. Translucent robes and crown in purple and pink. Ultra-ethereal dreamlike quality with photographic realism. Water lilies background.";

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
    const outputPath = path.join(dir, 'queen-of-cups.png');
    fs.writeFileSync(outputPath, Buffer.from(buffer));
    
    console.log(`✨ Queen of Cups created with GIGANTIC chalice! Size: ${buffer.byteLength} bytes`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createQueenWithChalice();