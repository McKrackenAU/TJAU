import React, { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { 
  Home, 
  CircleDashed, 
  LayoutGrid, 
  BookOpenText,
  User
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
  
  // Navigation items configuration
  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: Home,
      active: location === "/"
    },
    {
      label: "Daily",
      href: "/daily",
      icon: CircleDashed,
      active: location === "/daily"
    },
    {
      label: "Spreads",
      href: "/spreads",
      icon: LayoutGrid,
      active: location === "/spreads"
    },
    {
      label: "Library",
      href: "/library",
      icon: BookOpenText,
      active: location === "/library"
    },
    {
      label: "Account",
      href: "/account",
      icon: User,
      active: location === "/account"
    }
  ];

  // Debug mode - always show nav bar
  console.log("FixedBottomNav: Debug mode - Always showing nav bar");
  console.log("User status:", !!user);
  console.log("Mobile status:", isMobile);
  
  return (
    <div id="bottom-nav" className="fixed bottom-0 left-0 right-0 z-[9999] bg-red-500 h-16 flex items-center justify-center">
      <nav className="flex w-full max-w-md mx-auto">
        {navItems.map((item) => (
          <Link 
            key={item.href} 
            href={item.href}
            className={`flex-1 flex flex-col items-center justify-center no-underline transition-colors ${item.active ? 'text-white' : 'text-gray-400'}`}
          >
            <item.icon className="w-7 h-7 mb-1" />
            <span className="text-xs font-medium">
              {item.label}
            </span>
          </Link>
        ))}
      </nav>
    </div>
  );
}