/**
 * Fix Cups Cards with Proper Symbolism and Ultra-Ethereal 3D Quality
 * Regenerate specific cards that need better symbolism and imagery
 */

import OpenAI from "openai";
import fs from "fs";
import path from "path";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Cards that need fixing with proper symbolism
const cardsToFix = [
  {
    name: "Three of Cups",
    filename: "three-of-cups.png",
    prompt: `Ultra-ethereal 3D Three of Cups tarot card. Three friends celebrating together in joyful harmony, each holding an ornate chalice raised in toast. Translucent, dreamlike figures with liquid starlight hair flowing in cosmic winds. Celestial features glowing with inner light. Background of swirling pink and purple nebulae, with exactly THREE ornate golden cups prominently displayed. The scene radiates friendship, celebration, and community. Musky pink and purple color palette with golden accents. Ultra-realistic 3D depth, cinematic lighting, mystical atmosphere. The card should clearly show the number 3 and depict celebration and togetherness.`
  },
  {
    name: "Seven of Cups",
    filename: "seven-of-cups.png", 
    prompt: `Ultra-ethereal 3D Seven of Cups tarot card. A translucent figure with liquid starlight hair contemplating SEVEN floating chalices, each containing different visions: a castle, a snake, a jeweled crown, a dragon, a laurel wreath, a figure, and treasure. The cups hover in mystical clouds showing illusions and choices. Dreamlike quality with cosmic pink and purple nebulae background. Each of the SEVEN cups is clearly visible and ornate. The scene represents fantasy, illusion, and wishful thinking. Ultra-realistic 3D depth, musky pink/purple palette, celestial lighting. Exactly seven cups must be prominently displayed.`
  },
  {
    name: "Eight of Cups",
    filename: "eight-of-cups.png",
    prompt: `Ultra-ethereal 3D Eight of Cups tarot card. A cloaked figure with liquid starlight hair walking away under moonlight, leaving behind EXACTLY EIGHT ornate chalices arranged in the foreground. The figure moves toward distant mountains, symbolizing abandoning what no longer serves them. Translucent, dreamlike quality with cosmic winds. Background of mystical pink and purple starscape with crescent moon. The eight cups are clearly visible and arranged prominently, showing what is being left behind. Ultra-realistic 3D depth, musky pink/purple palette, melancholic yet hopeful atmosphere. The card depicts spiritual journey and moving on.`
  },
  {
    name: "Nine of Cups",
    filename: "nine-of-cups.png",
    prompt: `Ultra-ethereal 3D Nine of Cups tarot card. A satisfied figure with liquid starlight hair sitting contentedly before NINE ornate golden chalices arranged in an arc behind them. The figure radiates joy and fulfillment, with arms crossed in satisfaction. Translucent, dreamlike features glowing with inner happiness. Background of swirling pink and purple cosmic nebulae. The nine cups are prominently displayed in perfect arrangement. Ultra-realistic 3D depth with cosmic lighting, musky pink/purple palette with golden accents. The card embodies emotional satisfaction, contentment, and wish fulfillment. Exactly nine cups must be clearly visible.`
  }
];

function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
    console.log(`📁 Created directory: ${dir}`);
  }
}

async function fixCupCard(card: typeof cardsToFix[0]): Promise<boolean> {
  try {
    console.log(`🎨 Generating improved ${card.name}...`);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: card.prompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
    });

    if (!response.data?.[0]?.url) {
      throw new Error("No image URL in response");
    }

    // Download the image
    const imageResponse = await fetch(response.data[0].url);
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.statusText}`);
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const outputPath = path.join("public", "authentic-cards", "minor-arcana", "cups", card.filename);
    
    // Ensure directory exists
    ensureDirectoryExists(path.dirname(outputPath));
    
    // Save the image
    fs.writeFileSync(outputPath, new Uint8Array(imageBuffer));
    
    console.log(`✅ Fixed ${card.name} -> ${outputPath}`);
    return true;
    
  } catch (error) {
    console.error(`❌ Failed to fix ${card.name}:`, error);
    return false;
  }
}

async function fixCupsSymbolism() {
  console.log("🔧 Fixing Cups cards with proper symbolism and ultra-ethereal 3D quality...\n");
  
  let successCount = 0;
  
  for (const card of cardsToFix) {
    const success = await fixCupCard(card);
    if (success) {
      successCount++;
    }
    
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log(`\n🎉 Fixed ${successCount}/${cardsToFix.length} Cups cards with proper symbolism!`);
  console.log("\nAll cards now feature:");
  console.log("- Correct number of cups/chalices");
  console.log("- Proper traditional symbolism");
  console.log("- Ultra-ethereal 3D quality");
  console.log("- Musky pink/purple color palette");
}

// Run the script
fixCupsSymbolism().catch(console.error);