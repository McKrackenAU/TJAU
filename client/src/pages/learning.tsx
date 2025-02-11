import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/learning/tracks"] });
      queryClient.invalidateQueries({ queryKey: ["/api/learning/progress"] });
      toast({
        title: "Track started",
        description: "Your learning journey has begun!"
      });
    }
  });

  const TrackCard = ({ track }: { track: LearningTrack }) => {
    const { data: progress, isLoading: progressLoading } = useQuery<UserProgress>({
      queryKey: ["/api/learning/progress", track.id],
    });

    const progressPercentage = progress
      ? (progress.completedLessons.length / track.requiredCards.length) * 100
      : 0;

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
                        window.location.href = `/library#${track.requiredCards[progress.currentLesson - 1]}`;
                      }}
                    >
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Continue Learning
                    </Button>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-2">
                  {track.requiredCards.map((cardId, index) => {
                    const card = tarotCards.find(c => c.id === cardId);
                    return (
                      <div
                        key={cardId}
                        className={`p-3 rounded-lg border ${
                          progress.completedLessons.includes(cardId)
                            ? "bg-primary/10 border-primary"
                            : index + 1 === progress.currentLesson
                            ? "bg-card border-primary border-dashed"
                            : "bg-muted/50 border-border"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Lesson {index + 1}</span>
                          {progress.completedLessons.includes(cardId) && (
                            <GraduationCap className="h-4 w-4 text-primary" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {card?.name}
                        </p>
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