/**
 * Quick Fix for Cups Display Issue
 * Regenerate with unique filenames to bypass browser cache
 */

import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const cardsToFix = [
  {
    name: "Three of Cups",
    filename: "three-of-cups.png",
    prompt: "Ultra-ethereal 3D Three of Cups tarot card. Three joyful friends celebrating together in celebration, each holding ornate chalices raised in toast. Translucent figures with liquid starlight hair, celestial features glowing with inner light. Background of swirling pink and purple nebulae. EXACTLY THREE ornate golden cups prominently displayed. Scene radiates friendship, celebration, community spirit. Ultra-realistic 3D depth, musky pink/purple palette with golden accents."
  },
  {
    name: "Seven of Cups",
    filename: "seven-of-cups.png",
    prompt: "Ultra-ethereal 3D Seven of Cups tarot card. Translucent figure with starlight hair contemplating EXACTLY SEVEN floating chalices in mystical clouds, each containing different visions: castle, serpent, crown, dragon, wreath, figure, treasure. Dreamlike quality with cosmic pink/purple nebulae. All SEVEN cups clearly visible and distinct, representing illusion, choices, fantasy, too many options. Ultra-realistic 3D depth, musky pink/purple palette."
  }
];

async function fixCard(card: typeof cardsToFix[0]): Promise<void> {
  try {
    console.log(`🎨 Regenerating ${card.name} for immediate display...`);
    
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
    console.log(`✅ Fixed ${card.name} - should display immediately`);
    
  } catch (error) {
    console.error(`❌ Failed ${card.name}:`, error);
  }
}

async function quickFixDisplay() {
  console.log("🔧 Quick-fixing Cups display issue...\n");
  
  for (const card of cardsToFix) {
    await fixCard(card);
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  console.log("\n🎉 Display fix complete! Cards should now show properly.");
}

quickFixDisplay().catch(console.error);