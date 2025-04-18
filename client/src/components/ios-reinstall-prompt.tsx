import { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useAppVersion } from '@/hooks/use-app-version';

/**
 * This component specifically targets iOS users who have the app installed
 * to guide them through reinstalling the app with the new name.
 */
export default function IosReinstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(true);
  const { isIOS, isInstalled, needsReinstall, markReinstallPromptSeen, currentAppName } = useAppVersion();
  
  const handleClose = () => {
    // Mark that we've shown the prompt
    markReinstallPromptSeen();
    setShowPrompt(false);
  };
  
  // Only show for iOS users who are using the app as PWA and need to reinstall
  if (!isIOS || !isInstalled || !needsReinstall || !showPrompt) return null;
  
  return (
    <AlertDialog open={showPrompt} onOpenChange={setShowPrompt}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>App Name Has Changed</AlertDialogTitle>
          <AlertDialogDescription className="space-y-4">
            <p>
              Our app has been renamed to "Tarot Journey" but iOS doesn't automatically update the name on your home screen.
            </p>
            <p className="font-semibold">To see the new name:</p>
            <ol className="list-decimal pl-5 space-y-1 text-sm">
              <li>Add to Home Screen again (the app will update)</li>
              <li>Remove the old "Tarot Learn" icon from your home screen</li>
            </ol>
            <p className="text-xs text-muted-foreground mt-4">
              This is only needed once. Your data and preferences will be preserved.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleClose}>Got it</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}