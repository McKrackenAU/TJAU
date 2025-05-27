/**
 * Original Hanged Man - Commercially Reusable
 * Man hanging upside down with ethereal 3D lifelike quality
 */

import fs from 'fs';
import path from 'path';

async function createOriginalHangedMan(): Promise<void> {
  console.log('🙃 Creating original Hanged Man hanging upside down...');
  
  try {
    const prompt = "Ultra-photorealistic 3D original The Hanged Man tarot card design, completely unique and commercially reusable. Serene man hanging upside down by his left foot from a cosmic tree branch, his head pointing downward toward the bottom of the card. Ultra-realistic skin texture with peaceful pink ethereal glow, flowing liquid starlight hair in shimmering purple and pink tones falling downward due to gravity. His eyes are deeply realistic showing inner peace and enlightenment. His body is inverted with one leg bent creating figure-4 shape, arms behind his back in meditative pose. Translucent flowing robes in rich musky purple and pink aurora tones with gossamer fabric physics flowing naturally downward. Golden halo of pink and purple starlight around his inverted head with dimensional radiance. The cosmic tree extends into genuine 3D depth with intricate bark texture, purple and pink energy flowing through branches. Background shows ethereal sacrifice scene with layered atmospheric perspective in musky pink and purple tones. Ultra-ethereal dreamlike whimsical quality with translucent gossamer elements. Completely original artistic interpretation with no copyrighted elements. Photographic realism with magical pink purple atmosphere.";

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
    const outputPath = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana', '12-hanged-man.png');
    fs.writeFileSync(outputPath, Buffer.from(buffer));
    
    console.log(`✨ Original Hanged Man created! Size: ${buffer.byteLength} bytes`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createOriginalHangedMan();