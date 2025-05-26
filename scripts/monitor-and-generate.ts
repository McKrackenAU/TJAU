/**
 * Monitor OpenAI Image Service and Generate Cards When Available
 */
import OpenAI from "openai";
import fs from "fs";
import https from "https";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const majorArcanaCards = [
  { id: "00", name: "The Fool", prompt: "Traditional tarot card The Fool, young person in colorful robes stepping toward cliff edge, white dog at feet, white rose in hand, mountains behind, bright sun above, ornate tarot border, mystical atmosphere" },
  { id: "01", name: "The Magician", prompt: "Traditional tarot card The Magician, figure with wand raised high, infinity symbol above head, altar with cup sword wand pentacle, red and white robes, roses and lilies" },
  { id: "02", name: "The High Priestess", prompt: "Traditional tarot card High Priestess, woman in blue robes seated between two pillars, crescent moon crown, scroll of Torah, pomegranates behind" },
  { id: "03", name: "The Empress", prompt: "Traditional tarot card The Empress, crowned woman in flowing gown with wheat patterns, Venus symbol on heart-shaped shield, lush garden with waterfall" },
  { id: "04", name: "The Emperor", prompt: "Traditional tarot card The Emperor, bearded man on stone throne with ram head carvings, red robes, ankh scepter, barren mountains behind" },
  { id: "05", name: "The Hierophant", prompt: "Traditional tarot card Hierophant, religious figure with triple crown, raised hand blessing, two pillars, two acolytes kneeling, crossed keys at feet" },
  { id: "06", name: "The Lovers", prompt: "Traditional tarot card The Lovers, naked man and woman, angel Raphael above with purple wings, tree of knowledge with serpent, tree of life" },
  { id: "07", name: "The Chariot", prompt: "Traditional tarot card The Chariot, armored warrior in chariot pulled by black and white sphinxes, starry canopy, city walls behind" },
  { id: "08", name: "Strength", prompt: "Traditional tarot card Strength, woman in white robe gently closing lion's mouth, infinity symbol above head, flowers in hair, mountain landscape" },
  { id: "09", name: "The Hermit", prompt: "Traditional tarot card The Hermit, old man in grey hooded robe holding lantern with six-pointed star, staff in other hand, mountain peak" },
  { id: "10", name: "Wheel of Fortune", prompt: "Traditional tarot card Wheel of Fortune, large wheel with TARO letters, sphinx on top, snake descending left, Anubis ascending right, clouds" },
  { id: "11", name: "Justice", prompt: "Traditional tarot card Justice, figure in red robes holding scales in left hand and sword in right, crown, purple cloth behind throne" },
  { id: "12", name: "The Hanged Man", prompt: "Traditional tarot card Hanged Man, figure suspended upside down by right foot from living tree, halo around head, arms behind back" },
  { id: "13", name: "Death", prompt: "Traditional tarot card Death, skeleton knight in black armor on white horse, black banner with white rose, bishop and child in foreground" },
  { id: "14", name: "Temperance", prompt: "Traditional tarot card Temperance, angel with red wings pouring water between two cups, one foot on land one in water, triangle on chest" },
  { id: "15", name: "The Devil", prompt: "Traditional tarot card The Devil, horned Baphomet figure on black cube throne, inverted pentagram, naked chained man and woman below" },
  { id: "16", name: "The Tower", prompt: "Traditional tarot card The Tower, tall tower struck by lightning, golden crown falling, two figures falling headfirst, 22 flames" },
  { id: "17", name: "The Star", prompt: "Traditional tarot card The Star, naked woman kneeling by water pouring from two pitchers, large yellow star above with seven smaller stars" },
  { id: "18", name: "The Moon", prompt: "Traditional tarot card The Moon, full moon with face dripping dew, two towers, dog and wolf howling, crayfish emerging from water" },
  { id: "19", name: "The Sun", prompt: "Traditional tarot card The Sun, large sun with face and rays, naked child on white horse with red banner, sunflowers, brick wall" },
  { id: "20", name: "Judgement", prompt: "Traditional tarot card Judgement, angel Gabriel with trumpet and cross banner, graves opening, people rising with arms raised in prayer" },
  { id: "21", name: "The World", prompt: "Traditional tarot card The World, naked dancing figure in center of oval wreath, four corner symbols: angel eagle lion bull, completion celebration" }
];

async function checkServiceAvailability(): Promise<boolean> {
  try {
    console.log("🔍 Checking OpenAI image service...");
    
    const start = Date.now();
    await openai.images.generate({
      model: "dall-e-2",
      prompt: "test",
      n: 1,
      size: "256x256"
    });
    
    const duration = Date.now() - start;
    console.log(`✅ Service is available! Response time: ${duration}ms`);
    return true;
    
  } catch (error) {
    console.log("⏳ Service still experiencing delays");
    return false;
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
      model: "dall-e-2",
      prompt: card.prompt,
      n: 1,
      size: "1024x1024",
    });

    if (!response.data?.[0]?.url) {
      throw new Error("No image generated");
    }

    const filename = `public/authentic-cards/major-arcana/${card.id}-${card.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}.png`;
    await downloadImage(response.data[0].url, filename);
    
    console.log(`✅ ${card.name} completed!`);
    return true;
    
  } catch (error) {
    console.error(`❌ Failed to generate ${card.name}:`, error);
    return false;
  }
}

async function generateAllCards(): Promise<void> {
  console.log("🚀 Starting generation of all Major Arcana cards...");
  
  // Ensure directory exists
  fs.mkdirSync("public/authentic-cards/major-arcana", { recursive: true });
  
  let successCount = 0;
  
  for (const card of majorArcanaCards) {
    const success = await generateCard(card);
    if (success) {
      successCount++;
    }
    
    // Small delay between cards
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log(`\n🎉 COMPLETE! ${successCount}/${majorArcanaCards.length} authentic tarot cards generated!`);
  console.log("🚀 Your Tarot Journey app is ready for launch!");
}

async function monitorAndGenerate(): Promise<void> {
  console.log("🔄 Starting OpenAI image service monitoring...");
  
  while (true) {
    const isAvailable = await checkServiceAvailability();
    
    if (isAvailable) {
      console.log("🎯 Service is stable! Starting card generation...");
      await generateAllCards();
      break;
    } else {
      console.log("⏰ Checking again in 30 minutes...");
      await new Promise(resolve => setTimeout(resolve, 30 * 60 * 1000)); // 30 minutes
    }
  }
}

monitorAndGenerate();