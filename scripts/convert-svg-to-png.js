import { createConverter } from 'convert-svg-to-png';
import path from 'path';
import fs from 'fs';

async function convertSvgToPng() {
  const converter = createConverter();
  
  try {
    console.log('Converting SVG to PNG...');
    
    const inputPath = path.resolve('generated-icon.svg');
    const outputPath = path.resolve('generated-icon.png');
    
    // Read the SVG file
    if (!fs.existsSync(inputPath)) {
      console.error(`SVG file not found: ${inputPath}`);
      process.exit(1);
    }
    
    // Convert SVG to PNG with 1024x1024 dimensions
    const png = await converter.convertFile(inputPath, {
      width: 1024,
      height: 1024,
      outputFilePath: outputPath
    });
    
    console.log(`PNG file created: ${outputPath}`);
  } catch (error) {
    console.error('Error converting SVG to PNG:', error);
  } finally {
    await converter.destroy();
  }
}

convertSvgToPng();