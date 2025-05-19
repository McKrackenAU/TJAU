import path from 'path';
import fs from 'fs';

// Set up cache directory for all services
export const CACHE_DIR = path.join(process.cwd(), 'public', 'cache');
try {
  if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
  }
} catch (error) {
  console.error('Failed to create cache directory:', error);
}