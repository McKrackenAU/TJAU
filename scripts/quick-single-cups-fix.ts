/**
 * Quick Single Cups Fix with New Filenames
 */

import fs from "fs";
import path from "path";

async function createSingleNewCup(): Promise<void> {
  console.log("🎨 Creating fresh Three of Cups with new filename...");
  
  const token = process.env.hf_API_TOKEN_FOUR;
  if (!token) {
    console.log("❌ Token not found");
    return;
  }

  const prompt = "Three of Cups tarot card celebration scene, three joyful friends toasting with raised golden chalices, exactly 3 ornate cups prominently displayed, ultra-ethereal translucent figures with liquid starlight hair, celestial features, pink purple cosmic nebula background, 3D realistic depth, dreamlike quality";

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
          num_inference_steps: 18,
          guidance_scale: 7,
          width: 512,
          height: 512
        }
      }),
    });

    if (response.ok) {
      const buffer = await response.arrayBuffer();
      const outputDir = path.join("public", "authentic-cards", "minor-arcana", "cups");
      
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      const outputPath = path.join(outputDir, "three-of-cups-new.png");
      fs.writeFileSync(outputPath, new Uint8Array(buffer));
      console.log("✅ Three of Cups created with new filename!");
    } else {
      console.log(`❌ Error: ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ Failed: ${error.message}`);
  }
}

createSingleNewCup();