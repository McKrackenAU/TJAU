/**
 * Simple Hugging Face Cups Fix
 * Using Stable Diffusion XL for reliable generation
 */

import fs from "fs";
import path from "path";

// Using a more reliable Stable Diffusion model
const HF_API = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";

async function generateSingleCard(name: string, filename: string, prompt: string): Promise<boolean> {
  try {
    console.log(`🎨 Creating ${name}...`);
    
    const response = await fetch(HF_API, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
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
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }

    const imageBuffer = await response.arrayBuffer();
    const outputPath = path.join("public", "authentic-cards", "minor-arcana", "cups", filename);
    
    fs.writeFileSync(outputPath, new Uint8Array(imageBuffer));
    console.log(`✅ ${name} created successfully!`);
    return true;
    
  } catch (error) {
    console.error(`❌ Failed to create ${name}:`, error);
    return false;
  }
}

async function createImprovedThreeOfCups() {
  const prompt = "Ultra-ethereal 3D Three of Cups tarot card, three joyful friends celebrating together, each holding golden chalice raised in toast, exactly three ornate cups prominently displayed, translucent figures with flowing starlight hair, cosmic pink and purple nebulae background, ultra-realistic 3D depth, mystical celebration scene, high quality digital art";
  
  return await generateSingleCard("Three of Cups", "three-of-cups.png", prompt);
}

// Let's start with just one card to test
createImprovedThreeOfCups().catch(console.error);