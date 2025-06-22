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

  // Interactive Zodiac Constellation
  const [selectedTrack, setSelectedTrack] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  const zodiacConstellations = {
    1: { // Beginner's Journey - split between Taurus (first 11) and Leo (last 11)
      constellations: [
        { name: 'Taurus', range: [0, 10], color: '#8B5CF6' },
        { name: 'Leo', range: [11, 21], color: '#F59E0B' }
      ]
    },
    2: { // Minor Arcana Journey 
      constellations: [
        { name: 'Gemini', range: [0, 13], color: '#10B981' },
        { name: 'Cancer', range: [14, 27], color: '#3B82F6' },
        { name: 'Virgo', range: [28, 41], color: '#8B5CF6' },
        { name: 'Libra', range: [42, 55], color: '#F59E0B' }
      ]
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || stars.length === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;

    // Deep space background
    const gradient = ctx.createRadialGradient(width/2, height/2, 0, width/2, height/2, Math.max(width, height)/2);
    gradient.addColorStop(0, '#0f0f23');
    gradient.addColorStop(0.5, '#1a1a2e');
    gradient.addColorStop(1, '#16213e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Apply zoom
    ctx.save();
    ctx.scale(zoomLevel, zoomLevel);
    ctx.translate((width * (1 - zoomLevel)) / (2 * zoomLevel), (height * (1 - zoomLevel)) / (2 * zoomLevel));

    // Group stars by track and draw constellations
    const trackGroups = stars.reduce((groups, star) => {
      const trackId = parseInt(star.id.split('-')[0]);
      if (!groups[trackId]) groups[trackId] = [];
      groups[trackId].push(star);
      return groups;
    }, {} as Record<number, ConstellationStar[]>);

    Object.entries(trackGroups).forEach(([trackIdStr, trackStars]) => {
      const trackId = parseInt(trackIdStr);
      const constellationData = zodiacConstellations[trackId];
      
      if (constellationData) {
        constellationData.constellations.forEach(constellation => {
          const constellationStars = trackStars.slice(constellation.range[0], constellation.range[1] + 1);
          
          // Draw constellation connections
          for (let i = 0; i < constellationStars.length - 1; i++) {
            const star1 = constellationStars[i];
            const star2 = constellationStars[i + 1];
            
            ctx.strokeStyle = star1.isCompleted && star2.isCompleted ? constellation.color : 'rgba(100, 116, 139, 0.3)';
            ctx.lineWidth = star1.isCompleted && star2.isCompleted ? 2 : 1;
            ctx.beginPath();
            ctx.moveTo(star1.x, star1.y);
            ctx.lineTo(star2.x, star2.y);
            ctx.stroke();
          }
          
          // Draw constellation name
          if (constellationStars.length > 0) {
            const centerX = constellationStars.reduce((sum, s) => sum + s.x, 0) / constellationStars.length;
            const centerY = constellationStars.reduce((sum, s) => sum + s.y, 0) / constellationStars.length;
            
            ctx.fillStyle = constellation.color;
            ctx.font = '12px Inter, sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(constellation.name, centerX, centerY - 30);
          }
        });
      }
    });

    // Draw interactive stars
    stars.forEach(star => {
      const isClickable = star.canAccess;
      
      // Star glow effect
      if (star.isCompleted || isClickable) {
        const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, star.size * 2);
        gradient.addColorStop(0, star.color + '80');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(star.x - star.size * 2, star.y - star.size * 2, star.size * 4, star.size * 4);
      }
      
      // Main star
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fillStyle = star.isCompleted ? '#fbbf24' : isClickable ? star.color : '#475569';
      ctx.fill();
      
      // Star center highlight
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fill();
      
      // Clickable indicator
      if (isClickable && !star.isCompleted) {
        ctx.strokeStyle = '#60a5fa';
        ctx.lineWidth = 2;
        ctx.setLineDash([3, 3]);
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size + 3, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
    });

    ctx.restore();
  }, [stars, zoomLevel]);

  return (
    <div className="bg-slate-900 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xl">✨</span>
            <h3 className="text-lg font-semibold text-white">Your Spiritual Journey Constellation</h3>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setZoomLevel(Math.max(0.5, zoomLevel - 0.2))}
              className="px-3 py-1 bg-slate-700 text-white rounded text-sm hover:bg-slate-600"
            >
              Zoom Out
            </button>
            <button 
              onClick={() => setZoomLevel(Math.min(2, zoomLevel + 0.2))}
              className="px-3 py-1 bg-slate-700 text-white rounded text-sm hover:bg-slate-600"
            >
              Zoom In
            </button>
          </div>
        </div>
      </div>
      
      <div className="relative">
        <canvas
          ref={canvasRef}
          className="w-full h-96 cursor-pointer"
        />
        
        <div className="absolute bottom-4 right-4 bg-slate-800 rounded-lg p-3">
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-amber-400 rounded-full"></div>
              <span className="text-slate-300">Mastered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-400 rounded-full border-2 border-blue-400 border-dashed"></div>
              <span className="text-slate-300">Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-slate-600 rounded-full"></div>
              <span className="text-slate-300">Locked</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

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