import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { 
  Home, 
  CircleDashed, 
  LayoutGrid, 
  BookOpenText,
  User,
  Mic,
  FileText,
  BookHeart,
  Sparkles
} from "lucide-react";

/**
 * A super simplified bottom navigation bar
 */
export function FixedBottomNav() {
  const [location] = useLocation();
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(true);

  // Setup responsive detection
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 640);
    };
    
    // Check initially
    checkIfMobile();
    
    // Setup listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);
  
  // Only show bottom navigation when user is logged in
  if (!user) {
    console.log("FixedBottomNav: User not authenticated, not showing nav");
    return null;
  }
  
  console.log("FixedBottomNav: User authenticated, showing nav bar");
  
  return (
    <div id="bottom-nav" className="fixed bottom-0 left-0 right-0 z-[9999] bg-black h-16 flex items-center justify-center shadow-lg border-t border-gray-800">
      <nav className="flex w-full max-w-md mx-auto overflow-x-auto scrollbar-hide">
        <Link 
          href="/"
          className={`flex-1 flex flex-col items-center justify-center no-underline transition-colors ${location === "/" ? 'text-primary' : 'text-gray-400'}`}
        >
          <Home className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Home</span>
        </Link>
        <Link 
          href="/daily"
          className={`flex-1 flex flex-col items-center justify-center no-underline transition-colors ${location === "/daily" ? 'text-primary' : 'text-gray-400'}`}
        >
          <CircleDashed className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Daily</span>
        </Link>
        <Link 
          href="/spreads"
          className={`flex-1 flex flex-col items-center justify-center no-underline transition-colors ${location === "/spreads" ? 'text-primary' : 'text-gray-400'}`}
        >
          <LayoutGrid className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Spreads</span>
        </Link>
        <Link 
          href="/voice-guided"
          className={`flex-1 flex flex-col items-center justify-center no-underline transition-colors ${location === "/voice-guided" ? 'text-primary' : 'text-gray-400'}`}
        >
          <Mic className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Voice</span>
        </Link>
        <Link 
          href="/journal"
          className={`flex-1 flex flex-col items-center justify-center no-underline transition-colors ${location === "/journal" ? 'text-primary' : 'text-gray-400'}`}
        >
          <FileText className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Journal</span>
        </Link>
        <Link 
          href="/library"
          className={`flex-1 flex flex-col items-center justify-center no-underline transition-colors ${location === "/library" ? 'text-primary' : 'text-gray-400'}`}
        >
          <BookOpenText className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Library</span>
        </Link>
        <Link 
          href="/angel-numbers"
          className={`flex-1 flex flex-col items-center justify-center no-underline transition-colors ${location === "/angel-numbers" ? 'text-primary' : 'text-gray-400'}`}
        >
          <Sparkles className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Angel #</span>
        </Link>
        <Link 
          href="/account"
          className={`flex-1 flex flex-col items-center justify-center no-underline transition-colors ${location === "/account" ? 'text-primary' : 'text-gray-400'}`}
        >
          <User className="w-6 h-6 mb-1" />
          <span className="text-xs font-medium">Account</span>
        </Link>
      </nav>
    </div>
  );
}