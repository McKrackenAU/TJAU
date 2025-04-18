import { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useAppVersion } from '@/hooks/use-app-version';
import IosReinstallGuide from '@/components/ios-reinstall-guide';

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
              Our app has been renamed from <span className="font-semibold">Tarot Learn</span> to <span className="font-semibold">Tarot Journey</span>, but iOS doesn't automatically update the name on your home screen.
            </p>
            <p className="font-semibold">To update to the new name:</p>
            <ol className="list-decimal pl-5 space-y-2 text-sm">
              <li className="font-semibold">Tap the share icon <span className="inline-block w-5 h-5 text-center rounded-md bg-gray-100">⎙</span> at the bottom of your browser</li>
              <li className="font-semibold">Select "Add to Home Screen"</li>
              <li className="font-semibold">Confirm adding "Tarot Journey" to your home screen</li>
              <li className="font-semibold">Delete the old "Tarot Learn" icon from your home screen</li>
            </ol>
            <div className="bg-amber-50 p-3 rounded-md mt-3 text-amber-800 text-sm">
              <p className="font-semibold">Important:</p>
              <p>This is the <u>only way</u> to update the app name on iOS. Your data and preferences will be preserved.</p>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction onClick={handleClose}>Got it</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}