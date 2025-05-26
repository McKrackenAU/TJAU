/**
 * Enhance Cards with 3D Lifelike Quality
 * Creating otherworldly dimensional depth like The Fool
 */

import fs from 'fs';
import path from 'path';

const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

if (!HUGGINGFACE_API_TOKEN) {
  console.error('HUGGINGFACE_API_TOKEN is required');
  process.exit(1);
}

// Start with most important cards first
const priorityCards = [
  {
    id: "01",
    name: "The Magician",
    filename: "01-magician.png",
    prompt: `The Magician tarot card in ultra-ethereal style with incredible 3D photorealistic depth exactly like The Fool. A magnificent otherworldly male figure with flowing liquid starlight hair cascading naturally, rendered with complete photorealistic 3D depth and dimensional lighting. His skin has realistic texture with ethereal luminescence, natural facial features with otherworldly handsomeness. Translucent robes in musky purple and pink aurora tones flowing with realistic fabric physics around his three-dimensional muscular form. One hand points to heaven, one to earth, holding a glowing wand. Around him float 3D magical tools with genuine shadows and depth. Roses and lilies bloom in dimensional detail at his feet. Infinity symbol glows above his head with realistic light rays. Background has layered cosmic nebulae with true atmospheric perspective stretching to infinity. Photorealistic skin, natural hair movement, dimensional shadows, otherworldly but completely lifelike presence with genuine 3D depth.`
  }
];

function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function enhance3DCard(card: typeof priorityCards[0]): Promise<boolean> {
  try {
    console.log(`🎨 Enhancing ${card.name} with 3D lifelike depth...`);
    
    const outputDir = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana');
    ensureDirectoryExists(outputDir);
    
    const outputPath = path.join(outputDir, card.filename);

    console.log(`📡 Generating enhanced 3D version...`);
    
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HUGGINGFACE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: card.prompt,
          parameters: {
            negative_prompt: "flat, 2D, cartoon, anime, illustration, drawing, sketch, low quality, blurry, distorted, ugly, deformed, text, watermark, signature, frame, border",
            num_inference_steps: 35,
            guidance_scale: 8.5,
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
    
    console.log(`✨ Successfully enhanced ${card.name} with 3D depth!`);
    console.log(`📁 Saved to: ${outputPath}`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Error:`, error);
    return false;
  }
}

async function main() {
  console.log('🌟 Enhancing cards with 3D lifelike quality...');
  console.log('Creating otherworldly dimensional depth like The Fool...');
  
  for (const card of priorityCards) {
    const success = await enhance3DCard(card);
    if (success) {
      console.log(`✅ ${card.name} enhanced successfully!`);
    } else {
      console.log(`❌ Failed to enhance ${card.name}`);
    }
  }
  
  console.log('🎉 3D enhancement completed!');
}

main().catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});