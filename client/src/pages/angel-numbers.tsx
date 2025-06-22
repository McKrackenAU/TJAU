import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, Link } from "wouter";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Search } from "lucide-react";
import type { AngelNumber } from "@shared/schema";

export default function AngelNumbersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();
  const [_, navigate] = useLocation();

  const { data: angelNumbers, isLoading, error } = useQuery<AngelNumber[]>({
    queryKey: ["/api/angel-numbers"],
  });

  // Filter angel numbers based on search term
  const filteredAngelNumbers = angelNumbers?.filter((angelNumber) => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      angelNumber.number.toLowerCase().includes(searchLower) ||
      angelNumber.name.toLowerCase().includes(searchLower) ||
      angelNumber.meaning.toLowerCase().includes(searchLower)
    );
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // The filtering happens automatically via the filteredAngelNumbers
  };

  if (isLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-8">Angel Numbers Library</h1>
        <p>Loading angel numbers...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-8 text-center">
        <h1 className="text-3xl font-bold mb-8">Angel Numbers Library</h1>
        <p className="text-red-500">Error loading angel numbers. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-2">Angel Numbers Library</h1>
      <p className="text-center text-muted-foreground mb-8">
        Discover the spiritual meanings behind angel numbers and their divine guidance
      </p>

      {/* Search Box */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex w-full max-w-md mx-auto gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search angel numbers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button type="submit">Search</Button>
        </form>
      </div>

      {/* Angel Numbers Grid */}
      <Tabs defaultValue="grid" className="w-full">
        <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="list">List View</TabsTrigger>
        </TabsList>
        
        <TabsContent value="grid" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAngelNumbers?.map((angelNumber) => (
              <Card 
                key={angelNumber.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/angel-numbers/${angelNumber.number}`)}
              >
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{angelNumber.number}</span>
                    <span className="text-sm font-normal text-muted-foreground">{angelNumber.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="line-clamp-3">{angelNumber.meaning}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="ghost" size="sm" className="ml-auto">
                    View Details
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
          
          {filteredAngelNumbers?.length === 0 && (
            <p className="text-center mt-8 text-muted-foreground">
              No angel numbers found matching your search.
            </p>
          )}
        </TabsContent>
        
        <TabsContent value="list" className="mt-6">
          <ScrollArea className="h-[600px] rounded-md border p-4">
            {filteredAngelNumbers?.map((angelNumber, index) => (
              <div key={angelNumber.id}>
                <div 
                  className="py-4 cursor-pointer hover:bg-muted/50 px-2 rounded"
                  onClick={() => navigate(`/angel-numbers/${angelNumber.number}`)}
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold">{angelNumber.number}</h3>
                    <span className="text-sm text-muted-foreground">{angelNumber.name}</span>
                  </div>
                  <p className="mt-2 line-clamp-2">{angelNumber.meaning}</p>
                  <Button 
                    variant="link" 
                    className="px-0 mt-1" 
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/angel-numbers/${angelNumber.number}`);
                    }}
                  >
                    View Details
                  </Button>
                </div>
                {index < filteredAngelNumbers.length - 1 && <Separator />}
              </div>
            ))}
            
            {filteredAngelNumbers?.length === 0 && (
              <p className="text-center mt-8 text-muted-foreground">
                No angel numbers found matching your search.
              </p>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}