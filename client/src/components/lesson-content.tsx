import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import CardDisplay from "@/components/card-display";
import AIInterpretation from "@/components/ai-interpretation";
import { tarotCards } from "@shared/tarot-data";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, BookOpen, ArrowLeft, ArrowRight, Brain } from "lucide-react";

// Define the lesson content type
export interface LessonContent {
  id: string;
  title: string;
  description: string;
  sections: {
    title: string;
    content: string;
  }[];
  exercises: {
    question: string;
    options: string[];
    correctAnswer: number;
    explanation: string;
  }[];
  cardId: string;
  additionalResources?: {
    title: string;
    url?: string;
    description: string;
  }[];
  summary: string;
}

interface LessonContentProps {
  lesson: LessonContent;
  lessonNumber: number;
  totalLessons: number;
  trackId: number;
  onComplete: () => void;
  onBack?: () => void;
  onNext?: () => void;
  isCompleted: boolean;
  prevCardName?: string | null;
  nextCardName?: string | null;
}

export function LessonContent({
  lesson,
  lessonNumber,
  totalLessons,
  trackId,
  onComplete,
  onBack,
  onNext,
  isCompleted,
  prevCardName,
  nextCardName
}: LessonContentProps) {
  const [activeTab, setActiveTab] = useState("content");
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const card = tarotCards.find(c => c.id === lesson.cardId);
  
  const markLessonCompleteMutation = useMutation({
    mutationFn: async () => {
      // Get current progress
      const response = await apiRequest("GET", `/api/learning/progress/${trackId}`);
      const currentProgress = await response.json();
      
      // Add the card to completed lessons if not already there
      if (!currentProgress.completedLessons.includes(lesson.cardId)) {
        const completedLessons = [...currentProgress.completedLessons, lesson.cardId];
        
        // Calculate next lesson
        let nextLesson = currentProgress.currentLesson;
        const trackResponse = await apiRequest("GET", `/api/learning/tracks/${trackId}`);
        const track = await trackResponse.json();
        
        if (nextLesson < track.requiredCards.length) {
          nextLesson = nextLesson + 1;
        }
        
        // Update progress
        return apiRequest("PATCH", `/api/learning/progress/${currentProgress.id}`, {
          completedLessons,
          currentLesson: nextLesson
        });
      }
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/learning/progress/${trackId}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/learning/tracks"] });
      onComplete();
      toast({
        title: "Lesson Complete!",
        description: "You've successfully completed this lesson.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to mark lesson as complete. Please try again.",
        variant: "destructive",
      });
    },
  });
  
  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[questionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };
  
  const handleSubmitQuiz = () => {
    // Check if all questions have been answered
    if (selectedAnswers.length !== lesson.exercises.length) {
      toast({
        title: "Incomplete",
        description: "Please answer all questions before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    // Calculate score
    let correctCount = 0;
    
    selectedAnswers.forEach((answer, index) => {
      if (answer === lesson.exercises[index].correctAnswer) {
        correctCount++;
      }
    });
    
    const finalScore = correctCount / lesson.exercises.length;
    setScore(finalScore);
    setShowResults(true);
    
    // If score is above 70%, mark as complete
    if (finalScore >= 0.7) {
      if (!isCompleted) {
        markLessonCompleteMutation.mutate();
      }
    } else {
      toast({
        title: "Try Again",
        description: "Review the lesson content and try the quiz again to complete this lesson.",
      });
    }
  };
  
  const resetQuiz = () => {
    setSelectedAnswers([]);
    setShowResults(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <Badge variant="outline" className="mb-2">
            Lesson {lessonNumber} of {totalLessons}
          </Badge>
          <h2 className="text-2xl font-bold">{lesson.title}</h2>
          <p className="text-white">{lesson.description}</p>
        </div>
        
        {isCompleted && (
          <Badge className="bg-green-500 hover:bg-green-600">
            <CheckCircle className="h-4 w-4 mr-1" />
            Completed
          </Badge>
        )}
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-3 mb-4">
          <TabsTrigger value="content">
            <BookOpen className="h-4 w-4 mr-2" />
            Lesson
          </TabsTrigger>
          <TabsTrigger value="card">
            <BookOpen className="h-4 w-4 mr-2" />
            Card Study
          </TabsTrigger>
          <TabsTrigger value="quiz">
            <Brain className="h-4 w-4 mr-2" />
            Exercises
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="content" className="space-y-6">
          <ScrollArea className="h-[500px] rounded-md border p-4">
            {lesson.sections.map((section, index) => (
              <div key={index} className="mb-6">
                <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
                <div 
                  className="prose prose-sm prose-invert max-w-none prose-headings:font-semibold prose-headings:my-4 prose-h2:text-lg prose-h3:text-base prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-1 text-white" 
                  dangerouslySetInnerHTML={{ __html: section.content }}
                />
              </div>
            ))}
            
            <div className="mt-8 p-4 bg-muted rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Summary</h3>
              <p>{lesson.summary}</p>
            </div>
            
            {lesson.additionalResources && lesson.additionalResources.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-2">Additional Resources</h3>
                <ul className="space-y-2">
                  {lesson.additionalResources.map((resource, index) => (
                    <li key={index} className="p-3 border rounded-lg">
                      <h4 className="font-medium">{resource.title}</h4>
                      <p className="text-sm text-white">{resource.description}</p>
                      <a 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          alert(`Resource: ${resource.title}\n\n${resource.description}\n\nThis resource will be available in a future update.`);
                        }}
                        className="text-sm text-primary hover:underline mt-1 inline-block"
                      >
                        Learn more →
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </ScrollArea>
          
          <div className="flex justify-between">
            {onBack && (
              <Button variant="outline" onClick={onBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                {prevCardName ? `Previous: ${prevCardName}` : `Previous Lesson`}
              </Button>
            )}
            {onNext && (
              <Button onClick={onNext} className="ml-auto">
                {nextCardName ? `Next: ${nextCardName}` : `Next Lesson`}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="card">
          {card ? (
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex justify-center">
                <CardDisplay card={card} isRevealed={true} />
              </div>
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>{card.name}</CardTitle>
                    <CardDescription className="text-white">
                      {card.arcana === "major" ? "Major Arcana" : `${card.suit} - Minor Arcana`}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">{card.description}</p>
                    
                    <div className="space-y-2">
                      <h4 className="font-medium">Upright Meanings:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {card.meanings.upright.map((meaning, i) => (
                          <li key={i} className="text-sm">{meaning}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="space-y-2 mt-4">
                      <h4 className="font-medium">Reversed Meanings:</h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {card.meanings.reversed.map((meaning, i) => (
                          <li key={i} className="text-sm">{meaning}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>AI Interpretation</CardTitle>
                    <CardDescription className="text-white">
                      Deeper insights into the {card.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AIInterpretation card={card} context={`In the context of ${lesson.title}`} />
                  </CardContent>
                </Card>
              </div>
            </div>
          ) : (
            <div className="text-center p-8">
              <p className="text-white">Card not found.</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="quiz">
          <Card>
            <CardHeader>
              <CardTitle>Knowledge Check</CardTitle>
              <CardDescription className="text-white">
                Test your understanding of the {lesson.title} lesson.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {showResults ? (
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-bold mb-2">
                      Your Score: {Math.round(score * 100)}%
                    </h3>
                    <p className="text-white mb-4">
                      {score >= 0.7 
                        ? "Congratulations! You've passed this lesson's exercises."
                        : "Review the lesson content and try again."}
                    </p>
                    <Progress 
                      value={score * 100} 
                      className={`h-2 w-full max-w-md mx-auto ${score >= 0.7 ? "bg-green-500" : "bg-amber-500"}`}
                    />
                  </div>
                  
                  <div className="space-y-4 mt-6">
                    {lesson.exercises.map((exercise, index) => (
                      <div 
                        key={index} 
                        className={`p-4 border rounded-lg ${
                          selectedAnswers[index] === exercise.correctAnswer
                            ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                            : "border-red-500 bg-red-50 dark:bg-red-950/20"
                        }`}
                      >
                        <h4 className="font-medium mb-2">{index + 1}. {exercise.question}</h4>
                        <div className="grid gap-2">
                          {exercise.options.map((option, optIndex) => (
                            <div
                              key={optIndex}
                              className={`p-2 rounded text-sm ${
                                optIndex === exercise.correctAnswer
                                  ? "bg-green-100 dark:bg-green-900/30 border border-green-500"
                                  : selectedAnswers[index] === optIndex
                                  ? "bg-red-100 dark:bg-red-900/30 border border-red-500"
                                  : "bg-gray-100 dark:bg-gray-800"
                              }`}
                            >
                              {option}
                            </div>
                          ))}
                        </div>
                        <p className="text-sm mt-2">
                          <span className="font-medium">Explanation:</span> {exercise.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between mt-6">
                    <Button variant="outline" onClick={resetQuiz}>
                      Try Again
                    </Button>
                    {score >= 0.7 && onNext && (
                      <Button onClick={onNext}>
                        {nextCardName ? `Next: ${nextCardName}` : `Next Lesson`}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {lesson.exercises.map((exercise, index) => (
                    <div key={index} className="border p-4 rounded-lg space-y-4">
                      <h4 className="font-medium">{index + 1}. {exercise.question}</h4>
                      <div className="grid gap-2">
                        {exercise.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className={`p-3 rounded border cursor-pointer ${
                              selectedAnswers[index] === optIndex
                                ? "border-primary bg-primary/10"
                                : "border-border hover:border-primary/50"
                            }`}
                            onClick={() => handleAnswerSelect(index, optIndex)}
                          >
                            {option}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                  
                  <Button onClick={handleSubmitQuiz} className="w-full">
                    Submit Answers
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}