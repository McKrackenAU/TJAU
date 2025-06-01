/**
 * Generate New Fool Card - Ultra-Ethereal 3D Style
 * Matching The High Priestess color palette and dimensional depth
 */

import { writeFileSync, existsSync, mkdirSync } from 'fs';
import path from 'path';

async function generateNewFoolCard(): Promise<boolean> {
  try {
    console.log("🎨 Generating new ultra-ethereal 3D Fool card...");
    
    // Ultra-ethereal 3D prompt matching The High Priestess style
    const prompt = `Ultra-ethereal 3D lifelike tarot card: The Fool. A young, androgynous figure with liquid starlight hair in deep purples and magentas, celestial translucent skin with rose pink undertones, standing at the edge of a cliff with one foot suspended over the abyss. Wearing flowing robes of deep purple silk with rose pink accents, holding a white rose. Small loyal dog companion beside them. Dreamlike crystalline mountains in background, soft lavender mist, golden sunbeams. Hyper-realistic 3D rendering with translucent, ethereal qualities. Color palette: deep purples, magentas, rose pinks, lavender, soft gold. Professional tarot card composition, ornate decorative border.`;

    const apiKey = process.env.STABILITY_API_KEY;
    if (!apiKey) {
      console.error("❌ STABILITY_API_KEY not found in environment variables");
      return false;
    }

    console.log("🔮 Calling Stability AI API...");
    
    const response = await fetch("https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        text_prompts: [
          {
            text: prompt,
            weight: 1
          },
          {
            text: "blurry, low quality, distorted, anime, cartoon, flat 2D, simple illustration, poor anatomy, ugly, deformed",
            weight: -1
          }
        ],
        cfg_scale: 7,
        height: 1024,
        width: 1024,
        steps: 30,
        samples: 1,
        style_preset: "fantasy-art"
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Stability AI API error:", response.status, errorText);
      return false;
    }

    const responseData = await response.json();
    
    if (!responseData.artifacts || responseData.artifacts.length === 0) {
      console.error("❌ No image generated");
      return false;
    }

    // Ensure directory exists
    const outputDir = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana');
    if (!existsSync(outputDir)) {
      mkdirSync(outputDir, { recursive: true });
    }

    // Save the new Fool card image
    const imageData = responseData.artifacts[0].base64;
    const outputPath = path.join(outputDir, '00-fool.png');
    
    writeFileSync(outputPath, Buffer.from(imageData, 'base64'));
    
    console.log("✅ New ultra-ethereal 3D Fool card generated successfully!");
    console.log(`📁 Saved to: ${outputPath}`);
    
    return true;
    
  } catch (error) {
    console.error("❌ Error generating Fool card:", error);
    return false;
  }
}

// Run the generation
generateNewFoolCard()
  .then(success => {
    if (success) {
      console.log("🎉 The Fool card generation completed successfully!");
    } else {
      console.log("❌ The Fool card generation failed");
    }
    process.exit(success ? 0 : 1);
  })
  .catch(error => {
    console.error("❌ Fatal error:", error);
    process.exit(1);
  });