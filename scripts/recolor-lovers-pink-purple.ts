/**
 * Recolor Lovers with Pink Purple Palette
 * Male and female couple in musky pink and purple ethereal style
 */

import fs from 'fs';
import path from 'path';

async function recolorLovers(): Promise<void> {
  console.log('💕 Recoloring Lovers with pink purple palette...');
  
  try {
    const prompt = "Ultra-photorealistic 3D The Lovers tarot card with breathtaking lifelike quality in musky pink and purple color palette. Beautiful male and female couple with incredibly realistic human features, natural skin texture with subtle pink ethereal glow, flowing liquid starlight hair in shimmering purple and pink tones. Their eyes are deeply realistic showing profound loving connection. The man has strong masculine features, the woman has graceful feminine features. Translucent ethereal robes flowing in rich musky purple and soft pink aurora tones with gossamer fabric physics. Above them, a magnificent angel with realistic wings bathed in pink and purple light, flowing robes in matching ethereal colors. Tree of knowledge with cosmic apples glowing with pink starlight, Tree of life with purple energy streams. Paradise garden background bathed in soft purple and pink cosmic lighting with infinite atmospheric depth. Ultra-ethereal dreamlike quality with translucent gossamer elements all rendered in the signature musky pink and purple color palette. Photographic realism with magical pink purple atmosphere.";

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
    
    console.log(`✨ Lovers recolored! Size: ${buffer.byteLength} bytes`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

recolorLovers();