import { Home, Sun, BookOpen, Layout, History, GraduationCap, PenTool, Compass, CreditCard, Mic, ShieldAlert, User, MoreHorizontal, Hash, LogOut, Loader2 } from "lucide-react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";

// Main navigation items that will always be visible
const mainNavItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Sun, label: "Daily", href: "/daily" },
  { icon: Layout, label: "Spreads", href: "/spreads" },
  { icon: Mic, label: "Voice", href: "/voice-guided" },
  { icon: History, label: "History", href: "/history" },
  { icon: BookOpen, label: "Library", href: "/library" },
];

// Items that can be moved to the "More" dropdown if needed
const secondaryNavItems = [
  { icon: GraduationCap, label: "Study", href: "/study" },
  { icon: PenTool, label: "Journal", href: "/journal" },
  { icon: Compass, label: "Learn", href: "/learning" },
  { icon: Hash, label: "Angel Numbers", href: "/angel-numbers" },
];

export default function BottomNav() {
  const [location, navigate] = useLocation();
  const { user, logoutMutation } = useAuth();
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const moreMenuRef = useRef<HTMLDivElement>(null);
  
  // Only render the navigation bar when user is logged in
  if (!user) return null;
  
  // Account-related items that will be in the "More" dropdown if user is logged in
  const accountItems = [
    { icon: User, label: "Account", href: "/account" },
    { icon: CreditCard, label: "Subscribe", href: "/subscribe" },
    ...(user.isAdmin ? [{ icon: ShieldAlert, label: "Admin", href: "/admin/dashboard" }] : [])
  ];

  // Combined secondary and account items for the More dropdown
  const moreItems = [...secondaryNavItems, ...accountItems];
  
  // Close the dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target as Node)) {
        setShowMoreMenu(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50">
      <div className="flex justify-around items-center h-12 w-full py-1">
        {/* Main navigation items */}
        {mainNavItems.map(({ icon: Icon, label, href }) => (
          <Link key={href} href={href}>
            <div className={`flex items-center justify-center ${
              location === href ? "text-primary" : "text-muted-foreground"
            }`}>
              <div className="flex flex-col items-center">
                <Icon className="h-5 w-5" />
                <span className="text-[10px] mt-1 font-medium">{label}</span>
              </div>
            </div>
          </Link>
        ))}
        
        {/* More button */}
        <div className="relative" ref={moreMenuRef}>
          <div 
            className={`flex items-center justify-center cursor-pointer ${
              showMoreMenu ? "text-primary" : "text-muted-foreground"
            }`}
            onClick={() => setShowMoreMenu(!showMoreMenu)}
          >
            <div className="flex flex-col items-center">
              <MoreHorizontal className="h-5 w-5" />
              <span className="text-[10px] mt-1 font-medium">More</span>
            </div>
          </div>
          
          {/* Dropdown menu */}
          {showMoreMenu && (
            <div className="absolute bottom-16 right-0 w-48 py-2 bg-background rounded-md shadow-lg border border-border z-10">
              {moreItems.map(({ icon: Icon, label, href }) => (
                <Link key={href} href={href}>
                  <div 
                    className={`flex items-center gap-3 px-4 py-2 hover:bg-accent ${
                      location === href ? "text-primary" : "text-foreground"
                    }`}
                    onClick={() => setShowMoreMenu(false)}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </div>
                </Link>
              ))}
              
              {/* Logout button */}
              <div className="mt-2 pt-2 border-t border-border px-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full flex items-center gap-2 justify-start text-destructive hover:text-destructive" 
                  onClick={async () => {
                    setShowMoreMenu(false);
                    await logoutMutation.mutateAsync();
                    navigate('/auth');
                  }}
                  disabled={logoutMutation.isPending}
                >
                  {logoutMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <LogOut className="h-4 w-4" />
                  )}
                  <span>Sign Out</span>
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}