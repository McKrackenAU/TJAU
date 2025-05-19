import path from 'path';
import fs from 'fs';

// Set up cache directory for all services - using a public directory for caching
// This ensures the files will be accessible via the web server
export const CACHE_DIR = path.join(process.cwd(), 'public', 'cache');

// Ensure cache directory exists
try {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
    console.log(`Created cache directory at: ${CACHE_DIR}`);
  }
  
  // Also create images subdirectory
  const imagesCacheDir = path.join(CACHE_DIR, 'images');
  if (!fs.existsSync(imagesCacheDir)) {
    fs.mkdirSync(imagesCacheDir, { recursive: true });
    console.log(`Created images cache directory at: ${imagesCacheDir}`);
  }
} catch (error) {
  console.error('Failed to create cache directory:', error);
}