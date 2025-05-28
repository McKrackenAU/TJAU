/**
 * Generate Completely New Cups Cards with Unique Names
 */

import fs from "fs";
import path from "path";

const newCups = [
  {
    name: "Three of Cups",
    filename: "three-cups-celebration.png",
    prompt: "Three of Cups tarot card, three joyful friends celebrating with raised golden chalices in toast, exactly 3 ornate cups prominently displayed, ultra-ethereal translucent figures with liquid starlight hair flowing like cosmic waterfalls, celestial features glowing with inner light, pink purple nebula background with golden particles, 3D realistic depth, dreamlike translucent quality"
  },
  {
    name: "Seven of Cups",
    filename: "seven-cups-choices.png", 
    prompt: "Seven of Cups tarot card, mystical figure contemplating exactly 7 floating golden chalices each containing different visions - castle, jewels, dragon, wreath, head, snake, shrouded figure, ultra-ethereal translucent dreamer with liquid starlight hair, celestial features, illusions and choices theme, pink purple cosmic background, 3D realistic depth, dreamlike quality"
  },
  {
    name: "Eight of Cups",
    filename: "eight-cups-departure.png",
    prompt: "Eight of Cups tarot card, lone figure walking away from exactly 8 golden cups arranged in foreground, figure climbing toward mountains under crescent moon, ultra-ethereal translucent form with liquid starlight hair, celestial features, leaving behind emotional attachments, pink purple night sky with cosmic elements, 3D realistic depth, dreamlike quality"
  },
  {
    name: "Nine of Cups",
    filename: "nine-cups-satisfaction.png",
    prompt: "Nine of Cups tarot card, satisfied figure sitting contentedly with exactly 9 golden cups arranged in arc behind them, wish fulfillment and emotional satisfaction, ultra-ethereal translucent form with liquid starlight hair glowing with joy, celestial features, pink purple cosmic background with golden accents, 3D realistic depth, dreamlike quality"
  }
];

async function generateNewCup(card: typeof newCups[0]): Promise<void> {
  console.log(`🎨 Generating new ${card.name}...`);
  
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
      console.log(`✅ ${card.name} generated as ${card.filename}!`);
    } else {
      console.log(`❌ Error: ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ Failed: ${error.message}`);
  }
}

async function generateAllNewCups() {
  for (const card of newCups) {
    await generateNewCup(card);
    await new Promise(resolve => setTimeout(resolve, 4000));
  }
  console.log("🎉 All new Cups cards generated with unique names!");
}

generateAllNewCups();