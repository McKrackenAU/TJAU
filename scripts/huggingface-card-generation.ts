/**
 * Hugging Face Card Generation - Fast and Free
 * Generate authentic tarot cards using Stable Diffusion XL
 */
import fs from "fs";
import https from "https";

const HF_API_TOKEN = process.env.HUGGINGFACE_API_TOKEN;
const MODEL_URL = "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0";

const majorArcanaCards = [
  { id: "00", name: "The Fool", prompt: "Traditional tarot card artwork: The Fool, young person in colorful medieval robes stepping toward cliff edge, loyal white dog at feet, white rose in hand, snow-capped mountains background, bright golden sun above, ornate decorative tarot border, mystical Renaissance art style, rich vibrant colors" },
  { id: "01", name: "The Magician", prompt: "Traditional tarot card artwork: The Magician, robed figure with wand raised high toward heaven, infinity symbol floating above head, altar table with ceremonial tools (cup, sword, wand, pentacle), red and white robes, roses and lilies, ornate tarot border, mystical symbolism" },
  { id: "02", name: "The High Priestess", prompt: "Traditional tarot card artwork: The High Priestess, wise woman in flowing blue robes seated between two pillars (one black, one white), silver crescent moon crown, ancient scroll in lap, pomegranates and palm trees, veil with crosses and pomegranates, mystical atmosphere" },
  { id: "03", name: "The Empress", prompt: "Traditional tarot card artwork: The Empress, regal woman in flowing gown with wheat and pomegranate patterns, golden crown with twelve stars, Venus symbol on heart-shaped shield, lush fertile garden with waterfall, throne among cypress trees, abundance and nature" },
  { id: "04", name: "The Emperor", prompt: "Traditional tarot card artwork: The Emperor, powerful bearded man on stone throne decorated with ram heads, red robes and armor, ankh scepter, barren rocky mountains behind, symbol of authority and structure, commanding presence" },
  { id: "05", name: "The Hierophant", prompt: "Traditional tarot card artwork: The Hierophant, religious figure with triple papal crown, raised hand in blessing gesture, seated between two stone pillars, two kneeling acolytes before him, crossed keys at feet, sacred religious symbolism" },
  { id: "06", name: "The Lovers", prompt: "Traditional tarot card artwork: The Lovers, naked man and woman in Garden of Eden, angel Raphael with purple wings above blessing them, tree of knowledge with serpent, tree of life with flames, mountain in background, divine love and choice" },
  { id: "07", name: "The Chariot", prompt: "Traditional tarot card artwork: The Chariot, armored warrior in ornate chariot pulled by two sphinxes (one black, one white), starry canopy above, city walls behind, symbol of willpower and determination, triumphant victory" },
  { id: "08", name: "Strength", prompt: "Traditional tarot card artwork: Strength, gentle woman in white robes closing lion's mouth with bare hands, infinity symbol floating above her head, flowers in hair, peaceful mountain landscape, inner strength over brute force" },
  { id: "09", name: "The Hermit", prompt: "Traditional tarot card artwork: The Hermit, elderly wise man in grey hooded robes holding lantern with six-pointed star light, wooden staff, standing on mountain peak, seeking inner wisdom and enlightenment, solitary spiritual journey" },
  { id: "10", name: "Wheel of Fortune", prompt: "Traditional tarot card artwork: Wheel of Fortune, large golden wheel with mystical symbols and TARO letters, sphinx with sword on top, snake descending on left, Anubis ascending on right, four corner symbols, destiny and cycles" },
  { id: "11", name: "Justice", prompt: "Traditional tarot card artwork: Justice, figure in red robes holding balanced scales in left hand and upright sword in right hand, crown, seated on throne with purple cloth behind, pillar on each side, divine justice and balance" },
  { id: "12", name: "The Hanged Man", prompt: "Traditional tarot card artwork: The Hanged Man, figure suspended upside down by right foot from living tree with green leaves, golden halo around head, arms folded behind back, sacrifice and new perspective, spiritual surrender" },
  { id: "13", name: "Death", prompt: "Traditional tarot card artwork: Death, skeleton knight in black armor riding white horse, black banner with white rose, bishop and child in foreground, sunset behind, transformation and renewal, not literal death but rebirth" },
  { id: "14", name: "Temperance", prompt: "Traditional tarot card artwork: Temperance, angel with large red wings pouring water between two golden cups, one foot on land one in water, triangle symbol on chest, iris flowers, mountain path, balance and moderation" },
  { id: "15", name: "The Devil", prompt: "Traditional tarot card artwork: The Devil, horned Baphomet figure sitting on black cube throne, inverted pentagram on forehead, naked chained man and woman below, chains are loose showing bondage is chosen, materialism and temptation" },
  { id: "16", name: "The Tower", prompt: "Traditional tarot card artwork: The Tower, tall stone tower struck by lightning bolt, golden crown falling from top, two figures falling headfirst, 22 drops of light, dark stormy sky, sudden revelation and destruction of illusion" },
  { id: "17", name: "The Star", prompt: "Traditional tarot card artwork: The Star, naked woman kneeling by water under starlit sky, pouring water from two pitchers (one onto land, one into pool), large bright eight-pointed star above with seven smaller stars, hope and inspiration" },
  { id: "18", name: "The Moon", prompt: "Traditional tarot card artwork: The Moon, full moon with serene face dripping golden dew, two towers in distance, dog and wolf howling at moon, crayfish emerging from water onto path, illusion and intuition, mysterious night scene" },
  { id: "19", name: "The Sun", prompt: "Traditional tarot card artwork: The Sun, large smiling sun with golden rays, naked child with red feather riding white horse, red banner in hand, sunflowers behind brick wall, joy and vitality, pure happiness and success" },
  { id: "20", name: "Judgement", prompt: "Traditional tarot card artwork: Judgement, angel Gabriel with trumpet and white cross banner descending from clouds, graves opening below, people rising with arms raised in prayer and wonder, spiritual awakening and rebirth" },
  { id: "21", name: "The World", prompt: "Traditional tarot card artwork: The World, naked dancing figure wrapped in purple sash in center of oval wreath, four corner symbols (angel, eagle, lion, bull), completion of journey, cosmic consciousness and fulfillment" }
];

function ensureDirectory(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

async function generateImageWithHuggingFace(prompt: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({ inputs: prompt });
    
    const options = {
      hostname: 'api-inference.huggingface.co',
      path: '/models/stabilityai/stable-diffusion-xl-base-1.0',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${HF_API_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': data.length
      }
    };

    const req = https.request(options, (res) => {
      const chunks: Buffer[] = [];
      
      res.on('data', (chunk) => {
        chunks.push(chunk);
      });
      
      res.on('end', () => {
        const buffer = Buffer.concat(chunks);
        
        if (res.statusCode === 200) {
          resolve(buffer);
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${buffer.toString()}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(data);
    req.end();
  });
}

async function generateCard(card: any): Promise<boolean> {
  try {
    console.log(`🎨 Generating ${card.name} with Stable Diffusion XL...`);
    
    const imageBuffer = await generateImageWithHuggingFace(card.prompt);
    
    const filename = `public/authentic-cards/major-arcana/${card.id}-${card.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}.png`;
    fs.writeFileSync(filename, imageBuffer);
    
    console.log(`✅ ${card.name} saved successfully!`);
    return true;
    
  } catch (error: any) {
    console.error(`❌ Failed to generate ${card.name}:`, error.message);
    return false;
  }
}

async function generateAllCards(): Promise<void> {
  console.log("🚀 Starting Hugging Face generation for all Major Arcana cards...");
  console.log("Using Stable Diffusion XL for authentic tarot artwork...");
  
  // Ensure directory exists
  ensureDirectory("public/authentic-cards/major-arcana");
  
  let successCount = 0;
  
  for (const card of majorArcanaCards) {
    const success = await generateCard(card);
    if (success) {
      successCount++;
    }
    
    // Small delay between generations to respect rate limits
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  console.log(`\n🎉 GENERATION COMPLETE! ${successCount}/${majorArcanaCards.length} authentic tarot cards created!`);
  console.log("🚀 Your Tarot Journey app is ready for launch!");
}

generateAllCards();