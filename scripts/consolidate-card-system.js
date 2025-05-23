/**
 * Comprehensive Card System Consolidation
 * 
 * This script will:
 * 1. Download all existing card images to a permanent assets directory
 * 2. Create a master card database with no duplicates
 * 3. Assign specific images to specific cards permanently
 * 4. Update the database to store image paths directly
 */

import fs from 'fs';
import path from 'path';

const CACHE_DIR = path.join(process.cwd(), 'public', 'cache', 'images');
const ASSETS_DIR = path.join(process.cwd(), 'public', 'assets', 'cards');
const BACKUP_DIR = path.join(process.cwd(), 'public', 'assets', 'backup');

// Ensure directories exist
[ASSETS_DIR, BACKUP_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Master card list with permanent image assignments
const MASTER_CARD_LIST = [
  // Major Arcana
  { id: '0', name: 'The Fool', imageFile: 'the-fool.png', sourceId: '0' },
  { id: '1', name: 'The Magician', imageFile: 'the-magician.png', sourceId: '1' },
  { id: '2', name: 'The High Priestess', imageFile: 'the-high-priestess.png', sourceId: '2' },
  { id: '3', name: 'The Empress', imageFile: 'the-empress.png', sourceId: '3' },
  { id: '4', name: 'The Emperor', imageFile: 'the-emperor.png', sourceId: '4' },
  { id: '5', name: 'The Hierophant', imageFile: 'the-hierophant.png', sourceId: '5' },
  { id: '6', name: 'The Lovers', imageFile: 'the-lovers.png', sourceId: '6' },
  { id: '7', name: 'The Chariot', imageFile: 'the-chariot.png', sourceId: '7' },
  { id: '8', name: 'Strength', imageFile: 'strength.png', sourceId: '8' },
  { id: '9', name: 'The Hermit', imageFile: 'the-hermit.png', sourceId: '9' },
  { id: '10', name: 'Wheel of Fortune', imageFile: 'wheel-of-fortune.png', sourceId: '10' },
  { id: '11', name: 'Justice', imageFile: 'justice.png', sourceId: '11' },
  { id: '12', name: 'The Hanged Man', imageFile: 'the-hanged-man.png', sourceId: '12' },
  { id: '13', name: 'Death', imageFile: 'death.png', sourceId: '13' },
  { id: '14', name: 'Temperance', imageFile: 'temperance.png', sourceId: '14' },
  { id: '15', name: 'The Devil', imageFile: 'the-devil.png', sourceId: '15' },
  { id: '16', name: 'The Tower', imageFile: 'the-tower.png', sourceId: '16' },
  { id: '17', name: 'The Star', imageFile: 'the-star.png', sourceId: '17' },
  { id: '18', name: 'The Moon', imageFile: 'the-moon.png', sourceId: '18' },
  { id: '19', name: 'The Sun', imageFile: 'the-sun.png', sourceId: '19' },
  { id: '20', name: 'Judgement', imageFile: 'judgement.png', sourceId: '20' },
  { id: '21', name: 'The World', imageFile: 'the-world.png', sourceId: '21' },

  // Wands
  { id: 'w1', name: 'Ace of Wands', imageFile: 'ace-of-wands.png', sourceId: 'w1' },
  { id: 'w2', name: 'Two of Wands', imageFile: 'two-of-wands.png', sourceId: 'w2' },
  { id: 'w3', name: 'Three of Wands', imageFile: 'three-of-wands.png', sourceId: 'w3' },
  { id: 'w4', name: 'Four of Wands', imageFile: 'four-of-wands.png', sourceId: 'w4' },
  { id: 'w5', name: 'Five of Wands', imageFile: 'five-of-wands.png', sourceId: 'w5' },
  { id: 'w6', name: 'Six of Wands', imageFile: 'six-of-wands.png', sourceId: 'w6' },
  { id: 'w7', name: 'Seven of Wands', imageFile: 'seven-of-wands.png', sourceId: 'w7' },
  { id: 'w8', name: 'Eight of Wands', imageFile: 'eight-of-wands.png', sourceId: 'w8' },
  { id: 'w9', name: 'Nine of Wands', imageFile: 'nine-of-wands.png', sourceId: 'w9' },
  { id: 'w10', name: 'Ten of Wands', imageFile: 'ten-of-wands.png', sourceId: 'w10' },
  { id: 'wp', name: 'Page of Wands', imageFile: 'page-of-wands.png', sourceId: 'wp' },
  { id: 'wn', name: 'Knight of Wands', imageFile: 'knight-of-wands.png', sourceId: 'wn' },
  { id: 'wq', name: 'Queen of Wands', imageFile: 'queen-of-wands.png', sourceId: 'wq' },
  { id: 'wk', name: 'King of Wands', imageFile: 'king-of-wands.png', sourceId: 'wk' },

  // Cups
  { id: 'c1', name: 'Ace of Cups', imageFile: 'ace-of-cups.png', sourceId: 'c1' },
  { id: 'c2', name: 'Two of Cups', imageFile: 'two-of-cups.png', sourceId: 'c2' },
  { id: 'c3', name: 'Three of Cups', imageFile: 'three-of-cups.png', sourceId: 'c3' },
  { id: 'c4', name: 'Four of Cups', imageFile: 'four-of-cups.png', sourceId: 'c4' },
  { id: 'c5', name: 'Five of Cups', imageFile: 'five-of-cups.png', sourceId: 'c5' },
  { id: 'c6', name: 'Six of Cups', imageFile: 'six-of-cups.png', sourceId: 'c6' },
  { id: 'c7', name: 'Seven of Cups', imageFile: 'seven-of-cups.png', sourceId: 'c7' },
  { id: 'c8', name: 'Eight of Cups', imageFile: 'eight-of-cups.png', sourceId: 'c8' },
  { id: 'c9', name: 'Nine of Cups', imageFile: 'nine-of-cups.png', sourceId: 'c9' },
  { id: 'c10', name: 'Ten of Cups', imageFile: 'ten-of-cups.png', sourceId: 'c10' },
  { id: 'cp', name: 'Page of Cups', imageFile: 'page-of-cups.png', sourceId: 'cp' },
  { id: 'cn', name: 'Knight of Cups', imageFile: 'knight-of-cups.png', sourceId: 'cn' },
  { id: 'cq', name: 'Queen of Cups', imageFile: 'queen-of-cups.png', sourceId: 'cq' },
  { id: 'ck', name: 'King of Cups', imageFile: 'king-of-cups.png', sourceId: 'ck' },

  // Swords
  { id: 's1', name: 'Ace of Swords', imageFile: 'ace-of-swords.png', sourceId: 's1' },
  { id: 's2', name: 'Two of Swords', imageFile: 'two-of-swords.png', sourceId: 's2' },
  { id: 's3', name: 'Three of Swords', imageFile: 'three-of-swords.png', sourceId: 's3' },
  { id: 's4', name: 'Four of Swords', imageFile: 'four-of-swords.png', sourceId: 's4' },
  { id: 's5', name: 'Five of Swords', imageFile: 'five-of-swords.png', sourceId: 's5' },
  { id: 's6', name: 'Six of Swords', imageFile: 'six-of-swords.png', sourceId: 's6' },
  { id: 's7', name: 'Seven of Swords', imageFile: 'seven-of-swords.png', sourceId: 's7' },
  { id: 's8', name: 'Eight of Swords', imageFile: 'eight-of-swords.png', sourceId: 's8' },
  { id: 's9', name: 'Nine of Swords', imageFile: 'nine-of-swords.png', sourceId: 's9' },
  { id: 's10', name: 'Ten of Swords', imageFile: 'ten-of-swords.png', sourceId: 's10' },
  { id: 'sp', name: 'Page of Swords', imageFile: 'page-of-swords.png', sourceId: 'sp' },
  { id: 'sn', name: 'Knight of Swords', imageFile: 'knight-of-swords.png', sourceId: 'sn' },
  { id: 'sq', name: 'Queen of Swords', imageFile: 'queen-of-swords.png', sourceId: 'sq' },
  { id: 'sk', name: 'King of Swords', imageFile: 'king-of-swords.png', sourceId: 'sk' },

  // Pentacles
  { id: 'p1', name: 'Ace of Pentacles', imageFile: 'ace-of-pentacles.png', sourceId: 'p1' },
  { id: 'p2', name: 'Two of Pentacles', imageFile: 'two-of-pentacles.png', sourceId: 'p2' },
  { id: 'p3', name: 'Three of Pentacles', imageFile: 'three-of-pentacles.png', sourceId: 'p3' },
  { id: 'p4', name: 'Four of Pentacles', imageFile: 'four-of-pentacles.png', sourceId: 'p4' },
  { id: 'p5', name: 'Five of Pentacles', imageFile: 'five-of-pentacles.png', sourceId: 'p5' },
  { id: 'p6', name: 'Six of Pentacles', imageFile: 'six-of-pentacles.png', sourceId: 'p6' },
  { id: 'p7', name: 'Seven of Pentacles', imageFile: 'seven-of-pentacles.png', sourceId: 'p7' },
  { id: 'p8', name: 'Eight of Pentacles', imageFile: 'eight-of-pentacles.png', sourceId: 'p8' },
  { id: 'p9', name: 'Nine of Pentacles', imageFile: 'nine-of-pentacles.png', sourceId: 'p9' },
  { id: 'p10', name: 'Ten of Pentacles', imageFile: 'ten-of-pentacles.png', sourceId: 'p10' },
  { id: 'pp', name: 'Page of Pentacles', imageFile: 'page-of-pentacles.png', sourceId: 'pp' },
  { id: 'pn', name: 'Knight of Pentacles', imageFile: 'knight-of-pentacles.png', sourceId: 'pn' },
  { id: 'pq', name: 'Queen of Pentacles', imageFile: 'queen-of-pentacles.png', sourceId: 'pq' },
  { id: 'pk', name: 'King of Pentacles', imageFile: 'king-of-pentacles.png', sourceId: 'pk' },

  // Oracle Cards - using reassigned images
  { id: 'oracle_001', name: 'Element of Air', imageFile: 'element-of-air.png', sourceId: 'imported_300' },
  { id: 'oracle_002', name: 'Element of Earth', imageFile: 'element-of-earth.png', sourceId: 'imported_301' },
  { id: 'oracle_003', name: 'Element of Water', imageFile: 'element-of-water.png', sourceId: 'imported_302' },
  { id: 'oracle_004', name: 'Divine Guidance', imageFile: 'divine-guidance.png', sourceId: 'imported_303' },
  { id: 'oracle_005', name: 'Sacred Geometry', imageFile: 'sacred-geometry.png', sourceId: 'imported_304' },
  { id: 'oracle_006', name: 'Elemental Allies', imageFile: 'elemental-allies.png', sourceId: 'imported_305' },
  { id: 'oracle_007', name: 'Lunar Phases', imageFile: 'lunar-phases.png', sourceId: 'imported_328' },
  { id: 'oracle_008', name: 'Solar Energies', imageFile: 'solar-energies.png', sourceId: 'imported_329' },
  { id: 'oracle_009', name: 'Natures Wisdom', imageFile: 'natures-wisdom.png', sourceId: 'imported_332' },
  { id: 'oracle_010', name: 'Dream Exploration', imageFile: 'dream-exploration.png', sourceId: 'imported_333' },
  { id: 'oracle_011', name: 'Astral Travel', imageFile: 'astral-travel.png', sourceId: 'imported_334' },
  { id: 'oracle_012', name: 'Soul Contracts', imageFile: 'soul-contracts.png', sourceId: 'imported_335' },
  { id: 'oracle_013', name: 'Akashic Records', imageFile: 'akashic-records.png', sourceId: 'imported_336' },
  { id: 'oracle_014', name: 'Spirit Guides', imageFile: 'spirit-guides.png', sourceId: 'imported_337' },
  { id: 'oracle_015', name: 'Divine Feminine', imageFile: 'divine-feminine.png', sourceId: 'imported_338' },
  { id: 'oracle_016', name: 'Divine Masculine', imageFile: 'divine-masculine.png', sourceId: 'imported_339' },
  { id: 'oracle_017', name: 'Universal Love', imageFile: 'universal-love.png', sourceId: 'imported_340' },
  { id: 'oracle_018', name: 'Synchronicity', imageFile: 'synchronicity.png', sourceId: 'imported_341' },
  { id: 'oracle_019', name: 'Sacred Rituals', imageFile: 'sacred-rituals.png', sourceId: 'imported_342' },
  { id: 'oracle_020', name: 'Inner Alchemy', imageFile: 'inner-alchemy.png', sourceId: 'imported_343' },
  { id: 'oracle_021', name: 'Soulmates and Twin Flames', imageFile: 'soulmates-twin-flames.png', sourceId: 'imported_344' },
  { id: 'oracle_022', name: 'Ascended Masters', imageFile: 'ascended-masters.png', sourceId: 'imported_345' },
  { id: 'oracle_023', name: 'Divine Timing', imageFile: 'divine-timing.png', sourceId: 'imported_346' },
  { id: 'oracle_024', name: 'Inner Healing', imageFile: 'inner-healing.png', sourceId: 'imported_347' },
  { id: 'oracle_025', name: 'Ancestral Wisdom', imageFile: 'ancestral-wisdom.png', sourceId: 'imported_348' },
  { id: 'oracle_026', name: 'Soulful Expression', imageFile: 'soulful-expression.png', sourceId: 'imported_349' },
  { id: 'oracle_027', name: 'Divine Protection', imageFile: 'divine-protection.png', sourceId: 'imported_350' },
  { id: 'oracle_028', name: 'Gratitude and Abundance', imageFile: 'gratitude-abundance.png', sourceId: 'imported_351' },
  { id: 'oracle_029', name: 'Inner Child Healing', imageFile: 'inner-child-healing.png', sourceId: 'imported_352' },
  { id: 'oracle_030', name: 'Soulful Relationships', imageFile: 'soulful-relationships.png', sourceId: 'imported_353' },
  { id: 'oracle_031', name: 'Meditation and Mindfulness', imageFile: 'meditation-mindfulness.png', sourceId: 'imported_354' },
  { id: 'oracle_032', name: 'Cosmic Balance', imageFile: 'cosmic-balance.png', sourceId: 'imported_355' },
  { id: 'oracle_033', name: 'Infinite Possibilities', imageFile: 'infinite-possibilities.png', sourceId: 'imported_356' }
];

function copyImageToAssets(sourceId, targetFile) {
  const sourcePath = path.join(CACHE_DIR, `image_${sourceId}.png`);
  const targetPath = path.join(ASSETS_DIR, targetFile);
  
  if (fs.existsSync(sourcePath)) {
    try {
      fs.copyFileSync(sourcePath, targetPath);
      console.log(`✓ Copied ${sourceId} -> ${targetFile}`);
      return true;
    } catch (error) {
      console.error(`✗ Failed to copy ${sourceId}:`, error.message);
      return false;
    }
  } else {
    console.log(`⚠ Source image not found: ${sourcePath}`);
    return false;
  }
}

function consolidateCardSystem() {
  console.log('🚀 Starting comprehensive card system consolidation...');
  
  let successCount = 0;
  let totalCards = MASTER_CARD_LIST.length;
  
  // Copy all images to assets directory with proper names
  console.log(`\n📋 Processing ${totalCards} cards...`);
  
  for (const card of MASTER_CARD_LIST) {
    if (copyImageToAssets(card.sourceId, card.imageFile)) {
      successCount++;
    }
  }
  
  console.log(`\n📊 Consolidation Summary:`);
  console.log(`- Total cards processed: ${totalCards}`);
  console.log(`- Images successfully copied: ${successCount}`);
  console.log(`- Missing images: ${totalCards - successCount}`);
  
  // Generate the master card data file
  const masterCardData = {
    version: "1.0.0",
    lastUpdated: new Date().toISOString(),
    totalCards: totalCards,
    cards: MASTER_CARD_LIST.map(card => ({
      id: card.id,
      name: card.name,
      imagePath: `/assets/cards/${card.imageFile}`,
      hasImage: fs.existsSync(path.join(ASSETS_DIR, card.imageFile))
    }))
  };
  
  // Save master card data
  const masterDataPath = path.join(process.cwd(), 'public', 'assets', 'master-cards.json');
  fs.writeFileSync(masterDataPath, JSON.stringify(masterCardData, null, 2));
  
  console.log(`\n✅ Card system consolidation completed!`);
  console.log(`📁 Images stored in: ${ASSETS_DIR}`);
  console.log(`📄 Master data saved to: master-cards.json`);
  console.log(`\nNext steps:`);
  console.log(`1. Update frontend to use /assets/cards/ paths`);
  console.log(`2. Remove duplicate card loading logic`);
  console.log(`3. Update card components to use static paths`);
}

consolidateCardSystem();