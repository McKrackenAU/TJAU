/**
 * Enhance Judgement with 3D Lifelike Quality
 * Matching The Fool's otherworldly dimensional depth
 */

import fs from 'fs';
import path from 'path';

const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

if (!HUGGINGFACE_API_TOKEN) {
  console.error('HUGGINGFACE_API_TOKEN is required');
  process.exit(1);
}

async function enhance3DJudgement(): Promise<boolean> {
  try {
    console.log('🎨 Enhancing Judgement with 3D lifelike depth...');
    
    const outputDir = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana');
    const outputPath = path.join(outputDir, '20-judgement.png');
    
    const prompt = `Judgement tarot card with incredible photorealistic 3D depth and lifelike presence exactly like The Fool card. An archangel with flowing liquid starlight hair and magnificent luminous wings rendered in complete photorealistic depth, emerging from layered cosmic clouds with true atmospheric perspective. Realistic skin texture with divine ethereal glow, natural facial features with otherworldly benevolence. Translucent robes in musky purple and pink aurora tones with realistic fabric physics. They blow a golden trumpet that emanates pure light with realistic metallic reflection and dimensional light rays. Below, three figures with flowing starlight hair rise joyfully from crystalline tombs made of starlight, rendered with photorealistic skin textures and natural facial features showing otherworldly joy and spiritual awakening. Their arms raised in celebration with realistic human anatomy and movement. The tombs extend into genuine 3D depth with dimensional shadows. Mountains of light glow in the distance with true atmospheric perspective. The scene represents awakening and divine calling with realistic lighting physics. Background has soft purple and pink cosmic clouds with gentle divine light creating dimensional shadows and depth. Ultra-ethereal style with genuine 3D lifelike quality matching The Fool's dimensional realism.`;

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
    
    console.log(`✨ Successfully enhanced Judgement with 3D depth!`);
    console.log(`📁 Saved to: ${outputPath}`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Error:`, error);
    return false;
  }
}

async function main() {
  console.log('🌟 Enhancing Judgement with 3D lifelike depth...');
  
  const success = await enhance3DJudgement();
  
  if (success) {
    console.log('🎉 Judgement enhancement completed!');
  } else {
    console.log('❌ Enhancement failed');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});