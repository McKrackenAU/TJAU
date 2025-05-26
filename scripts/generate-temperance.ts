/**
 * Generate Temperance Card - Ultra-Ethereal Style
 * Matching The Fool and The Magician aesthetic exactly
 */

import fs from 'fs';
import path from 'path';

const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

if (!HUGGINGFACE_API_TOKEN) {
  console.error('HUGGINGFACE_API_TOKEN is required');
  process.exit(1);
}

const temperanceCard = {
  id: "14",
  name: "Temperance",
  filename: "14-temperance.png",
  prompt: `Temperance tarot card, ultra-ethereal dreamy style with soft glowing translucent robes in musky purple and pink tones. An angelic figure with flowing luminous hair and ethereal wings stands gracefully, pouring liquid starlight between two golden chalices. The liquid flows like liquid light between the cups. One foot stands on land, one in a flowing stream of cosmic energy. Mountains of light rise in the distance under a cosmic sky. Iris flowers bloom nearby. Background has soft purple and pink cosmic clouds with gentle starlight. Translucent flowing fabrics, dreamlike atmosphere, soft glowing lighting, mystical and ethereal. Same dreamy translucent style as The Fool card.`
};

function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function generateTemperanceCard(): Promise<boolean> {
  try {
    console.log(`🎨 Generating ${temperanceCard.name} with ultra-ethereal style...`);
    
    const outputDir = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana');
    ensureDirectoryExists(outputDir);
    
    const outputPath = path.join(outputDir, temperanceCard.filename);
    
    if (fs.existsSync(outputPath)) {
      console.log(`✅ ${temperanceCard.name} already exists, skipping...`);
      return true;
    }

    console.log(`📡 Calling image generation service for ${temperanceCard.name}...`);
    
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HUGGINGFACE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: temperanceCard.prompt,
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
      console.error(`❌ API Error for ${temperanceCard.name}:`, response.status, errorText);
      return false;
    }

    const imageBuffer = await response.arrayBuffer();
    
    if (imageBuffer.byteLength === 0) {
      console.error(`❌ Empty image buffer for ${temperanceCard.name}`);
      return false;
    }

    fs.writeFileSync(outputPath, Buffer.from(imageBuffer));
    
    console.log(`✨ Successfully generated ${temperanceCard.name}!`);
    console.log(`📁 Saved to: ${outputPath}`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Error generating ${temperanceCard.name}:`, error);
    return false;
  }
}

async function main() {
  console.log('🌊 Starting Temperance card generation...');
  
  const success = await generateTemperanceCard();
  
  if (success) {
    console.log('🎉 Temperance card generation completed successfully!');
  } else {
    console.log('❌ Temperance card generation failed');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});