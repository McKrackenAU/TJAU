/**
 * Generate Strength Card - Ultra-Ethereal Style
 * Matching The Fool and The Magician aesthetic exactly
 */

import fs from 'fs';
import path from 'path';

const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

if (!HUGGINGFACE_API_TOKEN) {
  console.error('HUGGINGFACE_API_TOKEN is required');
  process.exit(1);
}

const strengthCard = {
  id: "08",
  name: "Strength",
  filename: "08-strength.png",
  prompt: `Strength tarot card, ultra-ethereal dreamy style with soft glowing translucent robes in musky purple and pink tones. A graceful woman with flowing starlight hair gently holds the jaws of a magnificent cosmic lion made of liquid light and starfire. She wears flowing ethereal robes that shimmer like aurora. Above her head floats an infinity symbol made of pure golden light. The lion's mane flows like cosmic wind, and its eyes sparkle with ancient wisdom. Mountains of crystal light glow in the background. The scene represents inner strength, courage, and gentle power. Background has soft purple and pink cosmic clouds with gentle divine light. Translucent flowing fabrics, dreamlike atmosphere, soft glowing lighting, mystical and ethereal. Same dreamy translucent style as The Fool card.`
};

function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function generateStrengthCard(): Promise<boolean> {
  try {
    console.log(`🎨 Generating ${strengthCard.name} with ultra-ethereal style...`);
    
    const outputDir = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana');
    ensureDirectoryExists(outputDir);
    
    const outputPath = path.join(outputDir, strengthCard.filename);
    
    if (fs.existsSync(outputPath)) {
      console.log(`✅ ${strengthCard.name} already exists, skipping...`);
      return true;
    }

    console.log(`📡 Calling image generation service for ${strengthCard.name}...`);
    
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HUGGINGFACE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: strengthCard.prompt,
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
      console.error(`❌ API Error for ${strengthCard.name}:`, response.status, errorText);
      return false;
    }

    const imageBuffer = await response.arrayBuffer();
    
    if (imageBuffer.byteLength === 0) {
      console.error(`❌ Empty image buffer for ${strengthCard.name}`);
      return false;
    }

    fs.writeFileSync(outputPath, Buffer.from(imageBuffer));
    
    console.log(`✨ Successfully generated ${strengthCard.name}!`);
    console.log(`📁 Saved to: ${outputPath}`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Error generating ${strengthCard.name}:`, error);
    return false;
  }
}

async function main() {
  console.log('💪 Starting Strength card generation...');
  
  const success = await generateStrengthCard();
  
  if (success) {
    console.log('🎉 Strength card generation completed successfully!');
  } else {
    console.log('❌ Strength card generation failed');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});