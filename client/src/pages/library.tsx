import { useState, useEffect } from "react";
import { tarotCards } from "@shared/tarot-data";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function Library() {
  const [search, setSearch] = useState("");
  const { toast } = useToast();
  const [isImporting, setIsImporting] = useState(false);

  useEffect(() => {
    const scrollToCard = () => {
      const hash = window.location.hash.slice(1);
      if (hash) {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          element.classList.add('ring-2', 'ring-primary', 'ring-offset-2', 'transition-all', 'duration-500');
          setTimeout(() => {
            element.classList.remove('ring-2', 'ring-primary', 'ring-offset-2');
          }, 2000);
        }
      }
    };

    setTimeout(scrollToCard, 100);
    window.addEventListener('hashchange', scrollToCard);
    return () => window.removeEventListener('hashchange', scrollToCard);
  }, []);

  const filteredCards = tarotCards.filter(card =>
    card.name.toLowerCase().includes(search.toLowerCase()) ||
    card.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an Excel file (.xlsx or .xls)",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsImporting(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/import-cards', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Import successful",
          description: data.message
        });
      } else {
        throw new Error(data.error || 'Import failed');
      }
    } catch (error) {
      toast({
        title: "Import failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
      event.target.value = '';
    }
  };

  return (
    <div className="container px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Card Library</h1>

      <div className="max-w-md mx-auto mb-8 flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search cards..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="relative">
          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
            id="card-import"
            disabled={isImporting}
          />
          <Button
            variant="outline"
            onClick={() => document.getElementById('card-import')?.click()}
            disabled={isImporting}
          >
            {isImporting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Importing...
              </>
            ) : (
              'Import Cards'
            )}
          </Button>
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