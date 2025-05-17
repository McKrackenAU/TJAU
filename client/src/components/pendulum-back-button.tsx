import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

type ButtonSize = "default" | "sm" | "lg" | "icon";

type PendulumBackButtonProps = {
  size?: ButtonSize;
  className?: string;
  children?: React.ReactNode;
};

// A special Back to Learning button for the Pendulum course
export function PendulumBackButton({ size = "default", className = "", children }: PendulumBackButtonProps) {
  return (
    <Button 
      variant="secondary"
      size={size}
      className={className}
      onClick={() => {
        // Force a full page navigation to the learning page
        const currentUrl = window.location.href;
        
        // Only redirect if we're in the pendulum course
        if (currentUrl.includes('/learning/5/')) {
          window.location.href = '/learning';
        }
      }}
    >
      <ChevronLeft className="h-4 w-4 mr-2" />
      {children || "Back to Learning"}
    </Button>
  );
}