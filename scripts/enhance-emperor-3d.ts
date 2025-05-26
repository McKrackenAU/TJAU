/**
 * Enhance Emperor with 3D Lifelike Quality
 * Matching The Fool's otherworldly dimensional depth
 */

import fs from 'fs';
import path from 'path';

const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

if (!HUGGINGFACE_API_TOKEN) {
  console.error('HUGGINGFACE_API_TOKEN is required');
  process.exit(1);
}

async function enhance3DEmperor(): Promise<boolean> {
  try {
    console.log('🎨 Enhancing The Emperor with 3D lifelike depth...');
    
    const outputDir = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana');
    const outputPath = path.join(outputDir, '04-emperor.png');
    
    const prompt = `The Emperor tarot card with incredible photorealistic 3D depth and lifelike presence exactly like The Fool card. A powerful otherworldly man with flowing liquid starlight hair and majestic beard, rendered with complete photorealistic depth, realistic skin texture with authoritative ethereal glow, natural facial features with otherworldly nobility and commanding presence. Translucent flowing robes in musky purple and pink aurora tones with realistic fabric physics draping regally over his three-dimensional muscular form. He sits on a crystalline throne with dimensional ram head carvings that extend into genuine depth. In his hand, an ankh scepter glows with realistic light. Mountains of crystal authority stretch behind him with true atmospheric perspective. A crown of cosmic fire floats above his head with dimensional shadows. Background has majestic cosmic landscape with layered mountain ranges stretching to infinity. Photorealistic skin with paternal luminescence, natural facial features, realistic hair and beard movement, dimensional fabric flow. Ultra-ethereal style with genuine 3D lifelike quality matching The Fool's dimensional realism.`;

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
    
    console.log(`✨ Successfully enhanced The Emperor with 3D depth!`);
    console.log(`📁 Saved to: ${outputPath}`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Error:`, error);
    return false;
  }
}

async function main() {
  console.log('🌟 Enhancing The Emperor with 3D lifelike depth...');
  
  const success = await enhance3DEmperor();
  
  if (success) {
    console.log('🎉 Emperor enhancement completed!');
  } else {
    console.log('❌ Enhancement failed');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});