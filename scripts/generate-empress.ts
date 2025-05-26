/**
 * Generate The Empress Card - Ultra-Ethereal Style
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

const empressCard: CardData = {
  id: "3",
  name: "The Empress",
  filename: "03-empress.png",
  prompt: `The Empress tarot card in ultra-ethereal style. A radiant maternal figure with liquid starlight hair flowing in celestial waves, wearing translucent robes in musky pink and purple that shimmer with divine feminine energy. She sits on a throne surrounded by abundant nature - blooming flowers, ripe wheat, flowing streams. A crown of twelve stars adorns her head, and she holds a scepter of Venus. Her pregnant form glows with creative life force. Pomegranates and cypress trees frame the scene. Dreamlike quality with soft, translucent textures and ethereal lighting. Colors: deep purples, musky pinks, golden harvest tones, and emerald greens. Nurturing, abundant, and deeply fertile atmosphere.`
};

function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function generateEmpressCard(): Promise<boolean> {
  try {
    console.log(`🎨 Generating ${empressCard.name}...`);
    
    const outputDir = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana');
    ensureDirectoryExists(outputDir);
    
    const outputPath = path.join(outputDir, empressCard.filename);
    
    if (fs.existsSync(outputPath)) {
      console.log(`✅ ${empressCard.name} already exists, skipping...`);
      return true;
    }

    console.log(`📡 Calling Hugging Face API for ${empressCard.name}...`);
    
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HUGGINGFACE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: empressCard.prompt,
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
      console.error(`❌ API Error for ${empressCard.name}:`, response.status, errorText);
      return false;
    }

    const imageBuffer = await response.arrayBuffer();
    
    if (imageBuffer.byteLength === 0) {
      console.error(`❌ Empty image buffer for ${empressCard.name}`);
      return false;
    }

    fs.writeFileSync(outputPath, Buffer.from(imageBuffer));
    
    console.log(`✨ Successfully generated ${empressCard.name}!`);
    console.log(`📁 Saved to: ${outputPath}`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Error generating ${empressCard.name}:`, error);
    return false;
  }
}

async function main() {
  console.log('🌸 Starting Empress card generation...');
  
  const success = await generateEmpressCard();
  
  if (success) {
    console.log('🎉 Empress card generation completed successfully!');
  } else {
    console.log('❌ Empress card generation failed');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});