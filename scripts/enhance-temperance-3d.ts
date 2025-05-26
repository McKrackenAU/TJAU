/**
 * Enhance Temperance with 3D Lifelike Quality
 * Matching The Fool's otherworldly dimensional depth
 */

import fs from 'fs';
import path from 'path';

const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

if (!HUGGINGFACE_API_TOKEN) {
  console.error('HUGGINGFACE_API_TOKEN is required');
  process.exit(1);
}

async function enhance3DTemperance(): Promise<boolean> {
  try {
    console.log('🎨 Enhancing Temperance with 3D lifelike depth...');
    
    const outputDir = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana');
    const outputPath = path.join(outputDir, '14-temperance.png');
    
    const prompt = `Temperance tarot card with incredible photorealistic 3D depth and lifelike presence exactly like The Fool card. A graceful otherworldly angel with flowing liquid starlight hair and magnificent luminous wings, rendered with complete photorealistic depth, realistic skin texture with divine ethereal glow, natural facial features with otherworldly serenity and perfect balance. Translucent flowing robes in musky purple and pink aurora tones with realistic fabric physics draping gracefully over their three-dimensional form. They stand with one foot on crystalline land, one in cosmic water that ripples with genuine 3D depth. Pouring liquid starlight between two chalices in a perfect arc that flows with realistic physics. Behind them, a winding path leads to mountains of light with true atmospheric perspective. The triangle within a square symbol glows on their chest with dimensional light. Iris flowers bloom along the cosmic stream with realistic botanical detail. Photorealistic skin with harmonious luminescence, natural facial features, realistic hair and wing movement, dimensional fabric and water flow. Ultra-ethereal style with genuine 3D lifelike quality matching The Fool's dimensional realism.`;

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
    
    console.log(`✨ Successfully enhanced Temperance with 3D depth!`);
    console.log(`📁 Saved to: ${outputPath}`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Error:`, error);
    return false;
  }
}

async function main() {
  console.log('🌟 Enhancing Temperance with 3D lifelike depth...');
  
  const success = await enhance3DTemperance();
  
  if (success) {
    console.log('🎉 Temperance enhancement completed!');
  } else {
    console.log('❌ Enhancement failed');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});