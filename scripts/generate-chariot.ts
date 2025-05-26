/**
 * Generate The Chariot Card - Ultra-Ethereal Style
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

const chariotCard: CardData = {
  id: "7",
  name: "The Chariot",
  filename: "07-chariot.png",
  prompt: `The Chariot tarot card in ultra-ethereal style. A triumphant figure with liquid starlight hair flowing like cosmic energy, standing in a celestial chariot. He wears translucent armor in musky pink and purple that shimmers with divine willpower. A crown of stars adorns his head, and he holds the reins of two ethereal sphinxes - one light, one dark - representing duality. The chariot wheels glow with celestial energy. A canopy of stars covers the chariot, and a city skyline shimmers in the distance. Dreamlike quality with soft, translucent textures and ethereal lighting. Colors: deep purples, musky pinks, stellar silver, and cosmic blues. Victorious, determined, and powerfully focused atmosphere.`
};

function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function generateChariotCard(): Promise<boolean> {
  try {
    console.log(`🎨 Generating ${chariotCard.name}...`);
    
    const outputDir = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana');
    ensureDirectoryExists(outputDir);
    
    const outputPath = path.join(outputDir, chariotCard.filename);
    
    if (fs.existsSync(outputPath)) {
      console.log(`✅ ${chariotCard.name} already exists, skipping...`);
      return true;
    }

    console.log(`📡 Calling Hugging Face API for ${chariotCard.name}...`);
    
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HUGGINGFACE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: chariotCard.prompt,
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
      console.error(`❌ API Error for ${chariotCard.name}:`, response.status, errorText);
      return false;
    }

    const imageBuffer = await response.arrayBuffer();
    
    if (imageBuffer.byteLength === 0) {
      console.error(`❌ Empty image buffer for ${chariotCard.name}`);
      return false;
    }

    fs.writeFileSync(outputPath, Buffer.from(imageBuffer));
    
    console.log(`✨ Successfully generated ${chariotCard.name}!`);
    console.log(`📁 Saved to: ${outputPath}`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Error generating ${chariotCard.name}:`, error);
    return false;
  }
}

async function main() {
  console.log('🏆 Starting Chariot card generation...');
  
  const success = await generateChariotCard();
  
  if (success) {
    console.log('🎉 Chariot card generation completed successfully!');
  } else {
    console.log('❌ Chariot card generation failed');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});