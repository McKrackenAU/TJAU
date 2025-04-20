import React from "react";
import { Link, useLocation } from "wouter";
import { Home, CircleDashed, LayoutGrid, BookOpenText, User } from "lucide-react";

export function SimpleNav() {
  const [location] = useLocation();
  
  console.log("SimpleNav: Current location:", location);
  
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
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black border-t border-gray-800 h-16">
      <nav className="flex h-full max-w-md mx-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex-1 flex flex-col items-center justify-center ${
              item.active ? "text-white" : "text-gray-400"
            } transition-colors`}
          >
            <item.icon className={`h-5 w-5 mb-1 ${
              item.active ? "text-white" : "text-gray-400"
            }`} />
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}