/**
 * Simple Page of Cups with Clear Cup Focus
 */

import fs from 'fs';
import path from 'path';

async function createSimplePageCup(): Promise<void> {
  console.log('🏆 Creating Page of Cups with simple clear cup...');
  
  try {
    const prompt = "Young man holding large golden drinking cup chalice with both hands, ethereal purple pink lighting, tarot card art style, ultra realistic 3D, the cup is clearly visible and prominent";

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
          num_inference_steps: 40,
          guidance_scale: 7.5
        }
      }),
    });

    if (!response.ok) {
      console.error(`❌ API error: ${response.status}`);
      return;
    }

    const buffer = await response.arrayBuffer();
    
    const dir = path.join(process.cwd(), 'public', 'authentic-cards', 'minor-arcana', 'cups');
    const outputPath = path.join(dir, 'page-of-cups.png');
    fs.writeFileSync(outputPath, Buffer.from(buffer));
    
    console.log(`✨ Page of Cups with clear cup! Size: ${buffer.byteLength} bytes`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createSimplePageCup();