import { useEffect, useState } from "react";
import { useLocation, useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { LessonContent } from "@/components/lesson-content";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronLeft } from "lucide-react";
import { trackLessonMap } from "@/data/course-lessons";
import { tarotCards } from "@shared/tarot-data";

// Type assertion to help TypeScript with indexing
const typedTrackLessonMap: Record<string, LessonContent[]> = trackLessonMap as Record<string, LessonContent[]>;

export default function LessonPage() {
  const { trackId, lessonId } = useParams<{ trackId: string; lessonId: string }>();
  const [_, navigate] = useLocation();
  const [lesson, setLesson] = useState<LessonContent | null>(null);
  const [nextLesson, setNextLesson] = useState<string | null>(null);
  const [prevLesson, setPrevLesson] = useState<string | null>(null);
  const [nextCardName, setNextCardName] = useState<string | null>(null);
  const [prevCardName, setPrevCardName] = useState<string | null>(null);
  
  // Define types for API responses
  interface TrackData {
    id: number;
    name: string;
    description: string;
    requiredCards: string[];
    difficulty: string;
    [key: string]: any;
  }
  
  interface ProgressData {
    id: number;
    trackId: number;
    userId: number;
    currentLesson: number;
    completedLessons: string[];
    dateStarted: string;
    lastUpdated: string;
    [key: string]: any;
  }
  
  // Get track details
  const { data: track, isLoading: trackLoading } = useQuery<TrackData>({
    queryKey: [`/api/learning/tracks/${trackId}`],
    enabled: !!trackId,
  });
  
  // Get progress details
  const { data: progress, isLoading: progressLoading } = useQuery<ProgressData>({
    queryKey: [`/api/learning/progress/${trackId}`],
    enabled: !!trackId,
  });
  
  // Helper function to find a card by ID
  const getCardName = (cardId: string): string | null => {
    const card = tarotCards.find(c => c.id === cardId);
    return card ? card.name : null;
  };
  
  // Helper function to get the card name by suit and number
  const getCardNameBySuitNumber = (cardId: string): string => {
    if (!cardId) return "Unknown Card";
    
    const suitMap: Record<string, string> = {
      'c': 'Cups',
      'w': 'Wands',
      's': 'Swords',
      'p': 'Pentacles'
    };
    
    const rankMap: Record<string, string> = {
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
    
    // Parse the card ID to get suit and rank
    if (cardId.length === 2 || cardId.length === 3) {
      const suit = cardId[0];
      const rank = cardId.substring(1);
      
      if (suitMap[suit] && rankMap[rank]) {
        return `${rankMap[rank]} of ${suitMap[suit]}`;
      }
    }
    
    return "Unknown Card";
  };

  // Find the appropriate lesson from our course data
  useEffect(() => {
    if (!trackId || !lessonId) return;
    
    const trackIdNum = parseInt(trackId, 10);
    const lessons = typedTrackLessonMap[trackIdNum.toString()];
    
    if (!lessons) {
      console.log(`No lessons found for track ID: ${trackIdNum}`);
      navigate("/learning");
      return;
    }
    
    // Debug - log all lesson IDs in Minor Arcana track to help identify issues
    if (trackIdNum === 2) {
      console.log("All Minor Arcana lesson IDs in order:");
      lessons.forEach((lesson, index) => {
        console.log(`${index + 1}. ${lesson.id} - Card: ${lesson.cardId} - ${lesson.title.split(':')[0].trim()}`);
      });
    }
    
    console.log(`Looking for lesson with ID: ${lessonId} in track: ${trackIdNum}`);
    
    // First try to find the lesson by its exact ID
    let currentLesson = lessons.find((l: LessonContent) => l.id === lessonId);
    
    // Handle special cases by lesson ID
    if (!currentLesson) {
      // Enhanced lesson ID mapping for all suits in Intuitive Reading track
      if (lessonId.includes("intuitive-")) {
        const lessonNumber = parseInt(lessonId.replace(/intuitive-/, ""), 10);
        
        // Map lesson number to the corresponding card ID
        let cardId: string | null = null;
        
        // Cups (1-14)
        if (lessonNumber >= 1 && lessonNumber <= 14) {
          if (lessonNumber <= 10) {
            // Numeric cards: c1-c10
            cardId = `c${lessonNumber}`;
          } else {
            // Court cards: cp, cn, cq, ck
            const courtRanks = ["p", "n", "q", "k"];
            cardId = `c${courtRanks[lessonNumber - 11]}`;
          }
        } 
        // Wands (15-28)
        else if (lessonNumber >= 15 && lessonNumber <= 28) {
          const wandsNumber = lessonNumber - 14;
          if (wandsNumber <= 10) {
            // Numeric cards: w1-w10
            cardId = `w${wandsNumber}`;
          } else {
            // Court cards: wp, wn, wq, wk
            const courtRanks = ["p", "n", "q", "k"];
            cardId = `w${courtRanks[wandsNumber - 11]}`;
          }
        } 
        // Pentacles (29-42)
        else if (lessonNumber >= 29 && lessonNumber <= 42) {
          const pentaclesNumber = lessonNumber - 28;
          if (pentaclesNumber <= 10) {
            // Numeric cards: p1-p10
            cardId = `p${pentaclesNumber}`;
          } else {
            // Court cards: pp, pn, pq, pk
            const courtRanks = ["p", "n", "q", "k"];
            cardId = `p${courtRanks[pentaclesNumber - 11]}`;
          }
        } 
        // Swords (43-56)
        else if (lessonNumber >= 43 && lessonNumber <= 56) {
          // Use explicit mapping for Swords to ensure they work correctly
          if (lessonNumber === 43) cardId = 's1';      // Ace of Swords
          else if (lessonNumber === 44) cardId = 's2';  // Two of Swords
          else if (lessonNumber === 45) cardId = 's3';  // Three of Swords
          else if (lessonNumber === 46) cardId = 's4';  // Four of Swords
          else if (lessonNumber === 47) cardId = 's5';  // Five of Swords
          else if (lessonNumber === 48) cardId = 's6';  // Six of Swords
          else if (lessonNumber === 49) cardId = 's7';  // Seven of Swords
          else if (lessonNumber === 50) cardId = 's8';  // Eight of Swords
          else if (lessonNumber === 51) cardId = 's9';  // Nine of Swords
          else if (lessonNumber === 52) cardId = 's10'; // Ten of Swords
          else if (lessonNumber === 53) cardId = 'sp';  // Page of Swords
          else if (lessonNumber === 54) cardId = 'sn';  // Knight of Swords
          else if (lessonNumber === 55) cardId = 'sq';  // Queen of Swords
          else if (lessonNumber === 56) cardId = 'sk';  // King of Swords
        }
        
        if (cardId) {
          console.log(`Fallback: Looking for card with ID ${cardId} from lesson ID ${lessonId}`);
          currentLesson = lessons.find((l: LessonContent) => l.cardId === cardId);
        }
      }
    }
    
    // If still not found, redirect back to learning page
    if (!currentLesson) {
      console.log(`Lesson ${lessonId} not found in track ${trackIdNum}`);
      navigate(`/learning`);
      return;
    }
    
    setLesson(currentLesson);
    
    // Use standard approach with lessons array for all tracks
    const currentIndex = lessons.findIndex((l: LessonContent) => 
      l.id === currentLesson?.id || l.cardId === currentLesson?.cardId
    );
    
    if (currentIndex > 0) {
      const prevLessonData = lessons[currentIndex - 1];
      setPrevLesson(prevLessonData.id);
      
      // Get the name of the previous card - try multiple methods to get a good name
      const prevCard = tarotCards.find(card => card.id === prevLessonData.cardId);
      setPrevCardName(
        prevCard?.name || 
        getCardNameBySuitNumber(prevLessonData.cardId) || 
        prevLessonData.title.split(':')[0].trim()
      );
    } else {
      setPrevLesson(null);
      setPrevCardName(null);
    }
    
    if (currentIndex < lessons.length - 1) {
      const nextLessonData = lessons[currentIndex + 1];
      setNextLesson(nextLessonData.id);
      
      // Get the name of the next card - try multiple methods to get a good name
      const nextCard = tarotCards.find(card => card.id === nextLessonData.cardId);
      setNextCardName(
        nextCard?.name || 
        getCardNameBySuitNumber(nextLessonData.cardId) || 
        nextLessonData.title.split(':')[0].trim()
      );
    } else {
      setNextLesson(null);
      setNextCardName(null);
    }
  }, [trackId, lessonId, navigate]);
  
  const handleComplete = () => {
    // This will be handled by the LessonContent component
  };
  
  const handleNext = () => {
    if (nextLesson) {
      navigate(`/learning/${trackId}/${nextLesson}`);
    } else {
      // No more lessons, go back to track overview
      navigate("/learning");
    }
  };
  
  const handleBack = () => {
    if (prevLesson) {
      navigate(`/learning/${trackId}/${prevLesson}`);
    } else {
      // No previous lesson, go back to track overview
      navigate("/learning");
    }
  };
  
  const isLessonCompleted = () => {
    if (!progress || !lesson) return false;
    return progress.completedLessons && Array.isArray(progress.completedLessons) ? 
      progress.completedLessons.includes(lesson.cardId) : false;
  };
  
  if (trackLoading || progressLoading || !lesson) {
    return (
      <div className="container py-8">
        <div className="flex items-center mb-8">
          <Button variant="ghost" size="sm" onClick={() => navigate("/learning")}>
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Learning
          </Button>
        </div>
        
        <div className="space-y-8">
          <Skeleton className="h-12 w-2/3" />
          <Skeleton className="h-6 w-1/2" />
          
          <div className="grid md:grid-cols-2 gap-6">
            <Skeleton className="h-[400px]" />
            <div className="space-y-4">
              <Skeleton className="h-[200px]" />
              <Skeleton className="h-[200px]" />
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  const trackIdStr = trackId.toString();
  const lessonNumber = typedTrackLessonMap[trackIdStr].findIndex((l: LessonContent) => l.id === lessonId) + 1;
  const totalLessons = typedTrackLessonMap[trackIdStr].length;
  
  return (
    <div className="container py-8">
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="sm" onClick={() => navigate("/learning")}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Learning
        </Button>
        <div className="ml-4">
          <h1 className="text-xl font-bold">{track ? track.name : 'Loading...'}</h1>
          <p className="text-sm text-muted-foreground">{track ? track.description : ''}</p>
        </div>
      </div>
      
      <LessonContent
        lesson={lesson}
        lessonNumber={lessonNumber}
        totalLessons={totalLessons}
        trackId={parseInt(trackId, 10)}
        onComplete={handleComplete}
        onBack={handleBack}
        onNext={handleNext}
        isCompleted={isLessonCompleted()}
        prevCardName={prevCardName}
        nextCardName={nextCardName}
      />
    </div>
  );
}