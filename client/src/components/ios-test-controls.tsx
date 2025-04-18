import { useState, useEffect } from 'react';
import { useAppVersion } from '@/hooks/use-app-version';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Settings } from 'lucide-react';

/**
 * A hidden component for testing PWA functionality, especially on iOS
 * Only shown when a special keyboard combination is pressed
 */
export default function IosTestControls() {
  const [showControls, setShowControls] = useState(false);
  const { isIOS, isInstalled, needsReinstall, currentVersion, resetReinstallPrompt } = useAppVersion();
  
  // Listen for the key combination (Shift + Alt + I) to show the test controls
  // This is intentionally not documented for end users
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.shiftKey && e.altKey && e.key === 'I') {
        setShowControls(prev => !prev);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });
  
  if (!showControls) return null;
  
  return (
    <div className="fixed bottom-4 right-4 z-50">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-full bg-background shadow-md">
            <Settings className="h-5 w-5" />
            <span className="sr-only">PWA Test Controls</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>PWA Test Controls</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem className="flex flex-col items-start gap-1">
            <span className="text-xs font-medium">Device: {isIOS ? 'iOS' : 'Non-iOS'}</span>
            <span className="text-xs font-medium">Installed: {isInstalled ? 'Yes' : 'No'}</span>
            <span className="text-xs font-medium">Version: {currentVersion}</span>
            <span className="text-xs font-medium">Needs Reinstall: {needsReinstall ? 'Yes' : 'No'}</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem
            onClick={() => {
              resetReinstallPrompt();
              localStorage.setItem('appVersion', '1.0.0'); // Force old version
              window.location.reload();
            }}
          >
            Trigger Reinstall Prompt
          </DropdownMenuItem>
          
          <DropdownMenuItem
            onClick={() => {
              caches.keys().then(cacheNames => {
                return Promise.all(
                  cacheNames.map(cacheName => {
                    return caches.delete(cacheName);
                  })
                );
              }).then(() => {
                localStorage.clear();
                window.location.reload();
              });
            }}
          >
            Clear All Cache & Storage
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}