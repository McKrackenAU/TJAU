import { useQuery } from "@tanstack/react-query";
import { useRef, useEffect, useState, useMemo } from "react";
import type { LearningTrack } from "@shared/schema";

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
    staleTime: 10 * 60 * 1000,
  });

  // Stable progress data query - prevent infinite re-renders
  const { data: progressData = [] } = useQuery({
    queryKey: ["/api/learning/progress/all"],
    queryFn: async () => {
      if (!tracks || !Array.isArray(tracks) || tracks.length === 0) return [];
      const progressPromises = tracks.map(track => {
        if (!track || !track.id || isNaN(track.id)) {
          return Promise.resolve({ completedLessons: [], currentLesson: 1, trackId: null });
        }
        return fetch(`/api/learning/progress/${track.id}`)
          .then(res => res.ok ? res.json() : { completedLessons: [], currentLesson: 1, trackId: track.id })
          .catch(() => ({ completedLessons: [], currentLesson: 1, trackId: track.id }));
      });
      return Promise.all(progressPromises);
    },
    enabled: !!tracks && Array.isArray(tracks) && tracks.length > 0,
    staleTime: 10 * 60 * 1000,
  });

  // Generate constellation stars - use useMemo to prevent infinite re-renders
  const generatedStars = useMemo(() => {
    if (!tracks || tracks.length === 0 || !progressData || !containerRef.current) return [];

    const container = containerRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 400;

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
        centerY: height * 0.6,
        pattern: [
          { x: -60, y: 10 }, { x: -30, y: -20 }, { x: 0, y: -30 },
          { x: 30, y: -20 }, { x: 60, y: 10 }
        ]
      }
    };

    tracks.forEach((track, trackIndex) => {
      if (!track || !track.id || !track.requiredCards) return;

      const progress = progressData.find(p => p && p.trackId === track.id) || { completedLessons: [], currentLesson: 1 };
      const pattern = constellationPatterns[track.id as keyof typeof constellationPatterns] || {
        centerX: width * (0.2 + trackIndex * 0.15),
        centerY: height * (0.3 + (trackIndex % 2) * 0.4),
        pattern: track.requiredCards.map((_, i) => ({ 
          x: (i % 4) * 40 - 60, 
          y: Math.floor(i / 4) * 40 - 40 
        }))
      };
      
      track.requiredCards.forEach((cardId, lessonIndex) => {
        const isCompleted = progress.completedLessons.includes(cardId);
        const isCurrent = progress.currentLesson - 1 === lessonIndex;
        const pos = pattern.pattern[lessonIndex] || { x: lessonIndex * 30, y: 0 };

        // Star properties based on completion status
        let size = isCompleted ? 8 : 4;
        let brightness = isCompleted ? 1 : 0.3;
        let color = isCompleted ? '#FFD700' : '#87CEEB'; // Gold for completed, blue for available

        if (isCurrent) {
          size = 10;
          brightness = 0.8;
          color = '#FF6B6B'; // Red for current lesson
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
          connections: []
        });
      });
    });

    return newStars;
  }, [tracks, progressData]);

  // Update stars when generated stars change
  useEffect(() => {
    if (generatedStars.length > 0) {
      setStars(generatedStars);
    }
  }, [generatedStars]);

  // Animation loop for twinkling stars
  useEffect(() => {
    const animate = () => {
      setAnimationFrame(prev => prev + 1);
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

    // Draw stars
    stars.forEach(star => {
      const twinkle = Math.sin(animationFrame * 0.05 + star.x * 0.01) * 0.3 + 0.7;
      const currentBrightness = star.brightness * twinkle;
      
      ctx.save();
      ctx.globalAlpha = currentBrightness;
      ctx.fillStyle = star.color;
      
      // Draw star shape
      const radius = star.size;
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
        const x = star.x + Math.cos(angle) * radius;
        const y = star.y + Math.sin(angle) * radius;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        
        const innerAngle = ((i + 0.5) * Math.PI * 2) / 5 - Math.PI / 2;
        const innerX = star.x + Math.cos(innerAngle) * (radius * 0.4);
        const innerY = star.y + Math.sin(innerAngle) * (radius * 0.4);
        ctx.lineTo(innerX, innerY);
      }
      ctx.closePath();
      ctx.fill();
      
      // Add glow effect
      ctx.shadowColor = star.color;
      ctx.shadowBlur = 10;
      ctx.fill();
      
      ctx.restore();
    });

    // Draw connections between stars in the same track
    ctx.strokeStyle = 'rgba(135, 206, 235, 0.3)';
    ctx.lineWidth = 1;
    
    const trackGroups = stars.reduce((groups, star) => {
      const trackId = star.id.split('-')[0];
      if (!groups[trackId]) groups[trackId] = [];
      groups[trackId].push(star);
      return groups;
    }, {} as Record<string, ConstellationStar[]>);

    Object.values(trackGroups).forEach(trackStars => {
      for (let i = 0; i < trackStars.length - 1; i++) {
        const star1 = trackStars[i];
        const star2 = trackStars[i + 1];
        
        ctx.beginPath();
        ctx.moveTo(star1.x, star1.y);
        ctx.lineTo(star2.x, star2.y);
        ctx.stroke();
      }
    });

  }, [stars, animationFrame]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const clickedStar = stars.find(star => {
      const distance = Math.sqrt((x - star.x) ** 2 + (y - star.y) ** 2);
      return distance <= star.size + 5;
    });

    if (clickedStar && onStarClick) {
      onStarClick(clickedStar.id);
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const hoveredStar = stars.find(star => {
      const distance = Math.sqrt((x - star.x) ** 2 + (y - star.y) ** 2);
      return distance <= star.size + 5;
    });

    setHoveredStar(hoveredStar?.id || null);
  };

  return (
    <div ref={containerRef} className="relative w-full h-96 bg-gradient-to-b from-indigo-900 via-purple-900 to-black rounded-lg overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-pointer"
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredStar(null)}
      />
      
      {/* Constellation Info Tooltip */}
      {hoveredStar && (
        <div className="absolute top-4 left-4 bg-black bg-opacity-80 text-white p-3 rounded-lg pointer-events-none">
          <div className="text-sm font-medium">
            {stars.find(s => s.id === hoveredStar)?.trackName}
          </div>
          <div className="text-xs opacity-80">
            {stars.find(s => s.id === hoveredStar)?.lessonName}
          </div>
        </div>
      )}
      
      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-black bg-opacity-60 text-white p-3 rounded-lg text-xs">
        <div className="flex items-center mb-1">
          <div className="w-2 h-2 bg-yellow-400 rounded-full mr-2"></div>
          <span>Completed</span>
        </div>
        <div className="flex items-center mb-1">
          <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
          <span>Current</span>
        </div>
        <div className="flex items-center">
          <div className="w-2 h-2 bg-blue-300 rounded-full mr-2"></div>
          <span>Available</span>
        </div>
      </div>
    </div>
  );
}