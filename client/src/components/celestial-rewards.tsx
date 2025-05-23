import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { LearningTrack, UserProgress } from "@shared/schema";
import { 
  Crown, 
  Star, 
  Sparkles, 
  Trophy, 
  Gem, 
  Moon, 
  Sun, 
  Zap,
  Target,
  Award,
  Flame,
  Eye,
  Heart,
  Shield
} from "lucide-react";

interface CelestialReward {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirements: {
    type: 'track_complete' | 'lessons_count' | 'multi_track' | 'streak' | 'perfect_score';
    value: number;
    trackIds?: number[];
  };
  unlockedAt?: Date;
  isUnlocked: boolean;
  mysticalPower?: string;
}

interface CelestialRewardsProps {
  userProgress: UserProgress[];
  tracks: LearningTrack[];
}

export function CelestialRewards({ userProgress, tracks }: CelestialRewardsProps) {
  const [rewards, setRewards] = useState<CelestialReward[]>([]);
  const [newlyUnlocked, setNewlyUnlocked] = useState<CelestialReward[]>([]);
  const [showRewardDialog, setShowRewardDialog] = useState(false);

  // Define all celestial rewards
  const celestialRewards: Omit<CelestialReward, 'isUnlocked' | 'unlockedAt'>[] = [
    {
      id: 'first_star',
      name: 'First Light',
      description: 'Complete your very first lesson and begin your celestial journey',
      icon: <Star className="h-6 w-6 text-yellow-400" />,
      rarity: 'common',
      requirements: { type: 'lessons_count', value: 1 },
      mysticalPower: 'Grants clarity of vision in new beginnings'
    },
    {
      id: 'constellation_initiate',
      name: 'Constellation Initiate',
      description: 'Complete 5 lessons across any learning tracks',
      icon: <Sparkles className="h-6 w-6 text-blue-400" />,
      rarity: 'common',
      requirements: { type: 'lessons_count', value: 5 },
      mysticalPower: 'Awakens intuitive awareness'
    },
    {
      id: 'beginner_master',
      name: 'Guardian of Beginnings',
      description: 'Complete the entire Beginner\'s Journey constellation',
      icon: <Shield className="h-6 w-6 text-green-400" />,
      rarity: 'rare',
      requirements: { type: 'track_complete', value: 1, trackIds: [1] },
      mysticalPower: 'Protects against confusion and doubt'
    },
    {
      id: 'minor_arcana_sage',
      name: 'Keeper of the Minor Mysteries',
      description: 'Master the Minor Arcana Journey constellation',
      icon: <Gem className="h-6 w-6 text-purple-400" />,
      rarity: 'rare',
      requirements: { type: 'track_complete', value: 1, trackIds: [2] },
      mysticalPower: 'Reveals hidden meanings in daily life'
    },
    {
      id: 'pendulum_mystic',
      name: 'Pendulum Mystic',
      description: 'Complete the Pendulum Dowsing Mastery constellation',
      icon: <Target className="h-6 w-6 text-cyan-400" />,
      rarity: 'rare',
      requirements: { type: 'track_complete', value: 1, trackIds: [5] },
      mysticalPower: 'Attunes to subtle energies and divination'
    },
    {
      id: 'intuitive_oracle',
      name: 'Intuitive Oracle',
      description: 'Complete the Intuitive Reading constellation',
      icon: <Eye className="h-6 w-6 text-indigo-400" />,
      rarity: 'epic',
      requirements: { type: 'track_complete', value: 1, trackIds: [10] },
      mysticalPower: 'Enhances psychic perception and insight'
    },
    {
      id: 'symbol_sage',
      name: 'Master of Ancient Symbols',
      description: 'Complete the Advanced Symbolism constellation',
      icon: <Crown className="h-6 w-6 text-gold" />,
      rarity: 'epic',
      requirements: { type: 'track_complete', value: 1, trackIds: [11] },
      mysticalPower: 'Unlocks the language of universal symbols'
    },
    {
      id: 'stellar_collector',
      name: 'Stellar Collector',
      description: 'Gather 25 golden stars across all constellations',
      icon: <Trophy className="h-6 w-6 text-yellow-500" />,
      rarity: 'rare',
      requirements: { type: 'lessons_count', value: 25 },
      mysticalPower: 'Magnetizes positive cosmic energy'
    },
    {
      id: 'celestial_navigator',
      name: 'Celestial Navigator',
      description: 'Complete lessons in at least 3 different constellations',
      icon: <Moon className="h-6 w-6 text-slate-300" />,
      rarity: 'epic',
      requirements: { type: 'multi_track', value: 3 },
      mysticalPower: 'Guides through spiritual crossroads'
    },
    {
      id: 'cosmic_scholar',
      name: 'Cosmic Scholar',
      description: 'Accumulate 50 completed lessons across your journey',
      icon: <Sun className="h-6 w-6 text-orange-400" />,
      rarity: 'epic',
      requirements: { type: 'lessons_count', value: 50 },
      mysticalPower: 'Illuminates the path to higher wisdom'
    },
    {
      id: 'constellation_master',
      name: 'Master of All Constellations',
      description: 'Complete every single learning track constellation',
      icon: <Flame className="h-6 w-6 text-red-500" />,
      rarity: 'legendary',
      requirements: { type: 'track_complete', value: 5, trackIds: [1, 2, 5, 10, 11] },
      mysticalPower: 'Channels the full power of celestial wisdom'
    },
    {
      id: 'starlight_ascendant',
      name: 'Starlight Ascendant',
      description: 'Achieve 100 completed lessons - true spiritual mastery',
      icon: <Zap className="h-6 w-6 text-violet-400" />,
      rarity: 'legendary',
      requirements: { type: 'lessons_count', value: 100 },
      mysticalPower: 'Transcends ordinary limitations and manifests divine potential'
    }
  ];

  // Calculate reward unlocks based on user progress
  useEffect(() => {
    if (!userProgress || !tracks) return;

    const totalCompletedLessons = userProgress.reduce((total, progress) => 
      total + progress.completedLessons.length, 0
    );

    const completedTracks = userProgress.filter(progress => {
      const track = tracks.find(t => t.id === progress.trackId);
      return track && progress.completedLessons.length >= track.requiredCards.length;
    }).map(p => p.trackId);

    const activeTrackCount = userProgress.filter(p => p.completedLessons.length > 0).length;

    const updatedRewards = celestialRewards.map(reward => {
      let isUnlocked = false;

      switch (reward.requirements.type) {
        case 'lessons_count':
          isUnlocked = totalCompletedLessons >= reward.requirements.value;
          break;
        case 'track_complete':
          if (reward.requirements.trackIds) {
            if (reward.requirements.value === 1) {
              isUnlocked = reward.requirements.trackIds.some(trackId => 
                completedTracks.includes(trackId)
              );
            } else {
              isUnlocked = reward.requirements.trackIds.every(trackId => 
                completedTracks.includes(trackId)
              );
            }
          }
          break;
        case 'multi_track':
          isUnlocked = activeTrackCount >= reward.requirements.value;
          break;
      }

      return {
        ...reward,
        isUnlocked,
        unlockedAt: isUnlocked ? new Date() : undefined
      };
    });

    // Check for newly unlocked rewards
    const newUnlocks = updatedRewards.filter(reward => 
      reward.isUnlocked && !rewards.find(r => r.id === reward.id && r.isUnlocked)
    );

    if (newUnlocks.length > 0) {
      setNewlyUnlocked(newUnlocks);
      setShowRewardDialog(true);
    }

    setRewards(updatedRewards);
  }, [userProgress, tracks]);

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-500';
      case 'rare': return 'bg-blue-500';
      case 'epic': return 'bg-purple-500';
      case 'legendary': return 'bg-gradient-to-r from-yellow-400 to-orange-500';
      default: return 'bg-gray-500';
    }
  };

  const getRarityBorder = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'border-gray-400';
      case 'rare': return 'border-blue-400';
      case 'epic': return 'border-purple-400';
      case 'legendary': return 'border-gradient-to-r from-yellow-400 to-orange-500';
      default: return 'border-gray-400';
    }
  };

  const unlockedRewards = rewards.filter(r => r.isUnlocked);
  const lockedRewards = rewards.filter(r => !r.isUnlocked);

  return (
    <TooltipProvider>
      <Card className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border-purple-500/30">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-white flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-400" />
              Celestial Rewards
            </CardTitle>
            <Badge variant="secondary" className="bg-purple-600/20 text-purple-200">
              <Trophy className="h-3 w-3 mr-1" />
              {unlockedRewards.length}/{rewards.length} Unlocked
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-80">
            <div className="space-y-4">
              {/* Unlocked Rewards */}
              {unlockedRewards.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-yellow-400 mb-2 flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    Unlocked Talismans
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {unlockedRewards.map(reward => (
                      <Tooltip key={reward.id}>
                        <TooltipTrigger asChild>
                          <div className={`p-3 rounded-lg border-2 ${getRarityBorder(reward.rarity)} bg-gradient-to-br from-white/10 to-transparent cursor-pointer hover:scale-105 transition-transform`}>
                            <div className="flex items-center gap-2">
                              {reward.icon}
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-white truncate">
                                  {reward.name}
                                </p>
                                <Badge className={`text-xs ${getRarityColor(reward.rarity)} text-white`}>
                                  {reward.rarity}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs bg-slate-800 border-purple-600">
                          <div className="text-center">
                            <p className="font-semibold text-white">{reward.name}</p>
                            <p className="text-sm text-slate-300 mt-1">{reward.description}</p>
                            {reward.mysticalPower && (
                              <p className="text-xs text-purple-300 mt-2 italic">
                                "✨ {reward.mysticalPower}"
                              </p>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </div>
              )}

              {/* Locked Rewards */}
              {lockedRewards.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-400 mb-2 flex items-center gap-1">
                    <Moon className="h-4 w-4" />
                    Mysterious Rewards
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    {lockedRewards.map(reward => (
                      <Tooltip key={reward.id}>
                        <TooltipTrigger asChild>
                          <div className="p-3 rounded-lg border border-slate-600 bg-slate-800/50 opacity-60 cursor-pointer">
                            <div className="flex items-center gap-2">
                              <div className="text-slate-500">
                                {reward.icon}
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-sm font-medium text-slate-400 truncate">
                                  {reward.name}
                                </p>
                                <Badge variant="outline" className="text-xs border-slate-600 text-slate-500">
                                  {reward.rarity}
                                </Badge>
                              </div>
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent side="top" className="max-w-xs bg-slate-800 border-slate-600">
                          <div className="text-center">
                            <p className="font-semibold text-slate-300">{reward.name}</p>
                            <p className="text-sm text-slate-400 mt-1">{reward.description}</p>
                            {reward.mysticalPower && (
                              <p className="text-xs text-slate-500 mt-2 italic">
                                "✨ {reward.mysticalPower}"
                              </p>
                            )}
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* New Reward Dialog */}
      <Dialog open={showRewardDialog} onOpenChange={setShowRewardDialog}>
        <DialogContent className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 border-yellow-400">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-white text-center flex items-center justify-center gap-2">
              <Sparkles className="h-6 w-6 text-yellow-400" />
              Celestial Reward Unlocked!
              <Sparkles className="h-6 w-6 text-yellow-400" />
            </DialogTitle>
            <DialogDescription className="text-center text-purple-200">
              Your dedication has awakened new mystical powers
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {newlyUnlocked.map(reward => (
              <div 
                key={reward.id} 
                className={`p-6 rounded-lg border-2 ${getRarityBorder(reward.rarity)} bg-gradient-to-br from-white/10 to-transparent text-center`}
              >
                <div className="flex justify-center mb-3">
                  {reward.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{reward.name}</h3>
                <p className="text-sm text-slate-300 mb-3">{reward.description}</p>
                <Badge className={`${getRarityColor(reward.rarity)} text-white mb-3`}>
                  {reward.rarity.toUpperCase()} TALISMAN
                </Badge>
                {reward.mysticalPower && (
                  <p className="text-sm text-yellow-300 italic">
                    ✨ "{reward.mysticalPower}"
                  </p>
                )}
              </div>
            ))}
          </div>

          <Button 
            onClick={() => setShowRewardDialog(false)}
            className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            Continue Your Journey
          </Button>
        </DialogContent>
      </Dialog>
    </TooltipProvider>
  );
}