import { useEffect, useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

/**
 * This component forces users to update the app when there's a version change
 * in the app name or critical application changes
 */
export default function UpdateNotification() {
  const [forceUpdateDialogOpen, setForceUpdateDialogOpen] = useState(false);

  useEffect(() => {
    // Get the local storage version (if any)
    const localVersion = localStorage.getItem('appVersion');
    
    // Current app version
    const currentVersion = "2.0.0"; // Update this when making a major change like renaming
    
    // Check if the app has been renamed
    if (!localVersion || localVersion !== currentVersion) {
      // Show the force update dialog
      setForceUpdateDialogOpen(true);
      
      // Store the new version
      localStorage.setItem('appVersion', currentVersion);
    }
  }, []);

  // Function to handle the update action
  const handleUpdate = () => {
    // Check if there's a service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistration().then(registration => {
        if (registration && registration.waiting) {
          // Send a message to the service worker to skip waiting
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
        
        // Reload the page to apply the update
        window.location.reload();
      });
    } else {
      // If no service worker, just reload
      window.location.reload();
    }
    
    // Close the dialog
    setForceUpdateDialogOpen(false);
  };

  return (
    <AlertDialog open={forceUpdateDialogOpen} onOpenChange={setForceUpdateDialogOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>App Update Required</AlertDialogTitle>
          <AlertDialogDescription>
            Tarot Journey has been updated with important changes. Please update to the latest version for the best experience.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleUpdate}>Update Now</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}