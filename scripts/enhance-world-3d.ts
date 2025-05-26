/**
 * Enhance World with 3D Lifelike Quality
 * Matching The Fool's otherworldly dimensional depth
 */

import fs from 'fs';
import path from 'path';

const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

if (!HUGGINGFACE_API_TOKEN) {
  console.error('HUGGINGFACE_API_TOKEN is required');
  process.exit(1);
}

async function enhance3DWorld(): Promise<boolean> {
  try {
    console.log('🎨 Enhancing The World with 3D lifelike depth...');
    
    const outputDir = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana');
    const outputPath = path.join(outputDir, '21-world.png');
    
    const prompt = `The World tarot card with incredible photorealistic 3D depth and lifelike presence exactly like The Fool card. A graceful otherworldly dancing figure with flowing liquid starlight hair floating within a cosmic laurel wreath made of liquid light and starfire, rendered with complete photorealistic depth and natural human anatomy. Realistic skin texture with triumphant ethereal glow, natural facial features with otherworldly joy and cosmic unity. Translucent flowing ribbons of pure energy flow from their hands with realistic fabric physics and dimensional movement. In the four corners, celestial symbols appear as ethereal beings rendered with photorealistic 3D depth - an angel of light with magnificent wings, an eagle of cosmic winds with realistic feathers, a lion of stellar fire with natural musculature, and a bull of earth energy with dimensional form - all translucent and glowing with lifelike textures. The laurel wreath extends into genuine 3D space with botanical detail and dimensional shadows. The entire scene represents completion, fulfillment, and cosmic unity with realistic lighting physics. Background has soft purple and pink cosmic clouds with gentle divine light radiating everywhere, creating true atmospheric perspective stretching to infinity. Ultra-ethereal style with genuine 3D lifelike quality matching The Fool's dimensional realism.`;

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
    
    console.log(`✨ Successfully enhanced The World with 3D depth!`);
    console.log(`📁 Saved to: ${outputPath}`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Error:`, error);
    return false;
  }
}

async function main() {
  console.log('🌟 Enhancing The World with 3D lifelike depth...');
  
  const success = await enhance3DWorld();
  
  if (success) {
    console.log('🎉 World enhancement completed!');
    console.log('🎊 ALL MAJOR ARCANA 3D ENHANCEMENTS COMPLETE!');
  } else {
    console.log('❌ Enhancement failed');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});