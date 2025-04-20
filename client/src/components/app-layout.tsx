import React from "react";
import { BottomNav, SideNav } from "@/components/bottom-nav";
import { useAuth } from "@/hooks/use-auth";
import { isNativeApp } from "@/services/app-store-payments";

interface AppLayoutProps {
  children: React.ReactNode;
}

/**
 * Main application layout component
 * 
 * Provides:
 * - Side navigation for desktop
 * - Bottom navigation for mobile
 * - Responsive container for content
 * - Special handling for native app environment
 */
export function AppLayout({ children }: AppLayoutProps) {
  const { user } = useAuth();
  const [isNativeEnvironment, setIsNativeEnvironment] = React.useState(false);
  
  // Check if running in a native app environment
  React.useEffect(() => {
    setIsNativeEnvironment(isNativeApp());
  }, []);
  
  return (
    <div className="flex min-h-screen bg-background">
      {/* Side navigation for desktop */}
      <SideNav />
      
      {/* Main content area */}
      <div className="flex-1">
        {/* Add top spacing for native app status bar if needed */}
        {isNativeEnvironment && (
          <div className="h-6 bg-primary" /> // Status bar space for mobile
        )}
        
        {/* Main content with appropriate padding */}
        <main className={`flex-1 px-4 sm:px-6 md:px-8 pb-20 sm:pb-6 ${user ? "pt-4" : "pt-0"}`}>
          {children}
        </main>
      </div>
      
      {/* Bottom navigation for mobile */}
      <BottomNav />
    </div>
  );
}

/**
 * Authentication page layout without navigation
 * Used for login, registration, and other public pages
 */
export function AuthLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}

/**
 * Special layout for native app onboarding and subscription pages
 */
export function NativeAppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Status bar space for mobile */}
      <div className="h-6 bg-primary" />
      
      {/* Content with appropriate padding */}
      <main className="flex-1 px-4 py-4">
        {children}
      </main>
    </div>
  );
}