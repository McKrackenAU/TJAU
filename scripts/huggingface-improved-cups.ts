/**
 * Generate Improved Cups Cards with Hugging Face API
 * Create corrected symbolism for Three, Seven, Eight, Nine of Cups
 */

import fs from "fs";
import path from "path";

const HUGGING_FACE_API = "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev";

const improvedCards = [
  {
    name: "Three of Cups",
    filename: "three-of-cups.png",
    prompt: "Ultra-ethereal 3D Three of Cups tarot card, three joyful friends celebrating together in toast, each holding ornate golden chalice raised in celebration, translucent figures with liquid starlight hair flowing like cosmic waterfalls, celestial features glowing with inner light, EXACTLY THREE ornate golden cups prominently displayed, scene radiates friendship celebration community spirit, background swirling pink purple nebulae with golden light particles, ultra-realistic 3D depth with translucent dreamlike qualities, musky pink purple palette with golden accents, mystical ethereal atmosphere"
  },
  {
    name: "Seven of Cups",
    filename: "seven-of-cups.png",
    prompt: "Ultra-ethereal 3D Seven of Cups tarot card, translucent figure with starlight hair contemplating EXACTLY SEVEN floating chalices in mystical clouds, each cup contains different visions castle serpent crown dragon wreath figure treasure, all SEVEN cups clearly visible and distinct representing illusion choices fantasy, background cosmic pink purple nebulae, ultra-realistic 3D depth with dreamlike qualities, musky pink purple palette, ethereal mystical atmosphere"
  },
  {
    name: "Eight of Cups",
    filename: "eight-of-cups.png",
    prompt: "Ultra-ethereal 3D Eight of Cups tarot card, translucent figure with starlight hair walking away from eight stacked chalices under moonlight, person carries staff walks toward distant mountains representing spiritual quest leaving behind material attachments, EXACTLY EIGHT ornate cups arranged behind walking figure, ultra-realistic 3D depth with translucent dreamlike qualities, musky pink purple palette with silver moonlight, mystical departure scene"
  },
  {
    name: "Nine of Cups",
    filename: "nine-of-cups.png", 
    prompt: "Ultra-ethereal 3D Nine of Cups tarot card, satisfied figure with starlight hair sitting contentedly before EXACTLY NINE golden chalices arranged in arc behind them, person radiates happiness emotional fulfillment representing wishes fulfilled satisfaction, all NINE cups clearly visible in perfect arrangement, ultra-realistic 3D depth with translucent dreamlike qualities, musky pink purple palette with golden warm light, mystical satisfaction scene"
  }
];

async function generateCardWithHuggingFace(card: typeof improvedCards[0]): Promise<boolean> {
  try {
    console.log(`🎨 Creating improved ${card.name} with Hugging Face...`);
    
    const response = await fetch(HUGGING_FACE_API, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: card.prompt,
        parameters: {
          width: 1024,
          height: 1024,
          num_inference_steps: 50,
          guidance_scale: 7.5
        }
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const imageBuffer = await response.arrayBuffer();
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
  console.log("🔧 Generating improved Cups cards with Hugging Face API...\n");
  
  for (const card of improvedCards) {
    const success = await generateCardWithHuggingFace(card);
    if (success) {
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  console.log("\n🎉 Improved Cups generation complete with corrected symbolism!");
}

generateAllImprovedCups().catch(console.error);