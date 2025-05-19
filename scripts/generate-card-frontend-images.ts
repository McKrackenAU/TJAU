/**
 * Generate Card Frontend Images Script
 * 
 * This script generates a complete set of card front images for the tarot app.
 * It uses a combination of SVG templates and card data to create consistent,
 * beautiful card images without needing to make API calls for each card.
 */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { tarotCards } from '../shared/tarot-data';

// Ensure required directories exist
const imagesBaseDir = path.join(process.cwd(), 'public/images/cards');

// Create directory structure
const directories = [
  imagesBaseDir,
  path.join(imagesBaseDir, 'major'),
  path.join(imagesBaseDir, 'wands'),
  path.join(imagesBaseDir, 'cups'),
  path.join(imagesBaseDir, 'swords'),
  path.join(imagesBaseDir, 'pentacles')
];

directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Color palettes for different card types
const colorPalettes = {
  major: {
    primary: '#8b4ab0',
    secondary: '#e9c7f5',
    accent: '#ff9ecf'
  },
  wands: {
    primary: '#d35400',
    secondary: '#ffcead',
    accent: '#ff9966'
  },
  cups: {
    primary: '#2980b9',
    secondary: '#c7e7ff',
    accent: '#5fd4ff'
  },
  swords: {
    primary: '#7f8c8d',
    secondary: '#e5e9ea',
    accent: '#b1d1e0'
  },
  pentacles: {
    primary: '#27ae60',
    secondary: '#c6f8de',
    accent: '#8eff75'
  }
};

/**
 * Creates a basic SVG template for a card
 */
function createCardSvgTemplate(card: any, colors: any): string {
  const title = card.name;
  const suit = card.suit || 'Major Arcana';
  const description = card.description || '';
  
  // Extract main keywords for display
  const keywords = card.meanings.upright.slice(0, 3).join(', ');
  
  return `
  <svg width="1024" height="1536" xmlns="http://www.w3.org/2000/svg">
    <!-- Card background with gradient -->
    <linearGradient id="cardGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${colors.secondary}" />
      <stop offset="100%" stop-color="${colors.primary}" />
    </linearGradient>
    <rect width="1024" height="1536" rx="40" ry="40" fill="url(#cardGradient)" />
    
    <!-- Card border -->
    <rect x="20" y="20" width="984" height="1496" rx="30" ry="30" fill="none" stroke="${colors.accent}" stroke-width="8" />
    
    <!-- Card title -->
    <text x="512" y="120" font-family="Arial, sans-serif" font-size="70" font-weight="bold" text-anchor="middle" fill="#FFFFFF">${title}</text>
    <text x="512" y="180" font-family="Arial, sans-serif" font-size="40" text-anchor="middle" fill="#FFFFFF">${suit}</text>
    
    <!-- Central symbol or image placeholder -->
    <circle cx="512" cy="600" r="250" fill="${colors.secondary}" stroke="${colors.accent}" stroke-width="10" />
    <text x="512" y="600" font-family="Arial, sans-serif" font-size="80" font-weight="bold" text-anchor="middle" fill="${colors.primary}">
      ${card.arcana === 'major' ? card.number !== undefined ? card.number : '' : card.number}
    </text>
    
    <!-- Keywords -->
    <text x="512" y="900" font-family="Arial, sans-serif" font-size="40" text-anchor="middle" fill="#FFFFFF">Keywords:</text>
    <text x="512" y="960" font-family="Arial, sans-serif" font-size="36" text-anchor="middle" fill="#FFFFFF">${keywords}</text>
    
    <!-- Element if available -->
    ${card.element ? `<text x="512" y="1050" font-family="Arial, sans-serif" font-size="36" text-anchor="middle" fill="#FFFFFF">Element: ${card.element}</text>` : ''}
    
    <!-- Decorative accents -->
    <circle cx="100" cy="100" r="40" fill="${colors.accent}" opacity="0.7" />
    <circle cx="924" cy="100" r="40" fill="${colors.accent}" opacity="0.7" />
    <circle cx="100" cy="1436" r="40" fill="${colors.accent}" opacity="0.7" />
    <circle cx="924" cy="1436" r="40" fill="${colors.accent}" opacity="0.7" />
  </svg>
  `;
}

/**
 * Generate all card images
 */
async function generateCardImages() {
  console.log('Generating card front images...');
  
  for (const card of tarotCards) {
    try {
      // Determine colors based on card type
      let colorScheme;
      if (card.arcana === 'major') {
        colorScheme = colorPalettes.major;
      } else if (card.suit === 'Wands' || card.suit === 'wands') {
        colorScheme = colorPalettes.wands;
      } else if (card.suit === 'Cups' || card.suit === 'cups') {
        colorScheme = colorPalettes.cups;
      } else if (card.suit === 'Swords' || card.suit === 'swords') {
        colorScheme = colorPalettes.swords;
      } else if (card.suit === 'Pentacles' || card.suit === 'pentacles') {
        colorScheme = colorPalettes.pentacles;
      } else {
        colorScheme = colorPalettes.major; // Default fallback
      }
      
      // Create SVG content
      const svgContent = createCardSvgTemplate(card, colorScheme);
      
      // Determine output file path
      let outputPath;
      if (card.arcana === 'major') {
        const filename = card.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '.png';
        outputPath = path.join(imagesBaseDir, 'major', filename);
      } else if (card.suit) {
        const suitDir = card.suit.toLowerCase();
        const filename = (card.number ? card.number.toString() : card.name).toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '.png';
        outputPath = path.join(imagesBaseDir, suitDir, filename);
      } else {
        const filename = card.id.replace(/[^a-z0-9-]/g, '') + '.png';
        outputPath = path.join(imagesBaseDir, filename);
      }
      
      // Convert SVG to PNG
      await sharp(Buffer.from(svgContent))
        .png()
        .toFile(outputPath);
      
      console.log(`Generated card image: ${outputPath}`);
    } catch (error) {
      console.error(`Error generating image for card ${card.name}:`, error);
    }
  }
  
  console.log('Card image generation complete!');
}

// Run the generator
generateCardImages().catch(error => {
  console.error('Error in card image generation:', error);
  process.exit(1);
});