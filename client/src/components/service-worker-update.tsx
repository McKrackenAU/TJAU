import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

export default function ServiceWorkerUpdate() {
  const [waitingServiceWorker, setWaitingServiceWorker] = useState<ServiceWorker | null>(null);
  const [showReload, setShowReload] = useState(false);

  // Function to handle service worker updates
  const onServiceWorkerUpdate = (registration: ServiceWorkerRegistration) => {
    // Log that we found an update
    console.log('Service Worker update detected');
    
    // Check if there's a waiting service worker
    if (registration.waiting) {
      // Store the waiting service worker and show the update UI
      setWaitingServiceWorker(registration.waiting);
      setShowReload(true);
    }
  };

  // Function to update the service worker
  const updateServiceWorker = () => {
    if (!waitingServiceWorker) return;
    
    // Send a message to the service worker to skip waiting
    waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
    
    // After sending the message, reload the page to use the new service worker
    setShowReload(false);
    window.location.reload();
  };

  useEffect(() => {
    // Check if the browser supports service workers
    if ('serviceWorker' in navigator) {
      // When the page loads, register the service worker
      window.addEventListener('load', () => {
        // Get the service worker registration
        navigator.serviceWorker.getRegistration().then((registration) => {
          if (!registration) return;
          
          // Set up a listener for service worker updates
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (!newWorker) return;
            
            // Listen for state changes on the new service worker
            newWorker.addEventListener('statechange', () => {
              // If it becomes installed, notify that an update is available
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                onServiceWorkerUpdate(registration);
              }
            });
          });
          
          // Check for updates when the component mounts
          if (registration.waiting) {
            onServiceWorkerUpdate(registration);
          }
        });
        
        // Check for updates now
        navigator.serviceWorker.ready.then(registration => {
          try {
            registration.update();
          } catch (error) {
            console.error('Service worker update failed:', error);
          }
        });
        
        // Set up a periodic check for updates to the service worker (every 60 minutes)
        setInterval(() => {
          navigator.serviceWorker.ready.then(registration => {
            try {
              registration.update();
            } catch (error) {
              console.error('Service worker update failed:', error);
            }
          });
        }, 60 * 60 * 1000);
      });
    }
  }, []);

  // Show a toast notification when an update is available
  useEffect(() => {
    if (showReload) {
      toast({
        title: "App Update Available",
        description: "A new version of Tarot Journey is available. Update now for the latest features and improvements.",
        action: (
          <Button 
            variant="default" 
            onClick={updateServiceWorker} 
            className="bg-primary"
          >
            Update Now
          </Button>
        ),
        duration: 0, // Don't auto-dismiss
      });
    }
  }, [showReload]);

  // The component doesn't render anything visible
  return null;
}