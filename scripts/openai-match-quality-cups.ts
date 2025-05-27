/**
 * OpenAI High-Quality Cups Generation
 * Match the exact ultra-ethereal style of existing Major Arcana cards
 */

import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const improvedCards = [
  {
    name: "Three of Cups",
    filename: "three-of-cups.png",
    prompt: "Ultra-ethereal 3D Three of Cups tarot card in the exact style of The High Priestess and The Fool cards. Three luminous figures with translucent skin and liquid starlight hair flowing like cosmic waterfalls, each holding one ornate golden chalice raised in celebration. EXACTLY THREE ornate cups prominently displayed. Figures have celestial features glowing with inner divine light, same ethereal quality as existing major arcana cards. Background of swirling pink and purple cosmic nebulae with golden light particles. Ultra-realistic 3D depth with translucent, dreamlike qualities matching the artistic style of the major arcana collection. Musky pink and purple palette with golden accents. Commercial use artwork, no copyright issues."
  },
  {
    name: "Seven of Cups",
    filename: "seven-of-cups.png",
    prompt: "Ultra-ethereal 3D Seven of Cups tarot card matching the exact artistic style of The High Priestess and other major arcana cards. Translucent figure with liquid starlight hair flowing like cosmic waterfalls, contemplating EXACTLY SEVEN floating chalices in mystical clouds. Each cup contains different ethereal visions: castle, serpent, crown, dragon, wreath, figure, treasure. All SEVEN cups clearly visible and distinct, representing illusion and choices. Same celestial quality as existing major arcana cards with glowing inner light. Background of cosmic pink and purple nebulae. Ultra-realistic 3D depth with translucent, dreamlike qualities. Musky pink and purple palette matching the major arcana style. Commercial use artwork."
  },
  {
    name: "Eight of Cups",
    filename: "eight-of-cups.png",
    prompt: "Ultra-ethereal 3D Eight of Cups tarot card in the exact artistic style of The Hermit and other major arcana cards. Translucent figure with liquid starlight hair flowing like cosmic waterfalls, walking away from EXACTLY EIGHT stacked chalices under ethereal moonlight. Figure carries a staff and walks toward distant mountains, representing spiritual quest. Same celestial quality as existing major arcana with translucent skin and inner divine glow. EXACTLY EIGHT ornate cups clearly visible behind the walking figure. Ultra-realistic 3D depth with dreamlike qualities matching the major arcana collection. Musky pink and purple palette with silver moonlight accents. Commercial use artwork."
  },
  {
    name: "Nine of Cups",
    filename: "nine-of-cups.png", 
    prompt: "Ultra-ethereal 3D Nine of Cups tarot card matching the exact artistic style of The Sun and other major arcana cards. Satisfied figure with translucent skin and liquid starlight hair flowing like cosmic waterfalls, sitting contentedly before EXACTLY NINE golden chalices arranged in a perfect arc. Figure radiates happiness and emotional fulfillment with same celestial inner glow as major arcana cards. All NINE cups clearly visible in perfect arrangement representing wishes fulfilled. Ultra-realistic 3D depth with translucent, dreamlike qualities identical to the major arcana collection style. Musky pink and purple palette with golden warm light. Commercial use artwork."
  }
];

async function generateHighQualityCard(card: typeof improvedCards[0]): Promise<boolean> {
  try {
    console.log(`🎨 Creating ultra-ethereal ${card.name} to match Major Arcana quality...`);
    
    const response = await openai.images.generate({
      model: "dall-e-3", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      prompt: card.prompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
      style: "vivid"
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
    console.log(`✅ ${card.name} created with matching ultra-ethereal quality!`);
    return true;
    
  } catch (error) {
    console.error(`❌ Failed to generate ${card.name}:`, error);
    return false;
  }
}

async function generateMatchingQualityCups() {
  console.log("🔧 Generating improved Cups cards to match Major Arcana ultra-ethereal quality...\n");
  
  for (const card of improvedCards) {
    const success = await generateHighQualityCard(card);
    if (success) {
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  console.log("\n🎉 Improved Cups generation complete with matching quality!");
}

generateMatchingQualityCups().catch(console.error);