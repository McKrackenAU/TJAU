/**
 * Bulk Copy Card Images - Direct File Placement
 * Copy images from a source folder to exact card locations with zero processing
 */

import fs from "fs";
import path from "path";

// Card mapping for direct file placement
const cardMappings = [
  {
    source: "three-of-cups.png",
    destination: "public/authentic-cards/minor-arcana/cups/three-of-cups.png",
    name: "Three of Cups"
  },
  {
    source: "four-of-cups.png", 
    destination: "public/authentic-cards/minor-arcana/cups/four-of-cups.png",
    name: "Four of Cups"
  },
  {
    source: "seven-of-cups.png",
    destination: "public/authentic-cards/minor-arcana/cups/seven-of-cups.png",
    name: "Seven of Cups"
  },
  {
    source: "eight-of-cups.png",
    destination: "public/authentic-cards/minor-arcana/cups/eight-of-cups.png", 
    name: "Eight of Cups"
  },
  {
    source: "nine-of-cups.png",
    destination: "public/authentic-cards/minor-arcana/cups/nine-of-cups.png",
    name: "Nine of Cups"
  }
  // Add more mappings as needed
];

function ensureDirectoryExists(filePath: string) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyCardImages(sourceFolder: string = "card-images") {
  console.log(`Starting bulk card copy from ${sourceFolder}/`);
  
  let successCount = 0;
  let totalCount = 0;

  for (const mapping of cardMappings) {
    totalCount++;
    const sourcePath = path.join(sourceFolder, mapping.source);
    
    if (!fs.existsSync(sourcePath)) {
      console.log(`⚠️  Source file not found: ${sourcePath}`);
      continue;
    }

    try {
      // Ensure destination directory exists
      ensureDirectoryExists(mapping.destination);
      
      // Copy file directly with zero processing
      fs.copyFileSync(sourcePath, mapping.destination);
      
      console.log(`✅ Copied ${mapping.name}: ${mapping.source} -> ${mapping.destination}`);
      successCount++;
      
    } catch (error) {
      console.error(`❌ Failed to copy ${mapping.name}:`, error);
    }
  }

  console.log(`\n📋 Copy complete: ${successCount}/${totalCount} cards copied`);
  
  if (successCount > 0) {
    console.log("\n🎉 Cards successfully placed! No quality loss occurred.");
  }
  
  if (successCount < totalCount) {
    console.log("\n📝 To use this system:");
    console.log("1. Create a 'card-images' folder in the project root");
    console.log("2. Place your images with exact filenames:");
    cardMappings.forEach(mapping => {
      console.log(`   - ${mapping.source}`);
    });
    console.log("3. Run this script again");
  }
}

// Check command line arguments
const sourceFolder = process.argv[2] || "card-images";
copyCardImages(sourceFolder);