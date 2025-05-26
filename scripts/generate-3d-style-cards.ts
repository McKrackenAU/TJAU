/**
 * Generate 3D Lifelike Cards - Ultra-Ethereal Style
 * Matching The Fool's otherworldly 3D dimensional quality
 */

import fs from 'fs';
import path from 'path';

const HUGGINGFACE_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;

if (!HUGGINGFACE_API_TOKEN) {
  console.error('HUGGINGFACE_API_TOKEN is required');
  process.exit(1);
}

const cards3D = [
  {
    id: "01",
    name: "The Magician",
    filename: "01-magician.png",
    prompt: `The Magician tarot card, ultra-ethereal dreamy style with incredibly lifelike 3D depth and dimension. A magnificent otherworldly figure with flowing liquid starlight hair that moves with cosmic wind, rendered in full 3D depth with realistic lighting and shadows. Translucent robes in musky purple and pink tones that shimmer with aurora-like qualities, flowing naturally around a three-dimensional form. The figure stands with one hand pointing to heaven, one to earth, surrounded by floating 3D magical tools that cast real shadows. Roses and lilies bloom in full dimensional detail around their feet. Background has layered cosmic clouds with genuine depth perception, soft purple and pink nebulae stretching into infinite distance. Photorealistic skin texture with ethereal glow, realistic fabric physics, dimensional lighting effects, otherworldly but completely lifelike presence. Same incredible 3D depth and lifelike quality as The Fool card.`
  },
  {
    id: "02",
    name: "The High Priestess",
    filename: "02-high-priestess.png",
    prompt: `The High Priestess tarot card, ultra-ethereal dreamy style with incredibly lifelike 3D depth and dimension. A mystical otherworldly woman with flowing liquid starlight hair cascading in realistic 3D waves, rendered with photorealistic depth and natural lighting. Translucent robes in musky purple and pink tones that drape naturally over her three-dimensional form with realistic fabric physics. She sits between two crystalline pillars that extend into genuine depth, holding a sacred scroll that unfurls in 3D space. A crescent moon crown floats above her head with dimensional shadows. Behind her, a cosmic veil flows in realistic depth with stars twinkling at various distances. Photorealistic skin with ethereal luminescence, natural facial features with otherworldly beauty, realistic hair movement, dimensional fabric flow. Background has true depth perception with layered cosmic elements. Same incredible 3D lifelike presence as The Fool card.`
  },
  {
    id: "17",
    name: "The Star",
    filename: "17-star.png",
    prompt: `The Star tarot card, ultra-ethereal dreamy style with incredibly lifelike 3D depth and dimension. A beautiful otherworldly woman with flowing liquid starlight hair moving naturally in cosmic breeze, rendered with photorealistic 3D depth and realistic lighting. Translucent robes in musky purple and pink tones flowing with natural fabric physics around her three-dimensional form. She kneels by a cosmic pool with genuine depth reflection, pouring liquid starlight from dimensional vessels that cast real shadows. Seven 3D stars float at various depths above her head, creating natural depth perception. Mountains of crystalline light extend into realistic distance with atmospheric perspective. Her skin has photorealistic texture with ethereal glow, natural facial features with otherworldly grace, realistic body proportions and movement. Background has true dimensional depth with layered cosmic clouds stretching to infinity. Same incredible 3D lifelike presence as The Fool card.`
  }
];

function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function generateEnhanced3DCard(card: typeof cards3D[0]): Promise<boolean> {
  try {
    console.log(`🎨 Generating enhanced 3D ${card.name} with lifelike depth...`);
    
    const outputDir = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana');
    ensureDirectoryExists(outputDir);
    
    const outputPath = path.join(outputDir, card.filename);
    
    // Back up existing card
    if (fs.existsSync(outputPath)) {
      const backupPath = outputPath.replace('.png', '-backup.png');
      fs.copyFileSync(outputPath, backupPath);
      console.log(`📋 Backed up existing ${card.name} to ${backupPath}`);
    }

    console.log(`📡 Generating 3D lifelike version of ${card.name}...`);
    
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
            negative_prompt: "flat, 2D, cartoon, anime, illustration, drawing, sketch, painting, low quality, blurry, distorted, ugly, deformed, text, watermark, signature, frame, border",
            num_inference_steps: 40,
            guidance_scale: 9.0,
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
    
    console.log(`✨ Successfully generated 3D lifelike ${card.name}!`);
    console.log(`📁 Saved to: ${outputPath}`);
    
    return true;
    
  } catch (error) {
    console.error(`❌ Error generating ${card.name}:`, error);
    return false;
  }
}

async function main() {
  console.log('🌟 Starting 3D lifelike card generation...');
  console.log('Creating cards with The Fool\'s otherworldly 3D depth and dimension...');
  
  for (const card of cards3D) {
    const success = await generateEnhanced3DCard(card);
    if (!success) {
      console.log(`❌ Failed to generate ${card.name}`);
      return;
    }
    // Small delay between generations
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('🎉 3D lifelike card generation completed successfully!');
}

main().catch(error => {
  console.error('💥 Script failed:', error);
  process.exit(1);
});