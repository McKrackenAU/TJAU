import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { LearningTrack, UserProgress, QuizResult } from "@shared/schema";
import { GraduationCap, Trophy, Book, Brain, ArrowRight } from "lucide-react";
import { tarotCards } from "@shared/tarot-data";

export default function Learning() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [_, setLocation] = useLocation();

  const { data: tracks, isLoading: tracksLoading } = useQuery<LearningTrack[]>({
    queryKey: ["/api/learning/tracks"],
  });

  const { data: recentQuizzes } = useQuery<QuizResult[]>({
    queryKey: ["/api/learning/recent-quiz-results"],
  });

  const startTrackMutation = useMutation({
    mutationFn: async (trackId: number) => {
      return apiRequest("POST", "/api/learning/progress", {
        trackId,
        completedLessons: [],
        achievements: [],
        currentLesson: 1
      });
    },
    onSuccess: (_, trackId) => {
      // Invalidate both queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ["/api/learning/tracks"] });
      queryClient.invalidateQueries({ queryKey: [`/api/learning/progress/${trackId}`] });
      toast({
        title: "Track started",
        description: "Your learning journey has begun!"
      });
    }
  });

  const TrackCard = ({ track }: { track: LearningTrack }) => {
    const { data: progress, isLoading: progressLoading } = useQuery<UserProgress>({
      queryKey: [`/api/learning/progress/${track.id}`],
      enabled: !!track.id,
      retry: false,
    });

    const progressPercentage = progress
      ? (progress.completedLessons.length / track.requiredCards.length) * 100
      : 0;

    const handleContinueLearning = () => {
      const currentCardId = track.requiredCards[progress?.currentLesson - 1];
      if (currentCardId) {
        setLocation(`/library#${currentCardId}`);
      }
    };

    if (progressLoading) {
      return (
        <Card className="animate-pulse">
          <CardContent className="h-40" />
        </Card>
      );
    }

    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>{track.name}</CardTitle>
            <Badge variant={
              track.difficulty === "beginner" ? "default" :
              track.difficulty === "intermediate" ? "secondary" :
              "destructive"
            }>
              {track.difficulty}
            </Badge>
          </div>
          <CardDescription>{track.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {progress ? (
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>{Math.round(progressPercentage)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>

              {progress.achievements.length > 0 && (
                <div className="flex gap-2 items-center">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm text-muted-foreground">
                    {progress.achievements.length} Achievement{progress.achievements.length !== 1 && 's'}
                  </span>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="font-medium text-lg">Current Lesson</h3>
                {progress.currentLesson <= track.requiredCards.length && (
                  <div className="bg-card border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">
                        Lesson {progress.currentLesson} of {track.requiredCards.length}
                      </span>
                      {progress.completedLessons.includes(track.requiredCards[progress.currentLesson - 1]) && (
                        <Badge variant="secondary">
                          <GraduationCap className="h-4 w-4 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                    <p className="font-medium mb-4">
                      {tarotCards.find(c => c.id === track.requiredCards[progress.currentLesson - 1])?.name}
                    </p>
                    <Button 
                      className="w-full"
                      onClick={() => {
                        // Get the lessons for this track
                        const trackId = track.id;
                        const lessonId = progress.currentLesson <= track.requiredCards.length 
                          ? trackId === 1 ? `beginner-${progress.currentLesson}` 
                            : trackId === 2 ? `minor-${progress.currentLesson}`
                            : trackId === 10 ? `intuitive-${progress.currentLesson}`
                            : `advanced-${progress.currentLesson}`
                          : null;
                        
                        if (lessonId) {
                          setLocation(`/learning/${trackId}/${lessonId}`);
                        } else {
                          // Fallback to old behavior if we can't determine the lesson
                          handleContinueLearning();
                        }
                      }}
                    >
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Continue Learning
                    </Button>
                  </div>
                )}

                <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-1">
                  {track.requiredCards.map((cardId, index) => {
                    // Try to find card by exact ID
                    let card = tarotCards.find(c => c.id === cardId);
                    
                    // If not found, try to match major arcana name to ID
                    if (!card && track.id === 1) {
                      // Map beginner's journey card names to numeric IDs
                      const majorArcanaMap: Record<string, string> = {
                        "fool": "0", "magician": "1", "high-priestess": "2", "empress": "3", 
                        "emperor": "4", "hierophant": "5", "lovers": "6", "chariot": "7", 
                        "strength": "8", "hermit": "9", "wheel-of-fortune": "10", "justice": "11",
                        "hanged-man": "12", "death": "13", "temperance": "14", "devil": "15",
                        "tower": "16", "star": "17", "moon": "18", "sun": "19",
                        "judgement": "20", "world": "21"
                      };
                      
                      if (majorArcanaMap[cardId]) {
                        card = tarotCards.find(c => c.id === majorArcanaMap[cardId]);
                      }
                    }
                    
                    // If still no card found, create a placeholder with the ID as name
                    const displayCard = card || { 
                      name: cardId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') 
                    };
                    
                    return (
                      <div
                        key={cardId}
                        className={`p-2 rounded-lg border cursor-pointer hover:bg-muted/80 ${
                          progress.completedLessons.includes(cardId)
                            ? "bg-primary/10 border-primary"
                            : index + 1 === progress.currentLesson
                            ? "bg-card border-primary border-dashed"
                            : "bg-muted/50 border-border"
                        }`}
                        onClick={() => {
                          const trackId = track.id;
                          const lessonId = trackId === 1 ? `beginner-${index + 1}` 
                            : trackId === 2 ? `minor-${index + 1}`
                            : trackId === 10 ? `intuitive-${index + 1}`
                            : `advanced-${index + 1}`;
                          console.log(`Navigating to /learning/${trackId}/${lessonId} for card ${cardId}`);
                          setLocation(`/learning/${trackId}/${lessonId}`);
                        }}
                      >
                        <div className="flex flex-col items-center text-center">
                          <div className="flex flex-col items-center justify-center mb-1">
                            <div className="flex items-center">
                              {progress.completedLessons.includes(cardId) && (
                                <GraduationCap className="h-3 w-3 text-primary mr-1" />
                              )}
                              <span className="text-xs font-medium">{index + 1}</span>
                            </div>
                            <span className="text-xs text-muted-foreground truncate w-full text-center mt-1" title={displayCard.name}>
                              {displayCard.name}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                <p className="text-sm text-muted-foreground">
                  {track.requiredCards.length} lessons to complete
                </p>
              </div>
              <Button
                className="w-full"
                onClick={() => startTrackMutation.mutate(track.id)}
                disabled={startTrackMutation.isPending}
              >
                Start Track
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  if (tracksLoading) {
    return (
      <div className="container px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Learning Paths</h1>
        <div className="grid gap-8">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardContent className="h-40" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Learning Paths</h1>

      <div className="grid gap-8">
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Book className="h-5 w-5" />
            <h2 className="text-xl font-semibold">Available Tracks</h2>
          </div>
          <div className="grid gap-4">
            {tracks?.map(track => (
              <TrackCard key={track.id} track={track} />
            ))}
          </div>
        </section>

        {recentQuizzes && recentQuizzes.length > 0 && (
          <section>
            <div className="flex items-center gap-2 mb-4">
              <Brain className="h-5 w-5" />
              <h2 className="text-xl font-semibold">Recent Quiz Results</h2>
            </div>
            <ScrollArea className="h-[300px]">
              <div className="grid gap-4">
                {recentQuizzes.map(quiz => (
                  <Card key={quiz.id}>
                    <CardContent className="pt-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium">
                            Score: {quiz.score}/{quiz.totalQuestions}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Difficulty: {quiz.difficulty}
                          </p>
                        </div>
                        <Badge variant={
                          quiz.score / quiz.totalQuestions >= 0.8 ? "default" :
                          quiz.score / quiz.totalQuestions >= 0.6 ? "secondary" :
                          "destructive"
                        }>
                          {Math.round((quiz.score / quiz.totalQuestions) * 100)}%
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </section>
        )}
      </div>
    </div>
  );
}