/**
 * Script to generate images for custom oracle cards
 */

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CACHE_DIR = path.join(process.cwd(), 'public', 'cache', 'images');
const IMAGE_API_URL = 'http://localhost:5000/api/cards/';
const DELAY_MS = 10000; // 10 seconds between requests
const BATCH_SIZE = 3; // Process in small batches
const BATCH_DELAY_MS = 60000; // Wait 1 minute between batches

// Make sure cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

// Function to delay execution
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Function to check if card image exists
const imageExists = cardId => {
  const imagePath = path.join(CACHE_DIR, `image_${cardId}.png`);
  return fs.existsSync(imagePath);
};

// Function to generate image for a card
async function generateImage(cardId, name) {
  console.log(`Requesting image for card: ${name} (${cardId})`);
  try {
    const response = await fetch(`${IMAGE_API_URL}${cardId}/image`);
    
    if (response.status === 429) {
      console.log(`Rate limit hit for ${cardId}, will try again later`);
      return false;
    }
    
    if (!response.ok) {
      console.error(`Error generating image for ${cardId}: ${response.statusText}`);
      return false;
    }
    
    const data = await response.json();
    if (data && data.imageUrl) {
      console.log(`Successfully generated image for ${name} (${cardId}): ${data.imageUrl}`);
      return true;
    } else {
      console.error(`No image URL returned for ${cardId}`);
      return false;
    }
  } catch (error) {
    console.error(`Error generating image for ${cardId}:`, error);
    return false;
  }
}

// Array of custom cards to generate
const customCards = [
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

// Process cards in batches to avoid rate limiting
async function processBatches() {
  // Find cards missing images
  const missingImages = customCards.filter(card => !imageExists(card.id));
  console.log(`Found ${missingImages.length} custom cards without images`);
  
  if (missingImages.length === 0) {
    console.log('All custom cards already have images. Nothing to generate.');
    return;
  }
  
  // Process in batches
  for (let i = 0; i < missingImages.length; i += BATCH_SIZE) {
    const batch = missingImages.slice(i, i + BATCH_SIZE);
    console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1} of ${Math.ceil(missingImages.length / BATCH_SIZE)}`);
    
    // Process each card in the batch
    for (const card of batch) {
      await generateImage(card.id, card.name);
      console.log(`Waiting ${DELAY_MS/1000} seconds before next request...`);
      await delay(DELAY_MS);
    }
    
    // Wait between batches
    if (i + BATCH_SIZE < missingImages.length) {
      console.log(`Waiting ${BATCH_DELAY_MS/1000} seconds before next batch...`);
      await delay(BATCH_DELAY_MS);
    }
  }
  
  console.log('Custom card image generation complete!');
}

// Run the script
console.log('Starting custom card image generation...');
processBatches();