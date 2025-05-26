/**
 * Enhance Sun with 3D Lifelike Quality
 * Matching The Fool's otherworldly dimensional depth
 */

import fs from 'fs';
import path from 'path';

const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

if (!HUGGINGFACE_API_TOKEN) {
  console.error('HUGGINGFACE_API_TOKEN is required');
  process.exit(1);
}

async function enhance3DSun(): Promise<boolean> {
  try {
    console.log('🎨 Enhancing The Sun with 3D lifelike depth...');
    
    const outputDir = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana');
    const outputPath = path.join(outputDir, '19-sun.png');
    
    const prompt = `The Sun tarot card with incredible photorealistic 3D depth and lifelike presence exactly like The Fool card. A radiant sun with a gentle face rendered in complete photorealistic depth, beaming golden light across a cosmic landscape with realistic solar textures and natural lighting effects. A joyful child with flowing liquid starlight hair rides a white horse made of pure light energy, both rendered with photorealistic depth, realistic skin texture with joyful ethereal glow, natural facial features with otherworldly happiness. The child's hair flows naturally with cosmic wind using realistic physics. Translucent banner of liquid starlight flows from their hand with realistic fabric movement. The horse has realistic musculature and dimensional depth, galloping through a field of cosmic sunflowers that glow like stars, each flower rendered with botanical detail extending into genuine 3D space. A garden wall made of crystalline energy sparkles in the background with true atmospheric perspective. Everything radiates pure joy and divine blessing with realistic light physics. Background has soft purple and pink cosmic clouds with warm golden sunlight creating dimensional shadows. Ultra-ethereal style with genuine 3D lifelike quality matching The Fool's dimensional realism.`;

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
    
    console.log(`✨ Successfully enhanced The Sun with 3D depth!`);
    console.log(`📁 Saved to: ${outputPath}`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Error:`, error);
    return false;
  }
}

async function main() {
  console.log('🌟 Enhancing The Sun with 3D lifelike depth...');
  
  const success = await enhance3DSun();
  
  if (success) {
    console.log('🎉 Sun enhancement completed!');
  } else {
    console.log('❌ Enhancement failed');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});