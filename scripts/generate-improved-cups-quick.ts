/**
 * Generate Improved Cups Cards - Quick and Focused
 * Create corrected symbolism for Three, Seven, Eight, Nine of Cups
 */

import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const improvedCards = [
  {
    name: "Three of Cups",
    filename: "three-of-cups.png",
    prompt: "Ultra-ethereal 3D Three of Cups tarot card showing three joyful friends celebrating together in a toast. Each person holds one ornate golden chalice raised in celebration. Translucent figures with liquid starlight hair flowing like cosmic waterfalls, celestial features glowing with inner light. EXACTLY THREE ornate golden cups prominently displayed. Scene radiates friendship, celebration, community spirit. Background of swirling pink and purple nebulae with golden light particles. Ultra-realistic 3D depth with translucent, dreamlike qualities. Musky pink/purple palette with golden accents."
  },
  {
    name: "Seven of Cups",
    filename: "seven-of-cups.png",
    prompt: "Ultra-ethereal 3D Seven of Cups tarot card showing a translucent figure with starlight hair contemplating EXACTLY SEVEN floating chalices in mystical clouds. Each cup contains different visions: castle, serpent, crown, dragon, wreath, figure, treasure. All SEVEN cups clearly visible and distinct, representing illusion, choices, fantasy. Background of cosmic pink/purple nebulae. Ultra-realistic 3D depth with dreamlike qualities, musky pink/purple palette."
  },
  {
    name: "Eight of Cups",
    filename: "eight-of-cups.png",
    prompt: "Ultra-ethereal 3D Eight of Cups tarot card showing a translucent figure with starlight hair walking away from eight stacked chalices under moonlight. The person carries a staff and walks toward distant mountains, representing spiritual quest and leaving behind material attachments. EXACTLY EIGHT ornate cups arranged behind the walking figure. Ultra-realistic 3D depth with translucent, dreamlike qualities. Musky pink/purple palette with silver moonlight."
  },
  {
    name: "Nine of Cups",
    filename: "nine-of-cups.png", 
    prompt: "Ultra-ethereal 3D Nine of Cups tarot card showing a satisfied figure with starlight hair sitting contentedly before EXACTLY NINE golden chalices arranged in an arc behind them. The person radiates happiness and emotional fulfillment, representing wishes fulfilled and satisfaction. All NINE cups clearly visible in perfect arrangement. Ultra-realistic 3D depth with translucent, dreamlike qualities. Musky pink/purple palette with golden warm light."
  }
];

async function generateCard(card: typeof improvedCards[0]): Promise<boolean> {
  try {
    console.log(`🎨 Creating improved ${card.name}...`);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: card.prompt,
      n: 1,
      size: "1024x1024",
      quality: "hd"
    });

    if (!response.data[0]?.url) {
      throw new Error("No image URL returned");
    }

    const imageResponse = await fetch(response.data[0].url);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.status}`);
    }

    const imageBuffer = await imageResponse.arrayBuffer();
    const outputPath = path.join("public", "authentic-cards", "minor-arcana", "cups", card.filename);
    
    fs.writeFileSync(outputPath, new Uint8Array(imageBuffer));
    console.log(`✅ ${card.name} generated successfully!`);
    return true;
    
  } catch (error) {
    console.error(`❌ Failed to generate ${card.name}:`, error);
    return false;
  }
}

async function generateAllImprovedCups() {
  console.log("🔧 Generating improved Cups cards with corrected symbolism...\n");
  
  for (const card of improvedCards) {
    const success = await generateCard(card);
    if (success) {
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 2000));
    }
  }
  
  console.log("\n🎉 Improved Cups generation complete!");
}

generateAllImprovedCups().catch(console.error);