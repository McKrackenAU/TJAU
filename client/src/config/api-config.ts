/**
 * API Configuration for Mobile and Web
 * Ensures proper API endpoints for different environments
 */

// Detect if running in mobile app context
const isMobile = window.location.protocol === 'capacitor:' || 
                 window.location.protocol === 'file:' ||
                 (window as any).Capacitor;

// Production API base URL
const PRODUCTION_API_BASE = 'https://tarotjourney.au';

// Development API base URL (for when testing locally)
const DEVELOPMENT_API_BASE = import.meta.env.DEV ? 
  `${window.location.protocol}//${window.location.host}` : 
  PRODUCTION_API_BASE;

// API Configuration
export const API_CONFIG = {
  baseURL: isMobile ? PRODUCTION_API_BASE : DEVELOPMENT_API_BASE,
  apiURL: isMobile ? `${PRODUCTION_API_BASE}/api` : `${DEVELOPMENT_API_BASE}/api`,
  socketURL: isMobile ? PRODUCTION_API_BASE : DEVELOPMENT_API_BASE,
  isMobile,
  timeout: 30000, // 30 second timeout for mobile
};

console.log('API Configuration:', {
  isMobile: API_CONFIG.isMobile,
  baseURL: API_CONFIG.baseURL,
  apiURL: API_CONFIG.apiURL
});