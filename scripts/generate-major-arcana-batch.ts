/**
 * Generate Major Arcana Card Batch - Beautiful Authentic Artwork
 * 
 * This script generates stunning, meaningful card artwork for Major Arcana cards
 * that truly depicts the essence and symbolism of each card's name.
 */

import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
async function generateCardImage(cardId: string, cardName: string, prompt: string): Promise<boolean> {
  try {
    console.log(`🎨 Creating beautiful artwork for: ${cardName}`);
    
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
      
      console.log(`✅ Successfully created: ${cardName}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`Error creating ${cardName}:`, error);
    return false;
  }
}

async function generateMajorArcanaBatch() {
  // Major Arcana cards with authentic symbolic descriptions
  const majorArcanaCards = [
    {
      id: '0',
      name: 'The Fool',
      prompt: 'A young person stepping off a cliff edge with a small bag and walking stick, white dog companion, bright yellow sky with sun, snow-capped mountains in distance, symbolizing new beginnings and adventure, beautiful traditional tarot card art style'
    },
    {
      id: '1', 
      name: 'The Magician',
      prompt: 'A robed figure with one hand pointing up to heaven and one down to earth, wand raised high, infinity symbol above head, roses and lilies on table, red robe, symbolizing manifestation and divine will, traditional tarot art style'
    },
    {
      id: '2',
      name: 'The High Priestess', 
      prompt: 'A seated woman between two pillars marked B and J, crescent moon crown, blue robes flowing, pomegranate curtain behind, scroll of divine law, symbolizing intuition and sacred knowledge, mystical tarot art style'
    },
    {
      id: '3',
      name: 'The Empress',
      prompt: 'A pregnant woman on throne in lush nature setting, golden wheat field, flowing river, venus symbol on heart-shaped shield, crown of twelve stars, symbolizing fertility and motherhood, beautiful tarot art style'
    },
    {
      id: '4',
      name: 'The Emperor',
      prompt: 'A bearded king on stone throne with ram heads carved, red robes, golden crown and scepter, barren mountains behind, symbolizing authority and paternal power, majestic tarot art style'
    }
  ];
  
  console.log('🎨 Starting Major Arcana artwork generation...\n');
  
  let successCount = 0;
  
  for (const card of majorArcanaCards) {
    const imagePath = path.join(process.cwd(), 'public', 'assets', 'cards', `${card.id}.png`);
    
    if (!fs.existsSync(imagePath)) {
      const success = await generateCardImage(card.id, card.name, card.prompt);
      if (success) {
        successCount++;
      }
      
      // Wait between generations to respect rate limits
      console.log('⏳ Waiting 10 seconds before next generation...\n');
      await new Promise(resolve => setTimeout(resolve, 10000));
    } else {
      console.log(`✓ ${card.name} already exists with beautiful artwork`);
    }
  }
  
  console.log(`\n🎉 Generated ${successCount} beautiful Major Arcana card artworks!`);
  console.log('Each card features authentic symbolism that depicts the true meaning of its name.');
}

generateMajorArcanaBatch();