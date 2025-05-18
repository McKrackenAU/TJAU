
import fs from 'fs';
import path from 'path';
import { CACHE_DIR } from './constants';
import type { TarotCard } from '@shared/schema';
import { generateCardImage } from '../ai-service';

// Ensure images cache directory exists
const imagesCacheDir = path.join(CACHE_DIR, 'images');
const mappingFilePath = path.join(imagesCacheDir, 'card-image-mapping.json');

// Initialize or load the mapping
let cardImageMapping: Record<string, string> = {};

try {
  if (fs.existsSync(mappingFilePath)) {
    cardImageMapping = JSON.parse(fs.readFileSync(mappingFilePath, 'utf8'));
  }
  
  if (!fs.existsSync(imagesCacheDir)) {
    fs.mkdirSync(imagesCacheDir, { recursive: true });
  }
} catch (error) {
  console.error('Error initializing card image mapping:', error);
}

export async function getCardImagePath(card: TarotCard): Promise<string> {
  const cardId = card.id;
  const existingPath = cardImageMapping[cardId];

  if (existingPath && fs.existsSync(path.join(CACHE_DIR, existingPath))) {
    return existingPath;
  }

  // Generate new image and update mapping
  try {
    const imageUrl = await generateCardImage(card);
    // The imageUrl from generateCardImage is already relative to CACHE_DIR
    cardImageMapping[cardId] = imageUrl;
    
    // Save updated mapping
    fs.writeFileSync(mappingFilePath, JSON.stringify(cardImageMapping, null, 2));
    
    return imageUrl;
  } catch (error) {
    console.error(`Failed to generate/cache image for card ${cardId}:`, error);
    throw error;
  }
}

export function getCachedImagePath(cardId: string): string | null {
  const imagePath = cardImageMapping[cardId];
  if (imagePath && fs.existsSync(path.join(CACHE_DIR, imagePath))) {
    return imagePath;
  }
  return null;
}
