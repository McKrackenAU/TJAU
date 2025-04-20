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

  // Only show bottom navigation when user is logged in and on mobile
  if (!isMobile || !user) {
    return null;
  }
  
  console.log("FixedBottomNav: User is authenticated and on mobile device, showing nav");
  
  return (
    <div id="bottom-nav" style={{
      position: "fixed",
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 50,
      background: "#000",
      height: "64px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      borderTop: "none"
    }}>
      <nav style={{
        display: "flex",
        width: "100%",
        maxWidth: "500px",
        margin: "0 auto"
      }}>
        {navItems.map((item) => (
          <Link 
            key={item.href} 
            href={item.href}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              color: item.active ? "#fff" : "#9CA3AF",
              textDecoration: "none",
              transition: "color 0.2s"
            }}
          >
            <item.icon style={{ 
              width: "28px", 
              height: "28px", 
              marginBottom: "4px"
            }} />
            <span style={{ 
              fontSize: "12px",
              fontWeight: 500,
            }}>
              {item.label}
            </span>
          </Link>
        ))}
      </nav>
    </div>
  );
}