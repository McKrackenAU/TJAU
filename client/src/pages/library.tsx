import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { tarotCards } from "@shared/tarot-data";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Lock, Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { adminState } from "@/lib/admin";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CardCombinationAnalysis from "@/components/card-combination-analysis";
import CardDisplay from "@/components/card-display";

// Define a type for the card structure
interface TarotCard {
  id: string;
  name: string;
  description: string;
  meanings: {
    upright: string[];
    reversed: string[];
  };
  arcana?: string;
  suit?: string;
}

export default function Library() {
  const [search, setSearch] = useState("");
  const { toast } = useToast();
  const [isImporting, setIsImporting] = useState(false);
  const [isAdmin, setAdmin] = useState(adminState.isAdmin());
  const queryClient = useQueryClient();

  // Fetch all cards
  const { data: cards, isLoading } = useQuery<TarotCard[]>({
    queryKey: ["/api/cards"],
    // Initialize with built-in cards
    initialData: tarotCards,
    staleTime: 0, // Always refetch to get latest imported cards
  });

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

  const filteredCards = cards?.filter(card =>
    card.name.toLowerCase().includes(search.toLowerCase()) ||
    (card.description && card.description.toLowerCase().includes(search.toLowerCase())) ||
    card.meanings.upright.some(meaning =>
      meaning.toLowerCase().includes(search.toLowerCase())
    ) ||
    card.meanings.reversed.some(meaning =>
      meaning.toLowerCase().includes(search.toLowerCase())
    )
  ) || [];

  console.log("Total cards:", cards?.length);
  console.log("Filtered cards:", filteredCards.length);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file extension
    const fileExtension = file.name.split('.').pop()?.toLowerCase();
    if (fileExtension !== 'xlsx' && fileExtension !== 'xls') {
      toast({
        title: "Invalid file type",
        description: "Please upload an Excel file (.xlsx or .xls)",
        variant: "destructive"
      });
      return;
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload a file smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    try {
      setIsImporting(true);
      const formData = new FormData();
      formData.append('file', file);

      // Request admin token if not already set
      let adminToken = adminState.getAdminToken();
      if (!adminToken) {
        const granted = await adminState.requestAdminToken();
        if (!granted) {
          throw new Error("Admin token required for importing cards");
        }
        adminToken = adminState.getAdminToken();
      }

      if (!adminToken) {
        throw new Error("Admin access required");
      }

      console.log("Starting file upload...");
      const response = await fetch('/api/admin/import-cards', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        },
        body: formData
      });

      console.log("Upload response status:", response.status);
      const data = await response.json();
      console.log("Upload response data:", data);

      if (!response.ok) {
        // If authentication fails, clear the token
        if (response.status === 403) {
          adminState.clearAdminToken();
          setAdmin(false);
        }
        throw new Error(data.error || data.details || 'Import failed');
      }

      toast({
        title: "Import successful",
        description: data.message
      });
    } catch (error) {
      console.error('Import error:', error);
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: "destructive"
      });
    } finally {
      setIsImporting(false);
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  const handleAdminLogin = async () => {
    const success = await adminState.requestAdminToken();
    if (success) {
      setAdmin(true);
      toast({
        title: "Admin access granted",
        description: "You now have access to admin features."
      });
    }
  };

  const uploadImageMutation = useMutation({
    mutationFn: async ({ cardId, file }: { cardId: string; file: File }) => {
      const formData = new FormData();
      formData.append('image', file);

      const adminToken = adminState.getAdminToken();
      if (!adminToken) {
        throw new Error("Admin access required");
      }

      const response = await fetch(`/api/admin/upload-card-image/${cardId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/cards"] });
      toast({
        title: "Image uploaded",
        description: "Card image has been updated successfully."
      });
    },
    onError: (error) => {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive"
      });
    }
  });

  const handleImageUpload = async (cardId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast({
        title: "Invalid file type",
        description: "Please upload a JPEG, PNG, or WebP image",
        variant: "destructive"
      });
      return;
    }

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive"
      });
      return;
    }

    try {
      await uploadImageMutation.mutateAsync({ cardId, file });
    } catch (error) {
      console.error('Image upload error:', error);
    } finally {
      // Reset the file input
      if (event.target) {
        event.target.value = '';
      }
    }
  };

  return (
    <div className="container px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Card Library</h1>

      <Tabs defaultValue="browse" className="max-w-4xl mx-auto">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="browse">Browse Cards</TabsTrigger>
          <TabsTrigger value="analyze">Analyze Combinations</TabsTrigger>
        </TabsList>

        <TabsContent value="browse">
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
            {isAdmin ? (
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
            ) : (
              <Button
                variant="outline"
                size="icon"
                onClick={handleAdminLogin}
                title="Enter admin mode"
              >
                <Lock className="h-4 w-4" />
              </Button>
            )}
          </div>

          <ScrollArea className="h-[calc(100vh-350px)]">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <div className="grid gap-4 pb-16">
                {filteredCards.map(card => (
                  <Card
                    key={card.id}
                    id={card.id}
                    className="transition-all duration-300"
                  >
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>{card.name}</span>
                        {card.arcana === "minor" && card.suit && (
                          <span className="text-sm text-muted-foreground">
                            {card.suit}
                          </span>
                        )}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="aspect-[2/3] relative">
                          <CardDisplay card={card} isRevealed={true} />
                          {isAdmin && (
                            <div className="absolute top-2 right-2">
                              <input
                                type="file"
                                accept=".jpg,.jpeg,.png,.webp"
                                onChange={(e) => handleImageUpload(card.id, e)}
                                className="hidden"
                                id={`image-upload-${card.id}`}
                              />
                              <Button
                                variant="secondary"
                                size="sm"
                                className="flex gap-2 items-center"
                                onClick={() => document.getElementById(`image-upload-${card.id}`)?.click()}
                              >
                                <Upload className="h-4 w-4" />
                                Upload Image
                              </Button>
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground mb-4">
                            {card.description}
                          </p>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h4 className="font-semibold mb-2">Upright</h4>
                              <ul className="text-sm list-disc list-inside">
                                {card.meanings?.upright?.map((meaning, i) => (
                                  <li key={i}>{meaning}</li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="font-semibold mb-2">Reversed</h4>
                              <ul className="text-sm list-disc list-inside">
                                {card.meanings?.reversed?.map((meaning, i) => (
                                  <li key={i}>{meaning}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="analyze">
          <div className="max-w-4xl mx-auto">
            <p className="text-muted-foreground text-center mb-8">
              Select multiple cards to analyze their combined meanings and interactions
            </p>
            <CardCombinationAnalysis />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}