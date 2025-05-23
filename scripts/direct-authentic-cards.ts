/**
 * Direct Generation of Authentic Major Arcana Cards
 */

import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateDirectCard(cardNumber: number, cardName: string, prompt: string): Promise<void> {
  try {
    console.log(`🎯 Creating authentic ${cardName} that matches its true meaning...`);
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: `${prompt}, traditional tarot card style, detailed artwork, authentic symbolism, professional illustration`,
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
      
      // Backup old image
      const oldPath = path.join(assetsDir, `${cardNumber}.png`);
      const backupPath = path.join(assetsDir, `${cardNumber}_old.png`);
      if (fs.existsSync(oldPath)) {
        fs.copyFileSync(oldPath, backupPath);
      }
      
      // Save new authentic image
      fs.writeFileSync(oldPath, buffer);
      
      console.log(`✅ ${cardName} now shows authentic imagery that matches its meaning!`);
    }
    
  } catch (error) {
    console.error(`Error creating authentic ${cardName}:`, error);
  }
}

async function createAuthenticCards() {
  console.log('🎯 Creating Major Arcana cards with imagery that matches their true meanings...\n');
  
  // Start with The Fool - most important card
  await generateDirectCard(
    0, 
    'The Fool', 
    'Young person with colorful clothing stepping toward a cliff edge, small white dog at their feet, white rose in hand, bright sun above, carefree expression of new beginnings and infinite potential'
  );
  
  console.log('\n🎉 The Fool now displays authentic imagery!');
  console.log('Your tarot app will show the proper card meaning and symbolism.');
}

createAuthenticCards();