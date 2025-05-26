import { useState, useEffect } from 'react';

const APP_VERSION = '4.0.0'; // Increment this when app name changes or other major updates
const APP_NAME = 'Tarot Journey';
const OLD_APP_NAME = 'Tarot Learn';

interface AppVersion {
  // Current version of the app
  currentVersion: string;
  // If true, the user needs to be prompted to reinstall
  needsReinstall: boolean;
  // If true, the user is on iOS
  isIOS: boolean;
  // If true, the app is installed as a PWA
  isInstalled: boolean;
  // The name that the app is currently using
  currentAppName: string;
  // Mark that user has seen the reinstall prompt
  markReinstallPromptSeen: () => void;
  // Reset the reinstall prompt (for testing)
  resetReinstallPrompt: () => void;
}

export function useAppVersion(): AppVersion {
  const [needsReinstall, setNeedsReinstall] = useState<boolean>(false);
  const [isIOS, setIsIOS] = useState<boolean>(false);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  
  useEffect(() => {
    // Detect iOS
    const iosDevice = navigator.userAgent ? /iPad|iPhone|iPod/.test(navigator.userAgent) : false;
    setIsIOS(iosDevice);
    
    // Check if app is installed as PWA
    const isPWA = window.matchMedia('(display-mode: standalone)').matches || 
                  window.matchMedia('(display-mode: fullscreen)').matches ||
                  (window.navigator as any).standalone === true;
    setIsInstalled(isPWA);
    
    // Get stored version
    const storedVersion = localStorage.getItem('appVersion');
    
    // If on iOS, installed as PWA, and either no version stored or older version
    if (iosDevice && isPWA && (!storedVersion || storedVersion !== APP_VERSION)) {
      // Check if we've already prompted for reinstall for this version
      const reinstallPromptedVersion = localStorage.getItem('iosReinstallPromptedVersion');
      
      // Only prompt if not already prompted for this specific version
      if (reinstallPromptedVersion !== APP_VERSION) {
        setNeedsReinstall(true);
      }
    }
    
    // Store current version
    localStorage.setItem('appVersion', APP_VERSION);
  }, []);
  
  const markReinstallPromptSeen = () => {
    localStorage.setItem('iosReinstallPromptedVersion', APP_VERSION);
    setNeedsReinstall(false);
  };
  
  const resetReinstallPrompt = () => {
    localStorage.removeItem('iosReinstallPromptedVersion');
    localStorage.removeItem('appVersion');
    setNeedsReinstall(true);
  };
  
  return {
    currentVersion: APP_VERSION,
    needsReinstall,
    isIOS,
    isInstalled,
    currentAppName: APP_NAME,
    markReinstallPromptSeen,
    resetReinstallPrompt
  };
}