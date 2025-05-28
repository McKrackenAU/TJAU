/**
 * Finish the final two Cups cards - Eight and Nine
 */

import fs from "fs";
import path from "path";

const finalCups = [
  {
    name: "Eight of Cups",
    filename: "eight-of-cups.png",
    prompt: "Eight of Cups tarot card, lone figure walking away from exactly 8 golden cups arranged in foreground, figure climbing toward mountains under crescent moon, translucent form with starlight hair, leaving behind emotional attachments, pink purple night sky, ultra-ethereal 3D style"
  },
  {
    name: "Nine of Cups",
    filename: "nine-of-cups.png",
    prompt: "Nine of Cups tarot card, satisfied figure sitting contentedly with exactly 9 golden cups arranged in arc behind them, wish fulfillment and emotional satisfaction, translucent form with starlight hair glowing with joy, pink purple cosmic background, ultra-ethereal 3D style"
  }
];

async function createFinalCup(card: typeof finalCups[0]): Promise<void> {
  console.log(`🎨 Creating ${card.name}...`);
  
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
          num_inference_steps: 15,
          guidance_scale: 7,
          width: 512,
          height: 512
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
      console.log(`✅ ${card.name} completed!`);
    } else {
      console.log(`❌ Error: ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ Failed: ${error.message}`);
  }
}

async function finishCupsCollection() {
  for (const card of finalCups) {
    await createFinalCup(card);
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  console.log("🎉 All Cups cards collection completed!");
}

finishCupsCollection();