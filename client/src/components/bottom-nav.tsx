import { Home, Sun, BookOpen, Layout, History, GraduationCap, PenTool, Compass, CreditCard, Mic } from "lucide-react";
import { useLocation, Link } from "wouter";
import { useAuth } from "@/hooks/use-auth";

const baseNavItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Sun, label: "Daily", href: "/daily" },
  { icon: Layout, label: "Spreads", href: "/spreads" },
  { icon: Mic, label: "Voice", href: "/voice-guided" },
  { icon: History, label: "History", href: "/history" },
  { icon: GraduationCap, label: "Study", href: "/study" },
  { icon: PenTool, label: "Journal", href: "/journal" },
  { icon: BookOpen, label: "Library", href: "/library" },
  { icon: Compass, label: "Learn", href: "/learning" },
];

export default function BottomNav() {
  const [location] = useLocation();
  const { user } = useAuth();
  
  const navItems = [...baseNavItems];
  
  // Add subscription link if user is logged in
  if (user) {
    navItems.push({ icon: CreditCard, label: "Subscribe", href: "/subscribe" });
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border h-16">
      <div className={`grid ${user ? 'grid-cols-10' : 'grid-cols-9'} h-full max-w-lg mx-auto`}>
        {navItems.map(({ icon: Icon, label, href }) => (
          <Link key={href} href={href}>
            <div className={`flex flex-col items-center justify-center gap-1 ${
              location === href ? "text-primary" : "text-muted-foreground"
            }`}>
              <Icon className="h-5 w-5" />
              <span className="text-xs">{label}</span>
            </div>
          </Link>
        ))}
      </div>
    </nav>
  );
}