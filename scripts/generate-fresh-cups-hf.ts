/**
 * Generate Fresh Cups Cards with Hugging Face - Ultra-Ethereal 3D Style
 * Creates: Three, Four, Seven, Eight, Nine of Cups
 */
import fs from "fs";
import path from "path";

const HUGGING_FACE_API = "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev";

const cupsToGenerate = [
  {
    name: "Three of Cups",
    filename: "three-of-cups.png",
    prompt: "Ultra-ethereal 3D Three of Cups tarot card, three joyful friends celebrating together holding ornate chalices raised in toast, translucent dreamlike figures with liquid starlight hair flowing in cosmic winds, celestial features glowing with inner light, musky pink and purple aurora skin tones, background of swirling pink and purple nebulae with golden starlight, EXACTLY THREE ornate golden cups prominently displayed with intricate celestial engravings, scene radiates friendship celebration community joy, ultra-realistic 3D depth cinematic lighting mystical atmosphere, photographic realism magical pink purple color palette, no text"
  },
  {
    name: "Four of Cups",
    filename: "four-of-cups.png", 
    prompt: "Ultra-ethereal 3D Four of Cups tarot card, contemplative figure with liquid starlight hair sitting beneath cosmic tree, three cups before them fourth cup offered by celestial hand from clouds, translucent dreamlike figure with musky pink and purple aurora skin tones, figure in deep meditation showing apathy missed opportunities, background swirling pink purple nebulae, EXACTLY FOUR ornate golden cups clearly visible three on ground one floating, ultra-realistic 3D depth cinematic lighting mystical atmosphere, photographic realism magical pink purple color palette, no text"
  },
  {
    name: "Seven of Cups",
    filename: "seven-of-cups.png",
    prompt: "Ultra-ethereal 3D Seven of Cups tarot card, translucent figure with liquid starlight hair contemplating EXACTLY SEVEN floating chalices in mystical clouds each containing different visions castle serpent crown dragon wreath figure treasure, dreamlike figure with musky pink purple aurora skin tones, background swirling pink purple nebulae, all SEVEN cups clearly visible ornate floating in cosmic clouds, represents fantasy illusion choices, ultra-realistic 3D depth cinematic lighting mystical atmosphere, photographic realism magical pink purple color palette, no text"
  },
  {
    name: "Eight of Cups", 
    filename: "eight-of-cups.png",
    prompt: "Ultra-ethereal 3D Eight of Cups tarot card, cloaked figure with liquid starlight hair walking away under cosmic moonlight leaving behind EXACTLY EIGHT ornate chalices in foreground, figure moves toward distant mountains with ethereal glow, background pink purple starscape with crescent moon, eight cups clearly visible organized arrangement showing what left behind, translucent dreamlike figure musky pink purple aurora tones, spiritual journey symbolism, ultra-realistic 3D depth cinematic lighting mystical atmosphere, no text"
  },
  {
    name: "Nine of Cups",
    filename: "nine-of-cups.png", 
    prompt: "Ultra-ethereal 3D Nine of Cups tarot card, satisfied figure with liquid starlight hair sitting contentedly before EXACTLY NINE ornate chalices arranged in arc behind them, translucent dreamlike figure with musky pink purple aurora skin tones showing emotional satisfaction wish fulfillment, background swirling pink purple nebulae with golden starlight, nine cups prominently displayed organized arrangement, scene radiates contentment gratitude, ultra-realistic 3D depth cinematic lighting mystical atmosphere, photographic realism magical pink purple color palette, no text"
  }
];

async function generateCard(card: typeof cupsToGenerate[0]): Promise<boolean> {
  try {
    console.log(`🎨 Creating ${card.name} with Hugging Face...`);
    
    const response = await fetch(HUGGING_FACE_API, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: card.prompt,
        parameters: {
          num_inference_steps: 50,
          guidance_scale: 7.5,
          width: 1024,
          height: 1024
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const imageBuffer = await response.arrayBuffer();
    const outputPath = path.join("public", "authentic-cards", "minor-arcana", "cups", card.filename);
    
    fs.writeFileSync(outputPath, new Uint8Array(imageBuffer));
    console.log(`✅ Created ${card.name} -> ${outputPath}`);
    return true;
    
  } catch (error) {
    console.error(`❌ Failed ${card.name}:`, error);
    return false;
  }
}

async function generateAllFreshCups() {
  console.log("🎨 Creating 5 fresh ultra-ethereal Cups cards with Hugging Face...\n");
  
  for (const card of cupsToGenerate) {
    const success = await generateCard(card);
    if (success) {
      // Brief delay between generations
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  console.log("\n🎉 Completed all fresh Cups cards!");
}

generateAllFreshCups().catch(console.error);