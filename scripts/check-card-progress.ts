/**
 * Check Major Arcana Card Generation Progress
 */

import fs from "fs";
import path from "path";

function checkCardProgress() {
  const cards = ['5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21'];
  
  console.log("🔍 Checking Major Arcana card generation progress...\n");
  
  let generated = 0;
  let missing = [];
  
  for (const cardId of cards) {
    const cardPath = path.join("public", "assets", "cards", `${cardId}.png`);
    if (fs.existsSync(cardPath)) {
      const stats = fs.statSync(cardPath);
      console.log(`✅ Card ${cardId}: Generated (${Math.round(stats.size / 1024)}KB)`);
      generated++;
    } else {
      console.log(`❌ Card ${cardId}: Missing`);
      missing.push(cardId);
    }
  }
  
  console.log(`\n📊 Progress: ${generated}/${cards.length} cards generated`);
  console.log(`🎯 ${cards.length - generated} cards remaining: ${missing.join(', ')}`);
  
  if (missing.length === 0) {
    console.log("🎉 All Major Arcana cards are complete! Ready to launch!");
  } else {
    console.log(`⏱️ Next to generate: Card ${missing[0]}`);
  }
}

checkCardProgress();