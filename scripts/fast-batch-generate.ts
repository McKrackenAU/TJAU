/**
 * Fast Batch Generation - High Tier Rate Limits
 */

import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const remainingCards = [
  { id: "5", name: "The Hierophant", prompt: "Traditional Rider-Waite tarot card The Hierophant: seated religious figure in papal robes on throne between pillars, raising hand in blessing, holding golden staff with triple cross, two kneeling acolytes below, spiritual wisdom and religious tradition, vertical tarot card format" },
  { id: "6", name: "The Lovers", prompt: "Traditional Rider-Waite tarot card The Lovers: naked man and woman beneath angel Raphael with wings, Tree of Life behind woman, Tree of Knowledge behind man with serpent, mountain background, divine love and choice, paradise garden, vertical tarot card format" },
  { id: "7", name: "The Chariot", prompt: "Traditional Rider-Waite tarot card The Chariot: armored warrior in stone chariot pulled by black and white sphinxes, starry canopy above, crescent moons on shoulders, city walls background, determination and victory, vertical tarot card format" },
  { id: "8", name: "Strength", prompt: "Traditional Rider-Waite tarot card Strength: gentle woman in white robes with infinity symbol above head, calmly closing lion's jaws with hands, red roses background, inner strength and courage, vertical tarot card format" },
  { id: "9", name: "The Hermit", prompt: "Traditional Rider-Waite tarot card The Hermit: elderly bearded man in gray robes on mountain peak, holding glowing lantern with six-pointed star, wooden staff, seeking wisdom and enlightenment, vertical tarot card format" },
  { id: "10", name: "Wheel of Fortune", prompt: "Traditional Rider-Waite tarot card Wheel of Fortune: large golden wheel with Hebrew letters, sphinx with sword on top, snake descending, Anubis ascending, four winged creatures in corners, fate and destiny, vertical tarot card format" },
  { id: "11", name: "Justice", prompt: "Traditional Rider-Waite tarot card Justice: seated figure in red robes between pillars, holding upright sword and golden scales, square crown, purple curtain behind, divine justice and fairness, vertical tarot card format" },
  { id: "12", name: "The Hanged Man", prompt: "Traditional Rider-Waite tarot card The Hanged Man: man suspended upside down by foot from living tree with twelve leaves, hands bound, serene expression with halo, sacrifice and new perspective, vertical tarot card format" },
  { id: "13", name: "Death", prompt: "Traditional Rider-Waite tarot card Death: skeletal knight in black armor on white horse, carrying black banner with white rose, fallen king, priest and woman watching, transformation and rebirth, vertical tarot card format" },
  { id: "14", name: "Temperance", prompt: "Traditional Rider-Waite tarot card Temperance: winged angel in white robes pouring water between golden cups, one foot on land one in water, iris flowers, mountain path, divine alchemy and moderation, vertical tarot card format" },
  { id: "15", name: "The Devil", prompt: "Traditional Rider-Waite tarot card The Devil: horned devil with bat wings on black cube, inverted pentagram on forehead, holding torch, naked chained figures below, bondage and temptation, vertical tarot card format" },
  { id: "16", name: "The Tower", prompt: "Traditional Rider-Waite tarot card The Tower: tall stone tower struck by lightning, golden crown falling, two figures falling from tower, flames from windows, sudden upheaval and revelation, vertical tarot card format" },
  { id: "17", name: "The Star", prompt: "Traditional Rider-Waite tarot card The Star: naked woman kneeling by water under starry sky, pouring water from two jugs, large eight-pointed star with seven smaller stars, ibis bird, hope and inspiration, vertical tarot card format" },
  { id: "18", name: "The Moon", prompt: "Traditional Rider-Waite tarot card The Moon: large moon with face showing light and shadow, two towers, path between towers to mountains, wolf and dog howling, crayfish in water, illusion and subconscious, vertical tarot card format" },
  { id: "19", name: "The Sun", prompt: "Traditional Rider-Waite tarot card The Sun: bright sun with human face and rays, naked child riding white horse, red banner, four sunflowers behind garden wall, joy and vitality, vertical tarot card format" },
  { id: "20", name: "Judgement", prompt: "Traditional Rider-Waite tarot card Judgement: Angel Gabriel with golden trumpet and white banner with red cross, naked figures rising from coffins, snowy mountains, spiritual awakening and resurrection, vertical tarot card format" },
  { id: "21", name: "The World", prompt: "Traditional Rider-Waite tarot card The World: naked dancing figure within oval laurel wreath, holding two wands, purple scarves, four creatures in corners, completion and fulfillment, vertical tarot card format" }
];

async function generateCard(cardData: any): Promise<boolean> {
  try {
    console.log(`🎨 Generating ${cardData.name} (${cardData.id})...`);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: cardData.prompt,
      n: 1,
      size: "1024x1024",
      quality: "hd", // Using HD quality now that we have higher tier
    });

    const imageUrl = response.data?.[0]?.url;
    if (!imageUrl) {
      throw new Error("No image URL returned");
    }

    console.log(`✅ ${cardData.name} generated successfully!`);

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

async function fastBatchGenerate() {
  console.log("🚀 Fast batch generation starting with high-tier rate limits!");
  console.log(`📊 Generating ${remainingCards.length} Major Arcana cards...\n`);

  let successCount = 0;
  
  for (let i = 0; i < remainingCards.length; i++) {
    const card = remainingCards[i];
    
    console.log(`--- Card ${i + 1}/${remainingCards.length}: ${card.name} ---`);
    
    const success = await generateCard(card);
    if (success) {
      successCount++;
    }
    
    // Short delay between generations for higher tier limits
    if (i < remainingCards.length - 1) {
      console.log("⏱️ Brief pause...");
      await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
    }
  }
  
  console.log(`\n🎉 Batch generation complete!`);
  console.log(`✅ Successfully generated: ${successCount}/${remainingCards.length} cards`);
  
  if (successCount === remainingCards.length) {
    console.log("🌟 ALL Major Arcana cards now have authentic traditional artwork!");
    console.log("🚀 Your app is ready to launch!");
  } else {
    console.log(`⚠️ ${remainingCards.length - successCount} cards need retry.`);
  }
}

fastBatchGenerate().catch(console.error);