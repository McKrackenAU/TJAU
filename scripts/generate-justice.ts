/**
 * Generate Justice Card - Ultra-Ethereal Style
 * Matching The Fool and The Magician aesthetic exactly
 */

import fs from 'fs';
import path from 'path';

const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

if (!HUGGINGFACE_API_TOKEN) {
  console.error('HUGGINGFACE_API_TOKEN is required');
  process.exit(1);
}

const justiceCard = {
  id: "11",
  name: "Justice",
  filename: "11-justice.png",
  prompt: `Justice tarot card, ultra-ethereal dreamy style with soft glowing translucent robes in musky purple and pink tones. A serene figure with flowing luminous hair sits on a throne between pillars of light, holding glowing scales of pure starlight in one hand and a sword of crystalline light in the other. The scales emit gentle cosmic energy. Two pillars frame the scene with flowing cosmic curtains. Background has soft purple and pink cosmic clouds with gentle starlight. Translucent flowing fabrics, dreamlike atmosphere, soft glowing lighting, mystical and ethereal. Same dreamy translucent style as The Fool card.`
};

function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function generateJusticeCard(): Promise<boolean> {
  try {
    console.log(`🎨 Generating ${justiceCard.name} with ultra-ethereal style...`);
    
    const outputDir = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana');
    ensureDirectoryExists(outputDir);
    
    const outputPath = path.join(outputDir, justiceCard.filename);
    
    if (fs.existsSync(outputPath)) {
      console.log(`✅ ${justiceCard.name} already exists, skipping...`);
      return true;
    }

    console.log(`📡 Calling image generation service for ${justiceCard.name}...`);
    
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HUGGINGFACE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: justiceCard.prompt,
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
      console.error(`❌ API Error for ${justiceCard.name}:`, response.status, errorText);
      return false;
    }

    const imageBuffer = await response.arrayBuffer();
    
    if (imageBuffer.byteLength === 0) {
      console.error(`❌ Empty image buffer for ${justiceCard.name}`);
      return false;
    }

    fs.writeFileSync(outputPath, Buffer.from(imageBuffer));
    
    console.log(`✨ Successfully generated ${justiceCard.name}!`);
    console.log(`📁 Saved to: ${outputPath}`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Error generating ${justiceCard.name}:`, error);
    return false;
  }
}

async function main() {
  console.log('⚖️ Starting Justice card generation...');
  
  const success = await generateJusticeCard();
  
  if (success) {
    console.log('🎉 Justice card generation completed successfully!');
  } else {
    console.log('❌ Justice card generation failed');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});