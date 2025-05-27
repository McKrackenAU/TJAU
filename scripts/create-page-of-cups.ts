/**
 * Create Page of Cups - Young Male Figure
 */

import fs from 'fs';
import path from 'path';

async function createPageOfCups(): Promise<void> {
  console.log('👨 Creating Page of Cups...');
  
  try {
    const prompt = "Ultra-photorealistic 3D Page of Cups tarot card with breathtaking ethereal quality. Young ethereal male figure with flowing liquid starlight hair in shimmering purple and pink tones, rendered with complete lifelike depth. Ultra-realistic skin texture with youthful pink ethereal glow, perfectly natural masculine facial features with realistic eyes showing wonder and creativity. He holds a magnificent crystalline chalice with incredible dimensional detail, from which emerges a mystical fish with ethereal glow. Translucent flowing robes in rich musky purple and pink aurora tones with gossamer fabric physics. Cosmic ocean background with gentle waves and atmospheric depth. Ultra-ethereal dreamlike whimsical quality with translucent gossamer elements floating around. Completely original artistic interpretation. Photographic realism with magical pink purple atmosphere showing youth and intuitive messages.";

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
    
    const outputPath = path.join(dir, 'page-of-cups.png');
    fs.writeFileSync(outputPath, Buffer.from(buffer));
    
    console.log(`✨ Page of Cups created! Size: ${buffer.byteLength} bytes`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createPageOfCups();