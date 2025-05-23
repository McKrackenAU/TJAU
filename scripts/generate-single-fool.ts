/**
 * Generate Single Authentic Fool Card
 */

import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateAuthenticFool() {
  try {
    console.log('🎯 Creating The Fool with authentic traditional symbolism...');
    
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: 'Traditional Rider-Waite tarot card The Fool: young androgynous person in multicolored patchwork clothing with bindle sack over shoulder, stepping confidently toward cliff edge with one foot dangling over precipice, small loyal white dog at their feet looking up adoringly, bright yellow sun shining in clear blue sky, white rose held delicately in free hand, carefree joyful expression of innocence and new beginnings, snow-capped mountains in distant background, vertical tarot card format, authentic Rider-Waite traditional symbolism, detailed mystical artwork',
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    if (response.data?.[0]?.url) {
      const imageUrl = response.data[0].url;
      const imageResponse = await fetch(imageUrl);
      const buffer = Buffer.from(await imageResponse.arrayBuffer());
      
      const assetsDir = path.join(process.cwd(), 'public', 'assets', 'cards');
      fs.mkdirSync(assetsDir, { recursive: true });
      
      // Backup current file and save new authentic version
      const currentPath = path.join(assetsDir, '0.png');
      const backupPath = path.join(assetsDir, '0_backup.png');
      
      if (fs.existsSync(currentPath)) {
        fs.copyFileSync(currentPath, backupPath);
        console.log('📋 Backed up current image to 0_backup.png');
      }
      
      fs.writeFileSync(currentPath, buffer);
      
      console.log('✅ The Fool now shows authentic cliff-edge imagery with white dog!');
      console.log('🎯 Your tarot app will display proper traditional symbolism.');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Error creating authentic Fool:', error);
    return false;
  }
}

generateAuthenticFool();