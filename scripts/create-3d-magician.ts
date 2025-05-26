/**
 * Create 3D Lifelike Magician Card
 * Matching The Fool's dimensional depth exactly
 */

import fs from 'fs';
import path from 'path';

const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

if (!HUGGINGFACE_API_TOKEN) {
  console.error('HUGGINGFACE_API_TOKEN is required');
  process.exit(1);
}

async function create3DMagician(): Promise<boolean> {
  try {
    console.log('🎨 Creating 3D lifelike Magician card...');
    
    const outputDir = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana');
    const outputPath = path.join(outputDir, '01-magician.png');
    
    const prompt = `The Magician tarot card with incredible photorealistic 3D depth and lifelike presence exactly like The Fool card. A handsome otherworldly man with flowing liquid starlight hair that moves naturally, rendered with complete photorealistic depth, realistic skin texture with ethereal glow, natural facial features with otherworldly beauty. Translucent flowing robes in musky purple and pink aurora tones with realistic fabric physics. One hand points to heaven holding a glowing wand, one points to earth. Around him float magical tools with genuine 3D shadows and depth. Roses and lilies bloom dimensionally at his feet. Infinity symbol glows above with realistic light rays. Background has deep cosmic layers with true atmospheric perspective, purple and pink nebulae stretching to infinity. Photorealistic lighting, dimensional shadows, natural hair flow, lifelike skin, completely three-dimensional presence with otherworldly depth. Ultra-ethereal style with genuine 3D lifelike quality matching The Fool's dimensional realism.`;

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
    
    console.log(`✨ Successfully created 3D lifelike Magician!`);
    console.log(`📁 Saved to: ${outputPath}`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Error:`, error);
    return false;
  }
}

async function main() {
  console.log('🌟 Creating The Magician with 3D lifelike depth...');
  
  const success = await create3DMagician();
  
  if (success) {
    console.log('🎉 3D Magician creation completed!');
    console.log('Now it should match The Fool\'s dimensional quality!');
  } else {
    console.log('❌ Creation failed');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});