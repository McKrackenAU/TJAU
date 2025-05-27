/**
 * Ultra Lifelike Ethereal Chariot
 * Matching The High Priestess incredible realism and ethereal quality
 */

import fs from 'fs';
import path from 'path';

async function createUltraLifelikeChariot(): Promise<void> {
  console.log('🏇 Creating ultra-lifelike ethereal Chariot...');
  
  try {
    const prompt = "Ultra-photorealistic 3D The Chariot tarot card with breathtaking lifelike quality exactly like The High Priestess. Victorious otherworldly charioteer with incredibly realistic human features, natural skin texture with pores and subtle imperfections, flowing liquid starlight hair that moves like real hair with individual strands visible. His eyes are deeply realistic with natural iris patterns, realistic eyelashes, and triumphant expression showing profound determination and confidence. Translucent ethereal armor and robes flowing with gossamer fabric physics in musky purple and pink aurora tones, metallic surfaces reflecting light naturally with realistic shine. He stands in a crystalline chariot with incredible material detail - you can see crystal structure, light refraction, and weathered details. Two cosmic sphinxes pulling the chariot with completely realistic animal anatomy, natural fur texture, muscular definition, and lifelike expressions - one black sphinx, one white sphinx. Stars crown his head with dimensional light casting realistic shadows. Cosmic battlefield background with atmospheric perspective extending to infinity. Ultra-ethereal dreamlike quality with translucent, gossamer elements and musky pink purple cosmic lighting. Photographic realism meets ethereal magic.";

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
    
    console.log(`✨ Ultra-lifelike Chariot created! Size: ${buffer.byteLength} bytes`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createUltraLifelikeChariot();