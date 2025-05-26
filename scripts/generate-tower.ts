/**
 * Generate The Tower Card - Ultra-Ethereal Style
 * Matching The Fool and The Magician aesthetic exactly
 */

import fs from 'fs';
import path from 'path';

const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

if (!HUGGINGFACE_API_TOKEN) {
  console.error('HUGGINGFACE_API_TOKEN is required');
  process.exit(1);
}

const towerCard = {
  id: "16",
  name: "The Tower",
  filename: "16-tower.png",
  prompt: `The Tower tarot card, ultra-ethereal dreamy style with soft glowing translucent robes in musky purple and pink tones. A crystalline tower made of starlight and cosmic energy is struck by gentle divine lightning, causing beautiful transformation rather than destruction. Two figures with flowing luminous hair float gracefully downward surrounded by shimmering light particles and cosmic energy. The scene represents enlightening revelation and positive change. Background has soft purple and pink cosmic clouds with gentle starlight. Translucent flowing elements, dreamlike atmosphere, soft glowing lighting, mystical and ethereal. Same dreamy translucent style as The Fool card.`
};

function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function generateTowerCard(): Promise<boolean> {
  try {
    console.log(`🎨 Generating ${towerCard.name} with ultra-ethereal style...`);
    
    const outputDir = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana');
    ensureDirectoryExists(outputDir);
    
    const outputPath = path.join(outputDir, towerCard.filename);
    
    if (fs.existsSync(outputPath)) {
      console.log(`✅ ${towerCard.name} already exists, skipping...`);
      return true;
    }

    console.log(`📡 Calling image generation service for ${towerCard.name}...`);
    
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HUGGINGFACE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: towerCard.prompt,
          parameters: {
            negative_prompt: "low quality, blurry, distorted, ugly, deformed, text, watermark, signature, frame, border, realistic, photographic, scary, dark, violent, destruction",
            num_inference_steps: 35,
            guidance_scale: 8.0,
            width: 512,
            height: 768
          }
        }),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ API Error for ${towerCard.name}:`, response.status, errorText);
      return false;
    }

    const imageBuffer = await response.arrayBuffer();
    
    if (imageBuffer.byteLength === 0) {
      console.error(`❌ Empty image buffer for ${towerCard.name}`);
      return false;
    }

    fs.writeFileSync(outputPath, Buffer.from(imageBuffer));
    
    console.log(`✨ Successfully generated ${towerCard.name}!`);
    console.log(`📁 Saved to: ${outputPath}`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Error generating ${towerCard.name}:`, error);
    return false;
  }
}

async function main() {
  console.log('🗼 Starting Tower card generation...');
  
  const success = await generateTowerCard();
  
  if (success) {
    console.log('🎉 Tower card generation completed successfully!');
  } else {
    console.log('❌ Tower card generation failed');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});