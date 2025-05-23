/**
 * Create Authentic Major Arcana Cards with Traditional Symbolism
 */

import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Traditional Major Arcana card descriptions with authentic symbolism
const majorArcanaCards = [
  {
    id: '0',
    name: 'The Fool',
    prompt: 'Traditional Rider-Waite tarot card The Fool: young person in colorful patchwork clothing with bindle over shoulder, stepping confidently toward cliff edge with white dog at feet, bright yellow sun above, white rose in hand, mountains in background, carefree expression of new beginnings, vertical tarot card format'
  },
  {
    id: '1', 
    name: 'The Magician',
    prompt: 'Traditional Rider-Waite tarot card The Magician: figure in red robe with white tunic, pointing upward with right hand and downward with left, infinity symbol above head, red roses and white lilies below, table with cup sword wand pentacle, "as above so below" symbolism, vertical tarot card format'
  },
  {
    id: '2',
    name: 'The High Priestess', 
    prompt: 'Traditional Rider-Waite tarot card The High Priestess: seated woman in blue robes between two pillars marked B and J, crescent moon at feet, pomegranate tapestry behind, scroll of Torah in lap, crown with lunar phases, mystical wisdom symbolism, vertical tarot card format'
  },
  {
    id: '3',
    name: 'The Empress',
    prompt: 'Traditional Rider-Waite tarot card The Empress: crowned woman in flowing gown with pomegranate pattern, sitting in lush garden with wheat field, Venus symbol on heart-shaped shield, twelve stars in crown, pregnancy symbolizing fertility and abundance, vertical tarot card format'
  },
  {
    id: '4',
    name: 'The Emperor',
    prompt: 'Traditional Rider-Waite tarot card The Emperor: bearded ruler on stone throne with ram heads, holding ankh scepter, wearing crown and red robes, mountains behind throne, Aries symbol, authority and leadership symbolism, vertical tarot card format'
  }
];

async function generateAuthenticCard(cardData: { id: string, name: string, prompt: string }): Promise<boolean> {
  try {
    console.log(`🎨 Creating authentic ${cardData.name} with traditional symbolism...`);
    
    const response = await openai.images.generate({
      model: "dall-e-3", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      prompt: `${cardData.prompt}, detailed traditional tarot artwork, authentic Rider-Waite style, mystical symbolism, professional illustration`,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    if (response.data?.[0]?.url) {
      const imageUrl = response.data[0].url;
      const imageResponse = await fetch(imageUrl);
      const buffer = Buffer.from(await imageResponse.arrayBuffer());
      
      const assetsDir = path.join(process.cwd(), 'public', 'assets', 'cards');
      fs.mkdirSync(assetsDir, { recursive: true });
      
      // Save with both numbered filename and descriptive name
      fs.writeFileSync(path.join(assetsDir, `${cardData.id}.png`), buffer);
      fs.writeFileSync(path.join(assetsDir, `${cardData.name.toLowerCase().replace(/\s+/g, '-')}.png`), buffer);
      
      console.log(`✅ ${cardData.name} now displays authentic traditional imagery!`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error creating ${cardData.name}:`, error);
    return false;
  }
}

async function createAuthenticMajorArcana() {
  console.log('🎯 Creating Major Arcana cards with authentic traditional symbolism...\n');
  
  let successCount = 0;
  
  for (const card of majorArcanaCards) {
    const success = await generateAuthenticCard(card);
    if (success) successCount++;
    
    // Small delay between requests to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log(`\n🎉 Successfully created ${successCount}/${majorArcanaCards.length} authentic Major Arcana cards!`);
  console.log('Your tarot app now displays traditional symbolism that matches each card\'s meaning.');
}

createAuthenticMajorArcana();