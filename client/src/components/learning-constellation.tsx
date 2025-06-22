import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import type { LearningTrack, UserProgress } from "@shared/schema";
import { Star, Sparkles, Crown, Trophy } from "lucide-react";

interface ConstellationStar {
  id: string;
  x: number;
  y: number;
  size: number;
  brightness: number;
  color: string;
  isCompleted: boolean;
  trackName: string;
  lessonName: string;
  connections: string[];
}

interface ConstellationProps {
  onStarClick?: (starId: string) => void;
}

export function LearningConstellation({ onStarClick }: ConstellationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [stars, setStars] = useState<ConstellationStar[]>([]);
  const [animationFrame, setAnimationFrame] = useState(0);
  const [hoveredStar, setHoveredStar] = useState<string | null>(null);

  const { data: tracks = [] } = useQuery<LearningTrack[]>({
    queryKey: ["/api/learning/tracks"],
  });

  const { data: progressData = [] } = useQuery({
    queryKey: ["/api/learning/progress/all"],
    queryFn: async () => {
      if (!tracks || !Array.isArray(tracks) || tracks.length === 0) return [];
      const progressPromises = tracks.map(track => {
        if (!track || !track.id) return Promise.resolve({ completedLessons: [], currentLesson: 1, trackId: null });
        return fetch(`/api/learning/progress/${track.id}`)
          .then(res => res.json())
          .catch(() => ({ completedLessons: [], currentLesson: 1, trackId: track.id }));
      });
      return Promise.all(progressPromises);
    },
    enabled: !!tracks && Array.isArray(tracks) && tracks.length > 0,
  });

  // Generate constellation stars based on learning progress
  useEffect(() => {
    if (!tracks || !Array.isArray(tracks) || tracks.length === 0 || 
        !progressData || !Array.isArray(progressData) || 
        !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const newStars: ConstellationStar[] = [];

    // Define constellation patterns for different tracks
    const constellationPatterns = {
      1: { // Beginner's Journey - The Great Bear (Big Dipper)
        centerX: width * 0.3,
        centerY: height * 0.4,
        pattern: [
          { x: 0, y: 0 }, { x: 40, y: -20 }, { x: 80, y: -30 },
          { x: 120, y: -25 }, { x: 100, y: 20 }, { x: 60, y: 35 }, { x: 20, y: 30 }
        ]
      },
      2: { // Minor Arcana - Orion's Belt
        centerX: width * 0.7,
        centerY: height * 0.3,
        pattern: [
          { x: -60, y: -40 }, { x: -20, y: -20 }, { x: 20, y: 0 },
          { x: 60, y: 20 }, { x: -40, y: 40 }, { x: 0, y: 60 }, { x: 40, y: 80 }
        ]
      },
      5: { // Pendulum Dowsing - Cassiopeia (W shape)
        centerX: width * 0.5,
        centerY: height * 0.2,
        pattern: [
          { x: -80, y: 20 }, { x: -40, y: -10 }, { x: 0, y: 0 },
          { x: 40, y: -10 }, { x: 80, y: 20 }
        ]
      },
      10: { // Intuitive Reading - Southern Cross
        centerX: width * 0.2,
        centerY: height * 0.7,
        pattern: [
          { x: 0, y: -30 }, { x: -25, y: 0 }, { x: 0, y: 0 },
          { x: 25, y: 0 }, { x: 0, y: 30 }
        ]
      },
      11: { // Advanced Symbolism - Corona Borealis (Crown)
        centerX: width * 0.8,
        centerY: height * 0.6,
        pattern: [
          { x: -60, y: 10 }, { x: -30, y: -20 }, { x: 0, y: -30 },
          { x: 30, y: -20 }, { x: 60, y: 10 }
        ]
      }
    };

    tracks.forEach((track, trackIndex) => {
      // Safety check to prevent null reference errors
      if (!track || !track.id || !track.requiredCards) {
        console.warn('Invalid track found:', track);
        return;
      }
      const progress = progressData.find(p => p && p.trackId === track.id) || { completedLessons: [], currentLesson: 1 };
      const pattern = constellationPatterns[track.id as keyof typeof constellationPatterns] || {
        centerX: width * (0.2 + trackIndex * 0.15),
        centerY: height * (0.3 + (trackIndex % 2) * 0.4),
        pattern: track.requiredCards.map((_, i) => ({ 
          x: (i % 4) * 40 - 60, 
          y: Math.floor(i / 4) * 40 - 40 
        }))
      };

      if (!track.requiredCards || !Array.isArray(track.requiredCards)) {
        console.warn('Track has invalid requiredCards:', track);
        return;
      }
      
      track.requiredCards.forEach((cardId, lessonIndex) => {
        const isCompleted = progress.completedLessons.includes(cardId);
        const isCurrent = progress.currentLesson - 1 === lessonIndex;
        const pos = pattern.pattern[lessonIndex] || { x: lessonIndex * 30, y: 0 };

        // Star properties based on completion status
        let size = isCompleted ? 8 : 4;
        let brightness = isCompleted ? 1 : 0.3;
        let color = isCompleted ? '#FFDF00' : '#87CEEB'; // Bright golden yellow for completed, sky blue for pending

        if (isCurrent) {
          size = 10;
          brightness = 0.8;
          color = '#FF6B6B'; // Coral for current lesson
        }

        // Beautiful golden yellow for all completed lessons
        if (isCompleted) {
          color = '#FFD700'; // Pure gold color for all completed achievements
          brightness = 1.2; // Make completed stars extra bright
        }

        newStars.push({
          id: `${track.id}-${lessonIndex}`,
          x: pattern.centerX + pos.x,
          y: pattern.centerY + pos.y,
          size,
          brightness,
          color,
          isCompleted,
          trackName: track.name,
          lessonName: `Lesson ${lessonIndex + 1}`,
          connections: lessonIndex > 0 ? [`${track.id}-${lessonIndex - 1}`] : []
        });
      });
    });

    setStars(newStars);
  }, [tracks, progressData]);

  // Animation loop for twinkling stars
  useEffect(() => {
    const animate = () => {
      setAnimationFrame(prev => prev + 1);
      requestAnimationFrame(animate);
    };
    const animationId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Canvas rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || stars.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, rect.width, rect.height);

    // Draw constellation connections
    stars.forEach(star => {
      star.connections.forEach(connectionId => {
        const connectedStar = stars.find(s => s.id === connectionId);
        if (connectedStar && star.isCompleted && connectedStar.isCompleted) {
          ctx.strokeStyle = `rgba(255, 215, 0, 0.4)`;
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 5]);
          ctx.beginPath();
          ctx.moveTo(star.x, star.y);
          ctx.lineTo(connectedStar.x, connectedStar.y);
          ctx.stroke();
          ctx.setLineDash([]);
        }
      });
    });

    // Draw stars
    stars.forEach(star => {
      const twinkle = Math.sin(animationFrame * 0.02 + star.x * 0.01) * 0.2 + 0.8;
      const alpha = star.brightness * twinkle;
      
      // Outer glow
      if (star.isCompleted || hoveredStar === star.id) {
        const gradient = ctx.createRadialGradient(
          star.x, star.y, 0,
          star.x, star.y, star.size * 3
        );
        gradient.addColorStop(0, `${star.color}${Math.floor(alpha * 0.8 * 255).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Main star
      ctx.fillStyle = star.color;
      ctx.globalAlpha = alpha;
      ctx.beginPath();
      
      if (star.isCompleted) {
        // Draw 5-pointed star for completed lessons
        const spikes = 5;
        const outerRadius = star.size;
        const innerRadius = outerRadius * 0.5;
        
        ctx.moveTo(star.x, star.y - outerRadius);
        for (let i = 0; i < spikes * 2; i++) {
          const radius = i % 2 === 0 ? outerRadius : innerRadius;
          const angle = (i * Math.PI) / spikes - Math.PI / 2;
          ctx.lineTo(
            star.x + Math.cos(angle) * radius,
            star.y + Math.sin(angle) * radius
          );
        }
        ctx.closePath();
      } else {
        // Draw circle for incomplete lessons
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      }
      
      ctx.fill();
      ctx.globalAlpha = 1;
    });
  }, [stars, animationFrame, hoveredStar]);

  // Handle mouse interactions
  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const hoveredStar = stars.find(star => {
      const distance = Math.sqrt((x - star.x) ** 2 + (y - star.y) ** 2);
      return distance <= star.size * 2;
    });

    setHoveredStar(hoveredStar?.id || null);
    canvas.style.cursor = hoveredStar ? 'pointer' : 'default';
  };

  const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const clickedStar = stars.find(star => {
      const distance = Math.sqrt((x - star.x) ** 2 + (y - star.y) ** 2);
      return distance <= star.size * 2;
    });

    if (clickedStar && onStarClick) {
      onStarClick(clickedStar.id);
    }
  };

  const completedCount = stars.filter(star => star.isCompleted).length;
  const totalCount = stars.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <TooltipProvider>
      <Card className="bg-gradient-to-br from-indigo-950 via-purple-900 to-slate-900 border-purple-500/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-yellow-400" />
              Your Spiritual Constellation
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-purple-600/20 text-purple-200">
                <Star className="h-3 w-3 mr-1" />
                {completedCount}/{totalCount} Stars
              </Badge>
              <Badge variant="outline" className="border-yellow-400 text-yellow-400">
                {completionPercentage}% Complete
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div 
            ref={containerRef}
            className="relative w-full h-96 rounded-lg overflow-hidden"
            style={{ 
              background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #16213e 50%, #0f172a 100%)'
            }}
          >
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
              onMouseMove={handleMouseMove}
              onClick={handleClick}
            />
            
            {hoveredStar && (
              <Tooltip open={true}>
                <TooltipTrigger asChild>
                  <div className="absolute pointer-events-none" />
                </TooltipTrigger>
                <TooltipContent side="top" className="bg-purple-900 border-purple-600">
                  <div className="text-center">
                    <p className="font-semibold text-white">
                      {stars.find(s => s.id === hoveredStar)?.trackName}
                    </p>
                    <p className="text-purple-200">
                      {stars.find(s => s.id === hoveredStar)?.lessonName}
                    </p>
                    {stars.find(s => s.id === hoveredStar)?.isCompleted && (
                      <Badge className="bg-yellow-500 text-black mt-1">
                        <Crown className="h-3 w-3 mr-1" />
                        Completed
                      </Badge>
                    )}
                  </div>
                </TooltipContent>
              </Tooltip>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-purple-200">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                <span>Completed</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                <span>Current</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-sky-400 rounded-full"></div>
                <span>Upcoming</span>
              </div>
            </div>
            <div className="text-yellow-400 font-medium">
              {completionPercentage >= 100 && <Trophy className="h-4 w-4 inline mr-1" />}
              Journey Progress: {completionPercentage}%
            </div>
          </div>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
}