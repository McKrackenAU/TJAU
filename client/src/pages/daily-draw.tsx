import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { tarotCards } from "@shared/tarot-data";
import CardDisplay from "@/components/card-display";
import AIInterpretation from "@/components/ai-interpretation";
import MeditationPlayer from "@/components/meditation-player";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

export default function DailyDraw() {
  const [isRevealed, setIsRevealed] = useState(false);
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  const { data: readings } = useQuery({
    queryKey: ["/api/readings/daily"],
  });

  const mutation = useMutation({
    mutationFn: async (reading: { cards: string[], notes: string }) => {
      return apiRequest("POST", "/api/readings", {
        ...reading,
        type: "daily"
      });
    },
    onSuccess: () => {
      toast({
        title: "Reading saved",
        description: "Your daily reading has been saved successfully."
      });
    }
  });

  const todayCard = tarotCards[Math.floor(Math.random() * tarotCards.length)];

  const handleSave = () => {
    mutation.mutate({
      cards: [todayCard.id],
      notes
    });
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Daily Draw</h1>

      <div className="flex justify-center mb-8">
        <CardDisplay 
          card={todayCard}
          isRevealed={isRevealed}
          onClick={() => setIsRevealed(true)}
        />
      </div>

      {isRevealed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>{todayCard.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{todayCard.description}</p>

              <AIInterpretation card={todayCard} />

              <MeditationPlayer card={todayCard} />

              <Textarea
                placeholder="Add your reflections..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="mt-4 mb-4"
              />
              <Button 
                onClick={handleSave}
                disabled={mutation.isPending}
                className="w-full"
              >
                Save Reading
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}