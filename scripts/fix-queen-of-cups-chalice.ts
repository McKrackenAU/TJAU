/**
 * Fix Queen of Cups with Proper Chalice Symbolism
 */

import fs from 'fs';
import path from 'path';

async function fixQueenOfCups(): Promise<void> {
  console.log('👑 Creating Queen of Cups with chalice symbolism...');
  
  try {
    const prompt = "Ultra-photorealistic 3D Queen of Cups tarot card with breathtaking ethereal quality. Intuitive female queen with flowing liquid starlight hair in shimmering purple and pink tones, sitting on crystalline throne while prominently holding a magnificent ornate chalice with both hands with incredible dimensional detail. Ultra-realistic skin texture with nurturing pink ethereal glow, perfectly natural feminine facial features showing deep emotional wisdom. The chalice contains cosmic liquid starlight that glows and flows with mystical energy, showing clear cup symbolism. Translucent flowing robes and crown in rich musky purple and pink aurora tones. Multiple chalices and cups adorning her throne and surrounding area with dimensional presence. Water lilies and mystical flowers floating on cosmic waters with chalices reflected in the water. Ultra-ethereal dreamlike whimsical quality. Completely original artistic interpretation. Photographic realism with magical pink purple atmosphere.";

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
    
    const dir = path.join(process.cwd(), 'public', 'authentic-cards', 'minor-arcana', 'cups');
    const outputPath = path.join(dir, 'queen-of-cups.png');
    fs.writeFileSync(outputPath, Buffer.from(buffer));
    
    console.log(`✨ Queen of Cups created with chalice! Size: ${buffer.byteLength} bytes`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

fixQueenOfCups();