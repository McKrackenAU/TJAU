/**
 * Create King of Cups - Male King Figure
 */

import fs from 'fs';
import path from 'path';

async function createKingOfCups(): Promise<void> {
  console.log('👑 Creating King of Cups...');
  
  try {
    const prompt = "Ultra-photorealistic 3D King of Cups tarot card with breathtaking ethereal quality. Wise male king with flowing liquid starlight hair and regal beard in shimmering purple and pink tones, rendered with complete lifelike depth. Ultra-realistic skin texture with compassionate pink ethereal glow, perfectly natural masculine facial features with realistic eyes showing emotional mastery and wisdom. He sits on magnificent crystalline throne floating on cosmic waters, holding a large ornate chalice with incredible dimensional detail. Translucent flowing royal robes and crown in rich musky purple and pink aurora tones with gossamer fabric physics. Ethereal fish and sea creatures swimming around his throne with dimensional presence. Ship sailing in distant cosmic waters with atmospheric perspective. Ultra-ethereal dreamlike whimsical quality with translucent gossamer elements flowing around. Completely original artistic interpretation. Photographic realism with magical pink purple atmosphere showing emotional leadership and balanced power.";

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
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    const outputPath = path.join(dir, 'king-of-cups.png');
    fs.writeFileSync(outputPath, Buffer.from(buffer));
    
    console.log(`✨ King of Cups created! Size: ${buffer.byteLength} bytes`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

createKingOfCups();