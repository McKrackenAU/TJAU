/**
 * Regenerate The Magician with 3D Lifelike Quality
 * Matching The Fool's otherworldly dimensional depth
 */

import fs from 'fs';
import path from 'path';

const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

if (!HUGGINGFACE_API_TOKEN) {
  console.error('HUGGINGFACE_API_TOKEN is required');
  process.exit(1);
}

const magicianCard = {
  id: "01",
  name: "The Magician",
  filename: "01-magician.png",
  prompt: `The Magician tarot card, ultra-ethereal dreamy style with incredibly lifelike 3D depth and dimension exactly like The Fool card. A magnificent otherworldly figure with flowing liquid starlight hair that moves with cosmic wind, rendered in full photorealistic 3D depth with natural lighting and dimensional shadows. Translucent robes in musky purple and pink tones that shimmer with aurora-like qualities, flowing naturally around a three-dimensional form with realistic fabric physics. The figure stands with one hand pointing to heaven, one to earth, surrounded by floating 3D magical tools (wand, cup, sword, pentacle) that cast real shadows and have genuine depth. Roses and lilies bloom in full dimensional detail around their feet with realistic textures. Background has layered cosmic clouds with genuine depth perception, soft purple and pink nebulae stretching into infinite distance with atmospheric perspective. Photorealistic skin texture with ethereal glow, realistic facial features with otherworldly beauty, natural hair movement, dimensional lighting effects. The figure appears completely lifelike and three-dimensional with otherworldly presence, not flat or 2D. Same incredible 3D depth, dimensional quality, and lifelike realism as The Fool card.`
};

function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function regenerateMagician3D(): Promise<boolean> {
  try {
    console.log(`🎨 Regenerating ${magicianCard.name} with lifelike 3D depth...`);
    
    const outputDir = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana');
    ensureDirectoryExists(outputDir);
    
    const outputPath = path.join(outputDir, magicianCard.filename);
    
    // Back up existing card
    if (fs.existsSync(outputPath)) {
      const backupPath = outputPath.replace('.png', '-old.png');
      fs.copyFileSync(outputPath, backupPath);
      console.log(`📋 Backed up existing ${magicianCard.name}`);
    }

    console.log(`📡 Generating 3D lifelike version...`);
    
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HUGGINGFACE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: magicianCard.prompt,
          parameters: {
            negative_prompt: "flat, 2D, cartoon, anime, illustration, drawing, sketch, painting, low quality, blurry, distorted, ugly, deformed, text, watermark, signature, frame, border",
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
    
    console.log(`✨ Successfully regenerated 3D lifelike ${magicianCard.name}!`);
    console.log(`📁 Saved to: ${outputPath}`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Error:`, error);
    return false;
  }
}

async function main() {
  console.log('🌟 Regenerating The Magician with 3D lifelike quality...');
  
  const success = await regenerateMagician3D();
  
  if (success) {
    console.log('🎉 The Magician regeneration completed successfully!');
    console.log('Now it should have the same otherworldly 3D depth as The Fool!');
  } else {
    console.log('❌ Regeneration failed');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});