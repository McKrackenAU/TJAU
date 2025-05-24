/**
 * Generate Major Arcana Cards 5-9 (Batch 1)
 * The Hierophant, The Lovers, The Chariot, Strength, The Hermit
 */

import OpenAI from "openai";
import fs from "fs";
import path from "path";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateMajorCard(cardNumber: number, cardName: string, prompt: string): Promise<boolean> {
  try {
    console.log(`🎨 Generating authentic artwork for ${cardName} (${cardNumber})...`);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
    });

    if (!response.data[0]?.url) {
      console.error(`❌ No image URL returned for ${cardName}`);
      return false;
    }

    // Download the image
    const imageResponse = await fetch(response.data[0].url);
    if (!imageResponse.ok) {
      console.error(`❌ Failed to download image for ${cardName}: ${imageResponse.statusText}`);
      return false;
    }

    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Save as numbered file for consistency
    const filename = `${cardNumber}.png`;
    const filepath = path.join("public", "assets", "cards", filename);
    
    // Ensure directory exists
    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(filepath, buffer);
    console.log(`✅ Saved authentic ${cardName} as ${filename}`);
    
    return true;
  } catch (error) {
    console.error(`❌ Error generating ${cardName}:`, error);
    return false;
  }
}

async function generateBatch1() {
  console.log("🌟 Generating Major Arcana cards 5-9 with authentic traditional artwork...\n");

  // Major Arcana cards 5-9
  const batch1Cards = [
    {
      number: 5,
      name: "The Hierophant",
      prompt: "Traditional Rider-Waite tarot card The Hierophant: seated religious figure in papal robes on throne between two pillars, raising right hand in blessing, holding golden staff with triple cross, two kneeling acolytes below receiving teachings, ornate church setting with stained glass windows, keys at feet symbolizing spiritual knowledge, sacred wisdom and religious tradition, vertical tarot card format"
    },
    {
      number: 6,
      name: "The Lovers",
      prompt: "Traditional Rider-Waite tarot card The Lovers: naked man and woman standing beneath angel Raphael with purple wings, Tree of Life behind woman with apples, Tree of Knowledge behind man with fiery serpent, mountain in background, angel blessing the union, pure love and divine choice, paradise garden setting, vertical tarot card format"
    },
    {
      number: 7,
      name: "The Chariot",
      prompt: "Traditional Rider-Waite tarot card The Chariot: armored warrior standing in stone chariot pulled by one black sphinx and one white sphinx facing different directions, starry canopy above, crescent moons on shoulders, city walls in background, determination and willpower, victory through control, vertical tarot card format"
    },
    {
      number: 8,
      name: "Strength",
      prompt: "Traditional Rider-Waite tarot card Strength: gentle woman in white robes with infinity symbol above head, calmly closing the jaws of a golden lion with her bare hands, red roses in background, mountains in distance, inner strength conquering brute force, courage and compassion, vertical tarot card format"
    },
    {
      number: 9,
      name: "The Hermit",
      prompt: "Traditional Rider-Waite tarot card The Hermit: elderly bearded man in gray hooded robes standing on snowy mountain peak, holding glowing lantern with six-pointed star, wooden staff in other hand, seeking inner wisdom and enlightenment, solitary spiritual journey, vertical tarot card format"
    }
  ];

  let successCount = 0;
  const totalCards = batch1Cards.length;

  for (let i = 0; i < batch1Cards.length; i++) {
    const card = batch1Cards[i];
    
    console.log(`\n--- Card ${i + 1}/${totalCards}: ${card.name} ---`);
    
    const success = await generateMajorCard(card.number, card.name, card.prompt);
    
    if (success) {
      successCount++;
    }
    
    // Rate limiting - wait between requests
    if (i < batch1Cards.length - 1) {
      console.log("⏱️ Waiting 3 seconds before next generation...");
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  console.log(`\n🎉 Batch 1 complete!`);
  console.log(`✅ Successfully generated: ${successCount}/${totalCards} cards`);
  console.log("🌟 Cards 5-9 now have authentic traditional artwork!");
}

// Run the generation
generateBatch1().catch(console.error);