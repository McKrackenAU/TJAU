import React from 'react';
import BottomNav from './bottom-nav';

type AppLayoutProps = {
  children: React.ReactNode;
  header?: React.ReactNode;
};

export default function AppLayout({ children, header }: AppLayoutProps) {
  return (
    <div className="flex flex-col min-h-screen">
      {/* App header with safe area spacing for notch */}
      {header && (
        <header 
          className="sticky top-0 w-full bg-background border-b border-border z-40"
          style={{ paddingTop: 'env(safe-area-inset-top, 0)' }}
        >
          <div className="h-10 flex items-center px-4">
            {header}
          </div>
        </header>
      )}

      {/* Main content area */}
      <main className="flex-1">
        {children}
      </main>

      {/* Bottom navigation */}
      <BottomNav />
    </div>
  );
}