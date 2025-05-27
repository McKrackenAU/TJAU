/**
 * Create Three of Cups - Ultra 3D Ethereal
 */

import fs from 'fs';
import path from 'path';

async function createThreeOfCups(): Promise<void> {
  console.log('🎉 Creating Three of Cups...');
  
  try {
    const prompt = "Ultra-photorealistic 3D Three of Cups tarot card with breathtaking ethereal quality. Three joyful ethereal figures celebrating with flowing liquid starlight hair in shimmering purple and pink tones, each holding magnificent crystalline chalices with incredible dimensional detail. Ultra-realistic skin texture with celebratory pink ethereal glow, perfectly natural facial features with realistic eyes showing pure joy and friendship. All three figures have completely natural human anatomy with graceful poses. Three beautiful chalices raised in toast with cosmic liquid starlight sparkling between them. Celebration flowers, cosmic fruits, and ethereal party elements floating around with dimensional presence. Festive cosmic garden background with layered atmospheric depth. Ultra-ethereal dreamlike whimsical quality with translucent gossamer elements dancing in 3D space. Completely original artistic interpretation. Photographic realism with magical pink purple atmosphere showing friendship and celebration.";

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
    
    const outputPath = path.join(dir, 'three-of-cups.png');
    fs.writeFileSync(outputPath, Buffer.from(buffer));
    
    console.log(`✨ Three of Cups created! Size: ${buffer.byteLength} bytes`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createThreeOfCups();