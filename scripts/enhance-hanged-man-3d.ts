/**
 * Enhance Hanged Man with 3D Lifelike Quality
 * Matching The Fool's otherworldly dimensional depth
 */

import fs from 'fs';
import path from 'path';

const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

if (!HUGGINGFACE_API_TOKEN) {
  console.error('HUGGINGFACE_API_TOKEN is required');
  process.exit(1);
}

async function enhance3DHangedMan(): Promise<boolean> {
  try {
    console.log('🎨 Enhancing The Hanged Man with 3D lifelike depth...');
    
    const outputDir = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana');
    const outputPath = path.join(outputDir, '12-hanged-man.png');
    
    const prompt = `The Hanged Man tarot card with incredible photorealistic 3D depth and lifelike presence exactly like The Fool card. A serene otherworldly figure with flowing liquid starlight hair hanging upside down, rendered with complete photorealistic depth, realistic skin texture with peaceful ethereal glow, natural facial features with otherworldly tranquility and enlightened expression. Translucent flowing robes in musky purple and pink aurora tones with realistic fabric physics draping naturally with gravity. He hangs by one foot from a crystalline Tree of Life that extends into genuine 3D depth with dimensional branches. His free leg forms a cross, arms behind his back in surrender. A golden halo of starlight glows around his head with realistic light rays. His hair flows naturally downward with realistic physics. Background has cosmic landscape with layered elements stretching to infinity with true atmospheric perspective. Photorealistic skin with enlightened luminescence, natural facial features, realistic hair movement responding to gravity, dimensional fabric flow. Ultra-ethereal style with genuine 3D lifelike quality matching The Fool's dimensional realism.`;

    console.log('📡 Generating with enhanced 3D parameters...');
    
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HUGGINGFACE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            negative_prompt: "flat, 2D, cartoon, anime, illustration, drawing, sketch, painting, unrealistic, artificial, low quality, blurry, distorted, ugly, deformed, text, watermark, signature, frame, border",
            num_inference_steps: 40,
            guidance_scale: 9.0,
            width: 512,
            height: 768
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ API Error:`, response.status, errorText);
      return false;
    }

    const imageBuffer = await response.arrayBuffer();
    
    if (imageBuffer.byteLength === 0) {
      console.error(`❌ Empty image buffer`);
      return false;
    }

    fs.writeFileSync(outputPath, Buffer.from(imageBuffer));
    
    console.log(`✨ Successfully enhanced The Hanged Man with 3D depth!`);
    console.log(`📁 Saved to: ${outputPath}`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Error:`, error);
    return false;
  }
}

async function main() {
  console.log('🌟 Enhancing The Hanged Man with 3D lifelike depth...');
  
  const success = await enhance3DHangedMan();
  
  if (success) {
    console.log('🎉 Hanged Man enhancement completed!');
  } else {
    console.log('❌ Enhancement failed');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});