/**
 * Generate The Lovers Card - Ultra-Ethereal Style
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

const loversCard: CardData = {
  id: "6",
  name: "The Lovers",
  filename: "06-lovers.png",
  prompt: `The Lovers tarot card in ultra-ethereal style. Two celestial beings with liquid starlight hair flowing like cosmic energy, standing in a garden of paradise. They wear translucent garments in musky pink and purple that shimmer with divine love. Above them, an angel with rainbow wings blesses their union, radiating golden light. The Tree of Life and Tree of Knowledge frame the scene with blooming flowers. A mountain peak rises in the distance under a cosmic sky. Dreamlike quality with soft, translucent textures and ethereal lighting. Colors: deep purples, musky pinks, golden divine light, and emerald garden greens. Harmonious, loving, and deeply spiritual atmosphere.`
};

function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function generateLoversCard(): Promise<boolean> {
  try {
    console.log(`🎨 Generating ${loversCard.name}...`);
    
    const outputDir = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana');
    ensureDirectoryExists(outputDir);
    
    const outputPath = path.join(outputDir, loversCard.filename);
    
    if (fs.existsSync(outputPath)) {
      console.log(`✅ ${loversCard.name} already exists, skipping...`);
      return true;
    }

    console.log(`📡 Calling Hugging Face API for ${loversCard.name}...`);
    
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HUGGINGFACE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: loversCard.prompt,
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
      console.error(`❌ API Error for ${loversCard.name}:`, response.status, errorText);
      return false;
    }

    const imageBuffer = await response.arrayBuffer();
    
    if (imageBuffer.byteLength === 0) {
      console.error(`❌ Empty image buffer for ${loversCard.name}`);
      return false;
    }

    fs.writeFileSync(outputPath, Buffer.from(imageBuffer));
    
    console.log(`✨ Successfully generated ${loversCard.name}!`);
    console.log(`📁 Saved to: ${outputPath}`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Error generating ${loversCard.name}:`, error);
    return false;
  }
}

async function main() {
  console.log('💕 Starting Lovers card generation...');
  
  const success = await generateLoversCard();
  
  if (success) {
    console.log('🎉 Lovers card generation completed successfully!');
  } else {
    console.log('❌ Lovers card generation failed');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});