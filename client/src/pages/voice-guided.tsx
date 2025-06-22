import { useState, useEffect } from 'react';
import { TarotCard, tarotCards, spreads } from '@shared/tarot-data';
import { useLocation } from 'wouter';
import VoiceGuidedReading from '@/components/voice-guided-reading';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Mic, Music, ShuffleIcon } from 'lucide-react';
import CardDisplay from '@/components/card-display';
import { useToast } from '@/hooks/use-toast';

export default function VoiceGuidedPage() {
  const [selectedSpread, setSelectedSpread] = useState<string>('daily');
  const [cards, setCards] = useState<(TarotCard & { isReversed?: boolean })[]>([]);
  const [isReadingStarted, setIsReadingStarted] = useState(false);
  const [_, navigate] = useLocation();
  const { toast } = useToast();

  // Reset cards when spread changes
  useEffect(() => {
    setCards([]);
    setIsReadingStarted(false);
  }, [selectedSpread]);

  const generateCards = () => {
    // Create a copy of the tarot cards array
    const deck = [...tarotCards];
    // Shuffle the deck
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    // Get the number of cards for the selected spread
    let numberOfCards = 1; // Default for daily draw
    
    if (selectedSpread === 'past-present-future') {
      numberOfCards = 3;
    } else if (selectedSpread === 'celtic-cross') {
      numberOfCards = 10;
    }

    // Draw the cards (remove random reversal to fix upside-down issue)
    const drawnCards = deck.slice(0, numberOfCards).map(card => ({
      ...card,
      isReversed: false, // Always upright for consistent display
    }));

    setCards(drawnCards);
  };

  const handleReadingComplete = () => {
    toast({
      title: 'Reading Complete',
      description: 'Your voice-guided reading has concluded.',
    });
  };

  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-2">Voice-Guided Tarot Reading</h1>
      <p className="text-muted-foreground mb-6">
        Experience an immersive tarot reading with voice narration and meditation music.
      </p>

      {!isReadingStarted ? (
        <>
          <Tabs defaultValue="daily" value={selectedSpread} onValueChange={setSelectedSpread}>
            <TabsList className="mb-4">
              <TabsTrigger value="daily">Daily Card</TabsTrigger>
              <TabsTrigger value="past-present-future">Past, Present, Future</TabsTrigger>
              <TabsTrigger value="celtic-cross">Celtic Cross</TabsTrigger>
            </TabsList>
            
            <TabsContent value="daily" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Insight</CardTitle>
                  <CardDescription>
                    A single card to provide guidance for your day.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex justify-center">
                  {cards.length > 0 ? (
                    <div className="w-48">
                      <CardDisplay card={cards[0]} isRevealed={true} isReversed={cards[0].isReversed} />
                    </div>
                  ) : (
                    <div className="w-48 h-64 bg-muted rounded-md border border-border flex items-center justify-center">
                      <p className="text-muted-foreground text-center px-4">
                        Draw a card to begin your meditation
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={generateCards}>
                    <ShuffleIcon className="mr-2 h-4 w-4" />
                    {cards.length > 0 ? 'Draw Again' : 'Draw Card'}
                  </Button>
                  <Button 
                    disabled={cards.length === 0} 
                    onClick={() => setIsReadingStarted(true)}
                  >
                    Begin Voice Reading
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="past-present-future" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Past, Present, Future Spread</CardTitle>
                  <CardDescription>
                    Three cards revealing your journey through time.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap justify-center gap-4">
                    {cards.length === 3 ? (
                      cards.map((card, index) => (
                        <div key={index} className="text-center">
                          <CardDisplay 
                            card={card} 
                            isRevealed={true} 
                            isReversed={card.isReversed} 
                          />
                          <p className="mt-2 text-sm font-medium">
                            {['Past', 'Present', 'Future'][index]}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center w-full py-8">
                        <p className="text-muted-foreground">
                          Draw cards to begin your three-card reading
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={generateCards}>
                    <ShuffleIcon className="mr-2 h-4 w-4" />
                    {cards.length > 0 ? 'Draw Again' : 'Draw Cards'}
                  </Button>
                  <Button 
                    disabled={cards.length !== 3} 
                    onClick={() => setIsReadingStarted(true)}
                  >
                    Begin Voice Reading
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="celtic-cross" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Celtic Cross Spread</CardTitle>
                  <CardDescription>
                    A comprehensive 10-card spread for deep insights.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {cards.length === 10 ? (
                    <div className="grid grid-cols-5 gap-2 place-items-center">
                      {cards.map((card, index) => (
                        <div key={index} className="w-20 md:w-24 text-center">
                          <CardDisplay 
                            card={card} 
                            isRevealed={true} 
                            isReversed={card.isReversed} 
                          />
                          <p className="mt-1 text-xs font-medium">
                            Position {index + 1}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center w-full py-8">
                      <p className="text-muted-foreground">
                        Draw cards to begin your Celtic Cross reading
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between">
                  <Button variant="outline" onClick={generateCards}>
                    <ShuffleIcon className="mr-2 h-4 w-4" />
                    {cards.length > 0 ? 'Draw Again' : 'Draw Cards'}
                  </Button>
                  <Button 
                    disabled={cards.length !== 10} 
                    onClick={() => setIsReadingStarted(true)}
                  >
                    Begin Voice Reading
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>

          <div className="mt-6 p-4 bg-muted/50 rounded-lg border border-border">
            <h3 className="text-lg font-medium flex items-center mb-2">
              <Mic className="mr-2 h-4 w-4" /> Voice Narration
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Our voice-guided readings provide a soothing narration that explains each card's meaning and how it relates to your question.
            </p>
            
            <h3 className="text-lg font-medium flex items-center mb-2">
              <Music className="mr-2 h-4 w-4" /> Meditation Music
            </h3>
            <p className="text-sm text-muted-foreground">
              Choose from a variety of calming background music to enhance your tarot experience and achieve deeper insights.
            </p>
          </div>
        </>
      ) : (
        <div>
          <Button 
            variant="outline" 
            className="mb-4" 
            onClick={() => setIsReadingStarted(false)}
          >
            Return to Card Selection
          </Button>
          
          <VoiceGuidedReading 
            cards={cards} 
            spreadType={selectedSpread}
            onComplete={handleReadingComplete}
          />
        </div>
      )}
    </div>
  );
}