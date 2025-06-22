import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { tarotCards } from "@shared/tarot-data";
import type { Reading } from "@shared/schema";

export default function History() {
  const { data: readings } = useQuery<Reading[]>({
    queryKey: ["/api/readings"],
  });

  const dailyReadings = readings?.filter(r => r.type === 'daily') ?? [];
  const spreadReadings = readings?.filter(r => r.type === 'spread') ?? [];

  const getCardName = (cardId: string) => {
    return tarotCards.find(c => c.id === cardId)?.name ?? 'Unknown Card';
  };

  const ReadingCard = ({ reading }: { reading: Reading }) => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-base">
          <span>{format(new Date(reading.date), 'PPP')}</span>
          <span className="text-sm text-muted-foreground">
            {reading.spreadType || 'Daily Draw'}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="text-sm text-muted-foreground">
            Cards: {reading.cards.map(getCardName).join(', ')}
          </div>
          {reading.notes && (
            <div className="text-sm mt-2">
              <span className="font-medium">Notes:</span> {reading.notes}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Reading History</h1>

      <Tabs defaultValue="daily" className="max-w-2xl mx-auto">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="daily">Daily Draws</TabsTrigger>
          <TabsTrigger value="spread">Spreads</TabsTrigger>
        </TabsList>

        <TabsContent value="daily">
          <ScrollArea className="h-[calc(100vh-300px)]">
            {dailyReadings.length > 0 ? (
              dailyReadings.map(reading => (
                <ReadingCard key={reading.id} reading={reading} />
              ))
            ) : (
              <p className="text-center text-muted-foreground">
                No daily readings yet. Start your journey with a daily draw!
              </p>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="spread">
          <ScrollArea className="h-[calc(100vh-300px)]">
            {spreadReadings.length > 0 ? (
              spreadReadings.map(reading => (
                <ReadingCard key={reading.id} reading={reading} />
              ))
            ) : (
              <p className="text-center text-muted-foreground">
                No spread readings yet. Try a spread reading to gain deeper insights!
              </p>
            )}
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}
