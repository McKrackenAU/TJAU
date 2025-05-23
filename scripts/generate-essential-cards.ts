/**
 * Generate Essential Card Images - Priority Cards First
 * 
 * This script generates beautiful card front images for the most essential cards first
 */

import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
async function generateCardImage(cardId: string, cardName: string): Promise<boolean> {
  try {
    console.log(`🎨 Creating: ${cardName}`);
    
    // Create authentic prompts based on card names
    let prompt = '';
    
    if (cardName.includes('Fool')) {
      prompt = 'Young person stepping off cliff, white dog, colorful clothes, mountains, sun, new beginnings, traditional tarot art';
    } else if (cardName.includes('Magician')) {
      prompt = 'Robed figure with wand raised high, infinity symbol, altar with tools, roses and lilies, manifestation, traditional tarot art';
    } else if (cardName.includes('High Priestess')) {
      prompt = 'Seated woman between pillars, crescent moon crown, blue robes, pomegranate curtain, sacred scroll, intuition, traditional tarot art';
    } else if (cardName.includes('Empress')) {
      prompt = 'Pregnant woman on throne, wheat field, flowing river, venus symbol, crown of stars, fertility, traditional tarot art';
    } else if (cardName.includes('Emperor')) {
      prompt = 'Bearded king on stone throne, ram heads, red robes, golden crown, barren mountains, authority, traditional tarot art';
    } else if (cardName.includes('Ace')) {
      const suit = cardName.toLowerCase().includes('wands') ? 'wands' : 
                  cardName.toLowerCase().includes('cups') ? 'cups' :
                  cardName.toLowerCase().includes('swords') ? 'swords' : 'pentacles';
      prompt = `Single ${suit.slice(0,-1)} emerging from cloud, hand of god, ${suit === 'cups' ? 'dove and host' : ''} ${suit === 'wands' ? 'castle and mountains' : ''} ${suit === 'swords' ? 'crown and olive branch' : ''} ${suit === 'pentacles' ? 'garden path' : ''}, traditional tarot art`;
    } else {
      // Generic beautiful tarot card
      prompt = `Beautiful mystical tarot card depicting "${cardName}" with rich symbolic imagery, traditional tarot art style, meaningful spiritual symbolism`;
    }

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
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
      
      fs.writeFileSync(path.join(assetsDir, `${cardId}.png`), buffer);
      
      console.log(`✅ ${cardName} complete`);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Error: ${cardName}`, error);
    return false;
  }
}

async function generateEssentialCards() {
  // Priority cards to generate first
  const essentialCards = [
    { id: '0', name: 'The Fool' },
    { id: '1', name: 'The Magician' },
    { id: '2', name: 'The High Priestess' },
    { id: '3', name: 'The Empress' },
    { id: '4', name: 'The Emperor' },
    { id: 'ace-of-wands', name: 'Ace of Wands' },
    { id: 'ace-of-cups', name: 'Ace of Cups' },
    { id: 'ace-of-swords', name: 'Ace of Swords' },
    { id: 'ace-of-pentacles', name: 'Ace of Pentacles' }
  ];
  
  console.log('🎨 Generating essential card artwork...\n');
  
  let generated = 0;
  for (const card of essentialCards) {
    const imagePath = path.join(process.cwd(), 'public', 'assets', 'cards', `${card.id}.png`);
    
    if (!fs.existsSync(imagePath)) {
      const success = await generateCardImage(card.id, card.name);
      if (success) generated++;
      
      // Brief pause between generations
      await new Promise(resolve => setTimeout(resolve, 2000));
    } else {
      console.log(`✓ ${card.name} exists`);
    }
  }
  
  console.log(`\n🎉 Generated ${generated} essential cards!`);
}

generateEssentialCards();