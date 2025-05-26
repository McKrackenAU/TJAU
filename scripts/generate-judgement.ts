/**
 * Generate Judgement Card - Ultra-Ethereal Style
 * Matching The Fool and The Magician aesthetic exactly
 */

import fs from 'fs';
import path from 'path';

const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

if (!HUGGINGFACE_API_TOKEN) {
  console.error('HUGGINGFACE_API_TOKEN is required');
  process.exit(1);
}

const judgementCard = {
  id: "20",
  name: "Judgement",
  filename: "20-judgement.png",
  prompt: `Judgement tarot card, ultra-ethereal dreamy style with soft glowing translucent robes in musky purple and pink tones. An archangel with flowing starlight hair and magnificent luminous wings emerges from cosmic clouds, blowing a golden trumpet that emanates pure light. Below, three figures with flowing hair rise joyfully from crystalline tombs made of starlight, their arms raised in celebration of spiritual rebirth. Mountains of light glow in the distance. The scene represents awakening and divine calling. Background has soft purple and pink cosmic clouds with gentle divine light. Translucent flowing fabrics, dreamlike atmosphere, soft glowing lighting, mystical and ethereal. Same dreamy translucent style as The Fool card.`
};

function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function generateJudgementCard(): Promise<boolean> {
  try {
    console.log(`🎨 Generating ${judgementCard.name} with ultra-ethereal style...`);
    
    const outputDir = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana');
    ensureDirectoryExists(outputDir);
    
    const outputPath = path.join(outputDir, judgementCard.filename);
    
    if (fs.existsSync(outputPath)) {
      console.log(`✅ ${judgementCard.name} already exists, skipping...`);
      return true;
    }

    console.log(`📡 Calling image generation service for ${judgementCard.name}...`);
    
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HUGGINGFACE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: judgementCard.prompt,
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
      console.error(`❌ API Error for ${judgementCard.name}:`, response.status, errorText);
      return false;
    }

    const imageBuffer = await response.arrayBuffer();
    
    if (imageBuffer.byteLength === 0) {
      console.error(`❌ Empty image buffer for ${judgementCard.name}`);
      return false;
    }

    fs.writeFileSync(outputPath, Buffer.from(imageBuffer));
    
    console.log(`✨ Successfully generated ${judgementCard.name}!`);
    console.log(`📁 Saved to: ${outputPath}`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Error generating ${judgementCard.name}:`, error);
    return false;
  }
}

async function main() {
  console.log('📯 Starting Judgement card generation...');
  
  const success = await generateJudgementCard();
  
  if (success) {
    console.log('🎉 Judgement card generation completed successfully!');
  } else {
    console.log('❌ Judgement card generation failed');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});