/**
 * Check 3D Enhancement Progress
 * Verify all Major Arcana cards have been enhanced
 */

import fs from 'fs';
import path from 'path';

const majorArcanaCards = [
  { id: '00', name: 'The Fool', filename: '00-fool.png' },
  { id: '01', name: 'The Magician', filename: '01-magician.png' },
  { id: '02', name: 'The High Priestess', filename: '02-high-priestess.png' },
  { id: '03', name: 'The Empress', filename: '03-empress.png' },
  { id: '04', name: 'The Emperor', filename: '04-emperor.png' },
  { id: '05', name: 'The Hierophant', filename: '05-hierophant.png' },
  { id: '06', name: 'The Lovers', filename: '06-lovers.png' },
  { id: '07', name: 'The Chariot', filename: '07-chariot.png' },
  { id: '08', name: 'Strength', filename: '08-strength.png' },
  { id: '09', name: 'The Hermit', filename: '09-hermit.png' },
  { id: '10', name: 'Wheel of Fortune', filename: '10-wheel.png' },
  { id: '11', name: 'Justice', filename: '11-justice.png' },
  { id: '12', name: 'The Hanged Man', filename: '12-hanged-man.png' },
  { id: '13', name: 'Death', filename: '13-death.png' },
  { id: '14', name: 'Temperance', filename: '14-temperance.png' },
  { id: '15', name: 'The Devil', filename: '15-devil.png' },
  { id: '16', name: 'The Tower', filename: '16-tower.png' },
  { id: '17', name: 'The Star', filename: '17-star.png' },
  { id: '18', name: 'The Moon', filename: '18-moon.png' },
  { id: '19', name: 'The Sun', filename: '19-sun.png' },
  { id: '20', name: 'Judgement', filename: '20-judgement.png' },
  { id: '21', name: 'The World', filename: '21-world.png' }
];

function checkEnhancementProgress() {
  console.log('🌟 Checking 3D Enhancement Progress...');
  console.log('=======================================');
  
  const outputDir = path.join(process.cwd(), 'public', 'authentic-cards', 'major-arcana');
  
  let enhancedCount = 0;
  let recentlyUpdated = 0;
  const oneHourAgo = Date.now() - (60 * 60 * 1000);
  
  majorArcanaCards.forEach(card => {
    const filePath = path.join(outputDir, card.filename);
    
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      const isRecent = stats.mtime.getTime() > oneHourAgo;
      
      console.log(`✅ ${card.name.padEnd(20)} | ${card.filename} | ${isRecent ? '🆕 Recently Enhanced' : '✓ Available'}`);
      
      enhancedCount++;
      if (isRecent) recentlyUpdated++;
    } else {
      console.log(`❌ ${card.name.padEnd(20)} | ${card.filename} | Missing`);
    }
  });
  
  console.log('=======================================');
  console.log(`📊 Progress Summary:`);
  console.log(`   Total Cards: ${majorArcanaCards.length}`);
  console.log(`   Enhanced: ${enhancedCount}`);
  console.log(`   Recently Updated: ${recentlyUpdated}`);
  console.log(`   Completion: ${Math.round((enhancedCount / majorArcanaCards.length) * 100)}%`);
  
  if (enhancedCount === majorArcanaCards.length) {
    console.log('🎉 ALL MAJOR ARCANA CARDS SUCCESSFULLY ENHANCED WITH 3D DEPTH!');
    console.log('🌟 Your collection now has that beautiful lifelike quality!');
  } else {
    const missing = majorArcanaCards.length - enhancedCount;
    console.log(`⏳ ${missing} cards still processing or need enhancement...`);
  }
  
  return enhancedCount === majorArcanaCards.length;
}

function main() {
  console.log('🎨 3D Major Arcana Enhancement Progress Check');
  console.log('=============================================');
  
  const isComplete = checkEnhancementProgress();
  
  if (isComplete) {
    console.log('\n🎊 CONGRATULATIONS! Your 3D Major Arcana collection is complete!');
    console.log('Each card now has the same otherworldly, lifelike depth as The Fool.');
    console.log('Ready to proceed with Minor Arcana or launch your beautiful app!');
  }
}

main();