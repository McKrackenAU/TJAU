/**
 * Fix Single Cups Card - Three of Cups
 * Using hf_API_TOKEN_FOUR
 */

import fs from "fs";
import path from "path";

async function fixThreeOfCups(): Promise<void> {
  try {
    console.log("🎨 Fixing Three of Cups with proper celebration symbolism...");
    
    const token = process.env.hf_API_TOKEN_FOUR;
    if (!token) {
      console.log("❌ hf_API_TOKEN_FOUR not found");
      return;
    }

    const prompt = "Ultra-ethereal 3D Three of Cups tarot card, three joyful friends celebrating together in toast, each holding ornate golden chalice raised in celebration, EXACTLY THREE ornate cups prominently displayed, translucent figures with liquid starlight hair flowing like cosmic waterfalls, celestial features glowing with inner light, background swirling pink purple nebulae with golden particles, ultra-realistic 3D depth with translucent dreamlike qualities, musky pink purple palette with golden accents, mystical celebration scene";

    const response = await fetch("https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          num_inference_steps: 20,
          guidance_scale: 7.5,
          width: 1024,
          height: 1024
        }
      }),
    });

    if (!response.ok) {
      console.log(`❌ API Error: ${response.status}`);
      const errorText = await response.text();
      console.log(`Error details: ${errorText}`);
      return;
    }

    const imageBuffer = await response.arrayBuffer();
    const outputPath = path.join("public", "authentic-cards", "minor-arcana", "cups", "three-of-cups.png");
    
    fs.writeFileSync(outputPath, new Uint8Array(imageBuffer));
    console.log("✅ Three of Cups fixed with proper celebration symbolism!");
    
  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

fixThreeOfCups();