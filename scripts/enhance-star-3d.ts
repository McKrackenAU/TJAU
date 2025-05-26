/**
 * Enhance Star with 3D Lifelike Quality
 * Matching The Fool's otherworldly dimensional depth
 */

import fs from 'fs';
import path from 'path';

const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

if (!HUGGINGFACE_API_TOKEN) {
  console.error('HUGGINGFACE_API_TOKEN is required');
  process.exit(1);
}

async function enhance3DStar(): Promise<boolean> {
  try {
    console.log('🎨 Enhancing The Star with 3D lifelike depth...');
    
    const outputDir = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana');
    const outputPath = path.join(outputDir, '17-star.png');
    
    const prompt = `The Star tarot card with incredible photorealistic 3D depth and lifelike presence exactly like The Fool card. A beautiful otherworldly woman with flowing liquid starlight hair moving naturally in cosmic breeze, rendered with complete photorealistic depth, realistic skin texture with hopeful ethereal glow, natural facial features with otherworldly grace and serene expression. Translucent flowing robes in musky purple and pink aurora tones with realistic fabric physics draping gracefully over her three-dimensional form. She kneels by a cosmic pool with genuine depth reflection, pouring liquid starlight from dimensional vessels that cast real shadows and flow with realistic physics. Seven 3D stars float at various depths above her head, creating natural depth perception with realistic light rays. An eighth larger star shines brilliantly with dimensional illumination. Mountains of crystalline light extend into realistic distance with atmospheric perspective. Her skin has photorealistic texture with hopeful luminescence, natural facial features, realistic hair movement, dimensional fabric flow. Background has true dimensional depth with layered cosmic clouds stretching to infinity. Ultra-ethereal style with genuine 3D lifelike quality matching The Fool's dimensional realism.`;

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
    
    console.log(`✨ Successfully enhanced The Star with 3D depth!`);
    console.log(`📁 Saved to: ${outputPath}`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Error:`, error);
    return false;
  }
}

async function main() {
  console.log('🌟 Enhancing The Star with 3D lifelike depth...');
  
  const success = await enhance3DStar();
  
  if (success) {
    console.log('🎉 Star enhancement completed!');
  } else {
    console.log('❌ Enhancement failed');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});