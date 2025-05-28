/**
 * Generate final two Cups cards
 */

import fs from "fs";
import path from "path";

const finalTwoCups = [
  {
    name: "Eight of Cups",
    filename: "eight-cups-departure.png",
    prompt: "Eight of Cups tarot card, lone figure walking away from exactly 8 golden cups in foreground, climbing toward mountains under crescent moon, ultra-ethereal translucent form with liquid starlight hair, pink purple night sky, 3D realistic depth"
  },
  {
    name: "Nine of Cups",
    filename: "nine-cups-satisfaction.png",
    prompt: "Nine of Cups tarot card, satisfied figure sitting with exactly 9 golden cups in arc behind them, wish fulfillment scene, ultra-ethereal translucent form with starlight hair glowing with joy, pink purple cosmic background, 3D realistic depth"
  }
];

async function createFinalTwo(): Promise<void> {
  const token = process.env.hf_API_TOKEN_FOUR;
  if (!token) {
    console.log("❌ Token not found");
    return;
  }

  for (const card of finalTwoCups) {
    console.log(`🎨 Creating ${card.name}...`);
    
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
            num_inference_steps: 18,
            guidance_scale: 7,
            width: 1024,
            height: 1024
          }
        }),
      });

      if (response.ok) {
        const buffer = await response.arrayBuffer();
        const outputPath = path.join("public", "authentic-cards", "minor-arcana", "cups", card.filename);
        fs.writeFileSync(outputPath, new Uint8Array(buffer));
        console.log(`✅ ${card.name} completed!`);
      } else {
        console.log(`❌ Error: ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ Failed: ${error.message}`);
    }
    
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log("🎉 All four improved Cups cards completed!");
}

createFinalTwo();