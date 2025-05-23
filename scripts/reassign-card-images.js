/**
 * Script to reassign existing cached images to custom cards that don't have images
 */

import fs from 'fs';
import path from 'path';

const CACHE_DIR = path.join(process.cwd(), 'public', 'cache', 'images');

// Function to get all available cached images
function getAvailableImages() {
  const images = [];
  const files = fs.readdirSync(CACHE_DIR);
  
  for (const file of files) {
    if (file.endsWith('.png') && file.startsWith('image_')) {
      const cardId = file.replace('image_', '').replace('.png', '');
      images.push(cardId);
    }
  }
  
  return images;
}

// Custom cards that need images assigned
const customCardsNeedingImages = [
  { currentId: 'imported_300', newId: 'imported_300', name: 'Element of Air' },
  { currentId: 'imported_301', newId: 'imported_301', name: 'Element of Earth' },
  { currentId: 'imported_302', newId: 'imported_302', name: 'Element of Water' },
  { currentId: 'imported_303', newId: 'imported_303', name: 'Divine Guidance' },
  { currentId: 'imported_304', newId: 'imported_304', name: 'Sacred Geometry' },
  { currentId: 'imported_305', newId: 'imported_305', name: 'Elemental Allies' },
  { currentId: 'imported_328', newId: 'imported_328', name: 'Lunar Phases' },
  { currentId: 'imported_329', newId: 'imported_329', name: 'Solar Energies' },
  { currentId: 'imported_332', newId: 'imported_332', name: 'Natures Wisdom' },
  { currentId: 'imported_333', newId: 'imported_333', name: 'Dream Exploration' },
  { currentId: 'imported_334', newId: 'imported_334', name: 'Astral Travel' },
  { currentId: 'imported_335', newId: 'imported_335', name: 'Soul Contracts' },
  { currentId: 'imported_336', newId: 'imported_336', name: 'Akashic Records' },
  { currentId: 'imported_337', newId: 'imported_337', name: 'Spirit Guides' },
  { currentId: 'imported_338', newId: 'imported_338', name: 'Divine Feminine' },
  { currentId: 'imported_339', newId: 'imported_339', name: 'Divine Masculine' },
  { currentId: 'imported_340', newId: 'imported_340', name: 'Universal Love' },
  { currentId: 'imported_341', newId: 'imported_341', name: 'Synchronicity' },
  { currentId: 'imported_342', newId: 'imported_342', name: 'Sacred Rituals' },
  { currentId: 'imported_343', newId: 'imported_343', name: 'Inner Alchemy' },
  { currentId: 'imported_344', newId: 'imported_344', name: 'Soulmates and Twin Flames' },
  { currentId: 'imported_345', newId: 'imported_345', name: 'Ascended Masters' },
  { currentId: 'imported_346', newId: 'imported_346', name: 'Divine Timing' },
  { currentId: 'imported_347', newId: 'imported_347', name: 'Inner Healing' },
  { currentId: 'imported_348', newId: 'imported_348', name: 'Ancestral Wisdom' },
  { currentId: 'imported_349', newId: 'imported_349', name: 'Soulful Expression' },
  { currentId: 'imported_350', newId: 'imported_350', name: 'Divine Protection' },
  { currentId: 'imported_351', newId: 'imported_351', name: 'Gratitude and Abundance' },
  { currentId: 'imported_352', newId: 'imported_352', name: 'Inner Child Healing' },
  { currentId: 'imported_353', newId: 'imported_353', name: 'Soulful Relationships' },
  { currentId: 'imported_354', newId: 'imported_354', name: 'Meditation and Mindfulness' },
  { currentId: 'imported_355', newId: 'imported_355', name: 'Cosmic Balance' },
  { currentId: 'imported_356', newId: 'imported_356', name: 'Infinite Possibilities' }
];

// Function to check if image exists for a card
function imageExists(cardId) {
  const imagePath = path.join(CACHE_DIR, `image_${cardId}.png`);
  const jsonPath = path.join(CACHE_DIR, `image_${cardId}.json`);
  return fs.existsSync(imagePath) && fs.existsSync(jsonPath);
}

// Function to copy image and metadata
function copyImageFiles(sourceId, targetId, cardName) {
  const sourceImage = path.join(CACHE_DIR, `image_${sourceId}.png`);
  const sourceJson = path.join(CACHE_DIR, `image_${sourceId}.json`);
  const targetImage = path.join(CACHE_DIR, `image_${targetId}.png`);
  const targetJson = path.join(CACHE_DIR, `image_${targetId}.json`);
  
  try {
    // Copy image file
    fs.copyFileSync(sourceImage, targetImage);
    
    // Update JSON metadata
    const metadata = JSON.parse(fs.readFileSync(sourceJson, 'utf-8'));
    metadata.id = targetId;
    metadata.name = cardName;
    metadata.imageUrl = `/cache/images/image_${targetId}.png`;
    metadata.generatedAt = new Date().toISOString();
    
    fs.writeFileSync(targetJson, JSON.stringify(metadata, null, 2));
    
    console.log(`✓ Assigned image from ${sourceId} to ${cardName} (${targetId})`);
    return true;
  } catch (error) {
    console.error(`✗ Failed to copy image for ${cardName}:`, error.message);
    return false;
  }
}

function main() {
  console.log('Starting image reassignment for custom cards...');
  
  // Get available images
  const availableImages = getAvailableImages();
  console.log(`Found ${availableImages.length} cached images`);
  
  // Find cards that need images
  const cardsNeedingImages = customCardsNeedingImages.filter(card => !imageExists(card.currentId));
  console.log(`Found ${cardsNeedingImages.length} custom cards without images`);
  
  if (cardsNeedingImages.length === 0) {
    console.log('All custom cards already have images!');
    return;
  }
  
  // Find unused images (images that don't correspond to any known card)
  const usedImages = customCardsNeedingImages.map(card => card.currentId);
  const unusedImages = availableImages.filter(imageId => 
    !usedImages.includes(imageId) && 
    !imageId.startsWith('imported_') &&
    imageExists(imageId)
  );
  
  console.log(`Found ${unusedImages.length} potentially reassignable images`);
  
  // Assign images
  let assignedCount = 0;
  for (let i = 0; i < cardsNeedingImages.length && i < unusedImages.length; i++) {
    const card = cardsNeedingImages[i];
    const sourceImageId = unusedImages[i];
    
    if (copyImageFiles(sourceImageId, card.currentId, card.name)) {
      assignedCount++;
    }
  }
  
  console.log(`\nSummary:`);
  console.log(`- Cards needing images: ${cardsNeedingImages.length}`);
  console.log(`- Images assigned: ${assignedCount}`);
  console.log(`- Cards still missing images: ${cardsNeedingImages.length - assignedCount}`);
  
  if (assignedCount > 0) {
    console.log('\n✓ Image reassignment completed! Custom cards should now display with images.');
  }
}

main();