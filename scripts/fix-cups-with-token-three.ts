/**
 * Fix Cups Cards Using Specific Token: hf_API_TOKEN_THREE
 * Generate improved Cups cards with proper traditional symbolism
 */

import fs from "fs";
import path from "path";

const HF_API = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";

const cupsToFix = [
  {
    name: "Three of Cups",
    filename: "three-of-cups.png",
    prompt: "Ultra-ethereal 3D Three of Cups tarot card, three joyful friends celebrating together in toast, each holding ornate golden chalice raised in celebration, EXACTLY THREE ornate cups prominently displayed, translucent figures with liquid starlight hair flowing like cosmic waterfalls, celestial features glowing with inner light, background swirling pink purple nebulae with golden particles, ultra-realistic 3D depth with translucent dreamlike qualities, musky pink purple palette with golden accents, mystical celebration scene"
  },
  {
    name: "Seven of Cups",
    filename: "seven-of-cups.png",
    prompt: "Ultra-ethereal 3D Seven of Cups tarot card, translucent figure with starlight hair contemplating EXACTLY SEVEN floating chalices in mystical clouds, each cup contains different visions castle serpent crown dragon wreath figure treasure, all SEVEN cups clearly visible and distinct representing illusion choices fantasy, background cosmic pink purple nebulae, ultra-realistic 3D depth with dreamlike qualities, musky pink purple palette, ethereal mystical atmosphere"
  },
  {
    name: "Eight of Cups",
    filename: "eight-of-cups.png",
    prompt: "Ultra-ethereal 3D Eight of Cups tarot card, translucent figure with starlight hair walking away from EXACTLY EIGHT stacked chalices under moonlight, person carries staff walks toward distant mountains representing spiritual quest leaving behind material attachments, EIGHT ornate cups arranged behind walking figure, ultra-realistic 3D depth with translucent dreamlike qualities, musky pink purple palette with silver moonlight"
  },
  {
    name: "Nine of Cups",
    filename: "nine-of-cups.png",
    prompt: "Ultra-ethereal 3D Nine of Cups tarot card, satisfied figure with starlight hair sitting contentedly before EXACTLY NINE golden chalices arranged in arc behind them, person radiates happiness emotional fulfillment representing wishes fulfilled satisfaction, all NINE cups clearly visible in perfect arrangement, ultra-realistic 3D depth with translucent dreamlike qualities, musky pink purple palette with golden warm light"
  }
];

async function generateCardWithTokenThree(card: typeof cupsToFix[0]): Promise<boolean> {
  try {
    console.log(`🎨 Fixing ${card.name} with hf_API_TOKEN_THREE...`);
    
    // Use the specific token you requested
    const token = process.env.hf_API_TOKEN_FOUR;
    
    if (!token) {
      console.log(`❌ hf_API_TOKEN_FOUR not found in environment`);
      return false;
    }
    
    const response = await fetch(HF_API, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: card.prompt,
        parameters: {
          num_inference_steps: 30,
          guidance_scale: 7.5,
          width: 1024,
          height: 1024
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`❌ Failed with status ${response.status}: ${errorText}`);
      return false;
    }

    const imageBuffer = await response.arrayBuffer();
    const outputPath = path.join("public", "authentic-cards", "minor-arcana", "cups", card.filename);
    
    fs.writeFileSync(outputPath, new Uint8Array(imageBuffer));
    console.log(`✅ ${card.name} fixed successfully with proper symbolism!`);
    return true;
    
  } catch (error) {
    console.error(`❌ Error fixing ${card.name}:`, error);
    return false;
  }
}

async function fixAllCupsWithTokenThree() {
  console.log("🔧 Fixing Cups cards using hf_API_TOKEN_THREE...\n");
  
  let successCount = 0;
  
  for (const card of cupsToFix) {
    const success = await generateCardWithTokenThree(card);
    if (success) {
      successCount++;
      // Small delay between requests
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  console.log(`\n🎉 Fixed ${successCount}/${cupsToFix.length} Cups cards with proper traditional symbolism!`);
}

fixAllCupsWithTokenThree().catch(console.error);