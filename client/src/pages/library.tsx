import { useState, useEffect } from "react";
import { tarotCards } from "@shared/tarot-data";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";

export default function Library() {
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Handle scrolling to card from URL hash
    const scrollToCard = () => {
      const hash = window.location.hash.slice(1);
      if (hash) {
        const element = document.getElementById(hash);
        if (element) {
          // First scroll into view
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });

          // Then add highlight animation
          element.classList.add('ring-2', 'ring-primary', 'ring-offset-2', 'transition-all', 'duration-500');

          // Remove highlight after animation
          setTimeout(() => {
            element.classList.remove('ring-2', 'ring-primary', 'ring-offset-2');
          }, 2000);
        }
      }
    };

    // Initial scroll
    setTimeout(scrollToCard, 100);

    // Listen for hash changes
    window.addEventListener('hashchange', scrollToCard);
    return () => window.removeEventListener('hashchange', scrollToCard);
  }, []);

  const filteredCards = tarotCards.filter(card => 
    card.name.toLowerCase().includes(search.toLowerCase()) ||
    card.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Card Library</h1>

      <div className="max-w-md mx-auto mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search cards..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <ScrollArea className="h-[calc(100vh-250px)]">
        <div className="grid gap-4 pb-16">
          {filteredCards.map(card => (
            <Card 
              key={card.id} 
              id={card.id} 
              className="transition-all duration-300"
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {card.name}
                  {card.arcana === "minor" && (
                    <span className="text-sm text-muted-foreground">
                      {card.suit}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  {card.description}
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Upright</h4>
                    <ul className="text-sm list-disc list-inside">
                      {card.meanings.upright.map((meaning, i) => (
                        <li key={i}>{meaning}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Reversed</h4>
                    <ul className="text-sm list-disc list-inside">
                      {card.meanings.reversed.map((meaning, i) => (
                        <li key={i}>{meaning}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}