/**
 * Generate Major Arcana Cards 5-9 with Rate Limit Respect
 */

import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const cardsToGenerate = [
  {
    id: "5",
    name: "The Hierophant",
    prompt: "Traditional Rider-Waite tarot card The Hierophant: seated religious figure in papal robes on ornate throne between two stone pillars, raising right hand in blessing, holding golden staff with triple cross, two kneeling acolytes below receiving spiritual teachings, ornate church interior with stained glass windows, keys at feet symbolizing sacred knowledge, spiritual wisdom and religious tradition, detailed traditional tarot art style, vertical card format"
  },
  {
    id: "6", 
    name: "The Lovers",
    prompt: "Traditional Rider-Waite tarot card The Lovers: naked man and woman standing beneath large angel Raphael with spread wings, Tree of Life behind woman with red apples, Tree of Knowledge behind man with serpent, mountain peak in background, angel blessing the divine union, pure love and choice, garden of Eden paradise setting, detailed traditional tarot art style, vertical card format"
  },
  {
    id: "7",
    name: "The Chariot", 
    prompt: "Traditional Rider-Waite tarot card The Chariot: armored warrior standing confidently in ornate stone chariot, pulled by one black sphinx and one white sphinx facing different directions, starry blue canopy above, crescent moons on armor shoulders, ancient city walls in background, determination and willpower, victory through control, detailed traditional tarot art style, vertical card format"
  },
  {
    id: "8",
    name: "Strength",
    prompt: "Traditional Rider-Waite tarot card Strength: gentle woman in flowing white robes with infinity symbol glowing above her head, calmly and lovingly closing the jaws of a golden lion with her bare hands, red roses blooming in background, distant mountains, inner strength conquering brute force, courage and compassion, detailed traditional tarot art style, vertical card format"
  },
  {
    id: "9",
    name: "The Hermit",
    prompt: "Traditional Rider-Waite tarot card The Hermit: elderly bearded wise man in gray hooded robes standing on snowy mountain peak, holding glowing lantern containing six-pointed star, wooden walking staff in other hand, seeking inner wisdom and enlightenment, solitary spiritual journey, detailed traditional tarot art style, vertical card format"
  }
];

async function generateSingleCard(cardData: any): Promise<boolean> {
  try {
    console.log(`\n🎨 Generating ${cardData.name} (Card ${cardData.id})...`);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: cardData.prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard", // Using standard for faster generation within rate limits
    });

    const imageUrl = response.data?.[0]?.url;
    if (!imageUrl) {
      throw new Error("No image URL returned");
    }

    console.log(`✅ ${cardData.name} image generated successfully!`);

    // Download the image
    const imageResponse = await fetch(imageUrl);
    const buffer = Buffer.from(await imageResponse.arrayBuffer());
    
    const filepath = path.join("public", "assets", "cards", `${cardData.id}.png`);
    fs.writeFileSync(filepath, buffer);
    
    console.log(`✅ ${cardData.name} saved as ${cardData.id}.png`);
    return true;
    
  } catch (error) {
    console.error(`❌ Failed to generate ${cardData.name}:`, error);
    return false;
  }
}

async function generateCards5to9() {
  console.log("🌟 Starting generation of Major Arcana cards 5-9...");
  console.log("⏱️ Using delays to respect API rate limits\n");

  let successCount = 0;
  
  for (let i = 0; i < cardsToGenerate.length; i++) {
    const card = cardsToGenerate[i];
    
    console.log(`--- Generating card ${i + 1}/5 ---`);
    
    const success = await generateSingleCard(card);
    if (success) {
      successCount++;
    }
    
    // Wait 60 seconds between each generation to respect rate limits
    if (i < cardsToGenerate.length - 1) {
      console.log(`⏱️ Waiting 60 seconds before next generation to respect rate limits...`);
      await new Promise(resolve => setTimeout(resolve, 60000));
    }
  }
  
  console.log(`\n🎉 Generation complete!`);
  console.log(`✅ Successfully generated: ${successCount}/5 cards`);
  
  if (successCount === 5) {
    console.log("🌟 Cards 5-9 now have authentic traditional artwork!");
  } else {
    console.log(`⚠️ ${5 - successCount} cards failed. You may want to retry those manually.`);
  }
}

generateCards5to9().catch(console.error);