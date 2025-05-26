/**
 * Generate The Hanged Man Card - Ultra-Ethereal Style
 * Matching The Fool and The Magician aesthetic exactly
 */

import fs from 'fs';
import path from 'path';

const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

if (!HUGGINGFACE_API_TOKEN) {
  console.error('HUGGINGFACE_API_TOKEN is required');
  process.exit(1);
}

const hangedManCard = {
  id: "12",
  name: "The Hanged Man",
  filename: "12-hanged-man.png",
  prompt: `The Hanged Man tarot card, ultra-ethereal dreamy style with soft glowing translucent robes in musky purple and pink tones. A serene figure with flowing luminous hair hangs peacefully upside down from a tree of light, suspended by one foot. His other leg crosses in meditation pose. A gentle halo of starlight surrounds his head. The tree glows with cosmic energy against a background of soft purple and pink cosmic clouds. His robes flow like liquid light around him. Translucent flowing fabrics, dreamlike atmosphere, soft glowing lighting, mystical and ethereal. Same dreamy translucent style as The Fool card.`
};

function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function generateHangedManCard(): Promise<boolean> {
  try {
    console.log(`🎨 Generating ${hangedManCard.name} with ultra-ethereal style...`);
    
    const outputDir = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana');
    ensureDirectoryExists(outputDir);
    
    const outputPath = path.join(outputDir, hangedManCard.filename);
    
    if (fs.existsSync(outputPath)) {
      console.log(`✅ ${hangedManCard.name} already exists, skipping...`);
      return true;
    }

    console.log(`📡 Calling image generation service for ${hangedManCard.name}...`);
    
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HUGGINGFACE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: hangedManCard.prompt,
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
      console.error(`❌ API Error for ${hangedManCard.name}:`, response.status, errorText);
      return false;
    }

    const imageBuffer = await response.arrayBuffer();
    
    if (imageBuffer.byteLength === 0) {
      console.error(`❌ Empty image buffer for ${hangedManCard.name}`);
      return false;
    }

    fs.writeFileSync(outputPath, Buffer.from(imageBuffer));
    
    console.log(`✨ Successfully generated ${hangedManCard.name}!`);
    console.log(`📁 Saved to: ${outputPath}`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Error generating ${hangedManCard.name}:`, error);
    return false;
  }
}

async function main() {
  console.log('🔄 Starting Hanged Man card generation...');
  
  const success = await generateHangedManCard();
  
  if (success) {
    console.log('🎉 Hanged Man card generation completed successfully!');
  } else {
    console.log('❌ Hanged Man card generation failed');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});