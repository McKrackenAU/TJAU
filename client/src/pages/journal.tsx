import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { tarotCards } from "@shared/tarot-data";
import type { JournalEntry } from "@shared/schema";

export default function Journal() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [mood, setMood] = useState<string>("");
  const [newTag, setNewTag] = useState("");

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: entries } = useQuery<JournalEntry[]>({
    queryKey: ["/api/journal"],
  });

  const mutation = useMutation({
    mutationFn: async (entry: {
      title: string;
      content: string;
      cards?: string[];
      tags: string[];
      mood?: string;
    }) => {
      return apiRequest("POST", "/api/journal", entry);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/journal"] });
      toast({
        title: "Entry saved",
        description: "Your journal entry has been saved successfully."
      });
      // Reset form
      setTitle("");
      setContent("");
      setSelectedCards([]);
      setTags([]);
      setMood("");
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      title,
      content,
      cards: selectedCards.length > 0 ? selectedCards : undefined,
      tags,
      mood: mood || undefined
    });
  };

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && newTag.trim()) {
      e.preventDefault();
      if (!tags.includes(newTag.trim())) {
        setTags([...tags, newTag.trim()]);
      }
      setNewTag("");
    }
  };

  return (
    <div className="container px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Tarot Journal</h1>

      <div className="grid gap-8 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>New Entry</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div>
                <Textarea
                  placeholder="Write your thoughts..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="min-h-[200px]"
                  required
                />
              </div>

              <div>
                <Select
                  value={mood}
                  onValueChange={setMood}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select mood (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="peaceful">Peaceful</SelectItem>
                    <SelectItem value="inspired">Inspired</SelectItem>
                    <SelectItem value="confused">Confused</SelectItem>
                    <SelectItem value="anxious">Anxious</SelectItem>
                    <SelectItem value="grateful">Grateful</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Select
                  value={selectedCards[0] || ""}
                  onValueChange={(value) => setSelectedCards([value])}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Link to a card (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {tarotCards.map(card => (
                      <SelectItem key={card.id} value={card.id}>
                        {card.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Input
                  placeholder="Add tags (press Enter)"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={handleAddTag}
                />
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map(tag => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-primary/10 rounded-full text-sm"
                        onClick={() => setTags(tags.filter(t => t !== tag))}
                      >
                        {tag} ×
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={mutation.isPending}
              >
                Save Entry
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Previous Entries</CardTitle>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-4">
                {entries?.map(entry => (
                  <Card key={entry.id}>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center justify-between">
                        {entry.title}
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(entry.date), 'PPP')}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-line mb-4">{entry.content}</p>
                      {entry.mood && (
                        <p className="text-sm text-muted-foreground mb-2">
                          Mood: {entry.mood}
                        </p>
                      )}
                      {entry.cards && entry.cards.length > 0 && (
                        <p className="text-sm text-muted-foreground mb-2">
                          Cards: {entry.cards.map(id => 
                            tarotCards.find(c => c.id === id)?.name
                          ).join(', ')}
                        </p>
                      )}
                      {entry.tags && entry.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {entry.tags.map(tag => (
                            <span
                              key={tag}
                              className="px-2 py-1 bg-primary/10 rounded-full text-sm"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
