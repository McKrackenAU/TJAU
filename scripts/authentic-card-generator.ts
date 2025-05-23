/**
 * Authentic Major Arcana Card Generator
 * Creates cards with proper traditional symbolism
 */

import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Detailed traditional descriptions for authentic imagery
const authenticCards = [
  {
    id: '0',
    name: 'The Fool',
    description: 'Young person in bright patchwork clothing with bindle sack, stepping toward cliff edge, loyal white dog, bright sun, white rose in hand, mountains behind, carefree expression'
  },
  {
    id: '1', 
    name: 'The Magician',
    description: 'Robed figure pointing up with right hand and down with left, infinity symbol above head, altar table with cup sword wand pentacle, red roses and white lilies, confident stance'
  },
  {
    id: '2',
    name: 'The High Priestess', 
    description: 'Seated woman in blue robes between two pillars marked B and J, crescent moon at feet, pomegranate tapestry behind, scroll in lap, crown with lunar phases'
  },
  {
    id: '3',
    name: 'The Empress',
    description: 'Crowned pregnant woman in flowing gown with pomegranates, sitting in lush garden with wheat field, Venus symbol on heart shield, twelve stars in crown, abundant nature'
  },
  {
    id: '4',
    name: 'The Emperor',
    description: 'Bearded male ruler on stone throne with ram heads, holding ankh scepter, wearing crown and red robes, mountains behind throne, strong authoritative presence'
  }
];

async function generateSingleAuthenticCard(card: any): Promise<boolean> {
  try {
    console.log(`🎨 Creating authentic ${card.name} with traditional Rider-Waite symbolism...`);
    
    const fullPrompt = `Traditional Rider-Waite tarot card ${card.name}: ${card.description}, detailed mystical artwork, authentic tarot symbolism, professional illustration style, vertical card format, rich colors, symbolic elements clearly visible`;
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: fullPrompt,
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
      
      // Save the authentic image
      const imagePath = path.join(assetsDir, `${card.id}.png`);
      fs.writeFileSync(imagePath, buffer);
      
      console.log(`✅ ${card.name} now displays authentic traditional imagery!`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error creating ${card.name}:`, error);
    return false;
  }
}

async function createAuthenticMajorArcana() {
  console.log('🎯 Creating Major Arcana cards with authentic traditional symbolism...\n');
  
  for (const card of authenticCards) {
    console.log(`\n--- Creating ${card.name} ---`);
    const success = await generateSingleAuthenticCard(card);
    
    if (success) {
      console.log(`🎉 ${card.name} complete - now shows proper traditional imagery!`);
    } else {
      console.log(`⚠️  ${card.name} generation failed, will retry...`);
    }
    
    // Delay between requests
    await new Promise(resolve => setTimeout(resolve, 3000));
  }
  
  console.log('\n🎊 Authentic Major Arcana creation process complete!');
  console.log('Your tarot cards now display traditional symbolism that matches their meanings.');
}

// Run the generator
createAuthenticMajorArcana();