/**
 * Generate Death Card - Ultra-Ethereal Style
 * Matching The Fool and The Magician aesthetic exactly
 */

import fs from 'fs';
import path from 'path';

const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

if (!HUGGINGFACE_API_TOKEN) {
  console.error('HUGGINGFACE_API_TOKEN is required');
  process.exit(1);
}

const deathCard = {
  id: "13",
  name: "Death",
  filename: "13-death.png",
  prompt: `Death tarot card, ultra-ethereal dreamy style with soft glowing translucent robes in musky purple and pink tones. A mystical figure representing transformation with flowing luminous hair rides a white horse made of starlight and cosmic energy. The figure wears flowing ethereal robes that shimmer like cosmic mist. A gentle sun rises in the distance between two towers of light. Roses bloom along the path, symbolizing rebirth. The scene depicts peaceful transformation, not ending but beautiful change. Background has soft purple and pink cosmic clouds with gentle starlight. Translucent flowing fabrics, dreamlike atmosphere, soft glowing lighting, mystical and ethereal. Same dreamy translucent style as The Fool card.`
};

function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function generateDeathCard(): Promise<boolean> {
  try {
    console.log(`🎨 Generating ${deathCard.name} with ultra-ethereal style...`);
    
    const outputDir = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana');
    ensureDirectoryExists(outputDir);
    
    const outputPath = path.join(outputDir, deathCard.filename);
    
    if (fs.existsSync(outputPath)) {
      console.log(`✅ ${deathCard.name} already exists, skipping...`);
      return true;
    }

    console.log(`📡 Calling image generation service for ${deathCard.name}...`);
    
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HUGGINGFACE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: deathCard.prompt,
          parameters: {
            negative_prompt: "low quality, blurry, distorted, ugly, deformed, text, watermark, signature, frame, border, realistic, photographic, scary, dark, skeleton",
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
      console.error(`❌ API Error for ${deathCard.name}:`, response.status, errorText);
      return false;
    }

    const imageBuffer = await response.arrayBuffer();
    
    if (imageBuffer.byteLength === 0) {
      console.error(`❌ Empty image buffer for ${deathCard.name}`);
      return false;
    }

    fs.writeFileSync(outputPath, Buffer.from(imageBuffer));
    
    console.log(`✨ Successfully generated ${deathCard.name}!`);
    console.log(`📁 Saved to: ${outputPath}`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Error generating ${deathCard.name}:`, error);
    return false;
  }
}

async function main() {
  console.log('🌅 Starting Death card generation...');
  
  const success = await generateDeathCard();
  
  if (success) {
    console.log('🎉 Death card generation completed successfully!');
  } else {
    console.log('❌ Death card generation failed');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});