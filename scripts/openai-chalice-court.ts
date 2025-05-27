/**
 * Create Court Cards with Clear Chalices using OpenAI
 */

import OpenAI from "openai";
import fs from 'fs';
import path from 'path';

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateChaliceCard(cardName: string, filename: string, prompt: string): Promise<void> {
  console.log(`🏆 Creating ${cardName} with OpenAI...`);
  
  try {
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    const imageUrl = response.data[0].url;
    if (!imageUrl) {
      console.error(`❌ No image URL returned for ${cardName}`);
      return;
    }

    // Download the image
    const imageResponse = await fetch(imageUrl);
    const buffer = await imageResponse.arrayBuffer();
    
    const dir = path.join(process.cwd(), 'public', 'authentic-cards', 'minor-arcana', 'cups');
    const outputPath = path.join(dir, filename);
    fs.writeFileSync(outputPath, Buffer.from(buffer));
    
    console.log(`✨ ${cardName} created with clear chalice! Size: ${buffer.byteLength} bytes`);
    
  } catch (error) {
    console.error(`❌ Error creating ${cardName}:`, error);
  }
}

async function createAllChaliceCards() {
  console.log('🏆 Creating all Court Cards with clear chalices using OpenAI...');
  
  const cards = [
    {
      name: 'Page of Cups',
      filename: 'page-of-cups.png',
      prompt: 'Tarot card art: Young male page holding a large ornate golden chalice prominently in both hands. The chalice is the main focus - clearly visible, detailed, and central to the composition. Ethereal purple and pink magical lighting. Ultra-realistic fantasy art style. The cup/chalice must be obvious and prominent.'
    },
    {
      name: 'Knight of Cups',
      filename: 'knight-of-cups.png',
      prompt: 'Tarot card art: Male knight on white horse, raising a large ornate golden chalice high above his head. The chalice is the main focus - clearly visible, detailed, and central to the composition. Ethereal purple and pink magical lighting. Ultra-realistic fantasy art style. The cup/chalice must be obvious and prominent.'
    },
    {
      name: 'Queen of Cups',
      filename: 'queen-of-cups.png',
      prompt: 'Tarot card art: Female queen sitting on throne, holding a large ornate golden chalice in her lap with both hands. The chalice is the main focus - clearly visible, detailed, and central to the composition. Ethereal purple and pink magical lighting. Ultra-realistic fantasy art style. The cup/chalice must be obvious and prominent.'
    },
    {
      name: 'King of Cups',
      filename: 'king-of-cups.png',
      prompt: 'Tarot card art: Male king with beard sitting on throne, holding a large ornate golden chalice at chest level with both hands. The chalice is the main focus - clearly visible, detailed, and central to the composition. Ethereal purple and pink magical lighting. Ultra-realistic fantasy art style. The cup/chalice must be obvious and prominent.'
    }
  ];

  for (const card of cards) {
    await generateChaliceCard(card.name, card.filename, card.prompt);
    // Wait between requests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('✅ All Court Cards completed with clear chalices!');
}

createAllChaliceCards();