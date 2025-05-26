/**
 * Batch Generate Major Arcana Cards 10-14
 * Wheel of Fortune, Justice, The Hanged Man, Death, Temperance
 */

import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY 
});

function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function generateCard(cardName: string, filename: string, prompt: string): Promise<boolean> {
  try {
    console.log(`\n🎨 Generating ${cardName}...`);
    
    const directory = "public/authentic-cards/major-arcana";
    ensureDirectoryExists(directory);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
      style: "natural"
    });

    if (response.data?.[0]?.url) {
      const imageResponse = await fetch(response.data[0].url);
      const imageBuffer = Buffer.from(await imageResponse.arrayBuffer());
      const fullPath = path.join(directory, filename);
      
      fs.writeFileSync(fullPath, imageBuffer);
      
      console.log(`✅ SUCCESS: ${cardName} -> ${fullPath}`);
      return true;
    }
    
    return false;
    
  } catch (error) {
    console.error(`❌ FAILED: ${cardName}:`, error);
    return false;
  }
}

async function generateBatch10to14() {
  console.log("🌟 Generating Major Arcana Cards 10-14...");
  
  const cards = [
    {
      name: "Wheel of Fortune",
      filename: "10-wheel-of-fortune.png",
      prompt: "A great golden wheel suspended in clouds, inscribed with mystical symbols and Hebrew letters TARO and ROTA. Four winged creatures (angel, eagle, lion, bull) read books in the corners, representing the fixed signs. A sphinx sits atop with a sword, a serpent descends on the left, Anubis rises on the right. Rich blues and golds, cosmic atmosphere of destiny and cycles of fortune."
    },
    {
      name: "Justice",
      filename: "11-justice.png", 
      prompt: "A regal figure seated on a stone throne between two pillars, holding perfectly balanced golden scales in one hand and a double-edged sword pointed upward in the other. Wearing a red robe and golden crown, with a purple veil behind. The setting conveys perfect equilibrium, law, and cosmic justice. Rich purples, reds, and gold, emanating fairness and divine balance."
    },
    {
      name: "The Hanged Man",
      filename: "12-hanged-man.png",
      prompt: "A serene figure suspended upside down from a living tree by one foot, his other leg crossed at the knee forming a number 4. His hands are behind his back, and a golden halo surrounds his head. He appears peaceful and enlightened rather than suffering. Soft earth tones and golden light, conveying sacrifice, surrender, and gaining new perspective through letting go."
    },
    {
      name: "Death",
      filename: "13-death.png",
      prompt: "A skeletal figure in black armor riding a white horse, carrying a black banner with a white rose symbolizing purity through transformation. A king lies fallen, a child and woman plead, while a bishop prays. In the distance, a river flows toward mountains and a rising sun. The scene represents transformation and renewal, not ending - new beginnings through change."
    },
    {
      name: "Temperance",
      filename: "14-temperance.png",
      prompt: "An angelic figure with large wings standing with one foot on land, one in water, pouring liquid between two golden cups in an endless flow. A radiant triangle on their forehead, wearing flowing white and blue robes. Behind them, a path leads to golden mountains crowned with light. Soft blues, whites, and golds, conveying balance, moderation, and spiritual alchemy."
    }
  ];

  let successCount = 0;
  
  for (const card of cards) {
    const success = await generateCard(card.name, card.filename, card.prompt);
    if (success) successCount++;
    
    // 3-second delay between generations
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  console.log(`\n🎉 Batch 10-14 Complete! Generated ${successCount}/${cards.length} cards successfully.`);
  console.log("Next: Cards 15-21 (The Devil through The World)");
}

generateBatch10to14().catch(console.error);