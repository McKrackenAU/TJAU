/**
 * Create Fresh Cups Cards with New Filenames to Force Browser Refresh
 */

import fs from "fs";
import path from "path";

const freshCups = [
  {
    name: "Three of Cups",
    filename: "three-of-cups-v2.png",
    prompt: "Three of Cups tarot card, three joyful friends celebrating with raised golden chalices, exactly 3 ornate cups visible, celebration scene, ultra-ethereal style, translucent figures with starlight hair, pink purple cosmic background, 3D realistic depth"
  },
  {
    name: "Seven of Cups",
    filename: "seven-of-cups-v2.png", 
    prompt: "Seven of Cups tarot card, mystical figure contemplating exactly 7 floating golden chalices each containing different visions, choices and illusions theme, ultra-ethereal style, translucent dreamer with starlight hair, pink purple cosmic background, 3D realistic depth"
  },
  {
    name: "Eight of Cups",
    filename: "eight-of-cups-v2.png",
    prompt: "Eight of Cups tarot card, lone figure walking away from exactly 8 golden cups in foreground, climbing toward mountains under crescent moon, leaving behind emotional attachments, ultra-ethereal style, translucent form with starlight hair, pink purple night sky, 3D realistic depth"
  },
  {
    name: "Nine of Cups",
    filename: "nine-of-cups-v2.png",
    prompt: "Nine of Cups tarot card, satisfied figure sitting contentedly with exactly 9 golden cups arranged in arc behind them, wish fulfillment scene, ultra-ethereal style, translucent form with starlight hair glowing with joy, pink purple cosmic background, 3D realistic depth"
  }
];

async function createFreshCup(card: typeof freshCups[0]): Promise<void> {
  console.log(`🎨 Creating fresh ${card.name}...`);
  
  const token = process.env.hf_API_TOKEN_FOUR;
  if (!token) {
    console.log("❌ Token not found");
    return;
  }

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: card.prompt,
        parameters: {
          num_inference_steps: 20,
          guidance_scale: 7.5,
          width: 1024,
          height: 1024
        }
      }),
    });

    if (response.ok) {
      const buffer = await response.arrayBuffer();
      const outputDir = path.join("public", "authentic-cards", "minor-arcana", "cups");
      
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      const outputPath = path.join(outputDir, card.filename);
      fs.writeFileSync(outputPath, new Uint8Array(buffer));
      console.log(`✅ ${card.name} created as ${card.filename}!`);
    } else {
      console.log(`❌ Error: ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ Failed: ${error.message}`);
  }
}

async function createAllFreshCups() {
  for (const card of freshCups) {
    await createFreshCup(card);
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  console.log("🎉 All fresh Cups cards created with new filenames!");
}

createAllFreshCups();