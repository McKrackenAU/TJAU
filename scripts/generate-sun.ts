/**
 * Generate The Sun Card - Ultra-Ethereal Style
 * Matching The Fool and The Magician aesthetic exactly
 */

import fs from 'fs';
import path from 'path';

const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

if (!HUGGINGFACE_API_TOKEN) {
  console.error('HUGGINGFACE_API_TOKEN is required');
  process.exit(1);
}

const sunCard = {
  id: "19",
  name: "The Sun",
  filename: "19-sun.png",
  prompt: `The Sun tarot card, ultra-ethereal dreamy style with soft glowing translucent robes in musky purple and pink tones. A radiant sun with a gentle face beams golden light across a cosmic landscape. A joyful child with flowing starlight hair rides a white horse made of pure light energy through a field of cosmic sunflowers that glow like stars. The child holds a banner of light that flows like liquid starlight. A garden wall made of crystalline energy sparkles in the background. Everything radiates pure joy and divine blessing. Background has soft purple and pink cosmic clouds with warm golden sunlight. Translucent flowing fabrics, dreamlike atmosphere, soft glowing lighting, mystical and ethereal. Same dreamy translucent style as The Fool card.`
};

function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function generateSunCard(): Promise<boolean> {
  try {
    console.log(`🎨 Generating ${sunCard.name} with ultra-ethereal style...`);
    
    const outputDir = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana');
    ensureDirectoryExists(outputDir);
    
    const outputPath = path.join(outputDir, sunCard.filename);
    
    if (fs.existsSync(outputPath)) {
      console.log(`✅ ${sunCard.name} already exists, skipping...`);
      return true;
    }

    console.log(`📡 Calling image generation service for ${sunCard.name}...`);
    
    const response = await fetch(
      "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${HUGGINGFACE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: sunCard.prompt,
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
      console.error(`❌ API Error for ${sunCard.name}:`, response.status, errorText);
      return false;
    }

    const imageBuffer = await response.arrayBuffer();
    
    if (imageBuffer.byteLength === 0) {
      console.error(`❌ Empty image buffer for ${sunCard.name}`);
      return false;
    }

    fs.writeFileSync(outputPath, Buffer.from(imageBuffer));
    
    console.log(`✨ Successfully generated ${sunCard.name}!`);
    console.log(`📁 Saved to: ${outputPath}`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Error generating ${sunCard.name}:`, error);
    return false;
  }
}

async function main() {
  console.log('☀️ Starting Sun card generation...');
  
  const success = await generateSunCard();
  
  if (success) {
    console.log('🎉 Sun card generation completed successfully!');
  } else {
    console.log('❌ Sun card generation failed');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});