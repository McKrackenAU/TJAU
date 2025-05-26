/**
 * Generate The Devil Card - Ultra-Ethereal Style
 * Matching The Fool and The Magician aesthetic exactly
 */

import fs from 'fs';
import path from 'path';

const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

if (!HUGGINGFACE_API_TOKEN) {
  console.error('HUGGINGFACE_API_TOKEN is required');
  process.exit(1);
}

const devilCard = {
  id: "15",
  name: "The Devil",
  filename: "15-devil.png",
  prompt: `The Devil tarot card, ultra-ethereal dreamy style with soft glowing translucent robes in musky purple and pink tones. A powerful yet beautiful figure with flowing luminous hair sits on a throne of cosmic energy, representing temptation and earthly desires but not evil. Two figures with small horns stand chained below, but the chains are loose and made of starlight, showing they can free themselves. The scene represents liberation from illusion rather than bondage. Background has soft purple and pink cosmic clouds with gentle starlight. Translucent flowing fabrics, dreamlike atmosphere, soft glowing lighting, mystical and ethereal. Same dreamy translucent style as The Fool card.`
};

function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function generateDevilCard(): Promise<boolean> {
  try {
    console.log(`🎨 Generating ${devilCard.name} with ultra-ethereal style...`);
    
    const outputDir = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana');
    ensureDirectoryExists(outputDir);
    
    const outputPath = path.join(outputDir, devilCard.filename);
    
    if (fs.existsSync(outputPath)) {
      console.log(`✅ ${devilCard.name} already exists, skipping...`);
      return true;
    }

    console.log(`📡 Calling image generation service for ${devilCard.name}...`);
    
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HUGGINGFACE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: devilCard.prompt,
          parameters: {
            negative_prompt: "low quality, blurry, distorted, ugly, deformed, text, watermark, signature, frame, border, realistic, photographic, scary, dark, evil, demonic",
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
      console.error(`❌ API Error for ${devilCard.name}:`, response.status, errorText);
      return false;
    }

    const imageBuffer = await response.arrayBuffer();
    
    if (imageBuffer.byteLength === 0) {
      console.error(`❌ Empty image buffer for ${devilCard.name}`);
      return false;
    }

    fs.writeFileSync(outputPath, Buffer.from(imageBuffer));
    
    console.log(`✨ Successfully generated ${devilCard.name}!`);
    console.log(`📁 Saved to: ${outputPath}`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Error generating ${devilCard.name}:`, error);
    return false;
  }
}

async function main() {
  console.log('🔗 Starting Devil card generation...');
  
  const success = await generateDevilCard();
  
  if (success) {
    console.log('🎉 Devil card generation completed successfully!');
  } else {
    console.log('❌ Devil card generation failed');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});