import React from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { 
  Home, 
  Book, 
  CircleDashed, 
  LayoutGrid, 
  User, 
  BookOpenText,
  Search,
  Settings,
  BellRing
} from "lucide-react";

/**
 * Bottom navigation component for mobile screens
 * Only displays after user has logged in
 * Version without the purple line
 */
export function NavBottom() {
  const [location] = useLocation();
  const { user } = useAuth();
  
  console.log("NavBottom: User status:", !!user);
  console.log("NavBottom: Current location:", location);
  
  // Always show bottom nav for now (for testing)
  /* 
  if (!user) {
    return null;
  }
  */

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

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black h-16 sm:hidden">
      <nav className="flex h-full max-w-md mx-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex-1 flex flex-col items-center justify-center text-gray-400 transition-colors",
              item.active && "text-white"
            )}
          >
            <item.icon className={cn(
              "h-5 w-5 mb-1",
              item.active ? "text-white" : "text-gray-400"
            )} />
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}