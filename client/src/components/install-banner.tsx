import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Simplified version to avoid potential runtime errors
export default function InstallBanner(): JSX.Element | null {
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [isIOSDevice, setIsIOSDevice] = useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  
  // Use a simpler effect to avoid potential issues
  useEffect(() => {
    try {
      // Check if it's an iOS device
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      setIsIOSDevice(isIOS);
      
      // Only show the banner for iOS initially
      if (isIOS) {
        const iosBannerDismissed = localStorage.getItem('iosBannerDismissed');
        if (!iosBannerDismissed) {
          setShowBanner(true);
        }
      }
      
      // Handle the beforeinstallprompt event (for Android)
      const handleBeforeInstallPrompt = (e: any) => {
        // Prevent Chrome from automatically showing the prompt
        e.preventDefault();
        // Save the event for later use
        setDeferredPrompt(e);
        setShowBanner(true);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      
      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
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
    if (isIOSDevice) {
      localStorage.setItem('iosBannerDismissed', 'true');
    }
  };
  
  if (!showBanner) return null;
  
  return (
    <div className="fixed bottom-20 left-0 right-0 mx-4 z-50">
      <Alert className="bg-background shadow-lg border-primary/50">
        <div className="flex items-center justify-between">
          <AlertDescription className="flex-1">
            {isIOSDevice ? (
              <div className="space-y-1">
                <p>Install this app on your iPhone for a better experience!</p>
                <ol className="text-xs text-muted-foreground">
                  <li>1. Tap the share button</li>
                  <li>2. Select "Add to Home Screen"</li>
                </ol>
              </div>
            ) : (
              <p>Install this app for a better experience!</p>
            )}
          </AlertDescription>
          
          <div className="flex gap-2 items-center">
            {!isIOSDevice && deferredPrompt && (
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