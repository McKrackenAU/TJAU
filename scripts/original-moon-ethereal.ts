/**
 * Original Moon - Commercially Reusable
 * Ethereal 3D lifelike quality with pink purple palette
 */

import fs from 'fs';
import path from 'path';

async function createOriginalMoon(): Promise<void> {
  console.log('🌙 Creating original Moon card...');
  
  try {
    const prompt = "Ultra-photorealistic 3D original The Moon tarot card design, completely unique and commercially reusable. Large cosmic moon with realistic crater details and ethereal pink and purple glow, rendered with complete dimensional depth. Two mystical towers extending into genuine 3D depth with incredible architectural detail in musky purple and pink crystal formations. Ethereal wolf and cosmic dog howling with realistic animal anatomy and natural fur texture in shimmering purple and pink tones. Mystical crayfish emerging from cosmic waters with realistic detail and ethereal glow. Winding path extending into infinite distance with layered atmospheric perspective in soft purple and pink lighting. Ultra-realistic water reflections showing moon's ethereal light in purple and pink cosmic colors. Dewdrops catching starlight throughout the mystical landscape. Ultra-ethereal dreamlike whimsical quality with translucent gossamer elements. Completely original artistic interpretation with no copyrighted elements. Photographic realism with magical pink purple atmosphere showing mystery and intuition.";

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
    const outputPath = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana', '18-moon.png');
    fs.writeFileSync(outputPath, Buffer.from(buffer));
    
    console.log(`✨ Original Moon created! Size: ${buffer.byteLength} bytes`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createOriginalMoon();