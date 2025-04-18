import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Share } from "lucide-react";

/**
 * A visual guide that shows iOS users how to reinstall the app with the new name
 */
export default function IosReinstallGuide() {
  const [open, setOpen] = useState(false);
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="mt-2">
          <Share className="h-4 w-4 mr-2" />
          See how to reinstall
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>How to reinstall on iOS</DialogTitle>
          <DialogDescription>
            Follow these steps to update the app name on your home screen
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex flex-col gap-6">
            <div className="rounded-lg border overflow-hidden">
              <div className="bg-muted p-2 text-center text-sm font-medium">
                Step 1: Tap the share icon
              </div>
              <div className="p-6 flex justify-center">
                <div className="bg-gray-100 p-4 rounded-full">
                  <Share className="h-10 w-10 text-blue-500" />
                </div>
              </div>
            </div>
            
            <div className="rounded-lg border overflow-hidden">
              <div className="bg-muted p-2 text-center text-sm font-medium">
                Step 2: Select "Add to Home Screen"
              </div>
              <div className="p-4 flex flex-col gap-2">
                <div className="flex items-center gap-3 p-2 rounded border">
                  <div className="p-1 rounded bg-gray-100">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect width="20" height="20" rx="4" fill="#F3F4F6"/>
                      <path d="M10 4V16M4 10H16" stroke="#111827" strokeWidth="2" strokeLinecap="round"/>
                    </svg>
                  </div>
                  <span>Add to Home Screen</span>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg border overflow-hidden">
              <div className="bg-muted p-2 text-center text-sm font-medium">
                Step 3: Confirm adding "Tarot Journey"
              </div>
              <div className="p-4 flex items-center justify-center">
                <Button className="w-32" size="sm">
                  <Check className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>
            
            <div className="rounded-lg border overflow-hidden">
              <div className="bg-muted p-2 text-center text-sm font-medium">
                Step 4: Delete the old app icon
              </div>
              <div className="p-4 flex justify-center">
                <div className="relative">
                  <div className="h-16 w-16 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-800 text-xs font-medium">
                    Tarot Learn
                  </div>
                  <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-red-500 text-white flex items-center justify-center text-xs">
                    ✕
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-amber-50 p-3 rounded-md text-amber-800 text-sm">
          <p>Your progress and data will be preserved after reinstalling.</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}