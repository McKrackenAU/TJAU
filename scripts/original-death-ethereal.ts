/**
 * Original Death - Commercially Reusable
 * Ethereal 3D lifelike quality with pink purple palette
 */

import fs from 'fs';
import path from 'path';

async function createOriginalDeath(): Promise<void> {
  console.log('💀 Creating original Death card...');
  
  try {
    const prompt = "Ultra-photorealistic 3D original Death tarot card design, completely unique and commercially reusable. Ethereal skeletal figure in flowing translucent robes with liquid starlight essence, rendered with complete lifelike depth. Ultra-realistic bone texture with peaceful pink ethereal glow, perfectly natural anatomical structure with otherworldly serenity. Majestic white horse with realistic musculature, flowing mane in shimmering purple and pink tones, and gentle expression showing transformation not fear. Translucent death banner flowing with gossamer fabric physics in rich musky purple and pink aurora tones. River of cosmic energy with pink and purple reflections extending into genuine 3D depth. Sunrise of transformation in the background with soft purple and pink cosmic lighting, layered atmospheric perspective stretching to infinity. Fallen figures peacefully transitioning with ethereal pink glow. Ultra-ethereal dreamlike whimsical quality with translucent gossamer elements. Completely original artistic interpretation with no copyrighted elements. Photographic realism with magical pink purple atmosphere showing transformation and renewal.";

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
    const outputPath = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana', '13-death.png');
    fs.writeFileSync(outputPath, Buffer.from(buffer));
    
    console.log(`✨ Original Death created! Size: ${buffer.byteLength} bytes`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createOriginalDeath();