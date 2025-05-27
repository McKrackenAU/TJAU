/**
 * Original Sun - Commercially Reusable
 * Ethereal 3D lifelike quality with pink purple palette
 */

import fs from 'fs';
import path from 'path';

async function createOriginalSun(): Promise<void> {
  console.log('☀️ Creating original Sun card...');
  
  try {
    const prompt = "Ultra-photorealistic 3D original The Sun tarot card design, completely unique and commercially reusable. Radiant cosmic sun with realistic solar flares and dimensional light rays in ethereal pink and purple tones, rendered with complete lifelike depth. Joyful child with flowing liquid starlight hair in shimmering purple and pink tones, riding majestic white horse with realistic musculature and flowing mane. Ultra-realistic skin texture with solar pink ethereal glow, perfectly natural facial features with pure happiness and wonder. Translucent flowing garments in rich musky purple and pink aurora tones with gossamer fabric physics. White horse with natural equine anatomy and gentle expression. Sunflower garden extending into genuine 3D depth with botanical detail, flowers glowing with pink and purple cosmic energy. Banner of joy flowing in cosmic breeze with ethereal fabric physics. Ultra-ethereal dreamlike whimsical quality with translucent gossamer elements. Completely original artistic interpretation with no copyrighted elements. Photographic realism with magical pink purple atmosphere showing joy and success.";

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
    const outputPath = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana', '19-sun.png');
    fs.writeFileSync(outputPath, Buffer.from(buffer));
    
    console.log(`✨ Original Sun created! Size: ${buffer.byteLength} bytes`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createOriginalSun();