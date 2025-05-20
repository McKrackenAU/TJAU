/**
 * Generate Missing Card Images
 * 
 * This script checks for any missing card images in the cache
 * and generates them using the API with proper rate limiting.
 */

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { tarotCards } from '../shared/tarot-data';

// Configuration
const API_BASE_URL = 'http://localhost:5000';
const CACHE_DIR = path.join(process.cwd(), 'public', 'cache', 'images');
const REQUEST_DELAY_MS = 3000; // 3 seconds between requests to avoid rate limiting
const BATCH_SIZE = 5; // Process in small batches
const BATCH_DELAY_MS = 30000; // Wait 30 seconds between batches

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
  fs.mkdirSync(CACHE_DIR, { recursive: true });
}

// Function to check if an image exists for a card
function imageExists(cardId: string): boolean {
  const imagePath = path.join(CACHE_DIR, `image_${cardId}.png`);
  return fs.existsSync(imagePath);
}

// Function to generate image for a card
async function generateCardImage(cardId: string): Promise<boolean> {
  try {
    console.log(`Generating image for card: ${cardId}`);
    
    const response = await fetch(`${API_BASE_URL}/api/cards/${cardId}/image`);
    
    if (response.status === 429) {
      console.log(`Rate limit hit for ${cardId}, will retry later`);
      return false;
    }
    
    if (!response.ok) {
      console.error(`Failed to generate image for ${cardId}: ${response.statusText}`);
      return false;
    }
    
    const data = await response.json();
    if (data && data.imageUrl) {
      console.log(`Successfully generated image for ${cardId}: ${data.imageUrl}`);
      return true;
    }
    
    console.error(`No image URL returned for ${cardId}`);
    return false;
  } catch (error) {
    console.error(`Error generating image for ${cardId}:`, error);
    return false;
  }
}

// Process cards in batches with delays
async function processCardBatches(cards: { id: string, name: string }[]): Promise<void> {
  const missingCardImages = cards.filter(card => !imageExists(card.id));
  console.log(`Found ${missingCardImages.length} cards without images`);
  
  // Process in batches
  for (let i = 0; i < missingCardImages.length; i += BATCH_SIZE) {
    const batch = missingCardImages.slice(i, i + BATCH_SIZE);
    console.log(`Processing batch ${Math.floor(i / BATCH_SIZE) + 1} of ${Math.ceil(missingCardImages.length / BATCH_SIZE)}`);
    
    // Process each card in the batch
    for (const card of batch) {
      await generateCardImage(card.id);
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
  console.log('Starting missing card image generation');
  
  // Get all cards (standard tarot and imported)
  try {
    // First get standard tarot cards
    const standardCards = tarotCards;
    console.log(`Found ${standardCards.length} standard tarot cards`);
    
    // We'll just use standard cards since imported cards require authentication
    // and are specific to each user
    const importedCards = [];
    console.log(`Found ${importedCards.length} imported cards`);
    
    // Combine all cards
    const allCards = [...standardCards, ...importedCards];
    console.log(`Total of ${allCards.length} cards to check`);
    
    // Process all cards
    await processCardBatches(allCards);
    
    console.log('Card image generation completed');
  } catch (error) {
    console.error('Error during card image generation:', error);
  }
}

// Run the main function
main().catch(console.error);