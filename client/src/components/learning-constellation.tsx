import { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Star, Sparkles, Award, Crown } from "lucide-react";

interface ConstellationPoint {
  id: string;
  x: number;
  y: number;
  completed: boolean;
  name: string;
  category: string;
  connections: string[];
}

interface CelestialReward {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  requiredPattern: string[];
}

interface LearningConstellationProps {
  completedLessons: string[];
  totalLessons: number;
  trackName: string;
}

export function LearningConstellation({ 
  completedLessons, 
  totalLessons, 
  trackName 
}: LearningConstellationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rewards, setRewards] = useState<CelestialReward[]>([]);
  const [selectedStar, setSelectedStar] = useState<ConstellationPoint | null>(null);
  
  // Generate constellation points based on lessons
  const generateConstellation = (): ConstellationPoint[] => {
    if (!completedLessons || completedLessons.length === 0) {
      return [];
    }
    
    const points: ConstellationPoint[] = [];
    const categories = {
      'pendulum-1': { name: 'Introduction', color: '#9333ea', angle: 0 },
      'pendulum-2': { name: 'Preparation', color: '#06b6d4', angle: Math.PI / 2 },
      'pendulum-3': { name: 'Communication', color: '#10b981', angle: Math.PI },
      'pendulum-4': { name: 'Advanced', color: '#f59e0b', angle: 3 * Math.PI / 2 }
    };
    
    Object.entries(categories).forEach(([categoryId, category], catIndex) => {
      const categoryLessons = completedLessons.filter(id => id.startsWith(categoryId));
      const lessonCount = categoryLessons.length || 1;
      
      categoryLessons.forEach((lessonId, index) => {
        const radius = 80 + (catIndex * 40);
        const angleOffset = (index / lessonCount) * (Math.PI / 2);
        const angle = category.angle + angleOffset;
        
        points.push({
          id: lessonId,
          x: 200 + radius * Math.cos(angle),
          y: 200 + radius * Math.sin(angle),
          completed: true,
          name: `Lesson ${index + 1}`,
          category: category.name,
          connections: index > 0 ? [categoryLessons[index - 1]] : []
        });
      });
    });
    
    return points;
  };

  // Generate celestial rewards based on completion patterns
  const generateRewards = (): CelestialReward[] => {
    if (!completedLessons || !Array.isArray(completedLessons)) {
      return [];
    }
    
    const baseRewards: CelestialReward[] = [
      {
        id: 'first-steps',
        name: 'Cosmic Initiate',
        description: 'Complete your first pendulum lesson',
        icon: '⭐',
        unlocked: completedLessons.length >= 1,
        requiredPattern: ['pendulum-1-1']
      },
      {
        id: 'foundation-master',
        name: 'Foundation Guardian',
        description: 'Master the introduction module',
        icon: '🌟',
        unlocked: completedLessons.filter(id => id.startsWith('pendulum-1')).length >= 2,
        requiredPattern: ['pendulum-1-1', 'pendulum-1-2']
      },
      {
        id: 'preparation-sage',
        name: 'Preparation Sage',
        description: 'Complete the preparation module',
        icon: '✨',
        unlocked: completedLessons.filter(id => id.startsWith('pendulum-2')).length >= 2,
        requiredPattern: ['pendulum-2-1', 'pendulum-2-2']
      },
      {
        id: 'communication-oracle',
        name: 'Communication Oracle',
        description: 'Master pendulum communication',
        icon: '🔮',
        unlocked: completedLessons.filter(id => id.startsWith('pendulum-3')).length >= 2,
        requiredPattern: ['pendulum-3-1', 'pendulum-3-2']
      },
      {
        id: 'advanced-mystic',
        name: 'Advanced Mystic',
        description: 'Complete advanced techniques',
        icon: '👑',
        unlocked: completedLessons.filter(id => id.startsWith('pendulum-4')).length >= 2,
        requiredPattern: ['pendulum-4-1', 'pendulum-4-2']
      },
      {
        id: 'constellation-master',
        name: 'Constellation Master',
        description: 'Complete the entire pendulum course',
        icon: '🌌',
        unlocked: completedLessons.length >= 8,
        requiredPattern: []
      }
    ];
    
    return baseRewards;
  };

  // Draw the constellation on canvas
  const drawConstellation = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas with deep space background
    const gradient = ctx.createRadialGradient(200, 200, 0, 200, 200, 200);
    gradient.addColorStop(0, '#1a1a2e');
    gradient.addColorStop(0.5, '#16213e');
    gradient.addColorStop(1, '#0f3460');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 400, 400);
    
    // Add twinkling stars background
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * 400;
      const y = Math.random() * 400;
      const alpha = Math.random() * 0.8 + 0.2;
      
      ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, 1, 0, 2 * Math.PI);
      ctx.fill();
    }
    
    const points = generateConstellation();
    
    // Draw connections between completed lessons
    ctx.strokeStyle = 'rgba(147, 51, 234, 0.6)';
    ctx.lineWidth = 2;
    
    points.forEach(point => {
      point.connections.forEach(connectionId => {
        const connectedPoint = points.find(p => p.id === connectionId);
        if (connectedPoint && connectedPoint.completed) {
          ctx.beginPath();
          ctx.moveTo(point.x, point.y);
          ctx.lineTo(connectedPoint.x, connectedPoint.y);
          ctx.stroke();
        }
      });
    });
    
    // Draw constellation points (lessons)
    points.forEach(point => {
      const size = point.completed ? 8 : 4;
      const color = point.completed ? '#fbbf24' : '#6b7280';
      
      // Glow effect for completed lessons
      if (point.completed) {
        const glowGradient = ctx.createRadialGradient(
          point.x, point.y, 0,
          point.x, point.y, size * 2
        );
        glowGradient.addColorStop(0, 'rgba(251, 191, 36, 0.8)');
        glowGradient.addColorStop(1, 'rgba(251, 191, 36, 0)');
        
        ctx.fillStyle = glowGradient;
        ctx.beginPath();
        ctx.arc(point.x, point.y, size * 2, 0, 2 * Math.PI);
        ctx.fill();
      }
      
      // Main star
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(point.x, point.y, size, 0, 2 * Math.PI);
      ctx.fill();
      
      // Inner sparkle
      if (point.completed) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(point.x, point.y, size / 2, 0, 2 * Math.PI);
        ctx.fill();
      }
    });
  };

  useEffect(() => {
    setRewards(generateRewards());
    drawConstellation();
  }, [completedLessons]);

  const progressPercentage = completedLessons && completedLessons.length ? (completedLessons.length / totalLessons) * 100 : 0;
  const unlockedRewards = rewards.filter(r => r.unlocked);

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-purple-900/20 to-blue-900/20 border-purple-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-yellow-400" />
            {trackName} Constellation
          </CardTitle>
          <div className="space-y-2">
            <Progress value={progressPercentage} className="h-2" />
            <p className="text-sm text-muted-foreground">
              {completedLessons ? completedLessons.length : 0} of {totalLessons} stars illuminated
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center">
            <canvas
              ref={canvasRef}
              width={400}
              height={400}
              className="border border-purple-500/30 rounded-lg bg-gradient-to-br from-indigo-950 to-purple-950"
              onClick={(e) => {
                const rect = canvasRef.current?.getBoundingClientRect();
                if (!rect) return;
                
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                // Check if click is near any star
                const points = generateConstellation();
                const clickedPoint = points.find(point => {
                  const distance = Math.sqrt((x - point.x) ** 2 + (y - point.y) ** 2);
                  return distance < 15;
                });
                
                setSelectedStar(clickedPoint || null);
              }}
            />
          </div>
          
          {selectedStar && (
            <div className="mt-4 p-3 bg-purple-900/30 rounded-lg border border-purple-500/30">
              <h4 className="font-semibold text-yellow-400">{selectedStar.name}</h4>
              <p className="text-sm text-muted-foreground">Category: {selectedStar.category}</p>
              <Badge variant="secondary" className="mt-1">
                {selectedStar.completed ? 'Completed' : 'Locked'}
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Celestial Rewards Section */}
      <Card className="bg-gradient-to-br from-amber-900/20 to-orange-900/20 border-amber-500/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-amber-400" />
            Celestial Rewards ({unlockedRewards.length}/{rewards.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {rewards.map(reward => (
              <div
                key={reward.id}
                className={`p-3 rounded-lg border transition-all ${
                  reward.unlocked
                    ? 'bg-amber-900/30 border-amber-500/50 shadow-amber-500/20 shadow-lg'
                    : 'bg-gray-800/30 border-gray-600/30 opacity-60'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{reward.icon}</div>
                  <div>
                    <h4 className={`font-semibold ${reward.unlocked ? 'text-amber-300' : 'text-gray-400'}`}>
                      {reward.name}
                    </h4>
                    <p className="text-xs text-muted-foreground">
                      {reward.description}
                    </p>
                    {reward.unlocked && (
                      <Badge variant="secondary" className="mt-1 bg-amber-500/20 text-amber-300">
                        <Award className="h-3 w-3 mr-1" />
                        Unlocked
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}