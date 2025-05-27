/**
 * Recolor Hierophant with Pink Purple Palette
 * Matching the musky pink and purple ethereal style
 */

import fs from 'fs';
import path from 'path';

async function recolorHierophant(): Promise<void> {
  console.log('🎨 Recoloring Hierophant with pink purple palette...');
  
  try {
    const prompt = "Ultra-photorealistic 3D The Hierophant tarot card with breathtaking lifelike quality in musky pink and purple color palette. Wise spiritual teacher with incredibly realistic human features, natural skin texture with subtle pink ethereal glow, flowing liquid starlight hair in shimmering purple and pink tones. His eyes are deeply realistic showing profound spiritual wisdom. Translucent ethereal robes flowing in rich musky purple and soft pink aurora tones with gossamer fabric physics, each fold catching the ethereal light. He sits on a crystalline throne with pink and purple crystal formations. Two cosmic keys floating beside him glowing with pink and purple starlight. Two pilgrims kneeling in matching ethereal robes of musky purple and pink. Ancient temple columns bathed in soft purple and pink cosmic lighting. Ultra-ethereal dreamlike quality with translucent gossamer elements all rendered in the signature musky pink and purple color palette. Photographic realism with magical pink purple atmosphere.";

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
    const outputPath = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana', '05-hierophant.png');
    fs.writeFileSync(outputPath, Buffer.from(buffer));
    
    console.log(`✨ Hierophant recolored! Size: ${buffer.byteLength} bytes`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

recolorHierophant();