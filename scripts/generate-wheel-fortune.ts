/**
 * Generate Wheel of Fortune Card - Ultra-Ethereal Style
 * Matching The Fool and The Magician aesthetic exactly
 */

import fs from 'fs';
import path from 'path';

const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

if (!HUGGINGFACE_API_TOKEN) {
  console.error('HUGGINGFACE_API_TOKEN is required');
  process.exit(1);
}

const wheelCard = {
  id: "10",
  name: "Wheel of Fortune",
  filename: "10-wheel.png",
  prompt: `Wheel of Fortune tarot card, ultra-ethereal dreamy style with soft glowing cosmic wheel made of pure starlight and translucent energy. The mystical wheel floats in space surrounded by soft purple and pink cosmic clouds. Glowing mystical symbols and ancient runes orbit around the wheel. Four angelic beings in translucent robes float in the corners. Background has gentle starlight and flowing cosmic mist in musky purple and pink tones. Translucent flowing elements, dreamlike atmosphere, soft glowing lighting, mystical and ethereal. Same dreamy translucent style as The Fool card.`
};

function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function generateWheelCard(): Promise<boolean> {
  try {
    console.log(`🎨 Generating ${wheelCard.name} with ultra-ethereal style...`);
    
    const outputDir = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana');
    ensureDirectoryExists(outputDir);
    
    const outputPath = path.join(outputDir, wheelCard.filename);
    
    if (fs.existsSync(outputPath)) {
      console.log(`✅ ${wheelCard.name} already exists, skipping...`);
      return true;
    }

    console.log(`📡 Calling image generation service for ${wheelCard.name}...`);
    
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HUGGINGFACE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: wheelCard.prompt,
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
      console.error(`❌ API Error for ${wheelCard.name}:`, response.status, errorText);
      return false;
    }

    const imageBuffer = await response.arrayBuffer();
    
    if (imageBuffer.byteLength === 0) {
      console.error(`❌ Empty image buffer for ${wheelCard.name}`);
      return false;
    }

    fs.writeFileSync(outputPath, Buffer.from(imageBuffer));
    
    console.log(`✨ Successfully generated ${wheelCard.name}!`);
    console.log(`📁 Saved to: ${outputPath}`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Error generating ${wheelCard.name}:`, error);
    return false;
  }
}

async function main() {
  console.log('🎰 Starting Wheel of Fortune card generation...');
  
  const success = await generateWheelCard();
  
  if (success) {
    console.log('🎉 Wheel of Fortune card generation completed successfully!');
  } else {
    console.log('❌ Wheel of Fortune card generation failed');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});