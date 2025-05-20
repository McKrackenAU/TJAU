/**
 * Simple script to generate card images for the standard tarot deck
 */

import fetch from 'node-fetch';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current directory with ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CACHE_DIR = path.join(process.cwd(), 'public', 'cache', 'images');
const API_URL = 'http://localhost:5000/api/cards';
const DELAY_MS = 5000; // 5 seconds between requests
const IMAGE_API_URL = 'http://localhost:5000/api/cards/';

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
async function generateImage(cardId) {
  console.log(`Requesting image for card: ${cardId}`);
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
      console.log(`Successfully generated image for ${cardId}: ${data.imageUrl}`);
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

// Function to get all cards and generate missing images
async function generateMissingImages() {
  try {
    // Fetch all cards
    console.log('Fetching card list...');
    const response = await fetch(API_URL);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch cards: ${response.statusText}`);
    }
    
    const cards = await response.json();
    console.log(`Found ${cards.length} cards total`);
    
    // Find cards missing images
    const missingImages = cards.filter(card => !imageExists(card.id));
    console.log(`Found ${missingImages.length} cards without images`);
    
    // Generate images one by one with delay
    for (const card of missingImages) {
      console.log(`Processing ${card.name} (${card.id})`);
      await generateImage(card.id);
      console.log(`Waiting ${DELAY_MS/1000} seconds before next request...`);
      await delay(DELAY_MS);
    }
    
    console.log('Image generation complete!');
  } catch (error) {
    console.error('Error during image generation:', error);
  }
}

// Run the script
console.log('Starting card image generation...');
generateMissingImages();