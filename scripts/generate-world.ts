/**
 * Generate The World Card - Ultra-Ethereal Style
 * Matching The Fool and The Magician aesthetic exactly
 */

import fs from 'fs';
import path from 'path';

const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

if (!HUGGINGFACE_API_TOKEN) {
  console.error('HUGGINGFACE_API_TOKEN is required');
  process.exit(1);
}

const worldCard = {
  id: "21",
  name: "The World",
  filename: "21-world.png",
  prompt: `The World tarot card, ultra-ethereal dreamy style with soft glowing translucent robes in musky purple and pink tones. A graceful dancing figure with flowing starlight hair floats within a cosmic laurel wreath made of liquid light and starfire. The dancer holds flowing ribbons of pure energy. In the four corners, celestial symbols appear as ethereal beings: an angel of light, an eagle of cosmic winds, a lion of stellar fire, and a bull of earth energy - all translucent and glowing. The entire scene represents completion, fulfillment, and cosmic unity. Background has soft purple and pink cosmic clouds with gentle divine light radiating everywhere. Translucent flowing fabrics, dreamlike atmosphere, soft glowing lighting, mystical and ethereal. Same dreamy translucent style as The Fool card.`
};

function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function generateWorldCard(): Promise<boolean> {
  try {
    console.log(`🎨 Generating ${worldCard.name} with ultra-ethereal style...`);
    
    const outputDir = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana');
    ensureDirectoryExists(outputDir);
    
    const outputPath = path.join(outputDir, worldCard.filename);
    
    if (fs.existsSync(outputPath)) {
      console.log(`✅ ${worldCard.name} already exists, skipping...`);
      return true;
    }

    console.log(`📡 Calling image generation service for ${worldCard.name}...`);
    
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HUGGINGFACE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: worldCard.prompt,
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
      console.error(`❌ API Error for ${worldCard.name}:`, response.status, errorText);
      return false;
    }

    const imageBuffer = await response.arrayBuffer();
    
    if (imageBuffer.byteLength === 0) {
      console.error(`❌ Empty image buffer for ${worldCard.name}`);
      return false;
    }

    fs.writeFileSync(outputPath, Buffer.from(imageBuffer));
    
    console.log(`✨ Successfully generated ${worldCard.name}!`);
    console.log(`📁 Saved to: ${outputPath}`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Error generating ${worldCard.name}:`, error);
    return false;
  }
}

async function main() {
  console.log('🌍 Starting World card generation...');
  
  const success = await generateWorldCard();
  
  if (success) {
    console.log('🎉 World card generation completed successfully!');
  } else {
    console.log('❌ World card generation failed');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});