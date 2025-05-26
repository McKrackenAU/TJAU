/**
 * Generate The Emperor Card - Ultra-Ethereal Style
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

const emperorCard: CardData = {
  id: "4",
  name: "The Emperor",
  filename: "04-emperor.png",
  prompt: `The Emperor tarot card in ultra-ethereal style. A powerful masculine figure with liquid starlight hair flowing like cosmic energy, seated on a stone throne carved with ram heads. He wears translucent armor in musky pink and purple that shimmers with divine authority. An ornate crown adorns his head, and he holds a golden ankh scepter. His white beard flows like celestial mist, and his eyes glow with ancient wisdom. Red mountains rise behind him under a cosmic sky. Dreamlike quality with soft, translucent textures and ethereal lighting. Colors: deep purples, musky pinks, golden authority tones, and fiery reds. Commanding, structured, and powerfully paternal atmosphere.`
};

function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function generateEmperorCard(): Promise<boolean> {
  try {
    console.log(`🎨 Generating ${emperorCard.name}...`);
    
    const outputDir = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana');
    ensureDirectoryExists(outputDir);
    
    const outputPath = path.join(outputDir, emperorCard.filename);
    
    if (fs.existsSync(outputPath)) {
      console.log(`✅ ${emperorCard.name} already exists, skipping...`);
      return true;
    }

    console.log(`📡 Calling Hugging Face API for ${emperorCard.name}...`);
    
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HUGGINGFACE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: emperorCard.prompt,
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
      console.error(`❌ API Error for ${emperorCard.name}:`, response.status, errorText);
      return false;
    }

    const imageBuffer = await response.arrayBuffer();
    
    if (imageBuffer.byteLength === 0) {
      console.error(`❌ Empty image buffer for ${emperorCard.name}`);
      return false;
    }

    fs.writeFileSync(outputPath, Buffer.from(imageBuffer));
    
    console.log(`✨ Successfully generated ${emperorCard.name}!`);
    console.log(`📁 Saved to: ${outputPath}`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Error generating ${emperorCard.name}:`, error);
    return false;
  }
}

async function main() {
  console.log('👑 Starting Emperor card generation...');
  
  const success = await generateEmperorCard();
  
  if (success) {
    console.log('🎉 Emperor card generation completed successfully!');
  } else {
    console.log('❌ Emperor card generation failed');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});