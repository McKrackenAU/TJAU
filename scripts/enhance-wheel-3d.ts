/**
 * Enhance Wheel of Fortune with 3D Lifelike Quality
 * Matching The Fool's otherworldly dimensional depth
 */

import fs from 'fs';
import path from 'path';

const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

if (!HUGGINGFACE_API_TOKEN) {
  console.error('HUGGINGFACE_API_TOKEN is required');
  process.exit(1);
}

async function enhance3DWheel(): Promise<boolean> {
  try {
    console.log('🎨 Enhancing Wheel of Fortune with 3D lifelike depth...');
    
    const outputDir = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana');
    const outputPath = path.join(outputDir, '10-wheel.png');
    
    const prompt = `Wheel of Fortune tarot card with incredible photorealistic 3D depth and lifelike presence exactly like The Fool card. A magnificent cosmic wheel spinning in genuine 3D space with dimensional depth and realistic motion blur, made of liquid starlight and crystalline energy. The wheel has intricate symbols carved with genuine depth - Hebrew letters, astrological symbols, and alchemical marks that catch realistic light. Four otherworldly beings float in the corners with photorealistic 3D depth - an angel, eagle, lion, and bull with flowing liquid starlight features, rendered with complete dimensional realism, realistic textures with ethereal glow, natural facial features with otherworldly wisdom. Translucent wings and forms in musky purple and pink aurora tones with realistic fabric physics. The beings hold scrolls that unfurl in 3D space. Background has layered cosmic clouds with true atmospheric perspective stretching to infinity. Photorealistic textures with destiny luminescence, dimensional shadows, realistic movement. Ultra-ethereal style with genuine 3D lifelike quality matching The Fool's dimensional realism.`;

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
    
    console.log(`✨ Successfully enhanced Wheel of Fortune with 3D depth!`);
    console.log(`📁 Saved to: ${outputPath}`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Error:`, error);
    return false;
  }
}

async function main() {
  console.log('🌟 Enhancing Wheel of Fortune with 3D lifelike depth...');
  
  const success = await enhance3DWheel();
  
  if (success) {
    console.log('🎉 Wheel of Fortune enhancement completed!');
  } else {
    console.log('❌ Enhancement failed');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});