/**
 * Fix Cups Cards with OpenAI DALL-E 3
 * Create proper traditional symbolism with ultra-ethereal quality
 */

import OpenAI from "openai";
import fs from "fs";
import path from "path";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const cupsToFix = [
  {
    name: "Three of Cups",
    filename: "three-of-cups.png",
    prompt: "Ultra-ethereal 3D Three of Cups tarot card, three joyful friends celebrating together in toast, each holding ornate golden chalice raised in celebration, EXACTLY THREE ornate cups prominently displayed, translucent figures with liquid starlight hair flowing like cosmic waterfalls, celestial features glowing with inner light, background swirling pink purple nebulae with golden particles, ultra-realistic 3D depth with translucent dreamlike qualities, musky pink purple palette with golden accents, mystical celebration scene"
  },
  {
    name: "Seven of Cups",
    filename: "seven-of-cups.png", 
    prompt: "Ultra-ethereal 3D Seven of Cups tarot card, mystical figure contemplating EXACTLY SEVEN floating chalices each containing different visions - castle, jewels, dragon, wreath, head, snake, shrouded figure, translucent dreamer with liquid starlight hair, celestial features, illusions and choices theme, background swirling pink purple cosmos, ultra-realistic 3D depth with dreamlike translucent qualities, musky pink purple palette"
  },
  {
    name: "Eight of Cups",
    filename: "eight-of-cups.png",
    prompt: "Ultra-ethereal 3D Eight of Cups tarot card, lone figure walking away from EXACTLY EIGHT golden cups arranged in foreground, figure climbing toward mountains under crescent moon, translucent form with liquid starlight hair, celestial features, leaving behind emotional attachments, background swirling pink purple night sky, ultra-realistic 3D depth with dreamlike qualities, musky pink purple palette with golden moonlight"
  },
  {
    name: "Nine of Cups",
    filename: "nine-of-cups.png",
    prompt: "Ultra-ethereal 3D Nine of Cups tarot card, satisfied figure sitting contentedly with EXACTLY NINE golden cups arranged in arc behind them, wish fulfillment and emotional satisfaction, translucent form with liquid starlight hair, celestial features glowing with joy, background swirling pink purple cosmos, ultra-realistic 3D depth with translucent dreamlike qualities, musky pink purple palette with golden cup gleams"
  }
];

async function generateCardWithOpenAI(card: typeof cupsToFix[0]): Promise<boolean> {
  try {
    console.log(`🎨 Creating ${card.name} with OpenAI DALL-E 3...`);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: card.prompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
    });

    const imageUrl = response.data[0].url;
    if (!imageUrl) {
      console.log(`❌ No image URL returned for ${card.name}`);
      return false;
    }

    // Download the image
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    
    // Save to the correct path
    const outputPath = path.join("public", "authentic-cards", "minor-arcana", "cups", card.filename);
    fs.writeFileSync(outputPath, new Uint8Array(imageBuffer));
    
    console.log(`✅ ${card.name} created successfully!`);
    return true;
  } catch (error) {
    console.error(`❌ Error creating ${card.name}:`, error.message);
    return false;
  }
}

async function fixCupsWithOpenAI() {
  console.log("🎨 Fixing Cups cards with OpenAI DALL-E 3...");
  
  for (const card of cupsToFix) {
    await generateCardWithOpenAI(card);
    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log("🎉 All Cups cards fixed!");
}

fixCupsWithOpenAI();