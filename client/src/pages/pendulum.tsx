import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, Book, ArrowRight } from "lucide-react";
import type { LearningTrack, UserProgress } from "@shared/schema";

export default function PendulumPage() {
  const [_, setLocation] = useLocation();
  
  // Fetch the Pendulum track (ID 5)
  const { data: track, isLoading: trackLoading } = useQuery<LearningTrack>({
    queryKey: ["/api/learning/tracks/5"],
  });
  
  // Fetch the user's progress for this track
  const { data: progress, isLoading: progressLoading } = useQuery<UserProgress>({
    queryKey: ["/api/learning/progress/5"],
    retry: false,
  });
  
  // Calculate progress percentage
  const progressPercentage = progress && track
    ? (progress.completedLessons.length / track.requiredCards.length) * 100
    : 0;
  
  // Map of pendulum card IDs to lesson IDs and display names
  const pendulumLessons = [
    { cardId: 'pendulum-intro', lessonId: 'pendulum-1-1', name: 'Introduction to Pendulum Dowsing' },
    { cardId: 'pendulum-types', lessonId: 'pendulum-1-2', name: 'Types of Pendulums' },
    { cardId: 'pendulum-cleansing', lessonId: 'pendulum-2-1', name: 'Cleansing & Activation' },
    { cardId: 'pendulum-alignment', lessonId: 'pendulum-2-2', name: 'Energy Alignment' },
    { cardId: 'pendulum-communication', lessonId: 'pendulum-3-1', name: 'Establishing Communication' },
    { cardId: 'pendulum-questions', lessonId: 'pendulum-3-2', name: 'Asking Effective Questions' },
    { cardId: 'pendulum-decisions', lessonId: 'pendulum-4-1', name: 'Decision Making with Pendulums' },
    { cardId: 'pendulum-spiritual', lessonId: 'pendulum-4-2', name: 'Spiritual Development' },
  ];
  
  if (trackLoading || progressLoading) {
    return (
      <div className="w-full max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Pendulum Dowsing</h1>
        <div className="grid grid-cols-1 gap-6 animate-pulse">
          <Card>
            <CardContent className="h-40" />
          </Card>
          <Card>
            <CardContent className="h-40" />
          </Card>
        </div>
      </div>
    );
  }
  
  const currentCardId = progress && progress.currentLesson && track 
    ? track.requiredCards[progress.currentLesson - 1] 
    : null;
    
  // Find the current lesson details
  const currentLesson = currentCardId 
    ? pendulumLessons.find(lesson => lesson.cardId === currentCardId) 
    : null;
  
  return (
    <div className="w-full max-w-4xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setLocation("/learning")}
            className="mr-2"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Learning
          </Button>
          <h1 className="text-3xl font-bold">Pendulum Dowsing Mastery</h1>
        </div>
        <Badge variant="outline" className="px-3 py-1">
          <Book className="h-4 w-4 mr-2" />
          Divination
        </Badge>
      </div>
      
      {track && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>{track.name}</CardTitle>
            <CardDescription>{track.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Progress</span>
                  <span>{Math.round(progressPercentage)}%</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </div>
              
              {currentLesson && (
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">Current Lesson</h3>
                  <div className="bg-card border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-muted-foreground">
                        Lesson {progress?.currentLesson} of {pendulumLessons.length}
                      </span>
                      {progress?.completedLessons.includes(currentCardId || "") && (
                        <Badge variant="secondary">Completed</Badge>
                      )}
                    </div>
                    <p className="font-medium mb-4">{currentLesson.name}</p>
                    <Button 
                      className="w-full"
                      onClick={() => {
                        if (currentLesson) {
                          setLocation(`/learning/5/${currentLesson.lessonId}`);
                        }
                      }}
                    >
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Continue Learning
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
      
      <h2 className="text-xl font-bold mb-4">Pendulum Dowsing Lessons</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pendulumLessons.map((lesson, index) => {
          const isCompleted = progress?.completedLessons.includes(lesson.cardId);
          const isCurrent = currentCardId === lesson.cardId;
          
          return (
            <Card 
              key={lesson.cardId} 
              className={`
                transition-all duration-200 
                ${isCurrent ? 'ring-2 ring-primary' : ''}
                ${isCompleted ? 'bg-muted/40' : ''}
              `}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-base">
                    {index + 1}. {lesson.name}
                  </CardTitle>
                  {isCompleted && <Badge variant="secondary">Completed</Badge>}
                </div>
              </CardHeader>
              <CardContent>
                <Button 
                  className="w-full mt-2"
                  variant={isCurrent ? "default" : "outline"}
                  onClick={() => setLocation(`/learning/5/${lesson.lessonId}`)}
                >
                  {isCompleted ? "Review Lesson" : isCurrent ? "Continue" : "Start Lesson"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}