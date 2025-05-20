/**
 * Generate Specific Card Images
 * 
 * This script generates images for specified card IDs with rate limiting
 * to prevent API throttling.
 */

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';

// Configuration
const API_BASE_URL = 'http://localhost:5000';
const CACHE_DIR = path.join(process.cwd(), 'public', 'cache', 'images');
const REQUEST_DELAY_MS = 10000; // 10 seconds between requests to avoid rate limiting
const BATCH_SIZE = 3; // Process in small batches
const BATCH_DELAY_MS = 60000; // Wait 60 seconds between batches
const RETRY_COUNT = 3; // Number of retries for failed requests

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

// List of card IDs to generate images for
const cardsToGenerate = [
  // Major Arcana
  { id: 'two', name: 'The High Priestess' },
  { id: 'three', name: 'The Empress' },
  { id: 'four', name: 'The Emperor' },
  { id: 'five', name: 'The Hierophant' },
  { id: 'six', name: 'The Lovers' },
  { id: 'seven', name: 'The Chariot' },
  { id: 'eight', name: 'Strength' },
  { id: 'nine', name: 'The Hermit' },
  { id: 'ten', name: 'Wheel of Fortune' },
  { id: 'eleven', name: 'Justice' },
  { id: 'twelve', name: 'The Hanged Man' },
  { id: 'thirteen', name: 'Death' },
  { id: 'fourteen', name: 'Temperance' },
  { id: 'fifteen', name: 'The Devil' },
  { id: 'sixteen', name: 'The Tower' },
  { id: 'seventeen', name: 'The Star' },
  { id: 'eighteen', name: 'The Moon' },
  { id: 'nineteen', name: 'The Sun' },
  { id: 'twenty', name: 'Judgement' },
  { id: 'twentyone', name: 'The World' },
  
  // Wands
  { id: 'w1', name: 'Ace of Wands' },
  { id: 'w3', name: 'Three of Wands' },
  { id: 'w4', name: 'Four of Wands' },
  { id: 'w5', name: 'Five of Wands' },
  { id: 'w7', name: 'Seven of Wands' },
  { id: 'w9', name: 'Nine of Wands' },
  { id: 'wp', name: 'Page of Wands' },
  { id: 'wn', name: 'Knight of Wands' },
  { id: 'wq', name: 'Queen of Wands' },
  
  // Cups
  { id: 'c1', name: 'Ace of Cups' },
  { id: 'c2', name: 'Two of Cups' },
  { id: 'c3', name: 'Three of Cups' },
  { id: 'c5', name: 'Five of Cups' },
  { id: 'c6', name: 'Six of Cups' },
  { id: 'c7', name: 'Seven of Cups' },
  { id: 'c8', name: 'Eight of Cups' },
  { id: 'c10', name: 'Ten of Cups' },
  { id: 'cp', name: 'Page of Cups' },
  { id: 'cq', name: 'Queen of Cups' },
  { id: 'ck', name: 'King of Cups' },
  
  // Swords
  { id: 's1', name: 'Ace of Swords' },
  { id: 's4', name: 'Four of Swords' },
  { id: 's5', name: 'Five of Swords' },
  { id: 's7', name: 'Seven of Swords' },
  { id: 's8', name: 'Eight of Swords' },
  { id: 'sn', name: 'Knight of Swords' },
  { id: 'sq', name: 'Queen of Swords' },
  { id: 'sk', name: 'King of Swords' },
  
  // Pentacles
  { id: 'p1', name: 'Ace of Pentacles' },
  { id: 'p2', name: 'Two of Pentacles' },
  { id: 'p3', name: 'Three of Pentacles' },
  { id: 'p4', name: 'Four of Pentacles' },
  { id: 'p6', name: 'Six of Pentacles' },
  { id: 'p7', name: 'Seven of Pentacles' },
  { id: 'p8', name: 'Eight of Pentacles' },
  { id: 'p9', name: 'Nine of Pentacles' },
  { id: 'p10', name: 'Ten of Pentacles' },
  { id: 'pn', name: 'Knight of Pentacles' },
  { id: 'pq', name: 'Queen of Pentacles' },
  { id: 'pk', name: 'King of Pentacles' },
  
  // Custom Oracle cards (approximating IDs)
  { id: 'imported_300', name: 'Element of Air' },
  { id: 'imported_301', name: 'Element of Earth' },
  { id: 'imported_302', name: 'Element of Water' },
  { id: 'imported_303', name: 'Divine Guidance' },
  { id: 'imported_304', name: 'Sacred Geometry' },
  { id: 'imported_305', name: 'Elemental Allies' },
  { id: 'imported_328', name: 'Lunar Phases' },
  { id: 'imported_329', name: 'Solar Energies' },
  { id: 'imported_332', name: 'Natures Wisdom' },
  { id: 'imported_333', name: 'Dream Exploration' },
  { id: 'imported_334', name: 'Astral Travel' },
  { id: 'imported_335', name: 'Soul Contracts' },
  { id: 'imported_336', name: 'Akashic Records' },
  { id: 'imported_337', name: 'Spirit Guides' },
  { id: 'imported_338', name: 'Divine Feminine' },
  { id: 'imported_339', name: 'Divine Masculine' },
  { id: 'imported_340', name: 'Universal Love' },
  { id: 'imported_341', name: 'Synchronicity' },
  { id: 'imported_342', name: 'Sacred Rituals' },
  { id: 'imported_343', name: 'Inner Alchemy' },
  { id: 'imported_344', name: 'Soulmates and Twin Flames' },
  { id: 'imported_345', name: 'Ascended Masters' },
  { id: 'imported_346', name: 'Divine Timing' },
  { id: 'imported_347', name: 'Inner Healing' },
  { id: 'imported_348', name: 'Ancestral Wisdom' },
  { id: 'imported_349', name: 'Soulful Expression' },
  { id: 'imported_350', name: 'Divine Protection' },
  { id: 'imported_351', name: 'Gratitude and Abundance' },
  { id: 'imported_352', name: 'Inner Child Healing' },
  { id: 'imported_353', name: 'Soulful Relationships' },
  { id: 'imported_354', name: 'Meditation and Mindfulness' },
  { id: 'imported_355', name: 'Cosmic Balance' },
  { id: 'imported_356', name: 'Infinite Possibilities' }
];

// Function to check if an image exists for a card
function imageExists(cardId: string): boolean {
  const imagePath = path.join(CACHE_DIR, `image_${cardId}.png`);
  return fs.existsSync(imagePath);
}

// Function to generate image for a card
async function generateCardImage(cardId: string, name: string, retryCount = 0): Promise<boolean> {
  try {
    console.log(`[${new Date().toISOString()}] Generating image for card: ${name} (${cardId})`);
    
    const response = await fetch(`${API_BASE_URL}/api/cards/${cardId}/image`);
    
    if (response.status === 429) {
      console.log(`Rate limit hit for ${cardId}, will retry later`);
      return false;
    }
    
    if (!response.ok) {
      console.error(`Failed to generate image for ${cardId}: ${response.statusText}`);
      
      // Retry if we haven't hit the retry limit
      if (retryCount < RETRY_COUNT) {
        console.log(`Will retry ${cardId} (attempt ${retryCount + 1}/${RETRY_COUNT})`);
        await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY_MS));
        return generateCardImage(cardId, name, retryCount + 1);
      }
      
      return false;
    }
    
    const data = await response.json();
    if (data && data.imageUrl) {
      console.log(`Successfully generated image for ${name} (${cardId}): ${data.imageUrl}`);
      return true;
    }
    
    console.error(`No image URL returned for ${cardId}`);
    return false;
  } catch (error) {
    console.error(`Error generating image for ${cardId}:`, error);
    
    // Retry if we haven't hit the retry limit
    if (retryCount < RETRY_COUNT) {
      console.log(`Will retry ${cardId} (attempt ${retryCount + 1}/${RETRY_COUNT})`);
      await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY_MS));
      return generateCardImage(cardId, name, retryCount + 1);
    }
    
    return false;
  }
}

// Process cards in batches with delays
async function processCardBatches(cards: { id: string, name: string }[]): Promise<void> {
  const missingCardImages = cards.filter(card => !imageExists(card.id));
  console.log(`Found ${missingCardImages.length} cards without images out of ${cards.length} requested cards`);
  
  if (missingCardImages.length === 0) {
    console.log('All requested cards already have images. No generation needed.');
    return;
  }
  
  // Process in batches
  for (let i = 0; i < missingCardImages.length; i += BATCH_SIZE) {
    const batch = missingCardImages.slice(i, i + BATCH_SIZE);
    console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1} of ${Math.ceil(missingCardImages.length / BATCH_SIZE)}`);
    console.log(`Cards in this batch: ${batch.map(c => c.name).join(', ')}`);
    
    // Process each card in the batch
    for (const card of batch) {
      await generateCardImage(card.id, card.name);
      // Wait between individual requests
      await new Promise(resolve => setTimeout(resolve, REQUEST_DELAY_MS));
    }
    
    // If there are more batches to process, wait between batches
    if (i + BATCH_SIZE < missingCardImages.length) {
      console.log(`Waiting ${BATCH_DELAY_MS / 1000} seconds before next batch...`);
      await new Promise(resolve => setTimeout(resolve, BATCH_DELAY_MS));
    }
  }
}

async function main() {
  console.log(`Starting generation of ${cardsToGenerate.length} specific card images`);
  console.log(`Using batch size of ${BATCH_SIZE} with ${REQUEST_DELAY_MS/1000}s between cards and ${BATCH_DELAY_MS/1000}s between batches`);
  
  try {
    await processCardBatches(cardsToGenerate);
    console.log('Card image generation completed');
  } catch (error) {
    console.error('Error during card image generation:', error);
  }
}

// Run the main function
main().catch(console.error);