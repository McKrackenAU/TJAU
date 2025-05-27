/**
 * Original Horse-Drawn Chariot - Commercially Reusable
 * Ultra-lifelike ethereal style with proper chariot and horses
 */

import fs from 'fs';
import path from 'path';

async function createOriginalChariot(): Promise<void> {
  console.log('🏇 Creating original horse-drawn Chariot...');
  
  try {
    const prompt = "Ultra-photorealistic 3D original The Chariot tarot card design, completely unique and commercially reusable. Victorious ethereal warrior standing in ornate horse-drawn chariot with flowing liquid starlight hair in shimmering purple and pink tones. Natural skin texture with subtle pink ethereal glow, realistic eyes showing determination. Two powerful cosmic horses pulling an elaborate crystalline chariot - one horse in deep purple cosmic energy, one horse in soft pink starlight, both with realistic equine anatomy, flowing manes, and muscular definition. The chariot has intricate crystal formations and ethereal metallic details in musky purple and pink. Warrior wears translucent flowing armor and robes in rich purple and pink aurora tones with gossamer fabric physics. Stars crown forming above his head with dimensional pink and purple starlight. Cosmic battlefield background with swirling purple and pink energy, infinite atmospheric depth. Ultra-ethereal dreamlike quality with translucent gossamer elements. Completely original artistic interpretation with no copyrighted elements. Photographic realism with magical pink purple atmosphere.";

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
    const outputPath = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana', '07-chariot.png');
    fs.writeFileSync(outputPath, Buffer.from(buffer));
    
    console.log(`✨ Original horse-drawn Chariot created! Size: ${buffer.byteLength} bytes`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createOriginalChariot();