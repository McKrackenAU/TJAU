/**
 * Batch Fix Specific Cups Cards with Correct Symbolism
 */

import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const cardsToFix = [
  {
    name: "Three of Cups",
    filename: "three-of-cups.png",
    prompt: "Ultra-ethereal 3D Three of Cups tarot card. Three joyful friends celebrating together, each holding ornate chalices raised in toast. Translucent figures with liquid starlight hair, celestial features glowing. Background of pink/purple nebulae. EXACTLY THREE ornate golden cups prominently displayed. Scene radiates friendship, celebration, community. Ultra-realistic 3D depth, musky pink/purple palette."
  },
  {
    name: "Seven of Cups", 
    filename: "seven-of-cups.png",
    prompt: "Ultra-ethereal 3D Seven of Cups tarot card. Translucent figure contemplating EXACTLY SEVEN floating chalices in mystical clouds, each containing different visions: castle, serpent, crown, dragon, wreath, figure, treasure. Dreamlike quality, pink/purple nebulae. All SEVEN cups clearly visible and distinct. Represents illusion, choices, fantasy. Ultra-realistic 3D depth."
  },
  {
    name: "Eight of Cups",
    filename: "eight-of-cups.png", 
    prompt: "Ultra-ethereal 3D Eight of Cups tarot card. Cloaked figure with starlight hair walking away under moonlight, leaving behind EXACTLY EIGHT ornate chalices in foreground. Figure moves toward distant mountains. Pink/purple starscape with crescent moon. Eight cups clearly visible, showing what's left behind. Spiritual journey symbolism."
  },
  {
    name: "Nine of Cups",
    filename: "nine-of-cups.png",
    prompt: "Ultra-ethereal 3D Nine of Cups tarot card. Satisfied figure with starlight hair sitting contentedly, arms crossed in joy. EXACTLY NINE ornate golden chalices arranged in perfect arc behind them. Figure radiates happiness and fulfillment. Pink/purple cosmic background with golden accents. Emotional satisfaction and wish fulfillment energy."
  }
];

async function generateCard(card: typeof cardsToFix[0]): Promise<boolean> {
  try {
    console.log(`🎨 Fixing ${card.name}...`);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: card.prompt,
      n: 1,
      size: "1024x1024",
      quality: "hd"
    });

    const imageResponse = await fetch(response.data[0].url!);
    const imageBuffer = await imageResponse.arrayBuffer();
    const outputPath = path.join("public", "authentic-cards", "minor-arcana", "cups", card.filename);
    
    fs.writeFileSync(outputPath, new Uint8Array(imageBuffer));
    console.log(`✅ Fixed ${card.name}`);
    return true;
    
  } catch (error) {
    console.error(`❌ Failed ${card.name}:`, error);
    return false;
  }
}

async function fixBatchCups() {
  console.log("🔧 Fixing 4 Cups cards with proper symbolism...\n");
  
  for (const card of cardsToFix) {
    await generateCard(card);
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log("\n🎉 Completed fixing Cups cards!");
}

fixBatchCups().catch(console.error);