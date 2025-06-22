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

  // Update stars with stable reference
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

  // Professional constellation rendering
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || stars.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size properly
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    // Clear canvas with deep space background
    const gradient = ctx.createRadialGradient(
      canvas.width / 2, canvas.height / 2, 0,
      canvas.width / 2, canvas.height / 2, Math.max(canvas.width, canvas.height) / 2
    );
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(0.4, '#16213e');
    gradient.addColorStop(0.8, '#0f3460');
    gradient.addColorStop(1, '#0a1929');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add subtle background stars
    for (let i = 0; i < 80; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 1.2;
      const opacity = Math.random() * 0.4 + 0.1;
      
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.fill();
    }

    // Group stars by track for constellation connections
    const trackGroups = stars.reduce((groups, star) => {
      const trackId = star.id.split('-')[0];
      if (!groups[trackId]) groups[trackId] = [];
      groups[trackId].push(star);
      return groups;
    }, {} as Record<string, ConstellationStar[]>);

    // Draw constellation lines with beautiful effects
    Object.entries(trackGroups).forEach(([trackId, trackStars]) => {
      // Create constellation pattern connections
      for (let i = 0; i < trackStars.length - 1; i++) {
        const star1 = trackStars[i];
        const star2 = trackStars[i + 1];
        
        // Determine line appearance based on completion
        if (star1.isCompleted && star2.isCompleted) {
          // Completed connection - brilliant golden line
          const lineGradient = ctx.createLinearGradient(star1.x, star1.y, star2.x, star2.y);
          lineGradient.addColorStop(0, 'rgba(255, 215, 0, 0.9)');
          lineGradient.addColorStop(0.5, 'rgba(255, 230, 100, 1)');
          lineGradient.addColorStop(1, 'rgba(255, 215, 0, 0.9)');
          
          ctx.strokeStyle = lineGradient;
          ctx.lineWidth = 3;
          ctx.shadowBlur = 10;
          ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
        } else if (star1.isCompleted || star2.isCompleted) {
          // Partially completed - transitional
          const lineGradient = ctx.createLinearGradient(star1.x, star1.y, star2.x, star2.y);
          lineGradient.addColorStop(0, star1.isCompleted ? 'rgba(255, 215, 0, 0.7)' : 'rgba(135, 206, 235, 0.5)');
          lineGradient.addColorStop(1, star2.isCompleted ? 'rgba(255, 215, 0, 0.7)' : 'rgba(135, 206, 235, 0.5)');
          
          ctx.strokeStyle = lineGradient;
          ctx.lineWidth = 2;
          ctx.shadowBlur = 5;
          ctx.shadowColor = 'rgba(135, 206, 235, 0.4)';
        } else {
          // Future connection - ethereal blue
          ctx.strokeStyle = 'rgba(135, 206, 235, 0.3)';
          ctx.lineWidth = 1;
          ctx.shadowBlur = 0;
        }
        
        ctx.beginPath();
        ctx.moveTo(star1.x, star1.y);
        ctx.lineTo(star2.x, star2.y);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }
    });

    // Draw stars with premium visual effects
    stars.forEach(star => {
      const twinkle = Math.sin(animationFrame * 0.05 + star.x * 0.01) * 0.3 + 0.8;
      const pulse = Math.sin(animationFrame * 0.08 + star.y * 0.01) * 0.15 + 1;
      
      // Outer glow for completed stars
      if (star.isCompleted) {
        const glowGradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 4);
        glowGradient.addColorStop(0, 'rgba(255, 215, 0, 0.8)');
        glowGradient.addColorStop(0.3, 'rgba(255, 223, 77, 0.4)');
        glowGradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
        
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 4 * pulse, 0, Math.PI * 2);
        ctx.fill();
      }
      
      // Main star with gradient
      const starGradient = ctx.createRadialGradient(
        star.x - star.size * 0.3, star.y - star.size * 0.3, 0,
        star.x, star.y, star.size
      );
      
      if (star.isCompleted) {
        starGradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
        starGradient.addColorStop(0.3, 'rgba(255, 215, 0, 1)');
        starGradient.addColorStop(1, 'rgba(255, 140, 0, 0.9)');
      } else if (star.color === '#FF6B6B') {
        starGradient.addColorStop(0, 'rgba(255, 255, 255, 0.9)');
        starGradient.addColorStop(0.4, 'rgba(255, 107, 107, 1)');
        starGradient.addColorStop(1, 'rgba(220, 38, 38, 0.8)');
      } else {
        starGradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)');
        starGradient.addColorStop(0.4, 'rgba(135, 206, 235, 0.9)');
        starGradient.addColorStop(1, 'rgba(59, 130, 246, 0.7)');
      }
      
      ctx.fillStyle = starGradient;
      ctx.globalAlpha = star.brightness * twinkle;
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size * pulse, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      
      // Add subtle star highlight
      ctx.beginPath();
      ctx.arc(star.x - star.size * 0.2, star.y - star.size * 0.2, star.size * 0.2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.fill();
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
    <div ref={containerRef} className="relative w-full h-96 rounded-lg overflow-hidden" style={{
      background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #16213e 25%, #0f3460 50%, #0a1929 100%)'
    }}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full cursor-pointer"
        onClick={handleCanvasClick}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHoveredStar(null)}
      />
      
      {/* Constellation Info Tooltip */}
      {hoveredStar && (
        <div className="absolute top-4 left-4 bg-black/90 backdrop-blur-sm text-white p-3 rounded-lg pointer-events-none border border-white/20">
          <div className="text-sm font-medium text-yellow-300">
            {stars.find(s => s.id === hoveredStar)?.trackName}
          </div>
          <div className="text-xs text-blue-200">
            {stars.find(s => s.id === hoveredStar)?.lessonName}
          </div>
        </div>
      )}
      
      {/* Enhanced Legend */}
      <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-sm text-white p-4 rounded-lg text-xs border border-white/20">
        <div className="text-sm font-medium mb-2 text-center text-yellow-300">Learning Progress</div>
        <div className="flex items-center mb-2">
          <div className="w-3 h-3 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full mr-3 shadow-lg shadow-yellow-400/50"></div>
          <span>Mastered</span>
        </div>
        <div className="flex items-center mb-2">
          <div className="w-3 h-3 bg-gradient-to-r from-red-400 to-red-600 rounded-full mr-3 shadow-lg shadow-red-400/50"></div>
          <span>Current Focus</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-gradient-to-r from-blue-300 to-blue-500 rounded-full mr-3 shadow-lg shadow-blue-400/30"></div>
          <span>Awaiting</span>
        </div>
      </div>
      
      {/* Floating particles for ambiance */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-white/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
    </div>
  );
}