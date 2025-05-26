/**
 * Generate The Hermit Card - Ultra-Ethereal Style
 * Matching The Fool and The Magician aesthetic exactly
 */

import fs from 'fs';
import path from 'path';

const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

if (!HUGGINGFACE_API_TOKEN) {
  console.error('HUGGINGFACE_API_TOKEN is required');
  process.exit(1);
}

const hermitCard = {
  id: "9",
  name: "The Hermit",
  filename: "09-hermit.png",
  prompt: `The Hermit tarot card, ultra-ethereal dreamy style with soft glowing translucent robes in musky purple and pink tones. A wise elderly figure with flowing luminous hair holds a glowing lantern of pure starlight. His robes flow like cosmic mist around him. Background shows a mystical mountain peak surrounded by soft purple and pink cosmic clouds with gentle starlight. Translucent flowing fabrics, dreamlike atmosphere, soft glowing lighting, mystical and ethereal. Same dreamy translucent style as The Fool card.`
};

function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function generateHermitCard(): Promise<boolean> {
  try {
    console.log(`🎨 Generating ${hermitCard.name} with ultra-ethereal style...`);
    
    const outputDir = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana');
    ensureDirectoryExists(outputDir);
    
    const outputPath = path.join(outputDir, hermitCard.filename);
    
    if (fs.existsSync(outputPath)) {
      console.log(`✅ ${hermitCard.name} already exists, skipping...`);
      return true;
    }

    console.log(`📡 Calling image generation service for ${hermitCard.name}...`);
    
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HUGGINGFACE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: hermitCard.prompt,
          parameters: {
            negative_prompt: "low quality, blurry, distorted, ugly, deformed, text, watermark, signature, frame, border, realistic, photographic",
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
      console.error(`❌ API Error for ${hermitCard.name}:`, response.status, errorText);
      return false;
    }

    const imageBuffer = await response.arrayBuffer();
    
    if (imageBuffer.byteLength === 0) {
      console.error(`❌ Empty image buffer for ${hermitCard.name}`);
      return false;
    }

    fs.writeFileSync(outputPath, Buffer.from(imageBuffer));
    
    console.log(`✨ Successfully generated ${hermitCard.name}!`);
    console.log(`📁 Saved to: ${outputPath}`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Error generating ${hermitCard.name}:`, error);
    return false;
  }
}

async function main() {
  console.log('🔦 Starting Hermit card generation...');
  
  const success = await generateHermitCard();
  
  if (success) {
    console.log('🎉 Hermit card generation completed successfully!');
  } else {
    console.log('❌ Hermit card generation failed');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});