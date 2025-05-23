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
    console.log(`Generating: ${cardName}`);
    
    // Create detailed prompts for Major Arcana cards
    const cardPrompts = {
      'The Fool': 'A young person stepping off a cliff with a small bag, white dog, bright yellow sky, mountains, symbolizing new beginnings, tarot card art style',
      'The Magician': 'A robed figure with wand raised high, infinity symbol above head, roses and lilies, red robe, symbolizing manifestation, tarot card art style',
      'The High Priestess': 'A seated woman between pillars marked B and J, crescent moon crown, blue robes, pomegranate curtain, symbolizing intuition, tarot card art style',
      'The Empress': 'A pregnant woman on throne in nature, wheat field, flowing river, venus symbol, crown of stars, symbolizing fertility, tarot card art style',
      'The Emperor': 'A bearded king on stone throne, ram heads, red robes, golden crown, mountains, symbolizing authority, tarot card art style'
    };
    
    const prompt = cardPrompts[cardName as keyof typeof cardPrompts] || 
      `Beautiful tarot card artwork depicting ${cardName}, rich symbolic imagery, mystical, traditional tarot art style`;
    
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
      const arrayBuffer = await imageResponse.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      const assetsDir = path.join(process.cwd(), 'public', 'assets', 'cards');
      if (!fs.existsSync(assetsDir)) {
        fs.mkdirSync(assetsDir, { recursive: true });
      }
      
      const filename = path.join(assetsDir, `${cardId}.png`);
      fs.writeFileSync(filename, buffer);
      
      console.log(`✓ Generated: ${cardName}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error generating ${cardName}:`, error);
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
    { id: '4', name: 'The Emperor' }
  ];
  
  console.log('Generating essential Major Arcana cards...');
  
  for (const card of essentialCards) {
    const imagePath = path.join(process.cwd(), 'public', 'assets', 'cards', `${card.id}.png`);
    
    if (!fs.existsSync(imagePath)) {
      const success = await generateCardImage(card.id, card.name);
      if (success) {
        console.log(`Successfully created ${card.name}`);
      }
      
      // Wait between generations to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 5000));
    } else {
      console.log(`${card.name} already exists`);
    }
  }
  
  console.log('✅ Essential cards generation complete!');
}

generateEssentialCards();