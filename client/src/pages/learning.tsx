import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { LearningTrack, UserProgress, QuizResult } from "@shared/schema";
import { GraduationCap, Trophy, Book, Brain } from "lucide-react";

export default function Learning() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const { data: tracks } = useQuery<LearningTrack[]>({
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
      queryClient.invalidateQueries({ queryKey: ["/api/learning/progress"] });
      toast({
        title: "Track started",
        description: "Your learning journey has begun!"
      });
    }
  });

  const TrackCard = ({ track }: { track: LearningTrack }) => {
    const { data: progress } = useQuery<UserProgress>({
      queryKey: ["/api/learning/progress", track.id],
    });

    const progressPercentage = progress
      ? (progress.completedLessons.length / track.requiredCards.length) * 100
      : 0;

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
          <div className="space-y-4">
            {progress ? (
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>{Math.round(progressPercentage)}%</span>
                </div>
                <div className="h-2 bg-secondary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${progressPercentage}%` }}
                  />
                </div>
                {progress.achievements.length > 0 && (
                  <div className="flex gap-1 mt-4">
                    {progress.achievements.map((achievement, i) => (
                      <Trophy key={i} className="h-4 w-4 text-yellow-500" />
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Button
                className="w-full"
                onClick={() => startTrackMutation.mutate(track.id)}
                disabled={startTrackMutation.isPending}
              >
                Start Track
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

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
