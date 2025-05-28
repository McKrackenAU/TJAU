/**
 * Create Ultra-Ethereal Cups Cards with Alternative Token
 */
import fs from "fs";
import path from "path";

async function createCard(name: string, filename: string, prompt: string): Promise<boolean> {
  try {
    console.log(`🎨 Creating ${name}...`);
    
    const response = await fetch("https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.hf_API_TOKEN_THREE}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          num_inference_steps: 25,
          guidance_scale: 7.0,
          width: 1024,
          height: 1024
        }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ ${name} failed: HTTP ${response.status}: ${errorText}`);
      return false;
    }

    const imageBuffer = await response.arrayBuffer();
    const outputPath = path.join("public", "authentic-cards", "minor-arcana", "cups", filename);
    
    fs.writeFileSync(outputPath, new Uint8Array(imageBuffer));
    console.log(`✅ Created ${name} -> ${outputPath}`);
    return true;
    
  } catch (error) {
    console.error(`❌ Failed ${name}:`, error);
    return false;
  }
}

async function createThreeOfCups() {
  const prompt = "Ultra-ethereal 3D Three of Cups tarot card, three joyful friends celebrating together holding ornate chalices raised in toast, translucent dreamlike figures with liquid starlight hair flowing in cosmic winds, celestial features glowing with inner light, musky pink and purple aurora skin tones, background of swirling pink and purple nebulae with golden starlight, EXACTLY THREE ornate golden cups prominently displayed, scene radiates friendship celebration community joy, ultra-realistic 3D depth cinematic lighting mystical atmosphere, photographic realism magical pink purple color palette";
  
  return await createCard("Three of Cups", "three-of-cups.png", prompt);
}

createThreeOfCups().catch(console.error);