import sharp from 'sharp';
import path from 'path';

async function createAppIcon() {
  try {
    console.log('Creating app icon PNG...');
    
    const outputPath = path.resolve('generated-icon.png');
    
    // Create a solid purple square with rounded corners
    await sharp({
      create: {
        width: 1024,
        height: 1024,
        channels: 4,
        background: { r: 108, g: 67, b: 188, alpha: 1 } // #6c43bc
      }
    })
    .composite([
      {
        // Add a darker center circle
        input: Buffer.from(
          `<svg width="1024" height="1024">
            <circle cx="512" cy="512" r="350" fill="#5532a8"/>
            <circle cx="512" cy="512" r="300" fill="#4a2b96"/>
            
            <!-- Star/moon symbol -->
            <path d="M512 220 L530 320 L630 320 L550 380 L580 480 L512 420 L444 480 L474 380 L394 320 L494 320 Z" fill="#ffffff"/>
            <path d="M512 520 C440 520 380 580 380 650 C380 720 440 780 512 780 C550 780 584 762 607 735 C590 742 571 746 550 746 C479 746 420 687 420 616 C420 545 479 486 550 486 C571 486 590 490 607 497 C584 470 550 452 512 452 Z" fill="#ffffff"/>
          </svg>`
        ),
        gravity: 'center'
      }
    ])
    .png()
    .toFile(outputPath);
    
    console.log(`PNG file created: ${outputPath}`);
  } catch (error) {
    console.error('Error creating app icon:', error);
  }
}

createAppIcon();