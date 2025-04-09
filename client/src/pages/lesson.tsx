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
  
  // Get track details
  const { data: track, isLoading: trackLoading } = useQuery({
    queryKey: [`/api/learning/tracks/${trackId}`],
    enabled: !!trackId,
  });
  
  // Get progress details
  const { data: progress, isLoading: progressLoading } = useQuery({
    queryKey: [`/api/learning/progress/${trackId}`],
    enabled: !!trackId,
  });
  
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
    
    console.log(`Looking for lesson with ID: ${lessonId} in track: ${trackIdNum}`);
    console.log(`Available lessons: ${lessons.map((l: LessonContent) => l.id).join(', ')}`);
    
    const currentLesson = lessons.find((l: LessonContent) => l.id === lessonId);
    if (!currentLesson) {
      console.log(`Lesson ${lessonId} not found in track ${trackIdNum}`);
      navigate(`/learning`);
      return;
    }
    
    setLesson(currentLesson);
    
    // Find next and previous lessons
    const currentIndex = lessons.findIndex((l: LessonContent) => l.id === lessonId);
    if (currentIndex > 0) {
      const prevLessonData = lessons[currentIndex - 1];
      setPrevLesson(prevLessonData.id);
      
      // Get the name of the previous card
      const prevCard = tarotCards.find(card => card.id === prevLessonData.cardId);
      setPrevCardName(prevCard?.name || prevLessonData.title.split(':')[0].trim());
    } else {
      setPrevLesson(null);
      setPrevCardName(null);
    }
    
    if (currentIndex < lessons.length - 1) {
      const nextLessonData = lessons[currentIndex + 1];
      setNextLesson(nextLessonData.id);
      
      // Get the name of the next card
      const nextCard = tarotCards.find(card => card.id === nextLessonData.cardId);
      setNextCardName(nextCard?.name || nextLessonData.title.split(':')[0].trim());
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
          <h1 className="text-xl font-bold">{track && 'name' in track ? track.name : 'Loading...'}</h1>
          <p className="text-sm text-muted-foreground">{track && 'description' in track ? track.description : ''}</p>
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