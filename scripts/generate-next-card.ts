/**
 * Generate Next Missing Major Arcana Card
 */

import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Card definitions for all missing Major Arcana
const cardDefinitions: Record<string, { name: string; prompt: string }> = {
  "5": {
    name: "The Hierophant",
    prompt: "Beautiful traditional tarot card The Hierophant: religious figure in robes on throne, blessing gesture, spiritual teacher, sacred wisdom, traditional style"
  },
  "6": {
    name: "The Lovers", 
    prompt: "Beautiful traditional tarot card The Lovers: man and woman beneath angel, divine love, choice, harmony, garden paradise"
  },
  "7": {
    name: "The Chariot",
    prompt: "Beautiful traditional tarot card The Chariot: warrior in chariot with two sphinxes, determination, victory, willpower"
  },
  "8": {
    name: "Strength",
    prompt: "Beautiful traditional tarot card Strength: woman gently closing lion's mouth, inner strength, courage, infinity symbol"
  },
  "9": {
    name: "The Hermit",
    prompt: "Beautiful traditional tarot card The Hermit: old man with lantern and staff on mountain, seeking wisdom, introspection"
  },
  "10": {
    name: "Wheel of Fortune",
    prompt: "Beautiful traditional tarot card Wheel of Fortune: large wheel with symbols, sphinx on top, fate and destiny"
  },
  "11": {
    name: "Justice",
    prompt: "Beautiful traditional tarot card Justice: figure with sword and scales, divine justice, fairness, balance"
  },
  "12": {
    name: "The Hanged Man",
    prompt: "Beautiful traditional tarot card The Hanged Man: man suspended upside down from tree, sacrifice, new perspective"
  },
  "13": {
    name: "Death",
    prompt: "Beautiful traditional tarot card Death: skeletal knight on white horse, transformation, rebirth, change"
  },
  "14": {
    name: "Temperance",
    prompt: "Beautiful traditional tarot card Temperance: angel pouring water between cups, moderation, balance, alchemy"
  },
  "15": {
    name: "The Devil",
    prompt: "Beautiful traditional tarot card The Devil: horned figure with chained people, bondage, temptation, materialism"
  },
  "16": {
    name: "The Tower",
    prompt: "Beautiful traditional tarot card The Tower: tower struck by lightning, crown falling, sudden change, revelation"
  },
  "17": {
    name: "The Star",
    prompt: "Beautiful traditional tarot card The Star: woman pouring water under starry sky, hope, inspiration, guidance"
  },
  "18": {
    name: "The Moon",
    prompt: "Beautiful traditional tarot card The Moon: moon with face, path between towers, wolf and dog, illusion, subconscious"
  },
  "19": {
    name: "The Sun",
    prompt: "Beautiful traditional tarot card The Sun: bright sun with child on horse, joy, success, vitality, happiness"
  },
  "20": {
    name: "Judgement",
    prompt: "Beautiful traditional tarot card Judgement: angel with trumpet, people rising from graves, spiritual awakening, rebirth"
  },
  "21": {
    name: "The World",
    prompt: "Beautiful traditional tarot card The World: dancing figure in wreath, completion, fulfillment, cosmic consciousness"
  }
};

function findNextMissingCard(): string | null {
  for (let i = 5; i <= 21; i++) {
    const cardPath = path.join("public", "assets", "cards", `${i}.png`);
    if (!fs.existsSync(cardPath)) {
      return i.toString();
    }
  }
  return null;
}

async function generateCard(cardId: string) {
  const cardDef = cardDefinitions[cardId];
  if (!cardDef) {
    console.log(`❌ No definition found for card ${cardId}`);
    return false;
  }

  try {
    console.log(`🎨 Generating ${cardDef.name} (${cardId})...`);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: cardDef.prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    const imageUrl = response.data?.[0]?.url;
    if (!imageUrl) {
      throw new Error("No image URL returned");
    }

    console.log(`✅ Image generated for ${cardDef.name}!`);

    const imageResponse = await fetch(imageUrl);
    const buffer = Buffer.from(await imageResponse.arrayBuffer());
    
    const filepath = path.join("public", "assets", "cards", `${cardId}.png`);
    fs.writeFileSync(filepath, buffer);
    
    console.log(`✅ ${cardDef.name} saved as ${cardId}.png`);
    return true;
    
  } catch (error) {
    console.error(`❌ Failed to generate ${cardDef.name}:`, error);
    return false;
  }
}

async function main() {
  const nextCard = findNextMissingCard();
  if (!nextCard) {
    console.log("🎉 All Major Arcana cards are complete!");
    return;
  }

  console.log(`🔍 Next missing card: ${nextCard}`);
  const success = await generateCard(nextCard);
  
  if (success) {
    console.log(`🌟 ${cardDefinitions[nextCard].name} generated successfully!`);
    
    // Count remaining cards
    const remaining = Object.keys(cardDefinitions).filter(id => {
      const cardPath = path.join("public", "assets", "cards", `${id}.png`);
      return !fs.existsSync(cardPath);
    });
    
    console.log(`📊 ${remaining.length} cards remaining: ${remaining.join(', ')}`);
  }
}

main().catch(console.error);