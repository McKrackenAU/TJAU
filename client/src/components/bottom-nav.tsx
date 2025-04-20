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
 */
export function BottomNav() {
  const [location] = useLocation();
  const { user } = useAuth();
  
  console.log("BottomNav: User status:", !!user);
  console.log("BottomNav: Current location:", location);
  
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
    <div 
      className="fixed bottom-0 left-0 right-0 z-50 sm:hidden"
      style={{ 
        backgroundColor: "#000000", 
        height: "64px",
        borderTop: "none",
        borderStyle: "none"
      }}
    >
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
            <item.icon 
              style={{ 
                height: "24px", 
                width: "24px", 
                marginBottom: "4px",
                color: item.active ? "#FFFFFF" : "#9CA3AF"
              }} 
            />
            <span className="text-xs">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}

/**
 * Side navigation component for larger screens
 * Only displays after user has logged in
 */
export function SideNav() {
  const [location] = useLocation();
  const { user } = useAuth();

  // Don't show side nav if user is not logged in
  if (!user) {
    return null;
  }

  // Navigation items configuration (expanded for desktop)
  const navItems = [
    {
      label: "Home",
      href: "/",
      icon: Home,
      active: location === "/"
    },
    {
      label: "Daily Reading",
      href: "/daily",
      icon: CircleDashed,
      active: location === "/daily"
    },
    {
      label: "Tarot Spreads",
      href: "/spreads",
      icon: LayoutGrid,
      active: location === "/spreads"
    },
    {
      label: "Card Library",
      href: "/library",
      icon: BookOpenText,
      active: location === "/library"
    },
    {
      label: "Learning Paths",
      href: "/learning",
      icon: Book,
      active: location === "/learning"
    },
    {
      label: "Angel Numbers",
      href: "/angel-numbers",
      icon: Search,
      active: location === "/angel-numbers"
    },
    {
      label: "Journal",
      href: "/journal",
      icon: BookOpenText,
      active: location === "/journal"
    },
    {
      label: "Account",
      href: "/account",
      icon: User,
      active: location === "/account"
    }
  ];

  // Show admin dashboard link if user is admin
  if (user.isAdmin) {
    navItems.push({
      label: "Admin",
      href: "/admin/dashboard",
      icon: Settings,
      active: location === "/admin/dashboard"
    });
  }

  return (
    <div className="hidden sm:block w-64 border-r border-border h-screen sticky top-0 bg-background">
      <div className="flex flex-col h-full py-6">
        <div className="px-6 mb-8">
          <h2 className="text-2xl font-bold">Tarot Journey</h2>
          <p className="text-muted-foreground text-sm">Spiritual exploration</p>
        </div>
        <nav className="flex-1 space-y-1 px-3">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
                item.active
                  ? "bg-accent text-accent-foreground"
                  : "hover:bg-accent/50 hover:text-accent-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
              {item.label === "Daily Reading" && (
                <div className="ml-auto flex h-2 w-2 rounded-full bg-primary"></div>
              )}
            </Link>
          ))}
        </nav>
        <div className="mt-auto px-3">
          {user.isSubscribed ? (
            <div className="rounded-md bg-primary/10 p-3 mb-4">
              <div className="flex items-center gap-2">
                <BellRing className="h-4 w-4 text-primary" />
                <span className="text-xs font-medium">Premium Active</span>
              </div>
              <p className="text-xs mt-1 text-muted-foreground">
                Your subscription is active. Enjoy all premium features!
              </p>
            </div>
          ) : (
            <Link
              href="/subscribe"
              className="block w-full rounded-md bg-primary px-3 py-2 text-center text-sm font-medium text-primary-foreground mb-4"
            >
              Upgrade to Premium
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}