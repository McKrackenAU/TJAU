import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export default function InstallBanner() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState<boolean>(false);
  const [isIOSDevice, setIsIOSDevice] = useState<boolean>(false);

  useEffect(() => {
    // Check if it's an iOS device
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    setIsIOSDevice(isIOS);

    // Handle the beforeinstallprompt event (for Android)
    const beforeInstallPromptHandler = (e: Event) => {
      // Prevent Chrome 67 and earlier from automatically showing the prompt
      e.preventDefault();
      // Store the event so it can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', beforeInstallPromptHandler);

    // Check if the app is already installed
    const isAppInstalled = window.matchMedia('(display-mode: standalone)').matches;
    if (isAppInstalled) {
      setShowBanner(false);
    } else if (isIOS) {
      // On iOS, check if we've previously shown the banner to avoid repeated displays
      const iosBannerDismissed = localStorage.getItem('iosBannerDismissed');
      if (!iosBannerDismissed) {
        setShowBanner(true);
      }
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', beforeInstallPromptHandler);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt && !isIOSDevice) return;

    if (deferredPrompt) {
      // Show the install prompt for Android
      deferredPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const choiceResult = await deferredPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      
      // Clear the saved prompt since it can't be used twice
      setDeferredPrompt(null);
    }
    
    // Hide the banner regardless of outcome
    setShowBanner(false);
  };

  const dismissBanner = () => {
    setShowBanner(false);
    
    // For iOS devices, save the dismissal in localStorage
    if (isIOSDevice) {
      localStorage.setItem('iosBannerDismissed', 'true');
    }
  };

  if (!showBanner) return null;

  return (
    <Alert className="fixed bottom-20 left-0 right-0 mx-4 z-50 bg-background shadow-lg border-primary/50">
      <div className="flex items-center justify-between">
        <AlertDescription className="flex-1">
          {isIOSDevice ? (
            <div className="space-y-2">
              <p>Install this app on your iPhone for a better experience!</p>
              <ol className="text-xs space-y-1 text-muted-foreground">
                <li>1. Tap the share button <span className="font-mono">□↑</span></li>
                <li>2. Scroll down and tap "Add to Home Screen"</li>
              </ol>
            </div>
          ) : (
            <p>Install this app for a better experience!</p>
          )}
        </AlertDescription>
        
        <div className="flex gap-2 items-center">
          {!isIOSDevice && (
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
  );
}