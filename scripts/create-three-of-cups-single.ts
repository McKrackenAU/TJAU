/**
 * Create Single Three of Cups - Ultra-Ethereal Style
 */
import fs from "fs";
import path from "path";

async function createThreeOfCups(): Promise<void> {
  try {
    console.log("🎨 Creating Three of Cups...");
    
    const prompt = "Ultra-ethereal 3D Three of Cups tarot card, three joyful friends celebrating together holding ornate chalices raised in toast, translucent dreamlike figures with liquid starlight hair flowing in cosmic winds, celestial features glowing with inner light, musky pink and purple aurora skin tones, background of swirling pink and purple nebulae with golden starlight, EXACTLY THREE ornate golden cups prominently displayed with intricate celestial engravings, scene radiates friendship celebration community joy, ultra-realistic 3D depth cinematic lighting mystical atmosphere, photographic realism magical pink purple color palette, no text";
    
    const response = await fetch("https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HUGGINGFACE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          num_inference_steps: 30,
          guidance_scale: 7.0,
          width: 1024,
          height: 1024
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    const imageBuffer = await response.arrayBuffer();
    const outputPath = path.join("public", "authentic-cards", "minor-arcana", "cups", "three-of-cups.png");
    
    fs.writeFileSync(outputPath, new Uint8Array(imageBuffer));
    console.log(`✅ Created Three of Cups -> ${outputPath}`);
    
  } catch (error) {
    console.error("❌ Failed to create Three of Cups:", error);
  }
}

createThreeOfCups().catch(console.error);