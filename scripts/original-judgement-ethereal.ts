/**
 * Original Judgement - Commercially Reusable
 * Ethereal 3D lifelike quality with pink purple palette
 */

import fs from 'fs';
import path from 'path';

async function createOriginalJudgement(): Promise<void> {
  console.log('🎺 Creating original Judgement card...');
  
  try {
    const prompt = "Ultra-photorealistic 3D original Judgement tarot card design, completely unique and commercially reusable. Magnificent archangel with flowing liquid starlight hair in shimmering purple and pink tones and realistic ethereal wings, rendered with complete lifelike depth like a real divine being. Ultra-realistic skin texture with heavenly pink ethereal glow, perfectly natural facial features with divine authority and compassion. Translucent flowing robes with gossamer fabric physics in rich musky purple and pink aurora tones. Golden trumpet with dimensional metallic detail glowing with pink and purple starlight. People rising from ethereal graves with realistic human anatomy, natural expressions of awakening, and flowing garments in purple and pink tones. Cosmic clouds and heavenly atmosphere with layered depth in soft purple and pink lighting. Mountains and landscape extending into infinite atmospheric perspective. Ultra-ethereal dreamlike whimsical quality with translucent gossamer elements. Completely original artistic interpretation with no copyrighted elements. Photographic realism with magical pink purple atmosphere showing rebirth and awakening.";

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
    const outputPath = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana', '20-judgement.png');
    fs.writeFileSync(outputPath, Buffer.from(buffer));
    
    console.log(`✨ Original Judgement created! Size: ${buffer.byteLength} bytes`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createOriginalJudgement();