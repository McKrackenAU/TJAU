/**
 * Complete Remaining Major Arcana Cards (5-21)
 * Generate authentic traditional artwork for The Hierophant through The World
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

async function completeRemainingMajorArcana() {
  console.log("🌟 Generating remaining Major Arcana cards with authentic traditional artwork...\n");

  // Remaining Major Arcana cards (5-21) with traditional symbolism
  const remainingCards = [
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
    },
    {
      number: 10,
      name: "Wheel of Fortune",
      prompt: "Traditional Rider-Waite tarot card Wheel of Fortune: large golden wheel with Hebrew letters YHVH and TARO, sphinx with sword on top, snake descending on left, Anubis ascending on right, four winged creatures in corners reading books (angel, eagle, lion, bull), clouds background, fate and destiny, vertical tarot card format"
    },
    {
      number: 11,
      name: "Justice",
      prompt: "Traditional Rider-Waite tarot card Justice: seated figure in red robes between two gray pillars, holding upright sword in right hand and golden scales in left, square crown on head, purple curtain behind, divine justice and fairness, moral balance and accountability, vertical tarot card format"
    },
    {
      number: 12,
      name: "The Hanged Man",
      prompt: "Traditional Rider-Waite tarot card The Hanged Man: man suspended upside down by right foot from living tree with twelve leaves, hands bound behind back, serene expression with halo of light around head, wearing blue tunic and red leggings, sacrifice and new perspective, vertical tarot card format"
    },
    {
      number: 13,
      name: "Death",
      prompt: "Traditional Rider-Waite tarot card Death: skeletal knight in black armor riding white horse, carrying black banner with white rose, trampling over fallen king, priest pleading, woman and child watching, river and sunrise in background, transformation and rebirth, vertical tarot card format"
    },
    {
      number: 14,
      name: "Temperance",
      prompt: "Traditional Rider-Waite tarot card Temperance: winged angel in white robes with triangle on chest, pouring water between two golden cups, one foot on land one in water, iris flowers blooming, mountain path leading to golden crown, divine alchemy and moderation, vertical tarot card format"
    },
    {
      number: 15,
      name: "The Devil",
      prompt: "Traditional Rider-Waite tarot card The Devil: horned devil figure with bat wings sitting on black cube, inverted pentagram on forehead, holding burning torch, naked man and woman chained below with small horns and tails, dark cave setting, bondage and temptation, vertical tarot card format"
    },
    {
      number: 16,
      name: "The Tower",
      prompt: "Traditional Rider-Waite tarot card The Tower: tall stone tower being struck by lightning bolt from dark clouds, golden crown falling from top, two figures falling headfirst from tower, flames shooting from windows, rocky foundation, sudden upheaval and revelation, vertical tarot card format"
    },
    {
      number: 17,
      name: "The Star",
      prompt: "Traditional Rider-Waite tarot card The Star: naked woman kneeling by water's edge under starry night sky, pouring water from two jugs - one onto land one into pool, large eight-pointed star above with seven smaller stars, ibis bird in tree, hope and inspiration, vertical tarot card format"
    },
    {
      number: 18,
      name: "The Moon",
      prompt: "Traditional Rider-Waite tarot card The Moon: large moon with face showing both light and shadow, two towers in distance, path leading from foreground pool between towers to mountains, wolf and dog howling at moon, crayfish emerging from water, illusion and subconscious fears, vertical tarot card format"
    },
    {
      number: 19,
      name: "The Sun",
      prompt: "Traditional Rider-Waite tarot card The Sun: bright sun with human face and radiating rays, naked child riding white horse, red banner in hand, four large sunflowers behind garden wall, joyful celebration and vitality, clear blue sky, happiness and success, vertical tarot card format"
    },
    {
      number: 20,
      name: "Judgement",
      prompt: "Traditional Rider-Waite tarot card Judgement: Angel Gabriel with golden trumpet and white banner with red cross, naked figures rising from coffins with arms raised - man woman and child, snowy mountains in background, spiritual awakening and resurrection, final judgment, vertical tarot card format"
    },
    {
      number: 21,
      name: "The World",
      prompt: "Traditional Rider-Waite tarot card The World: naked dancing figure within large oval laurel wreath, holding two wands, purple scarves flowing, four creatures in corners (angel, eagle, lion, bull), completion and fulfillment, cosmic consciousness, vertical tarot card format"
    }
  ];

  let successCount = 0;
  const totalCards = remainingCards.length;

  for (let i = 0; i < remainingCards.length; i++) {
    const card = remainingCards[i];
    
    console.log(`\n--- Card ${i + 1}/${totalCards}: ${card.name} ---`);
    
    const success = await generateMajorCard(card.number, card.name, card.prompt);
    
    if (success) {
      successCount++;
    }
    
    // Rate limiting - wait between requests
    if (i < remainingCards.length - 1) {
      console.log("⏱️ Waiting 3 seconds before next generation...");
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  console.log(`\n🎉 Completed generating remaining Major Arcana cards!`);
  console.log(`✅ Successfully generated: ${successCount}/${totalCards} cards`);
  
  if (successCount === totalCards) {
    console.log("🌟 All Major Arcana cards now have authentic traditional artwork!");
  } else {
    console.log(`⚠️ ${totalCards - successCount} cards failed to generate. You may want to retry those manually.`);
  }
}

// Run the generation
completeRemainingMajorArcana().catch(console.error);