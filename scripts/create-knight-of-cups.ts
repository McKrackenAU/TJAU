/**
 * Create Knight of Cups - Male Knight Figure
 */

import fs from 'fs';
import path from 'path';

async function createKnightOfCups(): Promise<void> {
  console.log('🏇 Creating Knight of Cups...');
  
  try {
    const prompt = "Ultra-photorealistic 3D Knight of Cups tarot card with breathtaking ethereal quality. Romantic male knight with flowing liquid starlight hair in shimmering purple and pink tones, rendered with complete lifelike depth. Ultra-realistic skin texture with chivalrous pink ethereal glow, perfectly natural masculine facial features with realistic eyes showing passion and romance. He rides a majestic white horse with realistic equine anatomy and flowing mane, holding a magnificent crystalline chalice with incredible dimensional detail. Translucent flowing armor and cape in rich musky purple and pink aurora tones with gossamer fabric physics. The horse moves gracefully through cosmic waters with realistic splash effects. River landscape with ethereal mountains extending into atmospheric depth. Ultra-ethereal dreamlike whimsical quality with translucent gossamer elements flowing around. Completely original artistic interpretation. Photographic realism with magical pink purple atmosphere showing romantic quest and emotional journey.";

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
    
    const outputPath = path.join(dir, 'knight-of-cups.png');
    fs.writeFileSync(outputPath, Buffer.from(buffer));
    
    console.log(`✨ Knight of Cups created! Size: ${buffer.byteLength} bytes`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createKnightOfCups();