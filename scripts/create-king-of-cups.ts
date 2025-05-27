/**
 * Create King of Cups - Male King Figure
 */

import fs from 'fs';
import path from 'path';

async function createKingOfCups(): Promise<void> {
  console.log('👑 Creating King of Cups with chalice symbolism...');
  
  try {
    const prompt = "Ultra-photorealistic 3D King of Cups tarot card with breathtaking ethereal quality. Wise mature male king with flowing liquid starlight hair and regal beard in shimmering purple and pink tones, sitting on magnificent crystalline throne while prominently holding a large ornate chalice with both hands with incredible dimensional detail. Ultra-realistic skin texture with compassionate pink ethereal glow, perfectly natural masculine facial features showing deep wisdom and emotional mastery. The chalice overflows with cosmic liquid starlight that flows down in mystical streams, showing clear cup symbolism. Translucent flowing royal robes and crown in rich musky purple and pink aurora tones. Multiple chalices and cups integrated into his throne design and royal regalia with dimensional presence. Ship sailing in distant cosmic waters with chalices reflected in the waves. Ultra-ethereal dreamlike whimsical quality. Completely original artistic interpretation. Photographic realism with magical pink purple atmosphere.";

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
    const outputPath = path.join(dir, 'king-of-cups.png');
    fs.writeFileSync(outputPath, Buffer.from(buffer));
    
    console.log(`✨ King of Cups created with chalice! Size: ${buffer.byteLength} bytes`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createKingOfCups();