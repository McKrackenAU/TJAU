import { useQuery } from "@tanstack/react-query";
import type { LearningTrack } from "@shared/schema";

interface ConstellationProps {
  onStarClick?: (starId: string) => void;
}

export function LearningConstellation({ onStarClick }: ConstellationProps) {
  const { data: tracks = [] } = useQuery<LearningTrack[]>({
    queryKey: ["/api/learning/tracks"],
    staleTime: 10 * 60 * 1000,
  });

  if (!tracks || tracks.length === 0) {
    return (
      <div className="relative w-full h-96 bg-gradient-to-b from-indigo-900 via-purple-900 to-black rounded-lg flex items-center justify-center">
        <p className="text-white text-lg">Loading learning paths...</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-96 bg-gradient-to-b from-indigo-900 via-purple-900 to-black rounded-lg overflow-hidden p-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 h-full">
        {tracks.map((track, index) => (
          <div key={track.id} className="text-center text-white">
            <h3 className="text-sm font-bold mb-4 truncate">{track.name}</h3>
            <div className="grid grid-cols-2 gap-2">
              {track.requiredCards?.slice(0, 8).map((cardId, lessonIndex) => (
                <div
                  key={`${track.id}-${lessonIndex}`}
                  className="w-6 h-6 bg-blue-300 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-200 transition-colors text-xs"
                  onClick={() => onStarClick?.(`${track.id}-${lessonIndex}`)}
                  title={`Lesson ${lessonIndex + 1}`}
                >
                  {lessonIndex + 1}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      
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