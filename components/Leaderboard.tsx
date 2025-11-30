import React from 'react';
import { PlayerScore } from '../types';
import { Trophy } from 'lucide-react';

interface LeaderboardProps {
  scores: PlayerScore[];
}

export const Leaderboard: React.FC<LeaderboardProps> = ({ scores }) => {
  const sortedScores = [...scores].sort((a, b) => b.score - a.score || a.lastMatchTime - b.lastMatchTime).slice(0, 5);

  return (
    <div className="bg-tiktok-card border border-gray-700 rounded-xl p-4 w-full h-full overflow-hidden flex flex-col">
      <div className="flex items-center gap-2 mb-4 border-b border-gray-700 pb-2">
        <Trophy className="text-yellow-400" size={20} />
        <h2 className="font-bold text-lg text-white">Top Players</h2>
      </div>
      
      {sortedScores.length === 0 ? (
        <div className="flex-1 flex items-center justify-center text-gray-500 text-sm italic">
          No matches yet...
        </div>
      ) : (
        <div className="space-y-3 overflow-y-auto pr-1">
          {sortedScores.map((player, index) => (
            <div key={player.uniqueId} className="flex items-center justify-between bg-gray-800/50 p-2 rounded-lg animate-fade-in">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="relative">
                  <img 
                    src={player.profilePictureUrl} 
                    alt={player.uniqueId} 
                    className="w-10 h-10 rounded-full border-2 border-tiktok-cyan object-cover"
                  />
                  <div className="absolute -top-1 -right-1 bg-tiktok-red text-white text-xs w-5 h-5 flex items-center justify-center rounded-full font-bold">
                    {index + 1}
                  </div>
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="font-bold text-sm truncate text-white">{player.uniqueId}</span>
                  <span className="text-xs text-gray-400">Score: {player.score}</span>
                </div>
              </div>
              <div className="text-tiktok-cyan font-bold text-lg">
                +{player.score}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};