/**
 * Optimized Single Card Generation - Direct and Focused
 * Generate one specific card with optimized prompts and error handling
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

const highPriestessCard: CardData = {
  id: "2",
  name: "The High Priestess",
  filename: "02-high-priestess.png",
  prompt: `The High Priestess tarot card in ultra-ethereal style. A mystical feminine figure with liquid starlight hair flowing like cosmic waves, seated between pillars of light and shadow. She wears translucent robes in musky pink and purple that shimmer with celestial energy. Her third eye glows softly, and she holds a scroll of ancient wisdom. Behind her hangs a veil decorated with pomegranates and mystical symbols. The moon phases crown her head like a silver diadem. Dreamlike quality with soft, translucent textures and ethereal lighting. Colors: deep purples, musky pinks, silver moonlight, and cosmic blues. Mystical, intuitive, and deeply spiritual atmosphere.`
};

function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function generateHighPriestessCard(): Promise<boolean> {
  try {
    console.log(`🎨 Generating ${highPriestessCard.name}...`);
    
    // Ensure directory exists
    const outputDir = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana');
    ensureDirectoryExists(outputDir);
    
    const outputPath = path.join(outputDir, highPriestessCard.filename);
    
    // Check if card already exists
    if (fs.existsSync(outputPath)) {
      console.log(`✅ ${highPriestessCard.name} already exists, skipping...`);
      return true;
    }

    console.log(`📡 Calling Hugging Face API for ${highPriestessCard.name}...`);
    
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HUGGINGFACE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: highPriestessCard.prompt,
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
      console.error(`❌ API Error for ${highPriestessCard.name}:`, response.status, errorText);
      return false;
    }

    const imageBuffer = await response.arrayBuffer();
    
    if (imageBuffer.byteLength === 0) {
      console.error(`❌ Empty image buffer for ${highPriestessCard.name}`);
      return false;
    }

    // Save the image
    fs.writeFileSync(outputPath, Buffer.from(imageBuffer));
    
    console.log(`✨ Successfully generated ${highPriestessCard.name}!`);
    console.log(`📁 Saved to: ${outputPath}`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Error generating ${highPriestessCard.name}:`, error);
    return false;
  }
}

async function main() {
  console.log('🔮 Starting High Priestess card generation...');
  
  const success = await generateHighPriestessCard();
  
  if (success) {
    console.log('🎉 High Priestess card generation completed successfully!');
  } else {
    console.log('❌ High Priestess card generation failed');
    process.exit(1);
  }
}

// Run the script
main().catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});