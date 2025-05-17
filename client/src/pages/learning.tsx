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
      // If progress exists and has a currentLesson, get the corresponding card
      if (progress && progress.currentLesson) {
        const currentCardId = track.requiredCards[progress.currentLesson - 1];
        if (currentCardId) {
          setLocation(`/library#${currentCardId}`);
        }
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
                        
                        if (progress && progress.currentLesson) {
                          // Get the current card ID based on progress
                          const currentCardId = track.requiredCards[progress.currentLesson - 1];
                          
                          if (currentCardId) {
                            // Use standard approach for most tracks, but special handling for Intuitive Reading
                            let lessonId;
                            
                            if (trackId === 1) {
                              lessonId = `beginner-${progress.currentLesson}`;
                            } else if (trackId === 2) {
                              lessonId = `minor-${progress.currentLesson}`;
                            } else if (trackId === 10) {
                              // For Intuitive Reading track, we need special mapping
                              const suitCode = currentCardId.charAt(0);
                              const rank = currentCardId.substring(1);
                              
                              if (suitCode === 'c') {
                                // Cups
                                if (rank === '1') lessonId = 'intuitive-1';
                                else if (rank === '2') lessonId = 'intuitive-2';
                                else if (rank === '3') lessonId = 'intuitive-3';
                                else if (rank === '4') lessonId = 'intuitive-4';
                                else if (rank === '5') lessonId = 'intuitive-5';
                                else if (rank === '6') lessonId = 'intuitive-6';
                                else if (rank === '7') lessonId = 'intuitive-7';
                                else if (rank === '8') lessonId = 'intuitive-8';
                                else if (rank === '9') lessonId = 'intuitive-9';
                                else if (rank === '10') lessonId = 'intuitive-10';
                                else if (rank === 'p') lessonId = 'intuitive-11';
                                else if (rank === 'n') lessonId = 'intuitive-12';
                                else if (rank === 'q') lessonId = 'intuitive-13';
                                else if (rank === 'k') lessonId = 'intuitive-14';
                              } else if (suitCode === 'w') {
                                // Wands
                                if (rank >= '1' && rank <= '10') {
                                  lessonId = `intuitive-${parseInt(rank) + 14}`;
                                } else if (rank === 'p') {
                                  lessonId = 'intuitive-25';
                                } else if (rank === 'n') {
                                  lessonId = 'intuitive-26';
                                } else if (rank === 'q') {
                                  lessonId = 'intuitive-27';
                                } else if (rank === 'k') {
                                  lessonId = 'intuitive-28';
                                }
                              } else if (suitCode === 'p') {
                                // Pentacles
                                if (rank >= '1' && rank <= '10') {
                                  lessonId = `intuitive-${parseInt(rank) + 28}`;
                                } else if (rank === 'p') {
                                  lessonId = 'intuitive-39';
                                } else if (rank === 'n') {
                                  lessonId = 'intuitive-40';
                                } else if (rank === 'q') {
                                  lessonId = 'intuitive-41';
                                } else if (rank === 'k') {
                                  lessonId = 'intuitive-42';
                                }
                              } else if (suitCode === 's') {
                                // Swords
                                if (rank >= '1' && rank <= '10') {
                                  lessonId = `intuitive-${parseInt(rank) + 42}`;
                                } else if (rank === 'p') {
                                  lessonId = 'intuitive-53';
                                } else if (rank === 'n') {
                                  lessonId = 'intuitive-54';
                                } else if (rank === 'q') {
                                  lessonId = 'intuitive-55';
                                } else if (rank === 'k') {
                                  lessonId = 'intuitive-56';
                                }
                              } else {
                                lessonId = `intuitive-${progress.currentLesson}`;
                              }
                            } else {
                              lessonId = `advanced-${progress.currentLesson}`;
                            }
                            
                            console.log(`Continue: Navigating to /learning/${trackId}/${lessonId} for card ${currentCardId}`);
                            setLocation(`/learning/${trackId}/${lessonId}`);
                          } else {
                            // Fallback to old behavior if no card ID
                            handleContinueLearning();
                          }
                        } else {
                          // Fallback to old behavior if no progress
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
                    
                    // If still no card found but we have a numeric ID (major arcana in advanced track), use proper name
                    let displayName = cardId;
                    
                    // For Beginner's Journey and Advanced Symbolism tracks, map IDs to proper card names
                    if (track.id === 1 || track.id === 11) {
                      // For major arcana (numerical cards or named cards)
                      const majorArcanaMap = {
                        "0": "The Fool",
                        "1": "The Magician",
                        "2": "The High Priestess",
                        "3": "The Empress",
                        "4": "The Emperor",
                        "5": "The Hierophant",
                        "6": "The Lovers",
                        "7": "The Chariot",
                        "8": "Strength",
                        "9": "The Hermit",
                        "10": "Wheel of Fortune",
                        "11": "Justice",
                        "12": "The Hanged Man",
                        "13": "Death",
                        "14": "Temperance",
                        "15": "The Devil",
                        "16": "The Tower",
                        "17": "The Star",
                        "18": "The Moon",
                        "19": "The Sun",
                        "20": "Judgement",
                        "21": "The World",
                        // Add name-based mappings for Beginner's Journey
                        "fool": "The Fool",
                        "magician": "The Magician",
                        "high-priestess": "The High Priestess",
                        "empress": "The Empress",
                        "emperor": "The Emperor",
                        "hierophant": "The Hierophant",
                        "lovers": "The Lovers",
                        "chariot": "The Chariot",
                        "strength": "Strength",
                        "hermit": "The Hermit",
                        "wheel-of-fortune": "Wheel of Fortune",
                        "justice": "Justice",
                        "hanged-man": "The Hanged Man",
                        "death": "Death",
                        "temperance": "Temperance",
                        "devil": "The Devil",
                        "tower": "The Tower",
                        "star": "The Star",
                        "moon": "The Moon",
                        "sun": "The Sun",
                        "judgement": "Judgement",
                        "world": "The World"
                      };

                      if (majorArcanaMap[cardId]) {
                        displayName = majorArcanaMap[cardId];
                      }
                      // For minor arcana (letter-number combinations)
                      else if (cardId.length >= 2) {
                        const suit = cardId[0];
                        const rank = cardId.substring(1);
                        
                        const suitNames: Record<string, string> = {
                          'w': 'Wands',
                          'c': 'Cups',
                          'p': 'Pentacles',
                          's': 'Swords'
                        };
                        
                        const rankNames: Record<string, string> = {
                          '1': 'Ace',
                          '2': 'Two',
                          '3': 'Three',
                          '4': 'Four',
                          '5': 'Five',
                          '6': 'Six',
                          '7': 'Seven',
                          '8': 'Eight',
                          '9': 'Nine',
                          '10': 'Ten',
                          'p': 'Page',
                          'n': 'Knight',
                          'q': 'Queen',
                          'k': 'King'
                        };
                        
                        // If we can parse both suit and rank, create a properly formatted name
                        if (suitNames[suit] && rankNames[rank]) {
                          displayName = `${rankNames[rank]} of ${suitNames[suit]}`;
                        }
                      }
                    } else {
                      // Use existing formatting for other tracks
                      displayName = cardId.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                    }
                    
                    // For Beginner's Journey track, map the IDs to proper names
                    let finalDisplayName = displayName;
                    if (track.id === 1) {
                      const beginnerNameMap: Record<string, string> = {
                        "fool": "The Fool",
                        "magician": "The Magician",
                        "high-priestess": "The High Priestess",
                        "empress": "The Empress",
                        "emperor": "The Emperor",
                        "hierophant": "The Hierophant",
                        "lovers": "The Lovers",
                        "chariot": "The Chariot",
                        "strength": "Strength",
                        "hermit": "The Hermit",
                        "wheel-of-fortune": "Wheel of Fortune",
                        "justice": "Justice",
                        "hanged-man": "The Hanged Man",
                        "death": "Death",
                        "temperance": "Temperance",
                        "devil": "The Devil",
                        "tower": "The Tower",
                        "star": "The Star",
                        "moon": "The Moon",
                        "sun": "The Sun",
                        "judgement": "Judgement",
                        "world": "The World"
                      };
                      finalDisplayName = beginnerNameMap[cardId] || displayName;
                    }
                    
                    // Create the display card with proper name
                    let displayCardName = finalDisplayName;
                    
                    // Special handling for Beginner's Journey and Advanced Symbolism tracks
                    if (track.id === 1) {
                      // For Beginner's Journey, convert card IDs to proper names
                      const beginnerCards = {
                        "fool": "The Fool",
                        "magician": "The Magician",
                        "high-priestess": "The High Priestess",
                        "empress": "The Empress",
                        "emperor": "The Emperor",
                        "hierophant": "The Hierophant",
                        "lovers": "The Lovers",
                        "chariot": "The Chariot",
                        "strength": "Strength",
                        "hermit": "The Hermit",
                        "wheel-of-fortune": "Wheel of Fortune",
                        "justice": "Justice",
                        "hanged-man": "The Hanged Man",
                        "death": "Death",
                        "temperance": "Temperance",
                        "devil": "The Devil",
                        "tower": "The Tower",
                        "star": "The Star",
                        "moon": "The Moon",
                        "sun": "The Sun",
                        "judgement": "Judgement",
                        "world": "The World"
                      };
                      displayCardName = beginnerCards[cardId] || displayCardName;
                    } else if (track.id === 11) {
                      // For Advanced Symbolism track, use numeric IDs
                      const majorArcanaNames = [
                        "The Fool", "The Magician", "The High Priestess", "The Empress",
                        "The Emperor", "The Hierophant", "The Lovers", "The Chariot",
                        "Strength", "The Hermit", "Wheel of Fortune", "Justice",
                        "The Hanged Man", "Death", "Temperance", "The Devil",
                        "The Tower", "The Star", "The Moon", "The Sun",
                        "Judgement", "The World"
                      ];
                      const cardNum = parseInt(cardId);
                      if (!isNaN(cardNum) && cardNum >= 0 && cardNum < majorArcanaNames.length) {
                        displayCardName = majorArcanaNames[cardNum];
                      }
                    }

                    const displayCard = card || { 
                      name: displayCardName 
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
                          
                          // Skip directly to generating the lesson ID since allLessons.lessons doesn't exist in the API response
                          // The correct approach is to use the mapping logic below
                          
                          // Fallback to index-based ID for all tracks, with special handling for intuitive track (ID 10)
                          let lessonId;
                          if (trackId === 1) {
                            lessonId = `beginner-${index + 1}`;
                          } else if (trackId === 2) {
                            lessonId = `minor-${index + 1}`;
                          } else if (trackId === 10) {
                            // For the Intuitive Reading track, we need to map the card ID to the correct intuitive lesson ID
                            // First determine the suit
                            const suitCode = cardId.charAt(0);
                            // Then the rank (number or court card)
                            const rank = cardId.substring(1);
                            
                            if (suitCode === 'c') {
                              // Cups are 1-14
                              if (rank === '1') {
                                lessonId = 'intuitive-1'; // Ace of Cups
                              } else if (rank === '2') {
                                lessonId = 'intuitive-2'; // Two of Cups
                              } else if (rank === '3') {
                                lessonId = 'intuitive-3'; // Three of Cups
                              } else if (rank === '4') {
                                lessonId = 'intuitive-4'; // Four of Cups
                              } else if (rank === '5') {
                                lessonId = 'intuitive-5'; // Five of Cups
                              } else if (rank === '6') {
                                lessonId = 'intuitive-6'; // Six of Cups
                              } else if (rank === '7') {
                                lessonId = 'intuitive-7'; // Seven of Cups
                              } else if (rank === '8') {
                                lessonId = 'intuitive-8'; // Eight of Cups
                              } else if (rank === '9') {
                                lessonId = 'intuitive-9'; // Nine of Cups
                              } else if (rank === '10') {
                                lessonId = 'intuitive-10'; // Ten of Cups
                              } else if (rank === 'p') {
                                lessonId = 'intuitive-11'; // Page of Cups
                              } else if (rank === 'n') {
                                lessonId = 'intuitive-12'; // Knight of Cups
                              } else if (rank === 'q') {
                                lessonId = 'intuitive-13'; // Queen of Cups
                              } else if (rank === 'k') {
                                lessonId = 'intuitive-14'; // King of Cups
                              }
                            } else if (suitCode === 'w') {
                              // Wands are 15-28
                              if (rank >= '1' && rank <= '10') {
                                lessonId = `intuitive-${parseInt(rank) + 14}`; 
                              } else if (rank === 'p') {
                                lessonId = 'intuitive-25'; // Page
                              } else if (rank === 'n') {
                                lessonId = 'intuitive-26'; // Knight
                              } else if (rank === 'q') {
                                lessonId = 'intuitive-27'; // Queen
                              } else if (rank === 'k') {
                                lessonId = 'intuitive-28'; // King
                              }
                            } else if (suitCode === 'p') {
                              // Pentacles are 29-42
                              if (rank >= '1' && rank <= '10') {
                                lessonId = `intuitive-${parseInt(rank) + 28}`; 
                              } else if (rank === 'p') {
                                lessonId = 'intuitive-39'; // Page
                              } else if (rank === 'n') {
                                lessonId = 'intuitive-40'; // Knight
                              } else if (rank === 'q') {
                                lessonId = 'intuitive-41'; // Queen
                              } else if (rank === 'k') {
                                lessonId = 'intuitive-42'; // King
                              }
                            } else if (suitCode === 's') {
                              // Swords are 43-56
                              // Use explicit cases for Swords to ensure they work correctly
                              if (rank === '1') {
                                lessonId = 'intuitive-43'; // Ace of Swords
                              } else if (rank === '2') {
                                lessonId = 'intuitive-44'; // Two of Swords
                              } else if (rank === '3') {
                                lessonId = 'intuitive-45'; // Three of Swords
                              } else if (rank === '4') {
                                lessonId = 'intuitive-46'; // Four of Swords
                              } else if (rank === '5') {
                                lessonId = 'intuitive-47'; // Five of Swords
                              } else if (rank === '6') {
                                lessonId = 'intuitive-48'; // Six of Swords
                              } else if (rank === '7') {
                                lessonId = 'intuitive-49'; // Seven of Swords
                              } else if (rank === '8') {
                                lessonId = 'intuitive-50'; // Eight of Swords
                              } else if (rank === '9') {
                                lessonId = 'intuitive-51'; // Nine of Swords
                              } else if (rank === '10') {
                                lessonId = 'intuitive-52'; // Ten of Swords
                              } else if (rank === 'p') {
                                lessonId = 'intuitive-53'; // Page of Swords
                              } else if (rank === 'n') {
                                lessonId = 'intuitive-54'; // Knight of Swords
                              } else if (rank === 'q') {
                                lessonId = 'intuitive-55'; // Queen of Swords
                              } else if (rank === 'k') {
                                lessonId = 'intuitive-56'; // King of Swords
                              }
                            } else {
                              // Default fallback 
                              lessonId = `intuitive-${index + 1}`;
                            }
                          } else {
                            lessonId = `advanced-${index + 1}`;
                          }
                          console.log(`Fallback: Navigating to /learning/${trackId}/${lessonId} for card ${cardId}`);
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