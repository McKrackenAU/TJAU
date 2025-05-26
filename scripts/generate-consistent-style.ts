/**
 * Generate Major Arcana Cards - Consistent Ultra-Ethereal Style
 * Matching The Fool and The Magician aesthetic exactly
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

// Cards that need consistent ultra-ethereal style
const cardsToGenerate: CardData[] = [
  {
    id: "7",
    name: "The Chariot",
    filename: "07-chariot.png",
    prompt: `The Chariot tarot card, ultra-ethereal dreamy style with soft glowing translucent robes in musky purple and pink tones. A serene figure with flowing luminous hair stands in a celestial chariot made of starlight and cosmic energy. Two sphinx creatures made of pure light energy flank the chariot. Background has soft purple and pink cosmic clouds with gentle starlight. Translucent flowing fabrics, dreamlike atmosphere, soft glowing lighting, mystical and ethereal. Same style as The Fool card - dreamy, translucent, flowing.`
  },
  {
    id: "8",
    name: "Strength",
    filename: "08-strength.png",
    prompt: `Strength tarot card, ultra-ethereal dreamy style with soft glowing translucent robes in musky purple and pink tones. A gentle feminine figure with flowing luminous hair peacefully taming a glowing lion made of starlight. Infinity symbol glows softly above her head. Background has soft purple and pink cosmic clouds. Translucent flowing fabrics, dreamlike atmosphere, soft glowing lighting, mystical and ethereal. Same style as The Fool card - dreamy, translucent, flowing.`
  },
  {
    id: "9",
    name: "The Hermit",
    filename: "09-hermit.png",
    prompt: `The Hermit tarot card, ultra-ethereal dreamy style with soft glowing translucent robes in musky purple and pink tones. A wise figure with flowing luminous hair holds a glowing lantern of starlight. His robes flow like cosmic mist. Background shows a mystical mountain peak surrounded by soft purple and pink cosmic clouds. Translucent flowing fabrics, dreamlike atmosphere, soft glowing lighting, mystical and ethereal. Same style as The Fool card - dreamy, translucent, flowing.`
  },
  {
    id: "10",
    name: "Wheel of Fortune",
    filename: "10-wheel.png",
    prompt: `Wheel of Fortune tarot card, ultra-ethereal dreamy style with soft glowing cosmic wheel made of starlight and energy. The wheel floats in space surrounded by soft purple and pink cosmic clouds. Mystical symbols glow softly around the wheel. Background has gentle starlight and flowing cosmic energy. Translucent flowing elements, dreamlike atmosphere, soft glowing lighting, mystical and ethereal. Same style as The Fool card - dreamy, translucent, flowing.`
  },
  {
    id: "11",
    name: "Justice",
    filename: "11-justice.png",
    prompt: `Justice tarot card, ultra-ethereal dreamy style with soft glowing translucent robes in musky purple and pink tones. A serene figure with flowing luminous hair holds glowing scales of starlight and a sword of pure light. Pillars of light frame the scene. Background has soft purple and pink cosmic clouds. Translucent flowing fabrics, dreamlike atmosphere, soft glowing lighting, mystical and ethereal. Same style as The Fool card - dreamy, translucent, flowing.`
  }
];

function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function generateCard(card: CardData): Promise<boolean> {
  try {
    console.log(`🎨 Generating ${card.name} with consistent ultra-ethereal style...`);
    
    const outputDir = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana');
    ensureDirectoryExists(outputDir);
    
    const outputPath = path.join(outputDir, card.filename);
    
    if (fs.existsSync(outputPath)) {
      console.log(`✅ ${card.name} already exists, skipping...`);
      return true;
    }

    console.log(`📡 Calling Hugging Face API for ${card.name}...`);
    
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HUGGINGFACE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: card.prompt,
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
      console.error(`❌ API Error for ${card.name}:`, response.status, errorText);
      return false;
    }

    const imageBuffer = await response.arrayBuffer();
    
    if (imageBuffer.byteLength === 0) {
      console.error(`❌ Empty image buffer for ${card.name}`);
      return false;
    }

    fs.writeFileSync(outputPath, Buffer.from(imageBuffer));
    
    console.log(`✨ Successfully generated ${card.name} with consistent style!`);
    console.log(`📁 Saved to: ${outputPath}`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Error generating ${card.name}:`, error);
    return false;
  }
}

async function main() {
  console.log('🌟 Starting consistent ultra-ethereal card generation...');
  
  for (const card of cardsToGenerate) {
    const success = await generateCard(card);
    if (!success) {
      console.log(`❌ Failed to generate ${card.name}`);
      process.exit(1);
    }
    
    // Small delay between cards to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('🎉 All cards generated with consistent ultra-ethereal style!');
}

main().catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});