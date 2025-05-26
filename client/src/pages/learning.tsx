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
import { GraduationCap, Trophy, Book, Brain, ArrowRight, Sparkles } from "lucide-react";
import { tarotCards } from "@shared/tarot-data";
import { TrackCardLabel } from "@/components/track-card-label";

import { useEffect } from "react";

export default function Learning() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [_, setLocation] = useLocation();
  
  // Special handler for Pendulum course navigation
  useEffect(() => {
    // Check URL parameters for pendulum navigation flag
    const urlParams = new URLSearchParams(window.location.search);
    const fromPendulum = urlParams.get('from-pendulum');
    
    if (fromPendulum === 'true') {
      // Clear the URL parameter without page reload
      window.history.replaceState({}, document.title, '/learning');
      
      // Force a refetch of track data to ensure everything is up-to-date
      queryClient.invalidateQueries({ queryKey: ['/api/learning/tracks'] });
      queryClient.invalidateQueries({ queryKey: ['/api/learning/progress/5'] });
    }
  }, [queryClient]);

  const { data: tracks, isLoading: tracksLoading } = useQuery<LearningTrack[]>({
    queryKey: ["/api/learning/tracks"],
  });

  const { data: recentQuizzes } = useQuery<QuizResult[]>({
    queryKey: ["/api/learning/recent-quiz-results"],
  });

  const startTrackMutation = useMutation({
    mutationFn: async (trackId: number) => {
      console.log("Starting track:", trackId);
      try {
        // For pendulum course, add specific handling (track ID 5)
        if (trackId === 5) {
          console.log("Initializing Pendulum Dowsing course");
        }
        
        const response = await apiRequest("POST", "/api/learning/progress", {
          trackId,
          completedLessons: [],
          achievements: [],
          currentLesson: 1
        });
        console.log("Track start response:", response);
        return response;
      } catch (error) {
        console.error("Error starting track:", error);
        throw error;
      }
    },
    onSuccess: (_, trackId) => {
      // Invalidate both queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ["/api/learning/tracks"] });
      queryClient.invalidateQueries({ queryKey: [`/api/learning/progress/${trackId}`] });
      toast({
        title: "Track started",
        description: "Your learning journey has begun!"
      });
    },
    onError: (error) => {
      console.error("Track start error:", error);
      toast({
        title: "Error Starting Track",
        description: "There was a problem starting this learning track. Please try again.",
        variant: "destructive"
      });
    }
  });

  const TrackCard = ({ track }: { track: LearningTrack }) => {
    const { data: progress, isLoading: progressLoading } = useQuery<UserProgress>({
      queryKey: [`/api/learning/progress/${track.id}`],
      enabled: !!track.id,
      retry: false,
    });

    // For Pendulum course (track ID 5), use a separate dedicated page
    if (track.id === 5) {
      return (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{track.name}</CardTitle>
              <Badge variant="secondary">Divination</Badge>
            </div>
            <CardDescription>{track.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              className="w-full"
              onClick={() => setLocation('/pendulum')}
            >
              <ArrowRight className="h-4 w-4 mr-2" />
              Open Pendulum Course
            </Button>
          </CardContent>
        </Card>
      );
    }

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
                  <span className="text-sm text-white">
                    {progress.achievements.length} Achievement{progress.achievements.length !== 1 && 's'}
                  </span>
                </div>
              )}

              <div className="space-y-4">
                <h3 className="font-medium text-lg">Current Lesson</h3>
                {progress.currentLesson <= track.requiredCards.length && (
                  <div className="bg-card border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-white">
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
                    // Hard-coded direct mapping for card names - simplest and most reliable approach
                    let displayCardName = "";
                    
                    // Super explicit handling of card names based on hardcoded track ID
                    if (track.id === 1) {
                      // Direct string mapping for Beginner's Journey - explicit names for each card
                      switch(cardId) {
                        case "fool": displayCardName = "The Fool"; break;
                        case "magician": displayCardName = "The Magician"; break;
                        case "high-priestess": displayCardName = "The High Priestess"; break;
                        case "empress": displayCardName = "The Empress"; break;
                        case "emperor": displayCardName = "The Emperor"; break;
                        case "hierophant": displayCardName = "The Hierophant"; break;
                        case "lovers": displayCardName = "The Lovers"; break;
                        case "chariot": displayCardName = "The Chariot"; break;
                        case "strength": displayCardName = "Strength"; break;
                        case "hermit": displayCardName = "The Hermit"; break;
                        case "wheel-of-fortune": displayCardName = "Wheel of Fortune"; break;
                        case "justice": displayCardName = "Justice"; break;
                        case "hanged-man": displayCardName = "The Hanged Man"; break;
                        case "death": displayCardName = "Death"; break;
                        case "temperance": displayCardName = "Temperance"; break;
                        case "devil": displayCardName = "The Devil"; break;
                        case "tower": displayCardName = "The Tower"; break;
                        case "star": displayCardName = "The Star"; break;
                        case "moon": displayCardName = "The Moon"; break;
                        case "sun": displayCardName = "The Sun"; break;
                        case "judgement": displayCardName = "Judgement"; break;
                        case "world": displayCardName = "The World"; break;
                        default: displayCardName = "Card " + (index + 1);
                      }
                      
                      // Log what's happening with the Beginner cards
                      console.log(`Beginner Track - Card ${index + 1}: ID=${cardId}, Name=${displayCardName}`);
                    }
                    else if (track.id === 5) {
                      // For Pendulum Dowsing course - map card names but don't navigate directly
                      console.log(`Pendulum Course - Processing lesson ${index + 1} with card ID: ${cardId}`);
                      
                      // Map card IDs to display names only (no automatic navigation)
                      switch(cardId) {
                        case 'pendulum-intro':
                          displayCardName = 'Introduction to Pendulum Dowsing';
                          break;
                        case 'pendulum-types':
                          displayCardName = 'Types of Pendulums';
                          break;
                        case 'pendulum-cleansing':
                          displayCardName = 'Cleansing & Activation';
                          break;
                        case 'pendulum-alignment':
                          displayCardName = 'Energy Alignment';
                          break;
                        case 'pendulum-communication':
                          displayCardName = 'Establishing Communication';
                          break;
                        case 'pendulum-questions':
                          displayCardName = 'Asking Effective Questions';
                          break;
                        case 'pendulum-decisions':
                          displayCardName = 'Decision Making with Pendulums';
                          break;
                        case 'pendulum-spiritual':
                          displayCardName = 'Spiritual Development';
                          break;
                        default:
                          displayCardName = `Pendulum Lesson ${index + 1}`;
                      }
                      console.log(`Pendulum Course: Mapped card name ${displayCardName}`);
                    } 
                    else if (track.id === 11) {
                      // For Advanced Symbolism track - major arcana by number, minor arcana by code
                      
                      // First explicitly handle major arcana numerical cards
                      switch(cardId) {
                        case "0": displayCardName = "The Fool"; break;
                        case "1": displayCardName = "The Magician"; break;
                        case "2": displayCardName = "The High Priestess"; break;
                        case "3": displayCardName = "The Empress"; break;
                        case "4": displayCardName = "The Emperor"; break;
                        case "5": displayCardName = "The Hierophant"; break;
                        case "6": displayCardName = "The Lovers"; break;
                        case "7": displayCardName = "The Chariot"; break;
                        case "8": displayCardName = "Strength"; break;
                        case "9": displayCardName = "The Hermit"; break;
                        case "10": displayCardName = "Wheel of Fortune"; break;
                        case "11": displayCardName = "Justice"; break;
                        case "12": displayCardName = "The Hanged Man"; break;
                        case "13": displayCardName = "Death"; break;
                        case "14": displayCardName = "Temperance"; break;
                        case "15": displayCardName = "The Devil"; break;
                        case "16": displayCardName = "The Tower"; break;
                        case "17": displayCardName = "The Star"; break;
                        case "18": displayCardName = "The Moon"; break;
                        case "19": displayCardName = "The Sun"; break;
                        case "20": displayCardName = "Judgement"; break;
                        case "21": displayCardName = "The World"; break;
                      }
                      
                      // If we haven't set a name yet and it looks like a minor arcana card
                      if (!displayCardName && cardId.length >= 2) {
                        // Parse the suit and rank
                        const suit = cardId[0];
                        const rank = cardId.substring(1);
                        
                        // Determine the suit name
                        let suitName = "";
                        switch(suit) {
                          case "w": suitName = "Wands"; break;
                          case "c": suitName = "Cups"; break;
                          case "p": suitName = "Pentacles"; break;
                          case "s": suitName = "Swords"; break;
                        }
                        
                        // Determine the rank name
                        let rankName = "";
                        switch(rank) {
                          case "1": rankName = "Ace"; break;
                          case "2": rankName = "Two"; break;
                          case "3": rankName = "Three"; break;
                          case "4": rankName = "Four"; break;
                          case "5": rankName = "Five"; break;
                          case "6": rankName = "Six"; break; 
                          case "7": rankName = "Seven"; break;
                          case "8": rankName = "Eight"; break;
                          case "9": rankName = "Nine"; break;
                          case "10": rankName = "Ten"; break;
                          case "p": rankName = "Page"; break;
                          case "n": rankName = "Knight"; break;
                          case "q": rankName = "Queen"; break;
                          case "k": rankName = "King"; break;
                        }
                        
                        // If we have both a suit and rank name, combine them
                        if (suitName && rankName) {
                          displayCardName = `${rankName} of ${suitName}`;
                        }
                      }
                      
                      // If we still don't have a name, use a default
                      if (!displayCardName) {
                        displayCardName = "Card " + (index + 1);
                      }
                      
                      // Log what's happening with the Advanced Symbolism cards
                      console.log(`Advanced Track - Card ${index + 1}: ID=${cardId}, Name=${displayCardName}`);
                    }
                    else {
                      // For all other tracks, try to find the card in tarotCards
                      const card = tarotCards.find(c => c.id === cardId);
                      if (card && card.name) {
                        displayCardName = card.name;
                      } else {
                        // Format the card ID nicely if we can't find the card
                        displayCardName = cardId.split('-')
                          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                          .join(' ');
                      }
                    }
                    
                    // Final fallback - guarantee we have a name
                    if (!displayCardName) {
                      displayCardName = "Card " + (index + 1);
                    }
                    
                    // Create the display card object
                    const displayCard = { 
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
                            <span className="text-xs text-white truncate w-full text-center mt-1">
                              <TrackCardLabel trackId={track.id} cardId={cardId} index={index} />
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
                <p className="text-sm text-white">
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

  const handleStarClick = (starId: string) => {
    // Parse star ID to get track and lesson info
    const [trackId, lessonIndex] = starId.split('-');
    const track = tracks?.find(t => t.id === parseInt(trackId));
    if (track) {
      // Navigate to the specific lesson
      window.location.href = `/learning/tracks/${trackId}`;
    }
  };

  return (
    <div className="container px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Learning Paths</h1>

      <div className="grid gap-8">
        {/* Beautiful Constellation View - New Feature */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-yellow-400" />
            <h2 className="text-xl font-semibold">Your Spiritual Journey Constellation</h2>
          </div>

        </section>


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
                          <p className="text-sm text-white">
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