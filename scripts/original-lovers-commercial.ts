/**
 * Original Lovers - Commercially Reusable
 * Male and female couple with completely unique design
 */

import fs from 'fs';
import path from 'path';

async function createOriginalLovers(): Promise<void> {
  console.log('💕 Creating original Lovers design...');
  
  try {
    const prompt = "Ultra-photorealistic 3D original The Lovers tarot card design, completely unique and commercially reusable. Beautiful male and female couple with flowing liquid starlight hair in shimmering purple and pink tones, natural skin texture with subtle pink ethereal glow, realistic eyes showing profound loving connection. The man has strong masculine features, the woman has graceful feminine features, both with completely natural human anatomy. Standing together in cosmic garden with original ethereal design. Above them, a magnificent angel with unique wing patterns and flowing robes in purple and pink tones, blessing their union with original hand gestures. Tree of knowledge with cosmic fruits glowing with pink starlight, Tree of life with purple energy streams - both with original artistic design. Paradise garden background with unique botanical elements extending into infinite atmospheric depth. Original mystical symbols and patterns throughout. Ultra-ethereal dreamlike quality with translucent gossamer elements in signature musky pink and purple color palette. Completely original artistic interpretation with no copyrighted elements or references. Photographic realism with magical pink purple atmosphere.";

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
    const outputPath = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana', '06-lovers.png');
    fs.writeFileSync(outputPath, Buffer.from(buffer));
    
    console.log(`✨ Original Lovers created! Size: ${buffer.byteLength} bytes`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createOriginalLovers();