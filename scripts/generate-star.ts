/**
 * Generate The Star Card - Ultra-Ethereal Style
 * Matching The Fool and The Magician aesthetic exactly
 */

import fs from 'fs';
import path from 'path';

const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

if (!HUGGINGFACE_API_TOKEN) {
  console.error('HUGGINGFACE_API_TOKEN is required');
  process.exit(1);
}

const starCard = {
  id: "17",
  name: "The Star",
  filename: "17-star.png",
  prompt: `The Star tarot card, ultra-ethereal dreamy style with soft glowing translucent robes in musky purple and pink tones. A luminous figure with flowing starlight hair kneels gracefully by a cosmic pool, pouring liquid starlight from two vessels - one into the water, one onto the ethereal land. Seven small stars and one large star shine brilliantly in the cosmic sky above. A beautiful bird made of light perches on a tree of cosmic energy. The scene radiates hope and divine guidance. Background has soft purple and pink cosmic clouds with gentle starlight. Translucent flowing fabrics, dreamlike atmosphere, soft glowing lighting, mystical and ethereal. Same dreamy translucent style as The Fool card.`
};

function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function generateStarCard(): Promise<boolean> {
  try {
    console.log(`🎨 Generating ${starCard.name} with ultra-ethereal style...`);
    
    const outputDir = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana');
    ensureDirectoryExists(outputDir);
    
    const outputPath = path.join(outputDir, starCard.filename);
    
    if (fs.existsSync(outputPath)) {
      console.log(`✅ ${starCard.name} already exists, skipping...`);
      return true;
    }

    console.log(`📡 Calling image generation service for ${starCard.name}...`);
    
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HUGGINGFACE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: starCard.prompt,
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
      console.error(`❌ API Error for ${starCard.name}:`, response.status, errorText);
      return false;
    }

    const imageBuffer = await response.arrayBuffer();
    
    if (imageBuffer.byteLength === 0) {
      console.error(`❌ Empty image buffer for ${starCard.name}`);
      return false;
    }

    fs.writeFileSync(outputPath, Buffer.from(imageBuffer));
    
    console.log(`✨ Successfully generated ${starCard.name}!`);
    console.log(`📁 Saved to: ${outputPath}`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Error generating ${starCard.name}:`, error);
    return false;
  }
}

async function main() {
  console.log('⭐ Starting Star card generation...');
  
  const success = await generateStarCard();
  
  if (success) {
    console.log('🎉 Star card generation completed successfully!');
  } else {
    console.log('❌ Star card generation failed');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});