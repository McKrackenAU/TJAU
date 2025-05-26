/**
 * DALL-E 2 Card Generation - Fast and Reliable
 * Generate all Major Arcana cards using DALL-E 2
 */
import OpenAI from "openai";
import fs from "fs";
import https from "https";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const majorArcanaCards = [
  { id: "00", name: "The Fool", prompt: "Traditional tarot card The Fool, young person in colorful robes stepping toward cliff, white dog, mountains, sun, ornate border" },
  { id: "01", name: "The Magician", prompt: "Traditional tarot card The Magician, figure with wand raised, infinity symbol above head, altar with tools, red and white robes" },
  { id: "02", name: "The High Priestess", prompt: "Traditional tarot card High Priestess, woman in blue robes between two pillars, moon crown, scroll, pomegranates" },
  { id: "03", name: "The Empress", prompt: "Traditional tarot card The Empress, crowned woman in flowing gown, wheat field, Venus symbol, throne, abundant nature" },
  { id: "04", name: "The Emperor", prompt: "Traditional tarot card The Emperor, bearded man on stone throne, ram heads, armor, scepter, mountains behind" },
  { id: "05", name: "The Hierophant", prompt: "Traditional tarot card Hierophant, religious figure with papal crown, two pillars, two acolytes, crossed keys" },
  { id: "06", name: "The Lovers", prompt: "Traditional tarot card The Lovers, man and woman, angel above, tree of knowledge, mountains, choices" },
  { id: "07", name: "The Chariot", prompt: "Traditional tarot card The Chariot, warrior in chariot pulled by two sphinxes, starry canopy, city walls" },
  { id: "08", name: "Strength", prompt: "Traditional tarot card Strength, woman gently closing lion's mouth, infinity symbol, flowers, inner strength" },
  { id: "09", name: "The Hermit", prompt: "Traditional tarot card The Hermit, old man with lantern and staff, mountain peak, six-pointed star light" },
  { id: "10", name: "Wheel of Fortune", prompt: "Traditional tarot card Wheel of Fortune, large wheel with symbols, sphinx on top, snake and Anubis, clouds" },
  { id: "11", name: "Justice", prompt: "Traditional tarot card Justice, figure with scales and sword, pillars, balance, law and order" },
  { id: "12", name: "The Hanged Man", prompt: "Traditional tarot card Hanged Man, figure suspended by foot from tree, halo, sacrifice, new perspective" },
  { id: "13", name: "Death", prompt: "Traditional tarot card Death, skeleton knight on white horse, bishop and child, transformation, renewal" },
  { id: "14", name: "Temperance", prompt: "Traditional tarot card Temperance, angel pouring water between cups, one foot on land one in water, triangle" },
  { id: "15", name: "The Devil", prompt: "Traditional tarot card The Devil, horned figure on throne, chained man and woman, pentagram, bondage" },
  { id: "16", name: "The Tower", prompt: "Traditional tarot card The Tower, lightning striking tower, crown falling, figures falling, destruction" },
  { id: "17", name: "The Star", prompt: "Traditional tarot card The Star, woman pouring water, large star with seven smaller stars, hope" },
  { id: "18", name: "The Moon", prompt: "Traditional tarot card The Moon, moon with face, two towers, dog and wolf, crayfish, illusion" },
  { id: "19", name: "The Sun", prompt: "Traditional tarot card The Sun, large sun with face, child on white horse, sunflowers, joy" },
  { id: "20", name: "Judgement", prompt: "Traditional tarot card Judgement, angel with trumpet, graves opening, resurrection, final judgment" },
  { id: "21", name: "The World", prompt: "Traditional tarot card The World, dancing figure in wreath, four symbols in corners, completion" }
];

function ensureDirectory(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function downloadImage(url: string, filename: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filename);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filename, () => {});
      reject(err);
    });
  });
}

async function generateCard(card: any): Promise<boolean> {
  try {
    console.log(`🎨 Generating ${card.name}...`);
    
    const response = await openai.images.generate({
      model: "dall-e-2", // Using DALL-E 2 for speed and reliability
      prompt: card.prompt,
      n: 1,
      size: "1024x1024",
    });

    if (!response.data?.[0]?.url) {
      throw new Error("No image generated");
    }

    const filename = `public/authentic-cards/major-arcana/${card.id}-${card.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}.png`;
    await downloadImage(response.data[0].url, filename);
    
    console.log(`✅ ${card.name} saved successfully!`);
    return true;
    
  } catch (error) {
    console.error(`❌ Failed to generate ${card.name}:`, error);
    return false;
  }
}

async function generateAllMajorArcana(): Promise<void> {
  console.log("🚀 Starting DALL-E 2 generation for all Major Arcana cards...");
  
  // Ensure directory exists
  ensureDirectory("public/authentic-cards/major-arcana");
  
  let successCount = 0;
  
  for (const card of majorArcanaCards) {
    const success = await generateCard(card);
    if (success) {
      successCount++;
    }
    
    // Small delay between generations to avoid rate limits
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log(`\n🎉 Generation complete! ${successCount}/${majorArcanaCards.length} cards generated successfully.`);
}

generateAllMajorArcana();