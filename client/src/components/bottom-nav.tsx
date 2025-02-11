import { Home, Sun, BookOpen, Layout, History } from "lucide-react";
import { useLocation, Link } from "wouter";

const navItems = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Sun, label: "Daily", href: "/daily" },
  { icon: Layout, label: "Spreads", href: "/spreads" },
  { icon: History, label: "History", href: "/history" },
  { icon: BookOpen, label: "Library", href: "/library" },
];

export default function BottomNav() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-background border-t border-border h-16">
      <div className="grid grid-cols-5 h-full max-w-md mx-auto">
        {navItems.map(({ icon: Icon, label, href }) => (
          <Link key={href} href={href}>
            <a className={`flex flex-col items-center justify-center gap-1 ${
              location === href ? "text-primary" : "text-muted-foreground"
            }`}>
              <Icon className="h-5 w-5" />
              <span className="text-xs">{label}</span>
            </a>
          </Link>
        ))}
      </div>
    </nav>
  );
}