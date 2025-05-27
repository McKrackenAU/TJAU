/**
 * Original Hierophant - Commercially Reusable
 * Completely unique design with no copyright issues
 */

import fs from 'fs';
import path from 'path';

async function createOriginalHierophant(): Promise<void> {
  console.log('🎨 Creating original Hierophant design...');
  
  try {
    const prompt = "Ultra-photorealistic 3D original The Hierophant tarot card design, completely unique and commercially reusable. Wise spiritual teacher with flowing liquid starlight hair in shimmering purple and pink tones, natural skin texture with subtle pink ethereal glow, realistic eyes showing profound spiritual wisdom. Seated on crystalline throne with original geometric patterns in musky purple and pink crystal formations. Two cosmic keys floating beside him with unique ethereal design - one key glowing with purple starlight, one with pink cosmic energy. Two devoted followers kneeling with realistic human anatomy wearing original flowing robes in purple and pink tones. Ancient temple columns with unique architectural details extending into infinite depth. Sacred symbols and original mystical patterns throughout. Ultra-ethereal dreamlike quality with translucent gossamer elements in signature musky pink and purple color palette. Completely original artistic interpretation with no copyrighted elements or references. Photographic realism with magical pink purple atmosphere.";

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
    
    console.log(`✨ Original Hierophant created! Size: ${buffer.byteLength} bytes`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createOriginalHierophant();