/**
 * Enhance High Priestess with 3D Lifelike Quality
 * Matching The Fool's otherworldly dimensional depth
 */

import fs from 'fs';
import path from 'path';

const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

if (!HUGGINGFACE_API_TOKEN) {
  console.error('HUGGINGFACE_API_TOKEN is required');
  process.exit(1);
}

async function enhance3DHighPriestess(): Promise<boolean> {
  try {
    console.log('🎨 Enhancing The High Priestess with 3D lifelike depth...');
    
    const outputDir = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana');
    const outputPath = path.join(outputDir, '02-high-priestess.png');
    
    const prompt = `The High Priestess tarot card with incredible photorealistic 3D depth and lifelike presence exactly like The Fool card. A mystical otherworldly woman with flowing liquid starlight hair cascading in realistic waves, rendered with complete photorealistic depth, realistic skin texture with ethereal glow, natural facial features with otherworldly beauty. Translucent flowing robes in musky purple and pink aurora tones with realistic fabric physics draping naturally over her three-dimensional form. She sits between two crystalline pillars that extend into genuine depth, holding a sacred scroll that unfurls in 3D space. A crescent moon crown floats above her head with dimensional shadows. Behind her, a cosmic veil flows in realistic depth with stars twinkling at various distances. Photorealistic skin with ethereal luminescence, natural facial features, realistic hair movement, dimensional fabric flow. Background has true depth perception with layered cosmic elements stretching to infinity. Ultra-ethereal style with genuine 3D lifelike quality matching The Fool's dimensional realism.`;

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
    
    console.log(`✨ Successfully enhanced The High Priestess with 3D depth!`);
    console.log(`📁 Saved to: ${outputPath}`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Error:`, error);
    return false;
  }
}

async function main() {
  console.log('🌟 Enhancing The High Priestess with 3D lifelike depth...');
  
  const success = await enhance3DHighPriestess();
  
  if (success) {
    console.log('🎉 High Priestess enhancement completed!');
    console.log('Now it should match The Fool\'s dimensional quality!');
  } else {
    console.log('❌ Enhancement failed');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});