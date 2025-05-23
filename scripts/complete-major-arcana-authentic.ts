/**
 * Complete All 22 Major Arcana Cards with Authentic Artwork
 * Generate remaining cards 5-21 with traditional symbolism
 */

import OpenAI from "openai";
import fs from "fs";
import path from "path";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Remaining Major Arcana cards that need authentic artwork
const remainingMajorArcana = [
  { number: 5, name: 'The Hierophant', prompt: 'A religious figure in papal robes seated between two pillars, blessing two monks before him, with crossed keys at his feet and a triple crown, representing spiritual wisdom and religious tradition. Gothic cathedral setting with stained glass.' },
  { number: 6, name: 'The Lovers', prompt: 'A man and woman standing beneath an angel blessing them from above, with the Tree of Knowledge behind the woman and the Tree of Life behind the man, representing choice and divine love. Paradise garden setting.' },
  { number: 7, name: 'The Chariot', prompt: 'A warrior in armor standing in a chariot pulled by two sphinxes (one black, one white), with a canopy of stars above and a city in the background, representing willpower and determination. Triumphal and majestic.' },
  { number: 8, name: 'Strength', prompt: 'A woman gently closing the mouth of a lion with her bare hands, wearing a white robe with an infinity symbol above her head, representing inner strength and courage. Peaceful mountain landscape.' },
  { number: 9, name: 'The Hermit', prompt: 'An old bearded man in robes holding a lantern containing a six-pointed star, walking with a staff up a snowy mountain path, representing introspection and seeking inner guidance. Moonlit mountain scene.' },
  { number: 10, name: 'Wheel of Fortune', prompt: 'A large wheel with mystical symbols and letters, with a sphinx at the top holding a sword, a snake descending on the left, and Anubis rising on the right, representing cycles and destiny. Cloudy sky background.' },
  { number: 11, name: 'Justice', prompt: 'A crowned figure seated between two pillars, holding scales in one hand and a double-edged sword in the other, wearing robes and representing balance and fairness. Formal throne room setting.' },
  { number: 12, name: 'The Hanged Man', prompt: 'A man hanging upside down from a tree by his ankle, with a halo around his head, arms behind his back forming a triangle, representing sacrifice and new perspective. Peaceful tree setting.' },
  { number: 13, name: 'Death', prompt: 'A skeletal figure in black armor riding a white horse, carrying a black flag with a white rose, while a king lies fallen and others pray, representing transformation and rebirth. Dawn breaking over landscape.' },
  { number: 14, name: 'Temperance', prompt: 'An angel with wings standing with one foot on land and one in water, pouring liquid between two cups, with a radiant triangle on their forehead, representing balance and moderation. Serene riverside setting.' },
  { number: 15, name: 'The Devil', prompt: 'A horned goat-headed figure sitting on a throne with two chained humans below, but the chains are loose, representing bondage and materialism that can be overcome. Dark cavern setting.' },
  { number: 16, name: 'The Tower', prompt: 'A tall tower being struck by lightning with a crown falling from its top, two figures falling from the windows, representing sudden change and revelation. Stormy dramatic sky.' },
  { number: 17, name: 'The Star', prompt: 'A naked woman kneeling by a pool, pouring water from two jugs (one onto land, one into water), with seven small stars and one large star shining above, representing hope and inspiration. Peaceful night scene.' },
  { number: 18, name: 'The Moon', prompt: 'A full moon with a face, two towers in the distance, a dog and wolf howling, and a crayfish emerging from water, with a winding path between them, representing illusion and the subconscious. Mystical nighttime landscape.' },
  { number: 19, name: 'The Sun', prompt: 'A radiant sun with a face shining over a naked child riding a white horse, with sunflowers in the background and a brick wall, representing joy and success. Bright cheerful daytime scene.' },
  { number: 20, name: 'Judgement', prompt: 'An angel blowing a trumpet from the clouds above, with people rising from graves below with arms outstretched in prayer, representing rebirth and spiritual awakening. Divine celestial scene.' },
  { number: 21, name: 'The World', prompt: 'A dancing figure within an oval wreath, surrounded by the four symbols of the evangelists (angel, eagle, lion, bull) in the corners, representing completion and cosmic consciousness. Celestial mandala setting.' }
];

async function generateAuthenticCard(cardNumber: number, cardName: string, prompt: string): Promise<boolean> {
  try {
    console.log(`🎨 Creating authentic ${cardName} (${cardNumber})...`);
    
    const response = await openai.images.generate({
      model: "dall-e-3", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      prompt: `Create a beautiful, authentic tarot card: ${prompt} The artwork should be mystical, detailed, and capture the traditional Rider-Waite symbolism with rich colors and spiritual depth. High quality digital art.`,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    if (response.data?.[0]?.url) {
      // Download and save the authentic image
      const imageResponse = await fetch(response.data[0].url);
      const buffer = await imageResponse.arrayBuffer();
      
      const imagePath = path.join(process.cwd(), 'public', 'assets', 'cards', `${cardNumber}.png`);
      fs.writeFileSync(imagePath, Buffer.from(buffer));
      
      console.log(`✅ ${cardName} created successfully!`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error creating ${cardName}:`, error);
    return false;
  }
}

async function completeAuthenticMajorArcana() {
  console.log('🌟 Generating authentic Major Arcana artwork...\n');
  
  let successCount = 0;
  
  for (const card of remainingMajorArcana) {
    const success = await generateAuthenticCard(card.number, card.name, card.prompt);
    if (success) successCount++;
    
    // Rate limiting - wait between generations
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  console.log(`\n🎨 Major Arcana generation complete!`);
  console.log(`✨ Successfully created ${successCount}/${remainingMajorArcana.length} authentic cards`);
  console.log(`🔮 Your tarot collection now has complete traditional artwork!`);
}

// Run the generation
completeAuthenticMajorArcana().catch(console.error);