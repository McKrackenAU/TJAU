/**
 * Create Single Cup Card with Ultra-Ethereal Quality
 */

import fs from 'fs';
import path from 'path';

async function createSingleCupCard(name: string, filename: string, prompt: string): Promise<void> {
  console.log(`🏆 Creating ${name} with proper cup symbolism...`);
  
  try {
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
          num_inference_steps: 45,
          guidance_scale: 8.0
        }
      }),
    });

    if (!response.ok) {
      console.error(`❌ ${name} failed: ${response.status}`);
      return;
    }

    const buffer = await response.arrayBuffer();
    
    const dir = path.join(process.cwd(), 'public', 'authentic-cards', 'minor-arcana', 'cups');
    const outputPath = path.join(dir, filename);
    fs.writeFileSync(outputPath, Buffer.from(buffer));
    
    console.log(`✨ ${name} created! Size: ${buffer.byteLength} bytes`);
    
  } catch (error) {
    console.error(`❌ Error creating ${name}:`, error);
  }
}

// Create Ten of Cups
const tenPrompt = "Ultra-photorealistic 3D Ten of Cups tarot card with breathtaking ethereal quality. Happy family beneath rainbow arc of 10 golden chalices in sky, exactly 10 ornate cups clearly visible forming perfect rainbow. Ultra-realistic skin textures with joyful pink ethereal glow. Translucent flowing garments in rich musky purple and pink aurora tones. Ultra-ethereal dreamlike whimsical quality. Completely original artistic interpretation. Photographic realism with magical pink purple atmosphere.";

createSingleCupCard('Ten of Cups', 'ten-of-cups.png', tenPrompt);