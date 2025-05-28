/**
 * Generate All Fresh Cups Cards - Ultra-Ethereal 3D Style
 * Creates: Three, Four, Seven, Eight, Nine of Cups
 */
import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const cupsToGenerate = [
  {
    name: "Three of Cups",
    filename: "three-of-cups.png",
    prompt: "Ultra-ethereal 3D Three of Cups tarot card with breathtaking lifelike quality. Three joyful friends celebrating together in perfect harmony, each holding ornate chalices raised in toast. Translucent, dreamlike figures with liquid starlight hair flowing in cosmic winds. Celestial features glowing with inner light, musky pink and purple aurora skin tones. Background of swirling pink and purple nebulae with golden starlight. EXACTLY THREE ornate golden cups prominently displayed - each cup detailed with intricate celestial engravings. The scene radiates friendship, celebration, and community joy. Ultra-realistic 3D depth with cinematic lighting, mystical atmosphere. Photographic realism with magical pink purple color palette."
  },
  {
    name: "Four of Cups",
    filename: "four-of-cups.png", 
    prompt: "Ultra-ethereal 3D Four of Cups tarot card with breathtaking lifelike quality. Contemplative figure with liquid starlight hair sitting beneath cosmic tree, three cups before them, fourth cup offered by celestial hand from clouds. Translucent, dreamlike figure with musky pink and purple aurora skin tones. Figure appears in deep meditation, showing apathy or missed opportunities. Background of swirling pink and purple nebulae. EXACTLY FOUR ornate golden cups clearly visible - three on ground, one floating. Ultra-realistic 3D depth with cinematic lighting, mystical atmosphere. Photographic realism with magical pink purple color palette."
  },
  {
    name: "Seven of Cups",
    filename: "seven-of-cups.png",
    prompt: "Ultra-ethereal 3D Seven of Cups tarot card with breathtaking lifelike quality. Translucent figure with liquid starlight hair contemplating EXACTLY SEVEN floating chalices in mystical clouds, each containing different visions: castle, serpent, crown, dragon, wreath, figure, treasure. Dreamlike figure with musky pink and purple aurora skin tones. Background of swirling pink and purple nebulae. All SEVEN cups clearly visible and ornate, floating in cosmic clouds. The scene represents fantasy, illusion, and choices. Ultra-realistic 3D depth with cinematic lighting, mystical atmosphere. Photographic realism with magical pink purple color palette."
  },
  {
    name: "Eight of Cups", 
    filename: "eight-of-cups.png",
    prompt: "Ultra-ethereal 3D Eight of Cups tarot card with breathtaking lifelike quality. Cloaked figure with liquid starlight hair walking away under cosmic moonlight, leaving behind EXACTLY EIGHT ornate chalices in foreground. Figure moves toward distant mountains with ethereal glow. Background of pink and purple starscape with crescent moon. Eight cups clearly visible in organized arrangement, showing what's left behind. Translucent, dreamlike figure with musky pink and purple aurora tones. Spiritual journey symbolism. Ultra-realistic 3D depth with cinematic lighting, mystical atmosphere."
  },
  {
    name: "Nine of Cups",
    filename: "nine-of-cups.png", 
    prompt: "Ultra-ethereal 3D Nine of Cups tarot card with breathtaking lifelike quality. Satisfied figure with liquid starlight hair sitting contentedly before EXACTLY NINE ornate chalices arranged in arc behind them. Translucent, dreamlike figure with musky pink and purple aurora skin tones showing emotional satisfaction and wish fulfillment. Background of swirling pink and purple nebulae with golden starlight. Nine cups prominently displayed in organized arrangement. The scene radiates contentment and gratitude. Ultra-realistic 3D depth with cinematic lighting, mystical atmosphere. Photographic realism with magical pink purple color palette."
  }
];

async function generateCup(cup: typeof cupsToGenerate[0]): Promise<boolean> {
  try {
    console.log(`🎨 Creating ${cup.name}...`);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: cup.prompt,
      n: 1,
      size: "1024x1024",
      quality: "hd"
    });

    if (!response.data[0]?.url) {
      throw new Error("No image URL received");
    }

    const imageResponse = await fetch(response.data[0].url);
    const imageBuffer = await imageResponse.arrayBuffer();
    const outputPath = path.join("public", "authentic-cards", "minor-arcana", "cups", cup.filename);
    
    fs.writeFileSync(outputPath, new Uint8Array(imageBuffer));
    console.log(`✅ Created ${cup.name}`);
    return true;
    
  } catch (error) {
    console.error(`❌ Failed ${cup.name}:`, error);
    return false;
  }
}

async function generateAllFreshCups() {
  console.log("🎨 Creating 5 fresh ultra-ethereal Cups cards...\n");
  
  for (const cup of cupsToGenerate) {
    await generateCup(cup);
    // Brief delay between generations
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log("\n🎉 Completed all fresh Cups cards!");
}

generateAllFreshCups().catch(console.error);