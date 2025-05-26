/**
 * Generate The Moon Card - Ultra-Ethereal Style
 * Matching The Fool and The Magician aesthetic exactly
 */

import fs from 'fs';
import path from 'path';

const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

if (!HUGGINGFACE_API_TOKEN) {
  console.error('HUGGINGFACE_API_TOKEN is required');
  process.exit(1);
}

const moonCard = {
  id: "18",
  name: "The Moon",
  filename: "18-moon.png",
  prompt: `The Moon tarot card, ultra-ethereal dreamy style with soft glowing translucent robes in musky purple and pink tones. A mystical full moon with a serene face glows brilliantly in the cosmic sky, casting gentle silver light. Two towers of starlight stand on either side of a winding path made of liquid moonlight. A cosmic wolf and ethereal dog howl peacefully at the moon. A mystical crayfish made of starlight emerges from a pool of cosmic water. Gentle dewdrops fall like liquid starlight. Background has soft purple and pink cosmic clouds with gentle moonbeams. Translucent flowing elements, dreamlike atmosphere, soft glowing lighting, mystical and ethereal. Same dreamy translucent style as The Fool card.`
};

function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function generateMoonCard(): Promise<boolean> {
  try {
    console.log(`🎨 Generating ${moonCard.name} with ultra-ethereal style...`);
    
    const outputDir = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana');
    ensureDirectoryExists(outputDir);
    
    const outputPath = path.join(outputDir, moonCard.filename);
    
    if (fs.existsSync(outputPath)) {
      console.log(`✅ ${moonCard.name} already exists, skipping...`);
      return true;
    }

    console.log(`📡 Calling image generation service for ${moonCard.name}...`);
    
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HUGGINGFACE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: moonCard.prompt,
          parameters: {
            negative_prompt: "low quality, blurry, distorted, ugly, deformed, text, watermark, signature, frame, border, realistic, photographic, scary, dark",
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
      console.error(`❌ API Error for ${moonCard.name}:`, response.status, errorText);
      return false;
    }

    const imageBuffer = await response.arrayBuffer();
    
    if (imageBuffer.byteLength === 0) {
      console.error(`❌ Empty image buffer for ${moonCard.name}`);
      return false;
    }

    fs.writeFileSync(outputPath, Buffer.from(imageBuffer));
    
    console.log(`✨ Successfully generated ${moonCard.name}!`);
    console.log(`📁 Saved to: ${outputPath}`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Error generating ${moonCard.name}:`, error);
    return false;
  }
}

async function main() {
  console.log('🌙 Starting Moon card generation...');
  
  const success = await generateMoonCard();
  
  if (success) {
    console.log('🎉 Moon card generation completed successfully!');
  } else {
    console.log('❌ Moon card generation failed');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});