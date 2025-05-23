/**
 * Complete Remaining Authentic Card Collection
 * Generate beautiful, meaningful artwork for all missing cards
 */

import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// All cards that need authentic artwork
const remainingCards = [
  // Wands suit - passionate, creative energy
  { id: 'w1', name: 'Ace of Wands', prompt: 'A single magical wand or staff emerging from clouds, surrounded by sprouting leaves and flames, representing new creative beginnings and passionate inspiration. Medieval mystical art style with warm golden and red tones.' },
  { id: 'w2', name: 'Two of Wands', prompt: 'A figure holding a globe while looking over distant lands from a castle wall, with one wand planted and another in hand, representing planning and future possibilities. Rich tapestry style with deep blues and golds.' },
  { id: 'w3', name: 'Three of Wands', prompt: 'A cloaked figure standing on a cliff overlooking the sea, watching ships in the distance, with three wands planted in the ground, representing foresight and expansion. Romantic landscape style with sunset colors.' },
  { id: 'w4', name: 'Four of Wands', prompt: 'Four wands forming a canopy decorated with flowers and fruits, with figures celebrating beneath, representing harmony and celebration. Festive and joyful with bright warm colors.' },
  { id: 'w5', name: 'Five of Wands', prompt: 'Five young figures playfully sparring with wands in a friendly competition, representing healthy conflict and growth through challenge. Dynamic composition with earthy tones.' },
  
  // Cups suit - emotional, intuitive energy  
  { id: 'c1', name: 'Ace of Cups', prompt: 'A divine hand emerging from clouds holding a golden chalice overflowing with sparkling water, with a dove descending and lotus petals falling, representing pure love and spiritual fulfillment. Ethereal style with silver and blue tones.' },
  { id: 'c2', name: 'Two of Cups', prompt: 'A man and woman facing each other, toasting with golden cups under a winged lion head and caduceus symbol, representing partnership and emotional connection. Renaissance style with warm lighting.' },
  { id: 'c3', name: 'Three of Cups', prompt: 'Three joyful figures raising cups in celebration under a clear sky, representing friendship and community. Festive garden setting with abundant flowers and fruits.' },
  { id: 'c4', name: 'Four of Cups', prompt: 'A contemplative figure sitting under a tree, arms crossed, with three cups before them and a fourth being offered by a hand from a cloud, representing meditation and contemplation. Peaceful woodland setting.' },
  { id: 'c5', name: 'Five of Cups', prompt: 'A cloaked figure in black standing before three spilled cups, with two upright cups behind them and a bridge in the distance, representing grief but also hope. Melancholic but hopeful atmosphere.' },
  
  // Swords suit - mental, intellectual energy
  { id: 's1', name: 'Ace of Swords', prompt: 'A divine hand emerging from clouds gripping a upright sword with a crown piercing the tip, surrounded by olive and palm branches, representing mental clarity and truth. Crisp, clear composition with silver and white tones.' },
  { id: 's2', name: 'Two of Swords', prompt: 'A blindfolded figure in white sitting cross-armed with two crossed swords, crescent moon in the background over calm waters, representing difficult decisions and balance. Serene nighttime setting.' },
  { id: 's3', name: 'Three of Swords', prompt: 'A red heart pierced by three swords under stormy clouds and rain, representing heartbreak and sorrow. Dramatic stormy sky with emotional intensity.' },
  { id: 's4', name: 'Four of Swords', prompt: 'A figure lying in peaceful repose on a tomb with hands in prayer, three swords hanging on the wall and one carved in stone beneath, representing rest and meditation. Gothic church interior.' },
  { id: 's5', name: 'Five of Swords', prompt: 'A figure gathering swords while two others walk away defeated, stormy sky overhead, representing conflict and hollow victory. Windswept battlefield with dramatic lighting.' },
  
  // Pentacles suit - material, earthly energy
  { id: 'p1', name: 'Ace of Pentacles', prompt: 'A divine hand emerging from clouds holding a golden pentacle above a lush garden path leading to mountains, representing material opportunity and earthly abundance. Rich garden setting with golden light.' },
  { id: 'p2', name: 'Two of Pentacles', prompt: 'A dancing figure juggling two pentacles connected by an infinity symbol, with ships on turbulent seas in the background, representing balance and adaptability. Dynamic coastal scene.' },
  { id: 'p3', name: 'Three of Pentacles', prompt: 'A skilled craftsman working on a cathedral while a monk and nobleman observe, with three pentacles carved in the stone arch above, representing collaboration and skill. Gothic cathedral setting.' },
  { id: 'p4', name: 'Four of Pentacles', prompt: 'A figure seated on a throne in a city, tightly holding one pentacle, with one under each foot and one balanced on their head, representing security but also possessiveness. Urban throne room setting.' },
  { id: 'p5', name: 'Five of Pentacles', prompt: 'Two figures in tattered clothes walking past an illuminated church window showing five pentacles, representing material hardship but spiritual hope. Snowy winter night scene.' }
];

async function generateCardImage(cardData: { id: string, name: string, prompt: string }): Promise<boolean> {
  try {
    console.log(`\n🎨 Generating authentic artwork for ${cardData.name}...`);
    
    const response = await openai.images.generate({
      model: "dall-e-3", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      prompt: `Create a beautiful, authentic tarot card: ${cardData.prompt} The artwork should be mystical, detailed, and capture the traditional symbolism. High quality digital art with rich colors and symbolic depth.`,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    if (response.data[0]?.url) {
      // Download and save the image
      const imageResponse = await fetch(response.data[0].url);
      const buffer = await imageResponse.arrayBuffer();
      
      const imagePath = path.join(process.cwd(), 'public', 'assets', 'cards', `${cardData.id}.png`);
      fs.writeFileSync(imagePath, Buffer.from(buffer));
      
      console.log(`✅ Successfully generated ${cardData.name} -> ${cardData.id}.png`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error generating ${cardData.name}:`, error);
    return false;
  }
}

async function completeRemainingCards() {
  console.log('🌟 Starting generation of remaining authentic tarot card artwork...\n');
  
  let successCount = 0;
  
  for (const card of remainingCards) {
    const success = await generateCardImage(card);
    if (success) successCount++;
    
    // Rate limiting pause
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log(`\n🎨 Card generation complete!`);
  console.log(`✨ Successfully generated ${successCount}/${remainingCards.length} authentic card images`);
  console.log(`🔮 Your tarot collection now has beautiful, meaningful artwork!`);
}

// Run the generation
completeRemainingCards().catch(console.error);