/**
 * Create Two of Cups - Ultra 3D Ethereal
 */

import fs from 'fs';
import path from 'path';

async function createTwoOfCups(): Promise<void> {
  console.log('💕 Creating Two of Cups...');
  
  try {
    const prompt = "Ultra-photorealistic 3D Two of Cups tarot card with breathtaking ethereal quality. Two beautiful crystalline chalices with incredible dimensional detail, held by ethereal male and female figures with flowing liquid starlight hair in shimmering purple and pink tones. Ultra-realistic skin texture with loving pink ethereal glow, perfectly natural facial features with realistic eyes showing profound connection and love. Both figures have completely natural human anatomy. Cosmic caduceus with ethereal wings floating above with dimensional presence. Both cups contain cosmic liquid starlight flowing between them in magical stream. Romantic cosmic garden background with layered atmospheric depth. Ultra-ethereal dreamlike whimsical quality with translucent gossamer elements floating in 3D space. Completely original artistic interpretation. Photographic realism with magical pink purple atmosphere showing partnership and love.";

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
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    const outputPath = path.join(dir, 'two-of-cups.png');
    fs.writeFileSync(outputPath, Buffer.from(buffer));
    
    console.log(`✨ Two of Cups created! Size: ${buffer.byteLength} bytes`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createTwoOfCups();