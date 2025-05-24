/**
 * Generate The Hierophant (Card 5) - Immediate Priority
 */
import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateHierophant() {
  try {
    console.log("🔮 Generating The Hierophant (Card 5) with authentic symbolism...");
    
    const prompt = `Create a beautiful, authentic tarot card artwork for The Hierophant (Major Arcana V). 

Traditional symbolism to include:
- A spiritual teacher or religious figure seated on a throne
- Triple crown representing divine wisdom
- Two pillars representing structure and tradition
- Keys at his feet symbolizing access to hidden knowledge
- Two acolytes or students before him
- Raised hand in blessing
- Sacred religious vestments
- Colors: Deep blues, golds, whites
- Ornate, ceremonial setting suggesting a temple or sanctuary

Style: Classical tarot card artwork, rich colors, detailed symbolic imagery, mystical and reverent atmosphere. The card should convey spiritual authority, religious tradition, and the bridge between divine and earthly wisdom.`;

    const response = await openai.images.generate({
      model: "dall-e-3", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    if (response.data && response.data[0]?.url) {
      const imageUrl = response.data[0].url;
      console.log("✨ Image generated successfully, downloading...");
      
      // Download and save the image
      const imageResponse = await fetch(imageUrl);
      const arrayBuffer = await imageResponse.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const outputPath = path.join(process.cwd(), "public/authentic-cards/major-arcana/05-hierophant.png");
      fs.writeFileSync(outputPath, buffer);
      
      console.log(`🎉 The Hierophant saved successfully: ${outputPath}`);
      return true;
    } else {
      console.error("❌ No image URL returned from OpenAI");
      return false;
    }
  } catch (error) {
    console.error("❌ Error generating The Hierophant:", error);
    return false;
  }
}

generateHierophant();