/**
 * Enhanced Hanged Man - Properly Upside Down
 * Matching The High Priestess quality with correct hanging pose
 */

import fs from 'fs';
import path from 'path';

async function enhanceHangedMan(): Promise<void> {
  console.log('🙃 Creating The Hanged Man hanging upside down...');
  
  try {
    const prompt = "Ultra-realistic 3D The Hanged Man tarot card with extreme photorealistic depth exactly like The High Priestess. A serene man hanging upside down by his left foot from a cosmic tree branch, his head pointing downward toward the bottom of the card. Ultra-realistic skin texture with peaceful ethereal glow, flowing liquid starlight hair falling downward due to gravity. His body is inverted with one leg bent creating figure-4 shape, arms behind his back, wearing translucent robes flowing downward with realistic fabric physics in musky purple and pink tones. Golden halo around his inverted head. The cosmic tree extends into genuine 3D depth. Same incredible dimensional realism as The High Priestess. Ultra-ethereal dreamy style with musky purple and pink cosmic colors.";

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
          num_inference_steps: 40,
          guidance_scale: 7.0
        }
      }),
    });

    if (!response.ok) {
      console.error(`❌ Hugging Face API error: ${response.status}`);
      return;
    }

    const buffer = await response.arrayBuffer();
    const outputPath = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana', '12-hanged-man.png');
    fs.writeFileSync(outputPath, Buffer.from(buffer));
    
    console.log(`✨ Hanged Man enhanced! Size: ${buffer.byteLength} bytes`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

enhanceHangedMan();