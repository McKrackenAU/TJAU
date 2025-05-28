/**
 * Quick Cups Fix - Direct approach
 */

import fs from "fs";
import path from "path";

async function quickFixThreeOfCups(): Promise<void> {
  console.log("🎨 Quick fix for Three of Cups...");
  
  const token = process.env.hf_API_TOKEN_FOUR;
  if (!token) {
    console.log("❌ Token not found");
    return;
  }

  const prompt = "Three of Cups tarot card, three people celebrating with raised golden chalices, exactly 3 ornate cups visible, joyful celebration scene, ultra-ethereal style, translucent figures with starlight hair, pink purple cosmic background, 3D realistic depth";

  try {
    const response = await fetch("https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          num_inference_steps: 15,
          guidance_scale: 7,
          width: 512,
          height: 512
        }
      }),
    });

    if (response.ok) {
      const buffer = await response.arrayBuffer();
      const outputPath = path.join("public", "authentic-cards", "minor-arcana", "cups", "three-of-cups.png");
      fs.writeFileSync(outputPath, new Uint8Array(buffer));
      console.log("✅ Three of Cups fixed!");
    } else {
      console.log(`❌ Error: ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ Failed: ${error.message}`);
  }
}

quickFixThreeOfCups();