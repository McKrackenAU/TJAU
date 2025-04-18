import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/hooks/use-auth';

export default function InstallBanner(): JSX.Element | null {
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [isIOSDevice, setIsIOSDevice] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  
  useEffect(() => {
    try {
      // Check if the app is already installed (works for all platforms)
      const checkIfInstalled = () => {
        // Method 1: Check display-mode
        if (window.matchMedia('(display-mode: standalone)').matches || 
            window.matchMedia('(display-mode: fullscreen)').matches || 
            window.matchMedia('(display-mode: minimal-ui)').matches) {
          return true;
        }
        
        // Method 2: Check navigator.standalone (iOS)
        if ((window.navigator as any).standalone === true) {
          return true;
        }
        
        // Method 3: Check localStorage flag (set by us when installed)
        if (localStorage.getItem('appInstalled') === 'true') {
          return true;
        }
        
        return false;
      };
      
      // Check if this is iOS device and set state
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      setIsIOSDevice(isIOS);
      
      // For iOS, if we've prompted for reinstall, always show the banner again
      // This helps iOS users reinstall the app to get the name update
      if (isIOS && localStorage.getItem('iosReinstallPrompted') === 'true') {
        setShowBanner(true);
        return;
      }
      
      // Don't show banner if app is installed for non-iOS or iOS that hasn't seen reinstall prompt
      if (checkIfInstalled()) {
        setShowBanner(false);
        return;
      }
      
      // For iOS, check for permanent dismissal (using same isIOS variable from above)
      if (isIOS) {
        const iosBannerDismissed = localStorage.getItem('iosBannerDismissed');
        if (!iosBannerDismissed) {
          setShowBanner(true);
        }
      }
      
      // Handle the beforeinstallprompt event (for Android/Chrome)
      const handleBeforeInstallPrompt = (e: any) => {
        // Prevent Chrome from automatically showing the prompt
        e.preventDefault();
        // Save the event for later use
        setDeferredPrompt(e);
        
        // Only show if not permanently dismissed
        const bannerDismissed = localStorage.getItem('bannerDismissed');
        if (!bannerDismissed) {
          setShowBanner(true);
        }
      };

      // Listen for app install event
      const handleAppInstalled = () => {
        // Mark as installed in localStorage
        localStorage.setItem('appInstalled', 'true');
        setShowBanner(false);
        console.log('App was installed');
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);
      
      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
      };
    } catch (error) {
      console.error('Error in install banner:', error);
      return;
    }
  }, []);
  
  const handleInstallClick = async () => {
    try {
      if (deferredPrompt) {
        // Show the install prompt
        deferredPrompt.prompt();
        
        // Wait for the user to respond
        const result = await deferredPrompt.userChoice;
        console.log(`User ${result.outcome} the install prompt`);
        
        if (result.outcome === 'accepted') {
          // Mark as installed
          localStorage.setItem('appInstalled', 'true');
        }
        
        // Reset the deferred prompt
        setDeferredPrompt(null);
        setShowBanner(false);
      }
    } catch (error) {
      console.error('Error showing install prompt:', error);
    }
  };
  
  const dismissBanner = () => {
    setShowBanner(false);
    
    // Save permanent dismissal based on device type
    if (isIOSDevice) {
      localStorage.setItem('iosBannerDismissed', 'true');
    } else {
      localStorage.setItem('bannerDismissed', 'true');
    }
  };
  
  // Don't render if the banner shouldn't be shown
  if (!showBanner) return null;
  
  // Get the user state to adjust positioning
  const { user } = useAuth();
  
  // Position banner at the bottom with different spacing depending on whether 
  // bottom nav is visible (user is logged in)
  const bannerPosition = user ? "bottom-20" : "bottom-4";
  
  return (
    <div className={`fixed ${bannerPosition} left-0 right-0 mx-4 z-50`}>
      <Alert className="bg-background shadow-lg border-primary/50">
        <div className="flex items-center justify-between">
          <AlertDescription className="flex-1">
            {isIOSDevice ? (
              <div className="space-y-1">
                {localStorage.getItem('iosReinstallPrompted') === 'true' ? (
                  <>
                    <p className="font-semibold">Important: Reinstall to update the app name</p>
                    <p className="text-xs text-muted-foreground">The app has been renamed to "Tarot Journey"</p>
                  </>
                ) : (
                  <p>Install Tarot Journey on your iPhone for a better experience!</p>
                )}
                {localStorage.getItem('iosReinstallPrompted') !== 'true' && (
                  <ol className="text-xs text-muted-foreground">
                    <li>1. Tap the share button</li>
                    <li>2. Select "Add to Home Screen"</li>
                  </ol>
                )}
              </div>
            ) : (
              <p>Install Tarot Journey for a better experience!</p>
            )}
          </AlertDescription>
          
          <div className="flex gap-2 items-center">
            {isIOSDevice && localStorage.getItem('iosReinstallPrompted') === 'true' ? (
              // Special action for iOS reinstall
              <Button
                variant="default"
                size="sm"
                onClick={() => {
                  // Reset the prompt to show the detailed instructions again
                  localStorage.removeItem('iosReinstallPrompted');
                  setShowBanner(false);
                  
                  // Small delay to ensure the state updates before showing the prompt
                  setTimeout(() => {
                    // This will trigger the iOS reinstall prompt to show again
                    localStorage.setItem('appVersion', '1.0.0');
                  }, 500);
                }}
                className="whitespace-nowrap"
              >
                View Steps
              </Button>
            ) : !isIOSDevice && deferredPrompt && (
              // Default install button for non-iOS
              <Button
                variant="default"
                size="sm"
                onClick={handleInstallClick}
                className="whitespace-nowrap"
              >
                Install Now
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={dismissBanner}
              className="h-8 w-8 shrink-0"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Dismiss</span>
            </Button>
          </div>
        </div>
      </Alert>
    </div>
  );
}