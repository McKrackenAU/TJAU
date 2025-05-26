/**
 * Generate Strength Card - Ultra-Ethereal Style
 */

import fs from 'fs';
import path from 'path';

const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

if (!HUGGINGFACE_API_TOKEN) {
  console.error('HUGGINGFACE_API_TOKEN is required');
  process.exit(1);
}

interface CardData {
  id: string;
  name: string;
  filename: string;
  prompt: string;
}

const strengthCard: CardData = {
  id: "8",
  name: "Strength",
  filename: "08-strength.png",
  prompt: `Strength tarot card in ultra-ethereal style. A gentle feminine figure with liquid starlight hair flowing like cosmic energy, calmly taming a celestial lion. She wears translucent robes in musky pink and purple that shimmer with inner strength. An infinity symbol glows above her head like a halo. Her hands gently touch the lion's mane as it submits to her peaceful power. Flowers bloom around them in an ethereal garden. The scene radiates calm confidence and spiritual mastery. Dreamlike quality with soft, translucent textures and ethereal lighting. Colors: deep purples, musky pinks, golden lion mane, and soft garden greens. Gentle, powerful, and spiritually centered atmosphere.`
};

function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function generateStrengthCard(): Promise<boolean> {
  try {
    console.log(`🎨 Generating ${strengthCard.name}...`);
    
    const outputDir = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana');
    ensureDirectoryExists(outputDir);
    
    const outputPath = path.join(outputDir, strengthCard.filename);
    
    if (fs.existsSync(outputPath)) {
      console.log(`✅ ${strengthCard.name} already exists, skipping...`);
      return true;
    }

    console.log(`📡 Calling Hugging Face API for ${strengthCard.name}...`);
    
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
            negative_prompt: "low quality, blurry, distorted, ugly, deformed, text, watermark, signature, frame, border",
            num_inference_steps: 30,
            guidance_scale: 7.5,
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