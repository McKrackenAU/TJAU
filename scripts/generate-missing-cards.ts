/**
 * Generate Missing Card Images - Complete Card Collection
 * 
 * This script generates high-quality tarot card images for all missing cards
 * and saves them permanently to the assets directory.
 */

import OpenAI from "openai";
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const ASSETS_DIR = path.join(process.cwd(), 'public', 'assets', 'cards');

// Ensure assets directory exists
if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

// Missing Major Arcana cards (all except The Fool)
const missingMajorArcana = [
  { id: '1', name: 'The Magician', file: 'the-magician.png' },
  { id: '2', name: 'The High Priestess', file: 'the-high-priestess.png' },
  { id: '3', name: 'The Empress', file: 'the-empress.png' },
  { id: '4', name: 'The Emperor', file: 'the-emperor.png' },
  { id: '5', name: 'The Hierophant', file: 'the-hierophant.png' },
  { id: '6', name: 'The Lovers', file: 'the-lovers.png' },
  { id: '7', name: 'The Chariot', file: 'the-chariot.png' },
  { id: '8', name: 'Strength', file: 'strength.png' },
  { id: '9', name: 'The Hermit', file: 'the-hermit.png' },
  { id: '10', name: 'Wheel of Fortune', file: 'wheel-of-fortune.png' },
  { id: '11', name: 'Justice', file: 'justice.png' },
  { id: '12', name: 'The Hanged Man', file: 'the-hanged-man.png' },
  { id: '13', name: 'Death', file: 'death.png' },
  { id: '14', name: 'Temperance', file: 'temperance.png' },
  { id: '15', name: 'The Devil', file: 'the-devil.png' },
  { id: '16', name: 'The Tower', file: 'the-tower.png' },
  { id: '17', name: 'The Star', file: 'the-star.png' },
  { id: '18', name: 'The Moon', file: 'the-moon.png' },
  { id: '19', name: 'The Sun', file: 'the-sun.png' },
  { id: '20', name: 'Judgement', file: 'judgement.png' },
  { id: '21', name: 'The World', file: 'the-world.png' }
];

// Missing Custom Oracle cards (based on log showing 15 missing)
const missingCustomCards = [
  { name: 'Chakra Activation', file: 'chakra-activation.png' },
  { name: 'Crystals and Gemstones', file: 'crystals-gemstones.png' },
  { name: 'Elemental Fire', file: 'elemental-fire.png' },
  { name: 'Sacred Sound', file: 'sacred-sound.png' },
  { name: 'Past Life Healing', file: 'past-life-healing.png' },
  { name: 'Energy Clearing', file: 'energy-clearing.png' },
  { name: 'Manifestation Power', file: 'manifestation-power.png' },
  { name: 'Spiritual Awakening', file: 'spiritual-awakening.png' },
  { name: 'Intuitive Gifts', file: 'intuitive-gifts.png' },
  { name: 'Shadow Work', file: 'shadow-work.png' },
  { name: 'Higher Purpose', file: 'higher-purpose.png' },
  { name: 'Galactic Wisdom', file: 'galactic-wisdom.png' },
  { name: 'Earth Connection', file: 'earth-connection.png' },
  { name: 'Angel Communication', file: 'angel-communication.png' },
  { name: 'Cosmic Consciousness', file: 'cosmic-consciousness.png' }
];

async function generateCardImage(cardName: string, cardType: 'major' | 'custom'): Promise<string | null> {
  try {
    console.log(`🎨 Generating image for ${cardName}...`);
    
    const stylePrompt = cardType === 'major' 
      ? "classic traditional tarot art style, mystical and symbolic"
      : "ethereal oracle card art style, spiritual and celestial";
    
    const prompt = `Create a beautiful ${stylePrompt} illustration for the tarot card "${cardName}". 
    The image should be:
    - High quality digital art
    - Mystical and spiritual in nature
    - Rich in symbolic meaning
    - Suitable for a tarot or oracle card
    - Portrait orientation
    - Professional tarot card aesthetic
    - Detailed and visually striking
    
    Style: ${stylePrompt}, detailed illustration, mystical symbolism, spiritual art`;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "hd",
    });

    const imageUrl = response.data[0].url;
    if (!imageUrl) {
      throw new Error("No image URL returned");
    }

    console.log(`✓ Generated image for ${cardName}`);
    return imageUrl;
    
  } catch (error) {
    console.error(`✗ Failed to generate image for ${cardName}:`, error);
    return null;
  }
}

async function downloadAndSaveImage(imageUrl: string, filename: string): Promise<boolean> {
  try {
    console.log(`📥 Downloading ${filename}...`);
    
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to download: ${response.statusText}`);
    }
    
    const buffer = await response.arrayBuffer();
    const filepath = path.join(ASSETS_DIR, filename);
    
    fs.writeFileSync(filepath, Buffer.from(buffer));
    console.log(`✓ Saved ${filename}`);
    return true;
    
  } catch (error) {
    console.error(`✗ Failed to save ${filename}:`, error);
    return false;
  }
}

async function generateMissingCards() {
  console.log('🚀 Starting complete card image generation...\n');
  
  let totalGenerated = 0;
  let totalSaved = 0;
  
  // Generate Major Arcana cards
  console.log('📜 Generating Major Arcana cards...');
  for (const card of missingMajorArcana) {
    const imageUrl = await generateCardImage(card.name, 'major');
    if (imageUrl) {
      totalGenerated++;
      const saved = await downloadAndSaveImage(imageUrl, card.file);
      if (saved) totalSaved++;
    }
    
    // Rate limiting - wait 2 seconds between requests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n🔮 Generating Custom Oracle cards...');
  for (const card of missingCustomCards) {
    const imageUrl = await generateCardImage(card.name, 'custom');
    if (imageUrl) {
      totalGenerated++;
      const saved = await downloadAndSaveImage(imageUrl, card.file);
      if (saved) totalSaved++;
    }
    
    // Rate limiting - wait 2 seconds between requests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n🎉 Card generation complete!');
  console.log(`📊 Summary:`);
  console.log(`- Images generated: ${totalGenerated}`);
  console.log(`- Images saved: ${totalSaved}`);
  console.log(`- Total missing cards processed: ${missingMajorArcana.length + missingCustomCards.length}`);
  console.log(`\n💾 All images saved to: ${ASSETS_DIR}`);
  console.log(`\nNext: Update card mappings to include new images`);
}

// Run the generation
generateMissingCards().catch(console.error);