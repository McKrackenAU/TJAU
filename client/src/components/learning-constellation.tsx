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
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;

    // Draw background
    const gradient = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 0, canvas.width/2, canvas.height/2, Math.max(canvas.width, canvas.height)/2);
    gradient.addColorStop(0, '#0f0f23');
    gradient.addColorStop(0.5, '#1a1a2e');
    gradient.addColorStop(1, '#16213e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw sample constellation for Beginner's Journey
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) * 0.3;

    // Create Taurus constellation (first 11 cards)
    const taurusStars = [];
    for (let i = 0; i < 11; i++) {
      const angle = (i / 11) * Math.PI; // Half circle
      const x = centerX - radius + (i / 10) * (radius * 2);
      const y = centerY - 100 + Math.sin(angle) * 50;
      taurusStars.push({ x, y, completed: i < 2 }); // First 2 completed
    }

    // Create Leo constellation (last 11 cards)
    const leoStars = [];
    for (let i = 0; i < 11; i++) {
      const angle = (i / 11) * Math.PI; // Half circle
      const x = centerX - radius + (i / 10) * (radius * 2);
      const y = centerY + 100 + Math.sin(angle) * 50;
      leoStars.push({ x, y, completed: false }); // None completed yet
    }

    // Draw constellation connections
    ctx.strokeStyle = 'rgba(139, 92, 246, 0.5)';
    ctx.lineWidth = 1;
    
    // Taurus connections
    for (let i = 0; i < taurusStars.length - 1; i++) {
      ctx.beginPath();
      ctx.moveTo(taurusStars[i].x, taurusStars[i].y);
      ctx.lineTo(taurusStars[i + 1].x, taurusStars[i + 1].y);
      ctx.stroke();
    }
    
    // Leo connections
    for (let i = 0; i < leoStars.length - 1; i++) {
      ctx.beginPath();
      ctx.moveTo(leoStars[i].x, leoStars[i].y);
      ctx.lineTo(leoStars[i + 1].x, leoStars[i + 1].y);
      ctx.stroke();
    }

    // Draw constellation names
    ctx.fillStyle = '#8B5CF6';
    ctx.font = '16px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Taurus', centerX, centerY - 150);
    
    ctx.fillStyle = '#F59E0B';
    ctx.fillText('Leo', centerX, centerY + 200);

    // Draw stars
    [...taurusStars, ...leoStars].forEach(star => {
      // Star glow
      if (star.completed) {
        const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, 15);
        gradient.addColorStop(0, 'rgba(251, 191, 36, 0.8)');
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fillRect(star.x - 15, star.y - 15, 30, 30);
      }
      
      // Main star
      ctx.beginPath();
      ctx.arc(star.x, star.y, 6, 0, Math.PI * 2);
      ctx.fillStyle = star.completed ? '#fbbf24' : '#60a5fa';
      ctx.fill();
      
      // Star center
      ctx.beginPath();
      ctx.arc(star.x, star.y, 2, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.fill();
    });

  }, [zoomLevel]);

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
          className="w-full h-[600px] cursor-pointer"
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